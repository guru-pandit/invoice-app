// Example usage of reusable auth components

import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { SignInForm, RegisterForm, ResetPasswordForm } from "@/components/Auth";
import { useAuthorization } from "@/hooks/auth";

// Example 1: Using auth forms in a modal
export function AuthModal({ isOpen, onClose, initialMode = "signin" }) {
    const [mode, setMode] = useState(initialMode);
    const { handleSignIn, handleRegister, handleReset, loading } = useAuthorization();

    const onSignIn = async (values, { setSubmitting }) => {
        const result = await handleSignIn(values, setSubmitting);
        if (result.success) {
            onClose(); // Close modal on success
        }
    };

    const onRegister = async (values, { setSubmitting }) => {
        const result = await handleRegister(values, setSubmitting);
        if (result.success) {
            onClose(); // Close modal on success
        }
    };

    const onReset = async (values, { setSubmitting }) => {
        const result = await handleReset(values, setSubmitting);
        if (result.success) {
            setMode("signin"); // Switch back to signin after reset
        }
    };

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
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {mode === "signin" ? "Sign In" : mode === "register" ? "Create Account" : "Reset Password"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {renderForm()}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

// Example 2: Using auth forms in a multi-step wizard
export function AuthWizard({ onComplete }) {
    const [step, setStep] = useState(1);
    const [mode, setMode] = useState("signin");
    const { handleSignIn, handleRegister, handleReset, loading } = useAuthorization();

    const onSignIn = async (values, { setSubmitting }) => {
        const result = await handleSignIn(values, setSubmitting);
        if (result.success) {
            setStep(2); // Go to next step
        }
    };

    const onRegister = async (values, { setSubmitting }) => {
        const result = await handleRegister(values, setSubmitting);
        if (result.success) {
            setStep(2); // Go to next step
        }
    };

    if (step === 1) {
        return (
            <div>
                <h2>Step 1: Authentication</h2>
                {mode === "signin" ? (
                    <SignInForm
                        onSubmit={onSignIn}
                        loading={loading}
                        onSwitchToRegister={() => setMode("register")}
                        onSwitchToReset={() => setMode("reset")}
                    />
                ) : (
                    <RegisterForm
                        onSubmit={onRegister}
                        loading={loading}
                        onSwitchToSignIn={() => setMode("signin")}
                    />
                )}
            </div>
        );
    }

    return (
        <div>
            <h2>Step 2: Complete Setup</h2>
            <p>Authentication successful! Continue with setup...</p>
        </div>
    );
}

// Example 3: Standalone auth component with custom styling
export function CustomStyledAuth() {
    const [mode, setMode] = useState("signin");
    const { handleSignIn, handleRegister, handleReset, loading } = useAuthorization();

    const onSignIn = async (values, { setSubmitting }) => {
        const result = await handleSignIn(values, setSubmitting);
        if (result.success) {
            // Custom success handling
            window.location.href = "/custom-dashboard";
        }
    };

    return (
        <div style={{ backgroundColor: "#f7fafc", padding: "2rem", borderRadius: "8px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Welcome Back</h1>
            
            {mode === "signin" && (
                <SignInForm
                    onSubmit={onSignIn}
                    loading={loading}
                    onSwitchToRegister={() => setMode("register")}
                    onSwitchToReset={() => setMode("reset")}
                />
            )}
            
            {/* Add other modes as needed */}
        </div>
    );
}
