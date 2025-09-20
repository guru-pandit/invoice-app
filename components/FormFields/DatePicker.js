import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import DatePicker from "@/components/DatePicker";

export function DatePickerField({ field, form, label, showTimeSelect = false, dateFormat = "yyyy-MM-dd", ...props }) {
    const isInvalid = form.errors[field.name] && form.touched[field.name];

    return (
        <FormControl isInvalid={isInvalid}>
            <FormLabel>{label}</FormLabel>
            <DatePicker
                selected={field.value}
                onChange={(date) => {
                    const isoString = date ? new Date(date).toISOString() : "";
                    form.setFieldValue(field.name, isoString);
                }}
                showTimeSelect={showTimeSelect}
                dateFormat={dateFormat}
                {...props}
            />
            <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
    );
}
