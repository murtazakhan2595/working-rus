import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import { RxCross2, RxPlus } from "react-icons/rx";
import { Card } from "reactstrap";
import { CardTypes } from "app/utils/Types/TaskManagment";
import highpriorityIcon from "assets/images/highpriority.svg";
import lowpriorityIcon from "assets/images/lowpriority.svg";
import mediumpriorityIcon from "assets/images/mediumpriority.svg";
import plus from "assets/images/plus.svg";
import { addTask, addAttachments } from "app/hooks/taskManagment";
import CreateAndEditCardForm from "app/modules/TaskManagment/Boards/Sections/CreateAndEditCardForm";
import CustomDropdown from "./CustomDropdown";
import { getAllBoards } from "app/hooks/taskManagment";

const CreateCardModal = ({ employees, onClose, projects }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(CardTypes);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [options, setOptions] = useState([]);
  const [boardOptions, setBoardOptions] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  console.log(selectedBoard);
  console.log("boardOptions", boardOptions);

  const priorityMapping = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const handleSubmit = async (formData, files, resetForm) => {
    // console.log("Files", files);
    if(!selectedBoard || !selectedProject){
      toast.error("Please select a project and board", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return
    }
    setIsLoading(true);
    try {
      // Map over files to get an array of promises
      const attachmentPromises = files.map(async (file) => {
        const response = await addAttachments(file);
        return response.id; // Return the attachment ID
      });

      // Wait for all promises to resolve
      const attachmentIds = await Promise.all(attachmentPromises);

      // Update formData with attachment IDs
      formData.attachment = attachmentIds;
      console.log("formData", formData);


      // Now call addTask
      const response = await addTask({...formData, project_id: selectedProject.id, board_id: selectedBoard.id});

      if (response) {
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.detail, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Generate options dynamically based on the fetched data
    const dynamicOptions = projects.map((project) => ({
      label: project.name,
      onClick: () => {
        setIsDropdownOpen(false);
        setSelectedProject(project);
      },
    }));
    // Set the dynamically generated options to state
    setOptions(dynamicOptions);
  }, [projects]);

  const getBoards = async () => {
    try {
      const response = await getAllBoards({
        filterData: { project_id: [selectedProject.id] },
      });
      console.log("boards dataaaaaaaaaa", response);
      if (response) {
        const dynamicOptions = response.results.map((board) => ({
          label: board.name,
          onClick: () => {
            setIsBoardDropdownOpen(false);
            setSelectedBoard(board);
          },
        }));
        // Set the dynamically generated options to state
        setBoardOptions(dynamicOptions);
        setSelectedBoard(response.results[0]);
      }
    }catch(err){
      console.error(err)
    }
  }

  useEffect(() => {
    selectedProject?.id && getBoards();
  },[selectedProject])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleboardDropdown = () => {
    setIsBoardDropdownOpen(!isBoardDropdownOpen);
  };
  return (
    <>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto scroll flex justify-center items-center backdrop-blur-sm py-5 h-[100vh] ">
        <Card
          className="overflow-y-auto h-100 p-4 w-[90%]"
          style={{ maxWidth: "650px" }}
        >
        
          <div
            className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
            onClick={onClose}
          >
            <RxCross2 />
          </div>
          <div className="h-[58px] flex-col justify-start items-start gap-2.5 inline-flex">
            <div className="text-[#323233] text-[25px] font-bold ">
              Add Card to
            </div>
            <div className="justify-start items-center gap-2.5 inline-flex">
              <div>
                <span
                  className="text-[#323233] text-sm font-bold  underline cursor-pointer"
                  onClick={toggleDropdown}
                >
                  {selectedProject.name}
                </span>
                <span className="text-[#5c5e64] text-sm font-normal ">
                  {" "}
                  in list{" "}
                </span>
                <CustomDropdown
                  isOpen={isDropdownOpen}
                  toggleDropdown={toggleDropdown}
                  options={options}
                  iconVisible={false}
                  right={true}
                />
              </div>
              <div className="border-b border-[#323233] justify-start items-center gap-1 flex">
                <div className="w-1.5 h-1.5 bg-[#5640df] rounded-full" />
                <div className="text-[#323233] text-sm font-bold  leading-[17.50px]">
                  <span className="cursor-pointer"
                  onClick={toggleboardDropdown}>{selectedBoard?.name}</span>
                  <CustomDropdown
                    isOpen={isBoardDropdownOpen}
                    toggleDropdown={toggleboardDropdown}
                    options={boardOptions}
                    iconVisible={false}
                    right={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <CreateAndEditCardForm
            initialValues={initialValues}
            employees={employees}
            handleSubmit={handleSubmit}
            onClose={onClose}
          />
        </Card>
        <ToastContainer />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
  };
};
export default connect(mapStateToProps)(CreateCardModal);
