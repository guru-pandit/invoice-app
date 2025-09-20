import * as Yup from "yup";
import { atLeastMessage, invalidMessage, requiredMessage, minValueMessage, maxValueMessage } from "@/constants/messages";
import { PASSWORD_REGEX } from "./regex";
import { INVOICE_STATUS_OPTIONS, MIN_TAX_RATE, MAX_TAX_RATE, DEFAULT_TAX_RATE } from "@/constants/invoices";

// Auth validations
export const emailValidation = Yup.string()
    .email(invalidMessage('email'))
    .required(requiredMessage('email'));

export const nameValidation = Yup.string()
    .required(requiredMessage('name'));

export const phoneValidation = Yup.string()
    .required(requiredMessage('phone'));

export const passwordValidation = Yup.string()
    .min(6, atLeastMessage('password', 6))
    .required(requiredMessage('password'));

export const strongPasswordValidation = Yup.string()
    .min(6, atLeastMessage('password', 6))
    .matches(PASSWORD_REGEX, invalidMessage('password'))
    .required(requiredMessage('password'));

// Common invoice validations
export const invoiceNumberValidation = Yup.string()
    .required(requiredMessage('invoice number'));

export const customerNameValidation = Yup.string()
    .required(requiredMessage('customer name'));

export const invoiceStatusValidation = Yup.string()
    .oneOf(INVOICE_STATUS_OPTIONS, invalidMessage('status'))
    .required(requiredMessage('status'));

export const quantityValidation = Yup.number()
    .min(0, minValueMessage('quantity', 0))
    .required(requiredMessage('quantity'));

export const priceValidation = Yup.number()
    .min(0, minValueMessage('price', 0))
    .required(requiredMessage('price'));

export const taxRateValidation = Yup.number()
    .min(MIN_TAX_RATE, minValueMessage('tax rate', `${MIN_TAX_RATE}%`))
    .max(MAX_TAX_RATE, maxValueMessage('tax rate', `${MAX_TAX_RATE}%`))
    .default(DEFAULT_TAX_RATE);

export const itemDescriptionValidation = Yup.string()
    .required(requiredMessage('description'));