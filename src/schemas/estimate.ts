import * as yup from 'yup';

export const estimateSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    inspectionHours: yup.string().optional(),
    labourHours: yup.string().optional(),
    inspectionAmount: yup.string().optional(),
    partsAmount: yup.string().optional(),
    labourAmount: yup.string().optional(),
    authorizationMedium: yup.string().optional(),
    authorizationStatus: yup.string().optional(),
});