const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');

// Get all alumni
router.get('/', async (req, res) => {
  try {
    const alumni = await Alumni.findAll({ order: [['createdAt', 'DESC']] });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get alumni by ID
router.get('/:id', getAlumni, (req, res) => {
  res.json(res.alumni);
});

// Create alumni
router.post('/', async (req, res) => {
  try {
    const alumni = await Alumni.create({
      name: req.body.name,
      phone: req.body.phone,
      graduationYear: req.body.graduationYear,
      major: req.body.major,
      address: req.body.address,
      photo: req.body.photo
    });
    res.status(201).json(alumni);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update alumni
router.patch('/:id', getAlumni, async (req, res) => {
  try {
    await res.alumni.update({
      name: req.body.name,
      phone: req.body.phone,
      graduationYear: req.body.graduationYear,
      major: req.body.major,
      address: req.body.address,
      photo: req.body.photo
    });
    res.json(res.alumni);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete alumni
router.delete('/:id', getAlumni, async (req, res) => {
  try {
    await res.alumni.destroy();
    res.json({ message: 'Deleted Alumni' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getAlumni(req, res, next) {
  let alumni;
  try {
    alumni = await Alumni.findByPk(req.params.id);
    if (alumni == null) {
      return res.status(404).json({ message: 'Cannot find alumni' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.alumni = alumni;
  next();
}

module.exports = router;