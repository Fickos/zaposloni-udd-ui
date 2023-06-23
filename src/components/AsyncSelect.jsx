import { useState } from "react";
import Select, { components } from "react-select";
import Checkmark from "../assets/icons8-done.svg";

export default function AsyncSelect () {

    const [select, setSelect] = useState({ options: [{ value: "a", label: "A" }, { value: "b", label: "B"}], isLoading: false });
    const [selected, setSelected] = useState([]);
    const [value, setValue] = useState("");

    const handleInputChange = (value, { action }) => {
        if (action === "input-change") {
          setValue(value);
        }
    };

    const handleChange = (option, { action }) => {
        setSelected(option);
        console.log(option);
        console.log(action);
    };

    const Option = (props) => {
        const isSelected = selected.some((s) => s.value === props.data.value);
        return (
          <components.Option
            {...props}
            selectOption={() => null}
            selectValue={() => null}
          >
            <span className="options-row">
              <div className={isSelected ? "checkbox-checked" : "checkbox-default"}>
                {isSelected && (
                  <img alt="map" src={Checkmark} />
                )}
              </div>
              <div
                style={{
                  marginLeft: "1em",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {props.label}
              </div>
            </span>
          </components.Option>
        );
    };

    const customStyles = {
        container: (provided) => ({
          ...provided,
          display: "flex",
        }),
        control: (provided, state) => ({
          ...provided,
          backgroundColor: "white",
          minHeight: "40px",
          minWidth: "30em",
          display: "flex",
          justifyContent: "flex-end",
          boxShadow: "1px solid #3a8791",
          border: state.selectProps.menuIsOpen
            ? "1px solid #3a8791"
            : "1px solid #B6B6B6",
          borderRadius: "8px",
          "&:hover": {
            border: "1px solid #3a8791",
          },
        }),
        singleValue: () => ({
          backgroundColor: "white",
        }),
        option: () => ({
          backgroundColor: "white",
          color: "#484848",
          fontFamily: "Nunito",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: "1rem",
          lineHeight: "1.5rem",
          display: "flex",
          flexDirection: "row",
          marginLeft: "1.3em",
          verticalAlign: "middle",
          horizontalAlign: "middle",
        }),
        indicatorSeparator: () => ({
          display: "none"
        }),
        groupHeading: (provided) => ({
          ...provided,
          fontFamily: "Bahnschrift",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "24px",
          color: "#848484",
          textTransform: "uppercase",
          marginLeft: "2.5em",
        }),
        clearIndicator: (provided) => ({
          ...provided,
          display: selected.length >= 2 ? "" : "none",
        }),
        loadingIndicator: () => ({
          display: "none",
        }),
        menu: (provided) => ({
          ...provided,
          display: select.isLoading ? "none" : "",
          zIndex: 100,
        }),
        placeholder: (provided) => ({
          ...provided,
          fontFamily: "Nunito",
          marginLeft: "30px",
        }),
        input: (provided) => ({
          ...provided,
          marginLeft: "30px",
        }),
    };

    return (
          <Select
            styles={customStyles}
            components={{
              Option,
            }}
            placeholder={"Search by place"}
            options={select.options}
            onInputChange={handleInputChange}
            onChange={handleChange}
            isLoading={select.isLoading}
            noOptionsMessage={() => 'No results found'}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            inputValue={value ? value : ""}
            value={selected}
            filterOption={(options) => {
              return options;
            }}
            // controlShouldRenderValue={isOnLanding ? true : false}
            allowSelectAll
            isMulti
            isClearable
          />
      );
}