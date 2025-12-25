import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./utils/swRegistration";
import { notificationManager } from "./utils/notificationManager";

// Register service worker for PWA functionality
// Temporarily disabled to check if it's causing navigation issues
// if (import.meta.env.PROD) {
//   registerServiceWorker();
// }

// Start notification polling
notificationManager.startPolling();

createRoot(document.getElementById("root")!).render(<App />);
