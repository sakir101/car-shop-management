import * as yup from 'yup';

export const signupUserSchema = yup.object().shape({
    name: yup.string().required("Full name is required"),
    email: yup.string().email().required("Email is required"),
    address: yup.string().required("Address is required"),
    contactNum: yup.string().required("Contact Number is required"),
    password: yup.string().min(6).max(32).required("Password must be maximum 32 character and minimum 6 character"),
    confPassword: yup
        .string()
        .test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.password === value;
        })
        .min(6)
        .max(32)
        .required(),
});


