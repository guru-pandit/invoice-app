"use client";
import React from "react";
import { Button, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { InputField } from "@/components/FormFields/Input";
import { customerSchema } from "validations/customer-validation";
import { customerInitialValues } from "@/constants/initialvalues";
import { useToastMessages } from "@/hooks/popup";

export default function CustomerForm({ initialValues, onSubmit, submitLabel = "Save Customer" }) {
  const { showError } = useToastMessages();

  const formik = useFormik({
    initialValues: { ...customerInitialValues, ...(initialValues || {}) },
    validationSchema: customerSchema,
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);
      try {
        await onSubmit(values);
      } catch (e) {
        showError(e.message);
      } finally {
        actions.setSubmitting(false);
      }
    }
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <InputField
          field={{ name: "name", value: values.name, onChange: handleChange, onBlur: handleBlur }}
          form={{ errors, touched }}
          label="Name"
          placeholder="Enter customer name"
        />

        <InputField
          field={{ name: "email", value: values.email, onChange: handleChange, onBlur: handleBlur }}
          form={{ errors, touched }}
          label="Email"
          type="email"
          placeholder="Enter email address"
        />

        <InputField
          field={{ name: "phone", value: values.phone, onChange: handleChange, onBlur: handleBlur }}
          form={{ errors, touched }}
          label="Phone"
          placeholder="Enter phone number"
        />

        <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
}
