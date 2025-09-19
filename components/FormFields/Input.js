import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

export function InputField({ field, form, label, type = "text", placeholder, ...props }) {
    const isInvalid = form.errors[field.name] && form.touched[field.name];

    return (
        <FormControl isInvalid={isInvalid}>
            <FormLabel>{label}</FormLabel>
            <Input
                {...field}
                type={type}
                placeholder={placeholder}
                {...props}
            />
            <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
    );
}