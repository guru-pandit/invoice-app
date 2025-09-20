import * as Yup from "yup";
import { atLeastMessage, invalidMessage, requiredMessage } from "@/constants/messages";
import { PASSWORD_REGEX } from "./regex";

export const emailValidation = Yup.string()
    .email(invalidMessage('email'))
    .required(requiredMessage('email'));

export const passwordValidation = Yup.string()
    .min(6, atLeastMessage('password', 6))
    .required(requiredMessage('password'));

export const strongPasswordValidation = Yup.string()
    .min(6, atLeastMessage('password', 6))
    .matches(
        PASSWORD_REGEX,
        invalidMessage('password')
    )
    .required(requiredMessage('password'));