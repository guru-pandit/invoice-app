import React from "react";
import { Button, Stack, Text, HStack, Link as CLink, FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
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

                <FormControl isInvalid={formik.errors.password && formik.touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={loading || formik.isSubmitting}
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
