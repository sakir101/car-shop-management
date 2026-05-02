import * as yup from "yup";

export const contactSchema = yup.object().shape({

  phone: yup.string().required("phone is required"),
  // email: yup.string().email("Invalid email format").required("Email is required"),
  // role: yup.string().required("Role is required"),

});
