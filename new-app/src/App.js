import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import ReportsPage from "./components/ReportsPage";
import AuthPage from "./components/AuthPage";
import Menu from "./components/Menu";


function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Navigate to="/menu" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/auth" element={<AuthPage/>}></Route>
              <Route path="/menu" element={<Menu/>}></Route>
          </Routes>
      </Router>
  );
}

export default App;
