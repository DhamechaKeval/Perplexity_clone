import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Router } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";
import CustomToaster from "./components/CustomeToster";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <div>
      <CustomToaster/>
      <RouterProvider router={Router} />
    </div>
  );
};

export default App;
