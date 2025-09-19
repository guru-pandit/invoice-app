import { useToast } from "@chakra-ui/react";

export function useToastMessages() {
    const toast = useToast();

    const showSuccess = (title, description = null) => {
        toast({
            status: "success",
            title,
            description,
            duration: 3000,
            isClosable: true,
        });
    };

    const showError = (title, description = null) => {
        toast({
            status: "error",
            title,
            description,
            duration: 5000,
            isClosable: true,
        });
    };

    const showWarning = (title, description = null) => {
        toast({
            status: "warning",
            title,
            description,
            duration: 4000,
            isClosable: true,
        });
    };

    const showInfo = (title, description = null) => {
        toast({
            status: "info",
            title,
            description,
            duration: 3000,
            isClosable: true,
        });
    };

    // Generic function that accepts status, title, and description
    const showMessage = (status, title, description = null) => {
        const durations = {
            success: 3000,
            error: 5000,
            warning: 4000,
            info: 3000,
        };

        toast({
            status,
            title,
            description,
            duration: durations[status] || 3000,
            isClosable: true,
        });
    };

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showMessage,
    };
}