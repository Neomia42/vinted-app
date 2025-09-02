// Configuration API
const API_URL =
  import.meta.env.VITE_API_URL || // Local (.env)
  import.meta.env.API_URL || // Netlify
  "http://localhost:3000"; // back local

export { API_URL };
