import { useState } from "react";
import { emailRegister, emailSignIn, sendPasswordReset } from "@/lib/firebase/auth";
import { useToastMessages } from "./popup";

export function useAuthorization() {
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToastMessages();

    const handleSignIn = async (values, setSubmitting = null) => {
        setLoading(true);
        if (setSubmitting) setSubmitting(true);

        try {
            await emailSignIn(values.email, values.password);
            showSuccess("Logged in");
            return { success: true, data: null };
        } catch (e) {
            showError(`Sign in failed (${e.message})`);
            return { success: false, error: e.message };
        } finally {
            setLoading(false);
            if (setSubmitting) setSubmitting(false);
        }
    };

    const handleRegister = async (values, setSubmitting = null) => {
        setLoading(true);
        if (setSubmitting) setSubmitting(true);

        try {
            await emailRegister(values.email, values.password);
            showSuccess("Account created");
            return { success: true, data: null };
        } catch (e) {
            showError(`Registration failed (${e.message})`);
            return { success: false, error: e.message };
        } finally {
            setLoading(false);
            if (setSubmitting) setSubmitting(false);
        }
    };

    const handleReset = async (values, setSubmitting = null) => {
        setLoading(true);
        if (setSubmitting) setSubmitting(true);

        try {
            await sendPasswordReset(values.email);
            showSuccess("Password reset email sent");
            return { success: true, data: null };
        } catch (e) {
            showError(`Failed to send reset email (${e.message})`);
            return { success: false, error: e.message };
        } finally {
            setLoading(false);
            if (setSubmitting) setSubmitting(false);
        }
    };

    return {
        handleSignIn,
        handleRegister,
        handleReset,
        loading
    };
}