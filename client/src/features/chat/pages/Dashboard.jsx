import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "./../hooks/useChat";

const Dashboard = () => {
  const  initSocketConnection = useChat();
  const user = useSelector((state) => state.auth.user);

  console.log(user);

  useEffect(() => {
    initSocketConnection();
  }, []);
  return <div>Dashboard</div>;
};

export default Dashboard;
