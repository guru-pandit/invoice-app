"use client";
import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormControl, FormLabel, Input, HStack } from "@chakra-ui/react";
import moment from "moment";
import { normalizeToDate } from "@/utils/format";

// A reusable date-time picker that integrates with Formik or plain state
// Props:
// - label: string (optional)
// - selected: Date | string | number | null
// - onChange: function(Date) => void
// - placeholder: string
// - showTimeSelect: boolean
// - dateFormat: string (e.g., "yyyy-MM-dd HH:mm")
// - id, name: optional
export default function DatePicker({ label, selected, onChange, placeholder = "Select date & time", showTimeSelect = true, dateFormat = "yyyy-MM-dd HH:mm", id, name }) {
  const value = normalizeToDate(selected);

  return (
    <FormControl>
      {label ? <FormLabel htmlFor={id || name}>{label}</FormLabel> : null}
      <HStack>
        <ReactDatePicker
          id={id}
          selected={value}
          onChange={(date) => onChange && onChange(date)}
          customInput={<Input />}
          showTimeSelect={showTimeSelect}
          timeIntervals={15}
          dateFormat={dateFormat}
          placeholderText={placeholder}
          isClearable
        />
      </HStack>
    </FormControl>
  );
}
