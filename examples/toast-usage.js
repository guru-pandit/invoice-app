// Example usage of useToastMessages hook

import { useToastMessages } from "@/hooks/popup";

export function ExampleComponent() {
    const { showSuccess, showError, showWarning, showInfo, showMessage } = useToastMessages();

    const handleSuccess = () => {
        showSuccess("Operation completed successfully!");
    };

    const handleError = () => {
        showError("Something went wrong", "Please try again later");
    };

    const handleWarning = () => {
        showWarning("Warning", "This action cannot be undone");
    };

    const handleInfo = () => {
        showInfo("Information", "Your data has been saved");
    };

    const handleCustomMessage = () => {
        // Using the generic showMessage function
        showMessage("success", "Custom Success", "This is a custom success message");
    };

    return (
        <div>
            <button onClick={handleSuccess}>Show Success</button>
            <button onClick={handleError}>Show Error</button>
            <button onClick={handleWarning}>Show Warning</button>
            <button onClick={handleInfo}>Show Info</button>
            <button onClick={handleCustomMessage}>Show Custom Message</button>
        </div>
    );
}
