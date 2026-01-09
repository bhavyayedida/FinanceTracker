import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SpendingCharts from "./pages/SpendingCharts";
import Navigation from "./components/Navigation";
import { ROUTES } from "./utils/constants";

export default function App() {
  const location = useLocation();
  const showNavigation = location.pathname !== ROUTES.LOGIN;

  return (
    <>
      {showNavigation && <Navigation />}
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.SPENDING_CHARTS} element={<SpendingCharts />} />
      </Routes>
    </>
  );
}
