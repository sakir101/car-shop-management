import * as yup from "yup";

export const inspectionGroupSchema = yup.object().shape({
  name: yup.string().required("name is required"),
  code: yup.string().required("Code is required"),
  description: yup.string().required("Description is required"),
});
