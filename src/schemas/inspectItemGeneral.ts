import * as yup from 'yup';

export const inspectItemGeneralSchema = yup.object().shape({
    itemName: yup.string().required("Item name is required"),
    code: yup.string().required("Code is required"),
    
});