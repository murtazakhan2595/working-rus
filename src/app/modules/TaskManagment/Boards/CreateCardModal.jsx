import { ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import { CardTypes } from "app/utils/Types/TaskManagment";
import CreateAndEditCardForm from "./Sections/CreateAndEditCardForm";

const CreateAndUpdateCard = ({
  employees,
  onClose,
  boardId,
  projectId,
  setIsOpen,
  isOpen,
}) => {

  return (
    <>
      <CreateAndEditCardForm
        onClose={onClose}
        setIsOpen={setIsOpen}
        projectId={projectId}
        boardId={boardId}
        isOpen={isOpen}
      />
      <ToastContainer />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
  };
};
export default connect(mapStateToProps)(CreateAndUpdateCard);
