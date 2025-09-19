"use client";
import React, { useEffect, useState } from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { SignInForm, RegisterForm, ResetPasswordForm } from "@/components/Auth";
import { useAuthorization } from "@/hooks/auth";

export default function LoginPage() {
  const [mode, setMode] = useState("signin"); // signin | register
  const { user } = useAuthContext();
  const router = useRouter();
  const { handleSignIn, handleRegister, handleReset, loading } = useAuthorization();

  useEffect(() => {
    if (user) {
      router.replace("/invoices");
    }
  }, [user, router]);

  // Wrapper functions to handle Formik's actions and navigation
  const onSignIn = async (values, actions) => {
    const result = await handleSignIn(values, actions.setSubmitting);
    if (result.success) {
      router.replace("/invoices");
    }
  };

  const onRegister = async (values, actions) => {
    const result = await handleRegister(values, actions.setSubmitting);
    if (result.success) {
      router.replace("/invoices");
    }
  };

  const onReset = async (values, actions) => {
    await handleReset(values, actions.setSubmitting);
    // No navigation needed for password reset
  };

  // Get page title based on mode
  const getPageTitle = () => {
    switch (mode) {
      case "signin":
        return "Sign in";
      case "register":
        return "Create account";
      case "reset":
        return "Reset Password";
      default:
        return "Sign in";
    }
  };

  // Render form component based on mode
  const renderForm = () => {
    switch (mode) {
      case "signin":
        return (
          <SignInForm
            onSubmit={onSignIn}
            loading={loading}
            onSwitchToRegister={() => setMode("register")}
            onSwitchToReset={() => setMode("reset")}
          />
        );
      case "register":
        return (
          <RegisterForm
            onSubmit={onRegister}
            loading={loading}
            onSwitchToSignIn={() => setMode("signin")}
          />
        );
      case "reset":
        return (
          <ResetPasswordForm
            onSubmit={onReset}
            loading={loading}
            onSwitchToSignIn={() => setMode("signin")}
          />
        );
      default:
        return (
          <SignInForm
            onSubmit={onSignIn}
            loading={loading}
            onSwitchToRegister={() => setMode("register")}
            onSwitchToReset={() => setMode("reset")}
          />
        );
    }
  };

  return (
    <Container maxW="sm" py={12}>
      <Stack spacing={6}>
        <Heading>{getPageTitle()}</Heading>
        {renderForm()}
      </Stack>
    </Container>
  );
}
