import * as yup from 'yup';

export const appointmentSchema = yup.object().shape({
    startHour: yup.string().required("Start hour is required"),
    endHour: yup.string().required("End hour is required"),
    duration: yup.string().required("Duration is required"),
    suggestedHour: yup.string().optional(),
    odometer: yup.string().optional(),
    note: yup.string().optional(),
    scheduled: yup.string().required("schedule is required"),
    tag: yup.string().optional(),
});