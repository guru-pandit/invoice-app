"use client";
import React from "react";
import { Button, FormControl, FormLabel, Input, Stack, useToast } from "@chakra-ui/react";
import { Formik, Form } from "formik";

export default function CustomerForm({ initialValues, onSubmit, submitLabel = "Save Customer" }) {
  const toast = useToast();
  const init = {
    name: "",
    email: "",
    phone: "",
    ...(initialValues || {}),
  };
  return (
    <Formik
      initialValues={init}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        try {
          await onSubmit(values);
        } catch (e) {
          toast({ status: "error", title: "Failed", description: e.message });
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={values.name} onChange={(e) => setFieldValue("name", e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={values.email} onChange={(e) => setFieldValue("email", e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input value={values.phone} onChange={(e) => setFieldValue("phone", e.target.value)} />
            </FormControl>
            <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>{submitLabel}</Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
