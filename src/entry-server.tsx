import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

/** Usado só no build: gera o HTML inicial da página (pré-renderização estática). */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
