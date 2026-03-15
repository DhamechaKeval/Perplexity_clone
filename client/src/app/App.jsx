import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Router } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);
  return <RouterProvider router={Router} />;
};

export default App;
