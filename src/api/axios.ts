import axios from "axios";

// Use the server IP for internal network, public IP for external access
const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://197.243.60.141:8080/api" // Public IP for production
    : "http://10.10.35.50:8080/api"; // Server IP for development/internal use

const instance = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request and response interceptors (as in the previous example)

export default instance;
