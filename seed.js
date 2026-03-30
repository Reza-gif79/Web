const Alumni = require('./models/Alumni');
const { sequelize } = require('./config/database');

const alumniData = [
  { name: 'Hadi Suhermanto', phone: '085815907044', address: 'Lumajang' },
  { name: 'Mochammad Rifal', phone: '085791910977', address: 'Lumajang' },
  { name: 'Halimatus Sadziyah', phone: '085784932574', address: 'Lumajang' },
  { name: 'Siti Bariza Tulhasana', phone: '085649305378', address: 'Lumajang' },
  { name: 'Nur Aini', phone: '083832021171', address: 'Lumajang' },
  { name: 'Nuri Amelia', phone: '085735521974', address: 'Lumajang' },
  { name: 'Ussa Fitri', phone: '085792162113', address: 'Lumajang' },
  { name: 'Karinatun Nuzul', phone: '085850893052', address: 'Lumajang' },
  { name: 'Sholehatun H', phone: '087712996433', address: 'Lumajang' },
  { name: 'Iz', phone: '081233383320', address: 'Lumajang' },
  { name: 'Hurum Maqsuroh', phone: '083851350709', address: 'Lumajang' },
  { name: 'Ulin Naamah', phone: '085804034255', address: 'Lumajang' },
  { name: 'Zuwita Indri', phone: '082335909540', address: 'Lumajang' },
  { name: 'Mujib alhady', phone: '082228385038', address: 'Lumajang' },
  { name: 'Ajeng Wulandari', phone: '085607409226', address: 'Lumajang' },
  { name: 'Izzah Afkarinah', phone: '085812782667', address: 'Lumajang' },
  { name: 'Lailatul Livia', phone: '085704790103', address: 'Lumajang' },
  { name: 'Ahmad Hamdani Athoila', phone: '085792705624', address: 'Lumajang' },
  { name: 'Andria Kurnia', phone: '085745414074', address: 'Lumajang' },
  { name: 'Muhammad Wahyu Kurniawan', phone: '087788816794', address: 'Lumajang' },
  { name: 'Dama Saputra', phone: '087818590088', address: 'Lumajang' },
  { name: 'Riyan Saputra', phone: '085784880010', address: 'Lumajang' },
  { name: 'Avita Dwi Lestari', phone: '085185289056', address: 'Lumajang' },
  { name: 'Lelyta Dewi Putri Ramadhani', phone: '082143539994', address: 'Lumajang' },
  { name: 'Imam Efendi', phone: '082331118047', address: 'Lumajang' },
  { name: 'Nabila Rachma Diana', phone: '085785855461', address: 'Lumajang' },
  { name: 'Deva MF', phone: '082230042875', address: 'Lumajang' },
  { name: 'CEO PT Jaya Baya', phone: '085852872849', address: 'Lumajang' },
  { name: 'Siti Aisyah', phone: '085604378272', address: 'Lumajang' },
  { name: 'Muhammad Bahron', phone: '083140990867', address: 'Lumajang' },
  { name: 'Alim', phone: '085138507100', address: 'Lumajang' }
];

const seedDatabase = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Clear existing alumni
    await Alumni.destroy({ where: {} });
    console.log('Cleared existing alumni');

    // Insert alumni data
    const alumni = await Alumni.bulkCreate(alumniData);
    console.log('Inserted ' + alumni.length + ' alumni records');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
