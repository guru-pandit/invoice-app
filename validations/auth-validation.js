import * as Yup from "yup";
import { emailValidation, passwordValidation, strongPasswordValidation } from "./common-validation";

// Form schemas using common validations
export const signInSchema = Yup.object({
    email: emailValidation,
    password: passwordValidation,
});

export const registerSchema = Yup.object({
    email: emailValidation,
    password: strongPasswordValidation,
});

export const resetPasswordSchema = Yup.object({
    email: emailValidation,
});