import * as yup from "yup";

export const serviceValidation = yup.object().shape({
  title: yup.string().required("Title is required"),
  code: yup.string().required("Code is required"),
});