import { FormControl, FormLabel, Textarea, FormErrorMessage } from "@chakra-ui/react";

export function TextareaField({ field, form, label, placeholder, ...props }) {
    const isInvalid = form.errors[field.name] && form.touched[field.name];

    return (
        <FormControl isInvalid={isInvalid}>
            <FormLabel>{label}</FormLabel>
            <Textarea
                {...field}
                placeholder={placeholder}
                {...props}
            />
            <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
    );
}
