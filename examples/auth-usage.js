// Example usage of the new generic auth functions

import { useAuthorization } from "@/hooks/auth";
import { useRouter } from "next/navigation";

export function AuthExamples() {
    const { handleSignIn, handleRegister, handleReset, loading } = useAuthorization();
    const router = useRouter();

    // Example 1: Using with Formik (setSubmitting will be handled automatically)
    const onFormikSubmit = async (values, { setSubmitting }) => {
        const result = await handleSignIn(values, setSubmitting);
        if (result.success) {
            console.log("Login successful!");
            // Handle navigation at component level
            router.replace("/dashboard");
        } else {
            console.log("Login failed:", result.error);
        }
    };

    // Example 2: Using without Formik (manual call)
    const onManualLogin = async () => {
        const values = {
            email: "user@example.com",
            password: "password123"
        };
        
        const result = await handleSignIn(values);
        if (result.success) {
            console.log("Login successful!");
            // Handle navigation at component level
            router.replace("/dashboard");
        } else {
            console.log("Login failed:", result.error);
        }
    };

    // Example 3: Using with custom loading state
    const onCustomLogin = async () => {
        const values = {
            email: "user@example.com",
            password: "password123"
        };
        
        // You can pass your own setSubmitting function
        const setSubmitting = (isSubmitting) => {
            console.log("Custom submitting state:", isSubmitting);
        };
        
        const result = await handleSignIn(values, setSubmitting);
        return result;
    };

    // Example 4: Register user
    const onRegister = async () => {
        const values = {
            email: "newuser@example.com",
            password: "StrongPass123"
        };
        
        const result = await handleRegister(values);
        if (result.success) {
            console.log("Registration successful!");
            // Handle navigation at component level
            router.replace("/welcome");
        } else {
            console.log("Registration failed:", result.error);
        }
    };

    // Example 5: Reset password
    const onResetPassword = async () => {
        const values = {
            email: "user@example.com"
        };
        
        const result = await handleReset(values);
        if (result.success) {
            console.log("Reset email sent!");
        } else {
            console.log("Reset failed:", result.error);
        }
    };

    return (
        <div>
            <p>Loading: {loading ? "Yes" : "No"}</p>
            <button onClick={onManualLogin}>Manual Login</button>
            <button onClick={onCustomLogin}>Custom Login</button>
            <button onClick={onRegister}>Register</button>
            <button onClick={onResetPassword}>Reset Password</button>
        </div>
    );
}

// Return value structure:
// {
//   success: boolean,
//   data: any | null,
//   error: string | null
// }
