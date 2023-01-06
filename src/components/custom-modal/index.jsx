/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import React from "react";
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
const CustomModalForm = ({ isShowing, hide, ...props }) =>
  isShowing ? (
    <ReactModal
      isOpen={isShowing}
      onRequestClose={hide}
      {...props}
      style={{ ...customStyles, ...props.style }}
      contentLabel="Minimal Modal Example"
      className={
        "max-w-[500px] min-w-[450px] h-auto min-h-[20vh] max-h-[90vh] bg-white shadow-md  mt-[5vh] rounded-xl m-auto overflow-auto"
      }
      overlayClassName="fixed inset-0 bg-black-500 bg-opacity-75 flex justify-center items-center">
      {props.children}
    </ReactModal>
  ) : null;

CustomModalForm.propTypes = {
  hide: PropTypes.any,
  isShowing: PropTypes.any,
  children: PropTypes.any,
};
export { CustomModalForm };
