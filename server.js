const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced');
    // Try to add logo column to PaymentMethods table if it doesn't exist
    return sequelize.query('ALTER TABLE PaymentMethods ADD COLUMN logo VARCHAR(255);')
      .then(() => {
        console.log('Logo column added to PaymentMethods table (if it didn\'t exist)');
      })
      .catch(err => {
        // Ignore error if column already exists
        if (!err.message.includes('duplicate column name') && !err.message.includes('already has a column named logo')) {
          console.error('Error adding logo column:', err);
        } else {
          console.log('Logo column already exists in PaymentMethods table');
        }
      });
  })
  .catch(err => console.log('Database connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Sedulur Alumni API is running' });
});

// API Routes
const alumniRoutes = require('./routes/alumni');
const paymentMethodRoutes = require('./routes/paymentMethods');
const paymentRoutes = require('./routes/payments');

app.use('/api/alumni', alumniRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/payments', paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});