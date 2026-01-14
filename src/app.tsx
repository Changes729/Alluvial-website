import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import "./css/index";
import AlluvialHomepage from "./pages/view/alluvialHomePage";
import AlluvialTidal from "./pages/view/AlluvialTidal";
import AlluvialApp from "./pages/view/alluvialApp";

const IndexPage: React.FC = ({}) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/TidalTree/");
  }, []);

  return <></>;
};

function App() {
  onload = () => {
    useNavigate()(document.location.pathname);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<IndexPage />} />
        <Route path="/Tidal" element={<AlluvialTidal />} />
        <Route path="/TidalTree/*" element={<AlluvialHomepage />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Main Start */
window.onload = () => {
  if (new URL(document.URL).protocol == "app:") {
    ReactDOM.createRoot(document.body).render(<AlluvialApp />);
  } else {
    ReactDOM.createRoot(document.body).render(<App />);
  }
};
