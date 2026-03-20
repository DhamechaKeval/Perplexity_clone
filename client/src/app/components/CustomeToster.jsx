import { Toaster } from "react-hot-toast";

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#0d2226",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          padding: "12px 16px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#31b8c6",
            secondary: "#06262b",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};

export default CustomToaster;