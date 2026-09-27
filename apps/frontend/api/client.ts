import axios from "axios";

// Tumcha backend server URL (Next.js env variables nusar kiva default localhost:5000)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});