import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import "./css/index";
import AlluvialHomepage from "./pages/view/alluvialHomePage";
import AlluvialTidal from "./pages/view/AlluvialTidal";

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
  ReactDOM.createRoot(document.body).render(<App />);
};
