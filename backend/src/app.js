const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const reportRoutes = require("./routes/reportRoutes");
const statsRoutes = require("./routes/statsRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const pincodeRoutes = require("./routes/pincodeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const districtRoutes = require("./routes/districtRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "*",
  })
);
app.use(express.json({ limit: "20kb" }));
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/reports", reportRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/pincode", pincodeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/district", districtRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
