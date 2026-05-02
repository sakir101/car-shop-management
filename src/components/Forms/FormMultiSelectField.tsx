import { useFormContext, Controller } from "react-hook-form";
import { Select } from "antd";

const { Option } = Select;

type SelectOptions = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  name: string;
  size?: "large" | "small";
  value?: string | string[] | undefined;
  placeholder?: string;
  options: SelectOptions[];
  label?: string;
  defaultValue?: SelectOptions;
  handleChange?: (el: string) => void;
};

const FormMultiSelectField = ({
  name,
  size = "large",
  value,
  placeholder = "select",
  options,
  label,
  defaultValue,
}: SelectFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      {label ? label : null}
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <Select
            className="w-1/2"
            showSearch
            onChange={onChange}
            size={size}
            value={value}
            placeholder={placeholder}
            allowClear
            mode="multiple"
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {options?.map((option) => (
              <Option
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        )}
      />
    </>
  );
};

export default FormMultiSelectField;
