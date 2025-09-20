import { FormControl, FormLabel, Select, FormErrorMessage } from "@chakra-ui/react";

export function SelectField({ field, form, label, placeholder, children, ...props }) {
    const isInvalid = form.errors[field.name] && form.touched[field.name];

    return (
        <FormControl isInvalid={isInvalid}>
            <FormLabel>{label}</FormLabel>
            <Select
                {...field}
                placeholder={placeholder}
                {...props}
            >
                {children}
            </Select>
            <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
    );
}
