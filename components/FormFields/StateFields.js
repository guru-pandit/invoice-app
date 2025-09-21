import { FormControl, FormLabel, Select, Input, Button, HStack, Text } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import DatePicker from "@/components/DatePicker";

// Reusable DatePicker for plain React state
export function StateDatePicker({ label, value, onChange, placeholder = "Select date & time", showTimeSelect = true, dateFormat = "yyyy-MM-dd HH:mm", ...props }) {
  // Convert string/number to Date object for DatePicker
  const getDateValue = () => {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    if (onChange) {
      if (date) {
        // Convert Date to ISO string for consistency
        onChange(date.toISOString());
      } else {
        onChange("");
      }
    }
  };

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <DatePicker
        selected={getDateValue()}
        onChange={handleDateChange}
        placeholderText={placeholder}
        showTimeSelect={showTimeSelect}
        dateFormat={dateFormat}
        timeIntervals={15}
        {...props}
      />
    </FormControl>
  );
}

// Reusable Select Field for plain React state
export function StateSelect({ label, value, onChange, placeholder, options = [], maxW = "250px", ...props }) {
  return (
    <FormControl maxW={maxW}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

// Reusable Input Field for plain React state
export function StateInput({ label, type = "text", value, onChange, placeholder, ...props }) {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </FormControl>
  );
}
