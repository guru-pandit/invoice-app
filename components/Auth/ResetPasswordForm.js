import React from "react";
import { Button, Stack, Text, HStack, Link as CLink, FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
import { resetPasswordInitialValues } from "@/constants/initialvalues";
import { resetPasswordSchema } from "validations/auth-validation";

export function ResetPasswordForm({ onSubmit, loading, onSwitchToSignIn }) {
    const formik = useFormik({
        initialValues: resetPasswordInitialValues,
        validationSchema: resetPasswordSchema,
        onSubmit: (values, actions) => {
            onSubmit(values, actions);
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
                        placeholder="you@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={loading || formik.isSubmitting}
                    loadingText="Sending reset email..."
                >
                    Send Reset Email
                </Button>

                <HStack>
                    <Text fontSize="sm">Remember your password?</Text>
                    <CLink color="teal.500" onClick={onSwitchToSignIn}>
                        Sign in
                    </CLink>
                </HStack>
            </Stack>
        </form>
    );
}
