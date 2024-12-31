import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CreateAndEditCardForm from "./Sections/CreateAndEditCardForm";

const EditCard = ({
  onClose,
  cardId,
  projectId,
  setIsOpen,
  isOpen,
}) => {
 
  return (
    <CreateAndEditCardForm
      taskId={cardId}
      onClose={onClose}
      isEdit={true}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      projectId={projectId}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
  };
};

export default connect(mapStateToProps)(EditCard);
