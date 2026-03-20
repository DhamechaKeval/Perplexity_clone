import toast from "react-hot-toast";

export const showSuccess = (msg) => {
  toast.success(msg, {
    style: {
      border: "1px solid #31b8c6",
    },
  });
};

export const showError = (msg) => {
  toast.error(msg, {
    style: {
      border: "1px solid #ef4444",
    },
  });
};
