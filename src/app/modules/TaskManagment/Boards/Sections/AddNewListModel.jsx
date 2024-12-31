import { useState, useRef, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Formik } from "formik";
import { TextInput } from "components/form-control.jsx";
import { addBoard, getBoardById } from "app/hooks/taskManagment";
import { AddList } from "app/utils/Types/TaskManagment";
import { PageLoader } from "components";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";

const AddNewListModel = ({ onClose, projectId, boardId, isEditMode, setIsOpen }) => {
  const formRef = useRef();
  const [closeSheet, setCloseSheet] = useState(false)

  const [initialValues, setInitialValues] = useState({
    ...AddList,
    ...{ project_id: projectId },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = ()=>{
    // setIsOpen(false)
    setCloseSheet(true)
  }

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const BoardDetails = await getBoardById(boardId);
      if (isMounted) {
        setInitialValues(BoardDetails);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (boardId && isEditMode) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [boardId]);

  const handleSubmit = async (formData) => {
    console.log(formData);
    setIsLoading(true);
    try {
      const response = await addBoard(formData);
      if (response) {
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formSheetData = {
    triggerText: null,
    title: isEditMode ? "Update Card Name" : "Add Card Name",
    description: null,
    footer: null,
  };

  return (
    <>
     {handleCloseWithConfirmation({isOpen: closeSheet, setCloseSheet, setIsOpen})}
      <SheetComponent {...formSheetData}  isOpen={true}
       width="568px"
      >
        {isLoading ? (
          <PageLoader />
        ) : (
          <Formik
            initialValues={initialValues}
            innerRef={formRef}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
            validate={(values) => {
              const errors = {};
              return errors;
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <TextInput
                  name="name"
                  error={props.errors.name}
                  touch={props.touched.name}
                  value={props.values.name}
                  label="Title"
                  required
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit">{boardId ? "Update" : "Add"}</Button>
                </div>
              </form>
            )}
          </Formik>
        )}
        <ToastContainer />
      </SheetComponent>
    </>
  );
};

export default AddNewListModel;
