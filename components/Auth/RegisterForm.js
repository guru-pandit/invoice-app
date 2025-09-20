import React from "react";
import { Button, Stack, Text, HStack, Link as CLink, FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
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
