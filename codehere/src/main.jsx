import { StrictMode } from "react";
import {createRoot} from "react-dom/client";
import Start from "./Start.jsx"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Start />
  </StrictMode>
)