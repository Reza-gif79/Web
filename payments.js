const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.findAll({ order: [['createdAt', 'DESC']] });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get payment by ID
router.get('/:id', getPayment, (req, res) => {
  res.json(res.payment);
});

// Create payment
router.post('/', async (req, res) => {
  try {
    const payment = await Payment.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      amount: req.body.amount,
      month: req.body.month,
      year: req.body.year,
      date: req.body.date,
      method: req.body.method,
      status: req.body.status || 'pending',
      note: req.body.note
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update payment
router.patch('/:id', getPayment, async (req, res) => {
  try {
    await res.payment.update({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      amount: req.body.amount,
      month: req.body.month,
      year: req.body.year,
      date: req.body.date,
      method: req.body.method,
      status: req.body.status,
      note: req.body.note
    });
    res.json(res.payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete payment
router.delete('/:id', getPayment, async (req, res) => {
  try {
    await res.payment.destroy();
    res.json({ message: 'Deleted Payment' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getPayment(req, res, next) {
  let payment;
  try {
    payment = await Payment.findByPk(req.params.id);
    if (payment == null) {
      return res.status(404).json({ message: 'Cannot find payment' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.payment = payment;
  next();
}

module.exports = router;