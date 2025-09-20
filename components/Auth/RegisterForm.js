import React from "react";
import { Button, Stack, Text, HStack, Link as CLink } from "@chakra-ui/react";
import { useFormik } from "formik";
import { InputField } from "@/components/FormFields";
import { registerInitialValues } from "@/constants/initialvalues";
import { registerSchema } from "validations/auth-validation";

export function RegisterForm({ onSubmit, loading, onSwitchToSignIn }) {
    const formik = useFormik({
        initialValues: registerInitialValues,
        validationSchema: registerSchema,
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
                    loadingText="Creating account..."
                >
                    Create account
                </Button>

                <HStack>
                    <Text fontSize="sm">Already have an account?</Text>
                    <CLink color="teal.500" onClick={onSwitchToSignIn}>
                        Sign in
                    </CLink>
                </HStack>
            </Stack>
        </form>
    );
}
