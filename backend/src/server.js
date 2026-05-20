const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const providerRoutes = require("./routes/providerRoutes");
const leadRoutes = require("./routes/leadRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const testRoutes = require("./routes/testRoutes");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:3000").replace(
      /\/$/,
      ""
    ),
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

const autoSeed = require("./utils/autoSeed");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await autoSeed();
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/leads", leadRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/test", testRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});