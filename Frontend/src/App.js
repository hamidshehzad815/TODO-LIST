import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import Account from "./components/Account/Account";
import Dashboard from "./components/Dashboard/Dashboard";
import AllUsers from "./components/AllUsers/AllUsers";
import ChangeUsername from "./components/ChangeUsername/ChangeUsername";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import CreateTask from "./components/CreateTask/CreateTask";
import MyTasks from "./components/MyTasks/MyTasks";
import AllTasks from "./components/AllTasks/AllTasks";
import TaskAnalytics from "./components/myTaskAnalytics/Analytics";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/account" element={<Account />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/allusers" element={<AllUsers />} />
      <Route path="/change-username" element={<ChangeUsername />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/createTask" element={<CreateTask />} />
      <Route path="/mytasks" element={<MyTasks />} />
      <Route path="/alltasks" element={<AllTasks />} />
      <Route path="/Analytics" element={<TaskAnalytics />} />
    </Routes>
  );
}

export default App;
