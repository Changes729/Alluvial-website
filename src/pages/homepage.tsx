import React from "react";

const homepage = () => {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      background: "#001638",
    }}>
      <div style={{
        display: "flex",
        height: "3%",
        width: "100vw",
        alignItems: "center",
      }}>
        <a style={{
          color: "#f9ffa1",
          font: "italic 100% \"Fira Sans\", serif",
          padding: "1vw",
        }} href="/">Alluvial</a>
        <a style={{
          color: "#f9ffa1",
          font: "italic 100% \"Fira Sans\", serif",
          padding: "1vw",
        }} href="/blobs/">blobs</a>
        <a style={{
          color: "#f9ffa1",
          font: "italic 100% \"Fira Sans\", serif",
          padding: "1vw",
        }} href="/markdowns/">markdown</a>
        <a style={{
          color: "#f9ffa1",
          font: "italic 100% \"Fira Sans\", serif",
          padding: "1vw",
        }} href="/images/">images</a>
        <a style={{
          color: "#f9ffa1",
          font: "italic 100% \"Fira Sans\", serif",
          padding: "1vw",
        }} href="/doc/">doc</a>
        <a style={{
          color: "#f9ffa1",
          font: "italic 100% \"Fira Sans\", serif",
          padding: "1vw",
        }} href="/uploader/">uploader</a>
      </div>
      <div className="homepage" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "97%",
        width: "100vw",
        background: "#FFFFFF",
      }}>
        <p style={{
          color: "#002e6b",
          font: "italic 16vh \"Fira Sans\", serif",
        }}>Alluvial</p>
      </div>
    </div>
  );
}

export default homepage
