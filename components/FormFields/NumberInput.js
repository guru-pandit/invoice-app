import { FormControl, FormLabel, NumberInput, NumberInputField, FormErrorMessage } from "@chakra-ui/react";

export function NumberInputFieldComponent({ field, form, label, placeholder, min, max, ...props }) {
    const isInvalid = form.errors[field.name] && form.touched[field.name];

    return (
        <FormControl isInvalid={isInvalid}>
            <FormLabel>{label}</FormLabel>
            <NumberInput
                min={min}
                max={max}
                value={field.value}
                onChange={(valueString, valueNumber) => {
                    form.setFieldValue(field.name, valueNumber);
                }}
                onBlur={field.onBlur}
                {...props}
            >
                <NumberInputField placeholder={placeholder} />
            </NumberInput>
            <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
    );
}
