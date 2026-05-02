"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Input, InputProps } from "antd";
import { useFormContext, Controller } from "react-hook-form";

interface IInput extends InputProps {
    name: string;
    type?: string;
    size?: "large" | "small" | "middle";
    value?: string | string[] | undefined;
    id?: string;
    placeholder?: string;
    validation?: object;
    label?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    onValueChange?: (e: any) => void; // this function can be removed as onChange is already present in InputProps
}

const FormInput = ({
    name,
    type,
    size = "middle",
    value,
    id,
    placeholder,
    validation,
    label,
    required,
    className,
    disabled,
    onValueChange,
    ...rest
}: IInput) => {
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
                render={({ field }) =>
                    type === "password" ? (
                        <Input.Password
                            type={type}
                            size={size}
                            placeholder={placeholder}
                            {...field}
                            value={value ? value : field.value}
                            disabled={disabled}
                            {...rest}
                        />
                    ) : (
                        <Input
                            type={type}
                            size={size}
                            placeholder={placeholder}
                            {...field}
                            value={value ? value : field.value}
                            disabled={disabled}
                            onChange={(e) => {
                                field.onChange(e);
                                if (onValueChange) {
                                    onValueChange(e.target.value);
                                }
                            }}
                            {...rest}
                        />
                    )
                }
            />
            <small style={{ color: "red" }}>{errorMessage}</small>
        </div>
    );
};

export default FormInput;
