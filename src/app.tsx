import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import DefaultHomepage from "./pages/view/defaultHomepage";
import "./css/index";
import { DefaultAlluvialLoader } from "./pages/widget/AlluvialContent/defaultContent";

function App() {
  onload = () => {
    useNavigate()(document.location.pathname);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={<DefaultHomepage View={DefaultAlluvialLoader} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

/** Main Start */
window.onload = () => {
  ReactDOM.createRoot(document.body).render(<App />);
};
