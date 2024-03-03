import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_URL || "http://localhost:8000";

// export const BASEURL = "https://backendapi.qello.io";

export const socket = io(URL, {
  transports: ["websocket"],
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
    // Add any other necessary headers here
  },
});
