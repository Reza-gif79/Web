const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');

// Get all payment methods
router.get('/', async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.findAll();
    res.json(paymentMethods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get payment method by ID
router.get('/:id', getPaymentMethod, (req, res) => {
  res.json(res.paymentMethod);
});

// Create payment method
router.post('/', async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.create({
      name: req.body.name,
      number: req.body.number,
      holder: req.body.holder,
      description: req.body.description,
      type: req.body.type,
      enabled: req.body.enabled,
      logo: req.body.logo
    });
    res.status(201).json(paymentMethod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update payment method
router.patch('/:id', getPaymentMethod, async (req, res) => {
  try {
    await res.paymentMethod.update({
      name: req.body.name,
      number: req.body.number,
      holder: req.body.holder,
      description: req.body.description,
      type: req.body.type,
      enabled: req.body.enabled
    });
    res.json(res.paymentMethod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete payment method
router.delete('/:id', getPaymentMethod, async (req, res) => {
  try {
    await res.paymentMethod.destroy();
    res.json({ message: 'Deleted Payment Method' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getPaymentMethod(req, res, next) {
  let paymentMethod;
  try {
    paymentMethod = await PaymentMethod.findByPk(req.params.id);
    if (paymentMethod == null) {
      return res.status(404).json({ message: 'Cannot find payment method' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.paymentMethod = paymentMethod;
  next();
}

module.exports = router;