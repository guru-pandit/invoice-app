import React from "react";
import { Button, Stack, Text, HStack, Link as CLink } from "@chakra-ui/react";
import { useFormik } from "formik";
import { InputField } from "@/components/FormFields";
import { loginInitialValues } from "@/constants/initialvalues";
import { signInSchema } from "validations/auth-validation";

export function SignInForm({ onSubmit, loading, onSwitchToRegister, onSwitchToReset }) {
    const formik = useFormik({
        initialValues: loginInitialValues,
        validationSchema: signInSchema,
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

                <InputField
                    field={{ name: "password", value: values.password, onChange: handleChange, onBlur: handleBlur }}
                    form={{ errors, touched }}
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                />

                <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={loading || isSubmitting}
                    loadingText="Signing in..."
                >
                    Sign in
                </Button>

                <HStack justify="space-between">
                    <Text fontSize="sm">
                        Don't have an account?{" "}
                        <CLink color="teal.500" onClick={onSwitchToRegister}>
                            Register
                        </CLink>
                    </Text>
                    <CLink fontSize="sm" onClick={onSwitchToReset}>
                        Forgot password?
                    </CLink>
                </HStack>
            </Stack>
        </form>
    );
}
