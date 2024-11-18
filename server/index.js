const express = require("express");
const cors = require("cors"); // Import cors
const userRoutes = require("./routes/userRoutes");
const desaRoutes = require("./routes/desaRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Tambahkan middleware CORS

// Routes
app.use("/users", userRoutes);
app.use("/api/desa", desaRoutes);

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
