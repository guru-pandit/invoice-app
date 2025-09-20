import * as Yup from "yup";
import { emailValidation, invoiceNumberValidation, customerNameValidation, invoiceStatusValidation, quantityValidation, priceValidation, taxRateValidation, itemDescriptionValidation } from "./common-validation";
import { atLeastMessage } from "@/constants/messages";

// Schema for individual invoice items
export const invoiceItemSchema = Yup.object().shape({
    description: itemDescriptionValidation,
    qty: quantityValidation,
    price: priceValidation,
});

// Main invoice schema
export const invoiceSchema = Yup.object().shape({
    number: invoiceNumberValidation,
    customerName: customerNameValidation,
    customerEmail: emailValidation,
    status: invoiceStatusValidation,
    items: Yup.array()
        .of(invoiceItemSchema)
        .min(1, atLeastMessage('item', 1)),
    taxRate: taxRateValidation,
});