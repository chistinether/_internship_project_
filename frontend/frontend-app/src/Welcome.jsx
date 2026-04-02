import React from "react";

function Welcome() {
  const styles = {
    backgroundColor: "deep navy",
    color: "white",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  };

  return (
    <div style={styles}>
      <h1>Welcome</h1>
      <p>Manage your internship easily</p>
    </div>
  );
}

export default Welcome;