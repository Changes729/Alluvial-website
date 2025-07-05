import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import NotFoundPage from "./pages/not-found";
import Homepage from "./pages/homepage";
import ImageContainer from "./pages/ImageReader";
import Doc from "./pages/MarkdownReader";
import './css/index';

function App() {
  onload = () => {
    useNavigate()(document.location.pathname);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Homepage />} />
        <Route path="/images/*" element={<ImageContainer />} />
        <Route path="/doc/*" element={<Doc />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Main Start */
window.onload = () => {
  let node = document.createElement("div");
  document.body.appendChild(node);
  ReactDOM.createRoot(node).render(<App />);
};
