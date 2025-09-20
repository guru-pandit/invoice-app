import * as Yup from "yup";
import { emailValidation, nameValidation, phoneValidation } from "./common-validation";

// Customer validation schema
export const customerSchema = Yup.object().shape({
    name: nameValidation,
    email: emailValidation,
    phone: phoneValidation,
});
