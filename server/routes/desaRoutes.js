const express = require("express");
const { getAllDesa, getDesaById, createDesa, updateDesa, deleteDesa } = require("../service/desaService");

const router = express.Router();

// Get all desa
router.get("/", async (req, res) => {
  try {
    const desa = await getAllDesa();
    res.json(desa);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data desa" });
  }
});

// Get desa by ID
router.get("/:id", async (req, res) => {
  try {
    const desa = await getDesaById(req.params.id);
    if (desa) {
      res.json(desa);
    } else {
      res.status(404).json({ error: "Desa tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data desa" });
  }
});

// Create a new desa
router.post("/", async (req, res) => {
  try {
    const newDesa = await createDesa(req.body); // Data sudah termasuk kategori dari frontend
    res.status(201).json(newDesa);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: "Gagal menyimpan data desa." });
  }
});

// Update desa by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedDesa = await updateDesa(req.params.id, req.body);
    res.json(updatedDesa);
  } catch (error) {
    res.status(404).json({ error: "Desa tidak ditemukan" });
  }
});

// Delete desa by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedDesa = await deleteDesa(req.params.id);
    res.json(deletedDesa);
  } catch (error) {
    res.status(404).json({ error: "Desa tidak ditemukan" });
  }
});

module.exports = router;
