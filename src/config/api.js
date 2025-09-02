// Configuration API - TEST TEMPORAIRE
const API_URL = "https://site--backend-vinted--jmytcnlt7m5p.code.run";

// Debug TOUJOURS activé pour diagnostiquer
console.log("🔍 TEST - API URL hardcodée:", API_URL);
console.log("🔍 DIAGNOSTIC API - Variables d'environnement:");
console.log("- VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("- API_URL:", import.meta.env.API_URL);
console.log("- MODE:", import.meta.env.MODE);
console.log("- PROD:", import.meta.env.PROD);

export { API_URL };
