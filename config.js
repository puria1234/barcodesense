// Configuration
const CONFIG = {
  // API key is now stored securely on the server
  // No need to expose it in the frontend
  OPENROUTER_API_URL: "/api/ai", // Proxy endpoint (Vercel serverless function)
  MODEL: "google/gemini-2.5-flash",
  OPEN_FOOD_FACTS_API: "https://world.openfoodfacts.org/api/v0/product",
};

// User preferences (stored in localStorage)
const getUserPreferences = () => {
  const prefs = localStorage.getItem("userPreferences");
  return prefs
    ? JSON.parse(prefs)
    : {
        dietaryRestrictions: [],
        allergies: [],
        sustainabilityPreference: true,
        priceRange: "medium",
      };
};

const saveUserPreferences = (prefs) => {
  localStorage.setItem("userPreferences", JSON.stringify(prefs));
};
