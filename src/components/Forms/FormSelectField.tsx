"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Select } from "antd";
import { useFormContext, Controller } from "react-hook-form";

export type SelectOptions = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  options: SelectOptions[];
  name: string;
  size?: "large" | "small"|"middle";
  value?: string | string[];
  placeholder?: string;
  label?: string;
  validation?: object;
  defaultValue?: SelectOptions | string;
  required?: boolean;
  className?: string;
  handleChange?: (el: string) => void;
};

const FormSelectField = ({
  name,
  size = "middle",
  placeholder = "select",
  options,
  defaultValue,
  label,
  required,
  handleChange,
  className,
}: SelectFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </div>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            size={size}
            defaultValue={defaultValue || undefined}
            options={options}
            style={{ width: "100%" }}
            placeholder={placeholder}
            onChange={(value) => {
              field.onChange(value);
              if (handleChange) {
                handleChange(value); 
              }
            }}
          />
        )}
      />
      {errorMessage && <small style={{ color: "red" }}>{errorMessage}</small>}
    </div>
  );
};

export default FormSelectField;