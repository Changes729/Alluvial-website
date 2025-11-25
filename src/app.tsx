import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import Homepage from "./pages/homepage";
import "./css/index";

function App() {
  onload = () => {
    useNavigate()(document.location.pathname);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Main Start */
window.onload = () => {
  ReactDOM.createRoot(document.body).render(<App />);
};
