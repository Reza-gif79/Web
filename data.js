/**
 * Seduulur Alumni - Data Management
 * LocalStorage-based database for alumni management
 */

// Database Keys
const DB_KEYS = {
    ALUMNI: 'sedulur_alumni',
    PAYMENTS: 'sedulur_payments',
    AGENDAS: 'sedulur_agendas',
    GALLERY: 'sedulur_gallery',
    ADMINS: 'sedulur_admins'
};

// Default Admins (can support 5+ users)
const DEFAULT_ADMINS = [
    { id: 'admin1', username: 'SEDULURALUMNI', password: 'alumni123', name: 'Admin Utama', role: 'super_admin' },
    { id: 'admin2', username: 'admin02', password: 'admin123', name: 'Admin Keuangan', role: 'finance' },
    { id: 'admin3', username: 'admin03', password: 'admin123', name: 'Admin Event', role: 'event' },
    { id: 'admin4', username: 'admin04', password: 'admin123', name: 'Admin Galeri', role: 'gallery' },
    { id: 'admin5', username: 'admin05', password: 'admin123', name: 'Admin Umum', role: 'general' }
];

// Default Alumni Data
const DEFAULT_ALUMNI = [
    { id: 'a1', name: 'Mujib alhadi', email: 'ahmad@example.com', phone: '081234567890', graduationYear: 2018, major: 'Teknik Informatika', address: 'Jakarta Selatan', joinDate: '2024-01-15' },
    { id: 'a2', name: 'Riyan Saputra', email: 'siti@example.com', phone: '081234567891', graduationYear: 2019, major: 'Sistem Informasi', address: 'Jakarta Barat', joinDate: '2024-01-16' },
    { id: 'a3', name: 'Muhammad Reza Nandaka', email: 'budi@example.com', phone: '081358964029', graduationYear: 2017, major: 'Teknik Komputer', address: 'Jakarta Timur', joinDate: '2024-01-17' },
    { id: 'a4', name: 'Ahmad dani athoilah', email: 'dewi@example.com', phone: '081234567893', graduationYear: 2020, major: 'Manajemen Informatika', address: 'Jakarta Utara', joinDate: '2024-01-18' },
    { id: 'a5', name: 'Khofidun alim', email: 'rudi@example.com', phone: '081234567894', graduationYear: 2016, major: 'Teknik Informatika', address: 'Depok', joinDate: '2024-01-19' },
    { id: 'a6', name: 'Alhadi', email: 'lisa@example.com', phone: '081234567895', graduationYear: 2021, major: 'Sistem Informasi', address: 'Bekasi', joinDate: '2024-01-20' },
    { id: 'a7', name: 'Jabi', email: 'rizky@example.com', phone: '081234567896', graduationYear: 2018, major: 'Teknik Komputer', address: 'Tangerang', joinDate: '2024-01-21' },
    { id: 'a8', name: 'Defa', email: 'putri@example.com', phone: '081234567897', graduationYear: 2019, major: 'Manajemen Informatika', address: 'Jakarta Pusat', joinDate: '2024-01-22' }
];

// Default Payments Data
const DEFAULT_PAYMENTS = [
    { id: 'p1', alumniId: 'a1', name: 'Mujib alhadi', amount: 5000, month: 'Januari', year: 2026, paymentDate: '2026-01-05', paymentMethod: 'transfer_bca', status: 'paid', note: '' },
    { id: 'p2', alumniId: 'a2', name: 'Riyan Saputra', amount: 5000, month: 'Januari', year: 2026, paymentDate: '2026-01-06', paymentMethod: 'ewallet_dana', status: 'paid', note: '' },
    { id: 'p3', alumniId: 'a3', name: 'Muhammad Reza Nandaka', amount: 5000, month: 'Januari', year: 2026, paymentDate: '2026-01-07', paymentMethod: 'transfer_bca', status: 'paid', note: '' },
    { id: 'p4', alumniId: 'a4', name: 'Ahmad dani athoilah', amount: 5000, month: 'Januari', year: 2026, paymentDate: '2026-01-08', paymentMethod: 'cash', status: 'paid', note: '' },
    { id: 'p5', alumniId: 'a1', name: 'Mujib alhadi', amount: 5000, month: 'Februari', year: 2026, paymentDate: '2026-02-05', paymentMethod: 'transfer_bca', status: 'paid', note: '' },
    { id: 'p6', alumniId: 'a2', name: 'Riyan Saputra', amount: 5000, month: 'Februari', year: 2026, paymentDate: '2026-02-10', paymentMethod: 'ewallet_dana', status: 'paid', note: '' },
    { id: 'p7', alumniId: 'a3', name: 'Muhammad Reza Nandaka', amount: 5000, month: 'Februari', year: 2026, paymentDate: '2026-02-12', paymentMethod: 'transfer_bca', status: 'paid', note: '' }
];

// Default Agendas Data
const DEFAULT_AGENDAS = [
    { id: 'ag1', title: 'Reuni Akbar 2026', description: 'Reuni tahunan alumni seluruh angkatan dengan tema Membangun Negeri', date: '2026-06-15', time: '09:00', location: 'Hotel Grand Indonesia', type: 'tahunan', active: true, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { id: 'ag2', title: 'Workshop Kewirausahaan', description: 'Pelatihan kewirausahaan untuk alumni yang ingin memulai usaha', date: '2026-04-20', time: '13:00', location: 'Gedung Alumni Center', type: 'bulanan', active: true, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800' },
    { id: 'ag3', title: 'Bakti Sosial Donor Darah', description: 'Program donor darah bersama PMI dan alumni', date: '2026-03-25', time: '08:00', location: 'Balai Kota Jakarta', type: 'bulanan', active: true, image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800' },
    { id: 'ag4', title: 'Fun Football Alumni', description: 'Turnamen futsal antar alumni', date: '2026-05-10', time: '07:00', location: 'GOR Senayan', type: 'bulanan', active: true, image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800' }
];

// Default Gallery Data
const DEFAULT_GALLERY = [
    { id: 'g1', title: 'Reuni 2024', description: 'Momen reuni tahunan alumni', category: 'reunion', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', date: '2024-12-15' },
    { id: 'g2', title: 'Workshop IT', description: 'Workshop teknologi informasi', category: 'workshop', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', date: '2024-11-20' },
    { id: 'g3', title: 'Bakti Sosial', description: 'Program bakti sosial ke panti asuhan', category: 'social', image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800', date: '2024-10-15' },
    { id: 'g4', title: 'Turnamen Futsal', description: 'Turnamen futsal alumni', category: 'sport', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', date: '2024-09-10' },
    { id: 'g5', title: 'Seminar Karir', description: 'Seminar pengembangan karir', category: 'workshop', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', date: '2024-08-25' },
    { id: 'g6', title: 'Gathering', description: 'Acara gathering akhir tahun', category: 'reunion', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', date: '2024-12-28' },
    { id: 'g7', title: 'Pelatihan Public Speaking', description: 'Workshop peningkatan komunikasi', category: 'workshop', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', date: '2024-07-15' },
    { id: 'g8', title: 'Marathon Charity', description: 'Lari marathon untuk charity', category: 'social', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', date: '2024-06-20' }
];

// Initialize Database
function initDatabase() {
    // Initialize Admins
    if (!localStorage.getItem(DB_KEYS.ADMINS)) {
        localStorage.setItem(DB_KEYS.ADMINS, JSON.stringify(DEFAULT_ADMINS));
    }
    
    // Initialize Alumni
    if (!localStorage.getItem(DB_KEYS.ALUMNI)) {
        localStorage.setItem(DB_KEYS.ALUMNI, JSON.stringify(DEFAULT_ALUMNI));
    }
    
    // Initialize Payments
    if (!localStorage.getItem(DB_KEYS.PAYMENTS)) {
        localStorage.setItem(DB_KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
    }
    
    // Initialize Agendas
    if (!localStorage.getItem(DB_KEYS.AGENDAS)) {
        localStorage.setItem(DB_KEYS.AGENDAS, JSON.stringify(DEFAULT_AGENDAS));
    }
    
    // Initialize Gallery
    if (!localStorage.getItem(DB_KEYS.GALLERY)) {
        localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
    }
}

// Reset Database (for testing)
function resetDatabase() {
    localStorage.removeItem(DB_KEYS.ADMINS);
    localStorage.removeItem(DB_KEYS.ALUMNI);
    localStorage.removeItem(DB_KEYS.PAYMENTS);
    localStorage.removeItem(DB_KEYS.AGENDAS);
    localStorage.removeItem(DB_KEYS.GALLERY);
    initDatabase();
}

// Generic CRUD Functions with Error Handling
function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading data:', e);
        return [];
    }
}

function setData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        return false;
    }
}

function addData(key, item) {
    const data = getData(key);
    // Generate unique ID based on key type
    const prefix = key.substring(8).charAt(0).toUpperCase();
    item.id = prefix + Date.now();
    data.push(item);
    if (setData(key, data)) {
        return item;
    }
    return null;
}

function updateData(key, id, updates) {
    const data = getData(key);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        return setData(key, data);
    }
    return false;
}

function deleteData(key, id) {
    const data = getData(key);
    const filtered = data.filter(item => item.id !== id);
    return setData(key, filtered);
}

// Admin Functions
function getAdmins() {
    return getData(DB_KEYS.ADMINS);
}

function verifyAdmin(username, password) {
    const admins = getAdmins();
    return admins.find(admin => admin.username.toUpperCase() === username.toUpperCase() && admin.password === password);
}

// Alumni Functions
function getAlumni() {
    return getData(DB_KEYS.ALUMNI);
}

function getAlumniById(id) {
    const alumni = getAlumni();
    return alumni.find(a => a.id === id);
}

function addAlumni(alumni) {
    alumni.joinDate = new Date().toISOString().split('T')[0];
    return addData(DB_KEYS.ALUMNI, alumni);
}

function updateAlumni(id, updates) {
    return updateData(DB_KEYS.ALUMNI, id, updates);
}

function deleteAlumni(id) {
    return deleteData(DB_KEYS.ALUMNI, id);
}

// Payment Functions
function getPayments() {
    return getData(DB_KEYS.PAYMENTS);
}

function getPaymentsByAlumni(alumniId) {
    const payments = getPayments();
    return payments.filter(p => p.alumniId === alumniId);
}

function getPaymentsByMonthYear(month, year) {
    const payments = getPayments();
    return payments.filter(p => p.month === month && p.year === parseInt(year));
}

function addPayment(payment) {
    payment.status = 'paid';
    payment.paymentDate = new Date().toISOString().split('T')[0];
    return addData(DB_KEYS.PAYMENTS, payment);
}

function deletePayment(id) {
    return deleteData(DB_KEYS.PAYMENTS, id);
}

function getTotalIncome() {
    const payments = getPayments();
    return payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
}

function getMonthlyIncome(month, year) {
    const payments = getPayments();
    return payments
        .filter(p => p.month === month && p.year === parseInt(year) && p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
}

// Agenda Functions
function getAgendas() {
    return getData(DB_KEYS.AGENDAS);
}

function getActiveAgendas() {
    const agendas = getAgendas();
    return agendas.filter(a => a.active).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getUpcomingAgendas() {
    const agendas = getActiveAgendas();
    const today = new Date().toISOString().split('T')[0];
    return agendas.filter(a => a.date >= today).slice(0, 3);
}

function addAgenda(agenda) {
    return addData(DB_KEYS.AGENDAS, agenda);
}

function updateAgenda(id, updates) {
    return updateData(DB_KEYS.AGENDAS, id, updates);
}

function deleteAgenda(id) {
    return deleteData(DB_KEYS.AGENDAS, id);
}

// Gallery Functions
function getGallery() {
    return getData(DB_KEYS.GALLERY);
}

function getGalleryByCategory(category) {
    const gallery = getGallery();
    if (category === 'all') return gallery;
    return gallery.filter(g => g.category === category);
}

function addGallery(item) {
    item.date = new Date().toISOString().split('T')[0];
    return addData(DB_KEYS.GALLERY, item);
}

function deleteGallery(id) {
    return deleteData(DB_KEYS.GALLERY, id);
}

// Unpaid Alumni Functions
function getUnpaidAlumni(month, year) {
    const alumni = getAlumni();
    const payments = getPayments();
    const paidIds = payments
        .filter(p => p.month === month && p.year === parseInt(year) && p.status === 'paid')
        .map(p => p.alumniId);
    
    return alumni.filter(a => !paidIds.includes(a.id));
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Initialize on load
initDatabase();
