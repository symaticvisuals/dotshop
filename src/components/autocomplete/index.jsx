import React, { useState } from "react";

import Autocomplete from "react-autocomplete";
function CustomDropDown({
  label,
  placeholder,
  onChange,
  items,
  additional,
  ...props
}) {
  const [value, setValue] = useState("");

  return (
    <div
      className={
        props.outerStyle
          ? props.outerStyle
          : "border-white-500 p-2 border-2 rounded-md block"
      }>
      <h6
        className={props.labelStyle ? props.labelStyle : "font-sans text-xs "}>
        {label}
      </h6>
      <Autocomplete
        // style autocomplete container
        wrapperStyle={{
          display: "block",
        }}
        // style of the input
        inputProps={
          props.inputFieldStyle
            ? { className: props.inputFieldStyle }
            : {
                className:
                  "w-full p-0 m-0 focus:outline-none active:outline-none",
              }
        }
        getItemValue={(item) => {
          onChange({
            target: { ...item, value: item.label, name: props.name },
          });
          return item.label;
        }}
        items={items}
        placeholder={placeholder}
        renderItem={(item, isHighlighted) => (
          <div
            style={{ background: isHighlighted ? "lightgray" : "white" }}
            className={
              props.renderItem
                ? props.renderItem
                : "p-2 rounded-md w-full flex justify-between"
            }>
            {item.label}
            {additional && additional(item)}
          </div>
        )}
        name={props.name}
        value={value}
        // filter the items based on the input value
        shouldItemRender={(item, value) =>
          item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
        }
        // when an item is selected, set the value of the input to the item label
        onChange={(e) => {
          setValue(e.target.value);
          onChange({ target: { name: props.name, value: e.target.value } });
        }}
        onSelect={(val) => {
          setValue(val);
        }}
      />
    </div>
  );
}

export default CustomDropDown;
