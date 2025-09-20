import React from "react";
import { Button, Stack, Text, HStack, Link as CLink } from "@chakra-ui/react";
import { useFormik } from "formik";
import { InputField } from "@/components/FormFields";
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

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
                <InputField
                    field={{ name: "email", value: values.email, onChange: handleChange, onBlur: handleBlur }}
                    form={{ errors, touched }}
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                />

                <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={loading || isSubmitting}
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
