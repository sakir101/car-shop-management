"use client";

import { TimePicker } from "antd";
import { useFormContext, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";

interface ITimePicker {
  name: string;
  id?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  size?: "large" | "small"|"middle";
  disabled?: boolean;
  selectedDate?: Date;
  onChange?: (time: dayjs.Dayjs | null, timeString: string) => void;
  handleChange?: (timeString: string) => void;
}

const FormTimePicker = ({
  name,
  placeholder = "Select Time",
  label,
  required,
  className,
  size = "middle",
  onChange,
  handleChange,
  disabled = false,
  selectedDate,
  
}: ITimePicker) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  // Define format dynamically based on the name
  const timeFormat = name === "duration" ? "HH:mm" : "h:mm A";

  const getDisabledHours = () => {
    if (!selectedDate) return [];
    const now = dayjs();
    const selectedDay = dayjs(selectedDate);
    if (selectedDay.isSame(now, "day")) {
      return Array.from({ length: now.hour() }, (_, i) => i);
    }
    return [];
  };

  const getDisabledMinutes = (selectedHour: number) => {
    if (!selectedDate) return [];
    const now = dayjs();
    const selectedDay = dayjs(selectedDate);
    if (selectedDay.isSame(now, "day") && selectedHour === now.hour()) {
      return Array.from({ length: now.minute() }, (_, i) => i);
    }
    return [];
  };

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
          <TimePicker
            className="w-full"
            {...field}
            placeholder={placeholder}
            size={size}
            format={timeFormat}
            disabled={disabled}
            disabledHours={getDisabledHours}
            disabledMinutes={getDisabledMinutes}
            use12Hours={timeFormat === "h:mm A"} 
            renderExtraFooter={() => null}
            popupClassName="no-footer-picker"
            needConfirm={false}
            onChange={(time, timeString) => {
              if (time && time.isValid()) {
                const formattedTime = time.format(timeFormat);
                field.onChange(formattedTime);
                if (onChange) onChange(time, formattedTime);
                if (handleChange) handleChange(formattedTime);
              } else {
                field.onChange(null);
                if (onChange) onChange(null, "");
                if (handleChange) handleChange("");
              }
            }}
            value={field.value ? dayjs(field.value, timeFormat) : undefined}
            minuteStep={15}
          />
        )}
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </div>
  );
};

export default FormTimePicker;
