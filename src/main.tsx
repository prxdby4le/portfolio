import { createRoot } from "react-dom/client";

// Self-hosted variable fonts. Shipping these from node_modules instead of a
// Google Fonts <link> removes a render-blocking third-party round trip.
import "@fontsource-variable/outfit";
import "@fontsource-variable/geist-mono";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
