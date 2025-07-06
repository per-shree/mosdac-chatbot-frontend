import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Dashboard from "./Dashboard";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

function Main() {
  const path = window.location.pathname;
  if (path === "/dashboard") return <Dashboard />;
  return <App />;
}

createRoot(rootElement).render(<Main />);
