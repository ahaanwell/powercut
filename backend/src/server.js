require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { warmCityCache } = require("./controllers/statsController");
const { warmDistrictCache } = require("./controllers/districtController");
const { refreshGridCache } = require("./controllers/pincodeController");

const PORT = process.env.PORT || 5000;
const GRID_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      // Best-effort background warm-up of the area-scan caches, so the
      // slow (multi-second) scan path is rarely hit by a live request.
      // Failures here are logged, never fatal.
      warmDistrictCache()
        .catch((err) => console.error("District cache warm-up failed:", err.message))
        .then(() => warmCityCache())
        .catch((err) => console.error("City cache warm-up failed:", err.message));

      // Keep the live grid map's geocoded points warm proactively, so no
      // live request ever has to wait on the shared Nominatim queue for it.
      refreshGridCache().catch((err) => console.error("Grid cache warm-up failed:", err.message));
      setInterval(() => {
        refreshGridCache().catch((err) => console.error("Grid cache refresh failed:", err.message));
      }, GRID_REFRESH_INTERVAL_MS);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
