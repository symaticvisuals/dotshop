import { useField } from "formik";
import PropTypes from "prop-types";
import React from "react";

export const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <h6 className="font-sans text-sm font-medium mb-1">{label}</h6>
      <input
        {...field}
        {...props}
        className="py-3 px-4 block w-full border-black border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

TextField.propTypes = {
  label: PropTypes.any,
};
