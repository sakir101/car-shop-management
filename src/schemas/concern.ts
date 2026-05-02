import * as yup from 'yup';

export const concernSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    code: yup.string().required("Code is required"),
    description: yup.string().required("Description is required"),
});