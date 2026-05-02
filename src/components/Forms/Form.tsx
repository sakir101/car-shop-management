"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearResetStatus } from "@/redux/slice/resetForm";
import { ReactElement, ReactNode, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
  age: number;
};

type FormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
};

type FormProps = {
  children?: ReactElement | ReactNode;
  submitHandler: SubmitHandler<any>;
  formKey: string;
  isReset?: boolean;
  className?: string;
} & FormConfig;

const Form = ({
  children,
  submitHandler,
  defaultValues,
  resolver,
  formKey,
  className,
}: FormProps) => {
  const formConfig: FormConfig = {};

  if (!!defaultValues) formConfig["defaultValues"] = defaultValues;
  if (!!resolver) formConfig["resolver"] = resolver;

  // Use the FormValues type in useForm
  const methods = useForm<FormValues>(formConfig);
  const { handleSubmit, reset, watch, setValue } = methods;

  const { isReset } = useAppSelector((state) => state.reset);
  const dispatch = useAppDispatch();

  // Effect to restore form values from local storage on page reload
  useEffect(() => {
    const storedFormValues = localStorage.getItem(`formValues_${formKey}`);
    if (storedFormValues) {
      const parsedValues: FormValues = JSON.parse(storedFormValues);
      (Object.keys(parsedValues) as Array<keyof FormValues>).forEach((key) => {
        setValue(key, parsedValues[key]);
      });
    }
  }, [formKey, setValue]);

  // Effect to reset the form when `isRestet` is true
  useEffect(() => {
    if (isReset) {
      reset();
      localStorage.removeItem(`formValues_${formKey}`);
      dispatch(clearResetStatus());
    }
  }, [isReset, reset, formKey, dispatch]);

  // Effect to save form values to local storage on change
  useEffect(() => {
    const watchSubscription = watch((formValues) => {
       const { fileAs,role, ...filteredValues }:any = formValues;
      localStorage.setItem(`formValues_${formKey}`, JSON.stringify(filteredValues));
    });

    return () => {
      watchSubscription.unsubscribe(); // Cleanup subscription
    };
  }, [watch, formKey]);

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    await submitHandler(data); // Call the provided submit handler
  };

  return (
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
