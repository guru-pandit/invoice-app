// Examples showing useFormik hook usage in auth components

import React from "react";
import { useFormik } from "formik";
import { Button, Stack, FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { signInSchema } from "@/validations/auth-validation";
import { useAuthorization } from "@/hooks/auth";

// Example 1: Basic useFormik usage (similar to what's in our components)
export function BasicFormikExample() {
    const { handleSignIn, loading } = useAuthorization();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: signInSchema,
        onSubmit: async (values, actions) => {
            const result = await handleSignIn(values, actions.setSubmitting);
            if (result.success) {
                // Handle success
                console.log("Login successful!");
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
                <FormControl isInvalid={formik.errors.email && formik.touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.password && formik.touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    isLoading={loading || formik.isSubmitting}
                >
                    Sign In
                </Button>
            </Stack>
        </form>
    );
}

// Example 2: Advanced useFormik with custom validation and field manipulation
export function AdvancedFormikExample() {
    const { handleSignIn, loading } = useAuthorization();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: signInSchema,
        onSubmit: async (values, actions) => {
            // You can manipulate values before submission
            const trimmedValues = {
                email: values.email.trim().toLowerCase(),
                password: values.password
            };

            const result = await handleSignIn(trimmedValues, actions.setSubmitting);
            
            if (result.success) {
                // Reset form on success
                actions.resetForm();
            } else {
                // Set field-specific errors if needed
                actions.setFieldError('email', 'Invalid credentials');
            }
        }
    });

    // Custom handlers for additional functionality
    const handleEmailChange = (e) => {
        formik.handleChange(e);
        // Additional logic when email changes
        if (formik.errors.email && formik.touched.email) {
            // Clear error when user starts typing
            formik.setFieldError('email', '');
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
                <FormControl isInvalid={formik.errors.email && formik.touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={handleEmailChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.password && formik.touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    isLoading={loading || formik.isSubmitting}
                    disabled={!formik.isValid || !formik.dirty}
                >
                    Sign In
                </Button>

                {/* Additional buttons for form manipulation */}
                <Button
                    variant="outline"
                    onClick={() => formik.resetForm()}
                    disabled={!formik.dirty}
                >
                    Reset Form
                </Button>
            </Stack>
        </form>
    );
}

// Example 3: useFormik with dynamic field validation
export function DynamicValidationExample() {
    const { handleSignIn, loading } = useAuthorization();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: signInSchema,
        onSubmit: async (values, actions) => {
            const result = await handleSignIn(values, actions.setSubmitting);
            if (result.success) {
                console.log("Success!");
            }
        }
    });

    // Check if form is ready to submit
    const isFormReady = formik.isValid && formik.dirty && !formik.isSubmitting;

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
                <FormControl isInvalid={formik.errors.email && formik.touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        // Dynamic styling based on validation
                        borderColor={
                            formik.touched.email 
                                ? formik.errors.email 
                                    ? "red.300" 
                                    : "green.300"
                                : "gray.200"
                        }
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.password && formik.touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        borderColor={
                            formik.touched.password 
                                ? formik.errors.password 
                                    ? "red.300" 
                                    : "green.300"
                                : "gray.200"
                        }
                    />
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    colorScheme={isFormReady ? "teal" : "gray"}
                    isLoading={loading || formik.isSubmitting}
                    disabled={!isFormReady}
                >
                    Sign In
                </Button>

                {/* Debug info */}
                <pre style={{ fontSize: '12px', background: '#f7f7f7', padding: '10px' }}>
                    {JSON.stringify({
                        values: formik.values,
                        errors: formik.errors,
                        touched: formik.touched,
                        isValid: formik.isValid,
                        dirty: formik.dirty,
                        isSubmitting: formik.isSubmitting
                    }, null, 2)}
                </pre>
            </Stack>
        </form>
    );
}
