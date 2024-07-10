import { useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { Card, Row, Col, Button, Form } from "reactstrap";
import { Formik } from "formik";
import {
  TextInput,
} from "components/form-control.jsx";
import { AddList } from "app/utils/Types/TaskManagment";

const AddNewListModel = ({  onClose }) => {
  const formRef = useRef();
  const [initialValues, setInitialValues] = useState(AddList);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    console.log(formData);  
  };

  return (
    <>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto scroll flex justify-center items-center py-5 h-[100vh] bg-neutral-600 bg-opacity-40 ">
        <Card
          className="overflow-y-auto  py-10 px-[50px] w-[90%] "
          style={{ maxWidth: "650px" }}
        >
          <div
            className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
            onClick={onClose}
          >
            <RxCross2 />
          </div>
          <Row>
            <Col lg={12}>
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
                  <Form onSubmit={props.handleSubmit}>
                    <Row className="m-0">
                      <Col md="12">
                        <h5 className="fw-700 mb-3 mt-4">List Titile</h5>
                      </Col>
                      <Col md="12">
                        <TextInput
                          name="title"
                          error={props.errors.name}
                          touch={props.touched.name}
                          value={props.values.title}
                          label="Title"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="my-4">
                      <Col md="3">
                        <div
                          type="button"
                          className="btn btn-outline-dark w-100"
                          onClick={onClose}
                        >
                          Cancel
                        </div>
                      </Col>
                      <Col md="3">
                        <Button type="submit" className="btn btn-dark w-100">
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Card>
        <ToastContainer />
      </div>
    </>
  );
};

export default AddNewListModel;
