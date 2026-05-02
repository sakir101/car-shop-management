"use client";

import { DatePicker } from "antd";
import { useFormContext, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";

interface IDatePicker {
  name: string;
  id?: string;
  placeholder?: string;
  validation?: object;
  label?: string;
  required?: boolean;
  className?: string;
  size?: "large" | "small"|'middle';
  onChange?: (date: dayjs.Dayjs | null, dateString: string) => void;
  handleChange?: (timeString: string) => void;
  disablePast?: boolean;
  
}

const FormDatePicker = ({
  name,
  placeholder,
  label,
  required,
  className,
  size = "middle",
  onChange,
  handleChange,
  disablePast = false,
  
}: IDatePicker) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div>
        {label ? label : null}
        {required ? (
          <span
            style={{
              color: "red",
            }}
          >
            *
          </span>
        ) : null}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            className="w-full"
            {...field}
            placeholder={placeholder}
            size={size}
            disabledDate={disablePast ? (current) => current && current < dayjs().startOf("day") : undefined}
            onChange={(date, dateString) => {
              if (date && date.isValid()) {
                const formattedDate = date.format("YYYY-MM-DD");
                field.onChange(formattedDate);
                if (onChange) onChange(date, formattedDate);
                if (handleChange) handleChange(formattedDate);
              } else {
                field.onChange(null);
                if (onChange) onChange(null, "");
                if (handleChange) handleChange("");
              }
            }}
            value={field.value ? dayjs(field.value, "YYYY-MM-DD") : undefined}
          />
        )}
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </div>
  );
};

export default FormDatePicker;
