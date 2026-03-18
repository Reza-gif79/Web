/**
 * Seduulur Alumni - Admin Dashboard
 */

// Admin variables
let currentSection = 'dashboard';
let selectedUnpaidAlumni = [];

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initAdminSidebar();
    initAdminClock();
    loadDashboard();
    loadAlumniTable();
    loadPaymentsTable();
    loadAgendaTable();
    loadGalleryAdmin();
    loadUpcomingAgenda();
    initAIReminder(); // Initialize AI Auto Reminder
    
    // Check auth
    if (typeof isLoggedIn === 'function') {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
    
    // Setup form event listeners
    setupFormListeners();
});

// Setup Form Event Listeners
function setupFormListeners() {
    // Alumni Form
    const alumniForm = document.getElementById('alumniForm');
    if (alumniForm) {
        alumniForm.addEventListener('submit', handleAlumniSubmit);
    }
    
    // Agenda Form
    const agendaForm = document.getElementById('agendaForm');
    if (agendaForm) {
        agendaForm.addEventListener('submit', handleAgendaSubmit);
    }
    
    // Gallery Form
    const galleryForm = document.getElementById('galleryForm');
    if (galleryForm) {
        galleryForm.addEventListener('submit', handleGallerySubmit);
    }
    
    // Payment Form (Admin Input)
    const paymentFormAdmin = document.getElementById('paymentFormAdmin');
    if (paymentFormAdmin) {
        paymentFormAdmin.addEventListener('submit', handlePaymentAdminSubmit);
    }
}

// Initialize Sidebar Navigation
function initAdminSidebar() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById('section-' + section).classList.add('active');
            
            currentSection = section;
            
            if (section === 'dashboard') loadDashboard();
            if (section === 'alumni') loadAlumniTable();
            if (section === 'payments') loadPaymentsTable();
            if (section === 'agenda') loadAgendaTable();
            if (section === 'gallery') loadGalleryAdmin();
        });
    });
    
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('adminSidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

// Initialize Clock
function initAdminClock() {
    const timeElement = document.getElementById('currentTime');
    if (!timeElement) return;
    
    function updateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        };
        timeElement.textContent = now.toLocaleDateString('id-ID', options);
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// Load Dashboard
function loadDashboard() {
    const alumni = getAlumni();
    const totalIncome = getTotalIncome();
    const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const monthlyIncome = getMonthlyIncome(currentMonth, currentYear);
    const unpaidAlumni = getUnpaidAlumni(currentMonth, currentYear);
    
    const totalEl = document.getElementById('totalAlumni');
    const incomeEl = document.getElementById('totalIncome');
    const monthlyEl = document.getElementById('monthlyIncome');
    const unpaidEl = document.getElementById('unpaidCount');
    
    if (totalEl) totalEl.textContent = alumni.length;
    if (incomeEl) incomeEl.textContent = formatCurrency(totalIncome);
    if (monthlyEl) monthlyEl.textContent = formatCurrency(monthlyIncome);
    if (unpaidEl) unpaidEl.textContent = unpaidAlumni.length;
    
    loadRecentPayments();
}

function loadRecentPayments() {
    const tableBody = document.getElementById('recentPaymentsTable');
    if (!tableBody) return;
    
    const payments = getPayments()
        .filter(p => p.status === 'paid')
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
        .slice(0, 5);
    
    if (payments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Belum ada pembayaran</td></tr>';
        return;
    }
    
    tableBody.innerHTML = payments.map(payment => `
        <tr>
            <td>${payment.name || 'Tidak diketahui'}</td>
            <td>${payment.month} ${payment.year}</td>
            <td>${formatCurrency(payment.amount)}</td>
            <td><span class="status-badge paid">Lunas</span></td>
        </tr>
    `).join('');
}

function loadUpcomingAgenda() {
    const container = document.getElementById('upcomingAgenda');
    if (!container) return;
    
    const agendas = getUpcomingAgendas();
    
    if (agendas.length === 0) {
        container.innerHTML = '<p class="text-center">Belum ada agenda mendatang</p>';
        return;
    }
    
    container.innerHTML = agendas.map(agenda => `
        <div class="agenda-mini">
            <div class="agenda-date-badge">
                <span class="day">${new Date(agenda.date).getDate()}</span>
                <span class="month">${new Date(agenda.date).toLocaleString('id-ID', { month: 'short' })}</span>
            </div>
            <div class="agenda-mini-info">
                <h4>${agenda.title}</h4>
                <span><i class="fas fa-map-marker-alt"></i> ${agenda.location}</span>
            </div>
        </div>
    `).join('');
}

// Load Alumni Table
function loadAlumniTable() {
    const tableBody = document.getElementById('alumniTable');
    if (!tableBody) return;
    
    const alumni = getAlumni();
    
    if (alumni.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Belum ada alumni</td></tr>';
        return;
    }
    
    tableBody.innerHTML = alumni.map((a, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${a.name}</td>
            <td>${a.email}</td>
            <td>${a.phone}</td>
            <td>${a.graduationYear}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="editAlumni('${a.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteAlumniData('${a.id}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Payments Table
function loadPaymentsTable(month = '', year = '') {
    const tableBody = document.getElementById('paymentsTable');
    if (!tableBody) return;
    
    let payments = getPayments();
    
    if (month) {
        payments = payments.filter(p => p.month === month);
    }
    if (year) {
        payments = payments.filter(p => p.year === parseInt(year));
    }
    
    payments = payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
    
    if (payments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada pembayaran</td></tr>';
        return;
    }
    
    tableBody.innerHTML = payments.map((p, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${p.name || 'Tidak diketahui'}</td>
            <td>${p.month} ${p.year}</td>
            <td>${formatCurrency(p.amount)}</td>
            <td>${getPaymentMethodLabel(p.paymentMethod)}</td>
            <td>${formatDate(p.paymentDate)}</td>
            <td><span class="status-badge ${p.status}">${p.status === 'paid' ? 'Lunas' : 'Pending'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn delete" onclick="deletePaymentData('${p.id}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getPaymentMethodLabel(method) {
    const labels = {
        'transfer_bca': 'Transfer BCA',
        'transfer_mandiri': 'Transfer Mandiri',
        'transfer_bni': 'Transfer BNI',
        'ewallet_dana': 'DANA',
        'ewallet_gopay': 'GoPay',
        'ewallet_ovo': 'OVO',
        'transfer': 'Transfer Bank',
        'ewallet': 'E-Wallet',
        'cash': 'Tunai'
    };
    return labels[method] || method;
}

function filterPayments() {
    const month = document.getElementById('paymentFilterMonth').value;
    const year = document.getElementById('paymentFilterYear').value;
    loadPaymentsTable(month, year);
}

// Load Agenda Table
function loadAgendaTable() {
    const tableBody = document.getElementById('agendaTable');
    if (!tableBody) return;
    
    const agendas = getAgendas().sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (agendas.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada agenda</td></tr>';
        return;
    }
    
    tableBody.innerHTML = agendas.map((a, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${a.title}</td>
            <td>${formatDate(a.date)}</td>
            <td>${a.location}</td>
            <td>${a.type === 'tahunan' ? 'Tahunan' : 'Bulanan'}</td>
            <td><span class="status-badge ${a.active ? 'active' : 'inactive'}">${a.active ? 'Aktif' : 'Nonaktif'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="editAgenda('${a.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteAgendaData('${a.id}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Gallery Admin
function loadGalleryAdmin() {
    const grid = document.getElementById('galleryAdminGrid');
    if (!grid) return;
    
    const gallery = getGallery();
    
    if (gallery.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>Belum ada foto galeri</p></div>';
        return;
    }
    
    grid.innerHTML = gallery.map(item => `
        <div class="gallery-admin-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="gallery-admin-overlay">
                <button class="action-btn delete" onclick="deleteGalleryData('${item.id}')" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Form Handlers
function handleAlumniSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('alumniId').value;
    const alumni = {
        name: document.getElementById('alumniName').value,
        email: document.getElementById('alumniEmail').value,
        phone: document.getElementById('alumniPhone').value,
        graduationYear: parseInt(document.getElementById('alumniGradYear').value),
        major: document.getElementById('alumniMajor').value,
        address: document.getElementById('alumniAddress').value
    };
    
    let success;
    if (id) {
        success = updateAlumni(id, alumni);
    } else {
        success = addAlumni(alumni);
    }
    
    if (success) {
        closeModal('alumniModal');
        loadAlumniTable();
        loadDashboard();
        alert('Data alumni berhasil disimpan!');
    } else {
        alert('Gagal menyimpan data alumni!');
    }
}

function handleAgendaSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('agendaId').value;
    const selectedImage = document.getElementById('agendaImage').value;
    const agenda = {
        title: document.getElementById('agendaTitle').value,
        description: document.getElementById('agendaDesc').value,
        date: document.getElementById('agendaDate').value,
        time: document.getElementById('agendaTime').value,
        location: document.getElementById('agendaLocation').value,
        type: document.getElementById('agendaType').value,
        active: document.getElementById('agendaActive').checked,
        image: selectedImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
    };
    
    let success;
    if (id) {
        success = updateAgenda(id, agenda);
    } else {
        success = addAgenda(agenda);
    }
    
    if (success) {
        closeModal('agendaModal');
        loadAgendaTable();
        loadUpcomingAgenda();
        alert('Agenda berhasil disimpan!');
    } else {
        alert('Gagal menyimpan agenda!');
    }
}

function handleGallerySubmit(e) {
    e.preventDefault();
    
    // Check if base64 image exists (from file upload), otherwise use URL
    const base64Image = document.getElementById('galleryBase64').value;
    const urlImage = document.getElementById('galleryUrl').value;
    const image = base64Image || urlImage;
    
    if (!image) {
        alert('Silakan pilih foto atau masukkan URL foto!');
        return;
    }
    
    const gallery = {
        title: document.getElementById('galleryTitle').value,
        description: document.getElementById('galleryDesc').value,
        category: document.getElementById('galleryCategory').value,
        image: image
    };
    
    const success = addGallery(gallery);
    
    if (success) {
        closeModal('galleryModal');
        loadGalleryAdmin();
        resetGalleryForm();
        alert('Foto galeri berhasil ditambahkan!');
    } else {
        alert('Gagal menambahkan foto galeri!');
    }
}

// Handle File Upload (Convert to Base64)
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar! Maksimal 2MB.');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('galleryBase64').value = base64;
        
        // Show preview
        const preview = document.getElementById('imagePreview');
        const previewImg = preview.querySelector('img');
        previewImg.src = base64;
        preview.style.display = 'block';
        
        // Clear URL input
        document.getElementById('galleryUrl').value = '';
    };
    reader.readAsDataURL(file);
}

// Remove Image Preview
function removeImagePreview() {
    document.getElementById('galleryBase64').value = '';
    document.getElementById('galleryFile').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

// Reset Gallery Form
function resetGalleryForm() {
    document.getElementById('galleryTitle').value = '';
    document.getElementById('galleryDesc').value = '';
    document.getElementById('galleryCategory').value = 'reunion';
    document.getElementById('galleryUrl').value = '';
    document.getElementById('galleryBase64').value = '';
    document.getElementById('galleryFile').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

function handlePaymentAdminSubmit(e) {
    e.preventDefault();
    
    const amount = parseInt(document.getElementById('paymentAmountAdmin').value);
    
    // Validate minimum payment
    if (amount < 5000) {
        alert('Minimal pembayaran adalah Rp 5.000');
        return;
    }
    
    const payment = {
        alumniId: document.getElementById('paymentAlumniId').value,
        name: document.getElementById('paymentAlumniName').value,
        amount: amount,
        month: document.getElementById('paymentMonthAdmin').value,
        year: parseInt(document.getElementById('paymentYearAdmin').value),
        paymentMethod: document.getElementById('paymentMethodAdmin').value,
        note: document.getElementById('paymentNoteAdmin').value,
        status: 'paid'
    };
    
    const success = addPayment(payment);
    
    if (success) {
        closeModal('paymentModal');
        loadPaymentsTable();
        loadDashboard();
        loadRecentPayments();
        alert('Pembayaran berhasil dicatat!');
    } else {
        alert('Gagal mencatat pembayaran!');
    }
}

// Modal Functions
function openAlumniModal(id = null) {
    const modal = document.getElementById('alumniModal');
    const form = document.getElementById('alumniForm');
    const title = document.getElementById('alumniModalTitle');
    
    form.reset();
    document.getElementById('alumniId').value = '';
    
    if (id) {
        const alumni = getAlumniById(id);
        if (alumni) {
            title.textContent = 'Edit Alumni';
            document.getElementById('alumniId').value = alumni.id;
            document.getElementById('alumniName').value = alumni.name;
            document.getElementById('alumniEmail').value = alumni.email;
            document.getElementById('alumniPhone').value = alumni.phone;
            document.getElementById('alumniGradYear').value = alumni.graduationYear;
            document.getElementById('alumniMajor').value = alumni.major;
            document.getElementById('alumniAddress').value = alumni.address || '';
        }
    } else {
        title.textContent = 'Tambah Alumni';
    }
    
    modal.classList.add('active');
}

function openAgendaModal(id = null) {
    const modal = document.getElementById('agendaModal');
    const form = document.getElementById('agendaForm');
    const title = document.getElementById('agendaModalTitle');
    
    form.reset();
    document.getElementById('agendaId').value = '';
    document.getElementById('agendaImage').value = '';
    document.getElementById('selectedImagePreview').style.display = 'none';
    document.getElementById('locationStatus').style.display = 'none';
    
    // Load gallery for selector
    loadGalleryForAgendaSelector();
    
    // Set default date to 2026
    setDefaultAgendaDate();
    
    if (id) {
        const agenda = getAgendas().find(a => a.id === id);
        if (agenda) {
            title.textContent = 'Edit Agenda';
            document.getElementById('agendaId').value = agenda.id;
            document.getElementById('agendaTitle').value = agenda.title;
            document.getElementById('agendaDesc').value = agenda.description;
            document.getElementById('agendaDate').value = agenda.date;
            document.getElementById('agendaTime').value = agenda.time;
            document.getElementById('agendaLocation').value = agenda.location;
            document.getElementById('agendaType').value = agenda.type;
            document.getElementById('agendaActive').checked = agenda.active;
            
            // Set selected image if exists
            if (agenda.image) {
                document.getElementById('agendaImage').value = agenda.image;
                document.getElementById('agendaImageGallery').value = agenda.image;
                const preview = document.getElementById('selectedImagePreview');
                preview.querySelector('img').src = agenda.image;
                preview.style.display = 'block';
            }
        }
    } else {
        title.textContent = 'Tambah Agenda';
    }
    
    modal.classList.add('active');
}

function openGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const form = document.getElementById('galleryForm');
    form.reset();
    
    // Reset image fields
    document.getElementById('galleryBase64').value = '';
    document.getElementById('galleryFile').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    
    modal.classList.add('active');
}

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const form = document.getElementById('paymentFormAdmin');
    form.reset();
    
    // Populate alumni dropdown
    const select = document.getElementById('paymentAlumniId');
    if (select) {
        const alumni = getAlumni();
        select.innerHTML = '<option value="">Pilih Alumni</option>' + 
            alumni.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    }
    
    modal.classList.add('active');
}

// Delete Functions
function deleteAlumniData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus alumni ini?')) {
        const success = deleteAlumni(id);
        if (success) {
            loadAlumniTable();
            loadDashboard();
        }
    }
}

function deletePaymentData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) {
        const success = deletePayment(id);
        if (success) {
            loadPaymentsTable();
            loadDashboard();
            loadRecentPayments();
        }
    }
}

function deleteAgendaData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
        const success = deleteAgenda(id);
        if (success) {
            loadAgendaTable();
            loadUpcomingAgenda();
        }
    }
}

function deleteGalleryData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
        const success = deleteGallery(id);
        if (success) {
            loadGalleryAdmin();
        }
    }
}

// Edit Functions
function editAlumni(id) {
    openAlumniModal(id);
}

function editAgenda(id) {
    openAgendaModal(id);
}

// Select alumni and fill name
function onAlumniSelect() {
    const id = document.getElementById('paymentAlumniId').value;
    const alumni = getAlumniById(id);
    if (alumni) {
        document.getElementById('paymentAlumniName').value = alumni.name;
    }
}

// AI WhatsApp Reminder Functions
let autoReminderEnabled = false;
let autoReminderInterval = null;

// Initialize AI Reminder
function initAIReminder() {
    // Check if auto reminder was enabled before
    const autoEnabled = localStorage.getItem('ai_auto_reminder_enabled');
    if (autoEnabled === 'true') {
        autoReminderEnabled = true;
        const toggle = document.getElementById('autoReminderToggle');
        if (toggle) toggle.checked = true;
        startAutoReminder();
    }
}

// Toggle Auto Reminder
function toggleAutoReminder() {
    const toggle = document.getElementById('autoReminderToggle');
    if (!toggle) return;
    
    autoReminderEnabled = toggle.checked;
    localStorage.setItem('ai_auto_reminder_enabled', autoReminderEnabled);
    
    if (autoReminderEnabled) {
        startAutoReminder();
        alert('AI Auto Reminder diaktifkan! AI akan otomatis mengirim pesan WhatsApp ke alumni yang belum membayar.');
    } else {
        stopAutoReminder();
        alert('AI Auto Reminder dinonaktifkan.');
    }
}

// Start Auto Reminder
function startAutoReminder() {
    if (autoReminderInterval) return;
    
    // Run immediately
    runAutoReminder();
    
    // Then run every hour (3600000 ms)
    autoReminderInterval = setInterval(runAutoReminder, 3600000);
    
    updateAutoReminderStatus();
}

// Stop Auto Reminder
function stopAutoReminder() {
    if (autoReminderInterval) {
        clearInterval(autoReminderInterval);
        autoReminderInterval = null;
    }
    updateAutoReminderStatus();
}

// Run Auto Reminder
function runAutoReminder() {
    const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    // Get unpaid alumni
    const unpaidAlumni = getUnpaidAlumni(currentMonth, currentYear);
    
    if (unpaidAlumni.length === 0) {
        console.log('Semua alumni sudah membayar bulan ini');
        return;
    }
    
    // Get last sent date
    const lastSentKey = 'ai_last_sent_' + currentMonth + '_' + currentYear;
    const lastSent = localStorage.getItem(lastSentKey);
    const today = new Date().toISOString().split('T')[0];
    
    // Only send once per day
    if (lastSent === today) {
        console.log('Pesan sudah dikirim hari ini');
        return;
    }
    
    // Generate AI message
    const message = generateAIMessage(currentMonth, currentYear);
    
    // Send to all unpaid alumni
    unpaidAlumni.forEach((alumni, index) => {
        setTimeout(() => {
            sendWhatsAppMessage(alumni.phone, message);
        }, index * 2000); // 2 second delay between each message
    });
    
    // Save sent date
    localStorage.setItem(lastSentKey, today);
    
    // Update UI
    updateAutoReminderStatus();
    
    // Show notification
    showAutoReminderNotification(unpaidAlumni.length, currentMonth);
}

// Generate AI Message
function generateAIMessage(month, year) {
    const messages = [
        `Halo {name}! 

Saya dari Tim SEDULUR ALUMNI ingin mengingatkan bahwa iuran kas bulan ${month} ${year} sebesar Rp 5.000 belum kami terima.

Bantuan Anda sangat berarti untuk keberlangsungan acara-alumni kita.

Silakan melakukan pembayaran melalui:
- Transfer BCA: 1234 5678 9012 (SEDULUR ALUMNI)
- DANA: 0812 3456 7890

Terima kasih atas perhatiannya!

Salam hangat,
Tim SEDULUR ALUMNI`,

`Assalamualaikum wr. wb. Halo {name}!

Tim SEDULUR ALUMNI mengingatkan bahwa iuran bulan ${month} ${year} Rp 5.000 belum terbayar.

Yuk, langsung bayar agar tidak terlambat! 

Transfer: BCA 1234 5678 9012

Waalaikumussalam wr. wb.`,

`Hai {name}! 👋

Jangan lupa ya, iuran kas alumni bulan ${month} ${year} sebesar Rp 5.000 masih menunggu.

Kita butuh dukunganmu untuk kesuksesan acara alumni nanti!

Info lebih lanjut hubungi admin.

Terima kasih! 😊`
    ];
    
    // Pick random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Replace {name} placeholder
    return randomMessage.replace('{name}', '{name}');
}

// Send WhatsApp Message
function sendWhatsAppMessage(phone, message) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('62') ? cleanPhone : '62' + cleanPhone.substring(1);
    const waUrl = 'https://wa.me/' + waPhone + '?text=' + encodeURIComponent(message);
    window.open(waUrl, '_blank');
}

// Update Auto Reminder Status
function updateAutoReminderStatus() {
    const statusEl = document.getElementById('autoReminderStatus');
    if (!statusEl) return;
    
    if (autoReminderEnabled) {
        statusEl.innerHTML = '<span class="status-active"><i class="fas fa-circle"></i> Aktif - AI akan otomatis menagih</span>';
    } else {
        statusEl.innerHTML = '<span class="status-inactive"><i class="fas fa-circle"></i> Nonaktif</span>';
    }
}

// Show Auto Reminder Notification
function showAutoReminderNotification(count, month) {
    const notification = document.getElementById('aiNotification');
    if (notification) {
        notification.innerHTML = `
            <div class="ai-notification">
                <i class="fab fa-whatsapp"></i>
                <span>AI telah mengirim ${count} pesan WhatsApp ke alumni yang belum membayar bulan ${month}</span>
            </div>
        `;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 10000);
    }
}

// Manual Search Unpaid
function searchUnpaid() {
    const month = document.getElementById('reminderMonth').value;
    const year = document.getElementById('reminderYear').value;
    
    selectedUnpaidAlumni = getUnpaidAlumni(month, year);
    
    const list = document.getElementById('unpaidList');
    const badge = document.getElementById('unpaidCountBadge');
    
    if (badge) badge.textContent = selectedUnpaidAlumni.length + ' alumni belum membayar';
    
    if (selectedUnpaidAlumni.length === 0) {
        if (list) list.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><p>Semua alumni sudah membayar!</p></div>';
        const preview = document.getElementById('messagePreview');
        if (preview) preview.style.display = 'none';
        return;
    }
    
    if (list) {
        list.innerHTML = selectedUnpaidAlumni.map(alumni => `
            <div class="unpaid-item">
                <div class="unpaid-info">
                    <h4>${alumni.name}</h4>
                    <span>${alumni.phone}</span>
                </div>
                <input type="checkbox" class="select-alumni" value="${alumni.id}" checked>
            </div>
        `).join('');
    }
    
    showMessagePreview(month, year);
}

function showMessagePreview(month, year) {
    const preview = document.getElementById('messagePreview');
    const message = document.getElementById('aiMessage');
    
    const sampleAlumni = selectedUnpaidAlumni[0] || { name: '[Nama Alumni]', phone: '[No. Telp]' };
    
    const messageTemplate = `Halo ${sampleAlumni.name}! 

Saya dari Tim SEDULUR ALUMNI ingin mengingatkan bahwa iuran kas bulan ${month} ${year} sebesar Rp 5.000 belum kami terima. 

Bantuan Anda sangat berarti untuk keberlangsungan acara-alumni kita. 

Silakan melakukan pembayaran melalui:
- Transfer BCA: 1234 5678 9012 (SEDULUR ALUMNI)
- DANA: 0812 3456 7890

Terima kasih atas perhatiannya!

Salam hangat,
Tim SEDULUR ALUMNI`;

    if (message) message.value = messageTemplate;
    if (preview) preview.style.display = 'block';
}

function sendReminders() {
    const checkboxes = document.querySelectorAll('.select-alumni:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    const alumniToRemind = selectedUnpaidAlumni.filter(a => selectedIds.includes(a.id));
    
    if (alumniToRemind.length === 0) {
        alert('Pilih alumni yang ingin dikirimi pesan terlebih dahulu!');
        return;
    }
    
    const message = document.getElementById('aiMessage').value;
    
    alumniToRemind.forEach((alumni, index) => {
        setTimeout(() => {
            const phone = alumni.phone.replace(/[^0-9]/g, '');
            const waPhone = phone.startsWith('62') ? phone : '62' + phone.substring(1);
            const waUrl = 'https://wa.me/' + waPhone + '?text=' + encodeURIComponent(message);
            window.open(waUrl, '_blank');
        }, index * 1500);
    });
    
    alert('Membuka WhatsApp untuk ' + alumniToRemind.length + ' alumni...');
}

// Utility
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ========================================
// NEW FEATURES IMPLEMENTATION
// ========================================

// Feature 1 & 2: Gallery Photo Selection & Location Picker for Agenda
function loadGalleryForAgendaSelector() {
    const select = document.getElementById('agendaImageGallery');
    if (!select) return;
    
    const gallery = getGallery();
    select.innerHTML = '<option value="">Pilih foto dari galeri...</option>';
    
    gallery.forEach(item => {
        select.innerHTML += `<option value="${item.image}">${item.title}</option>`;
    });
}

function selectGalleryImage(select) {
    const imageUrl = select.value;
    const hiddenInput = document.getElementById('agendaImage');
    const preview = document.getElementById('selectedImagePreview');
    const previewImg = preview.querySelector('img');
    
    // Clear file upload
    const fileInput = document.getElementById('agendaImageUpload');
    if (fileInput) fileInput.value = '';
    
    if (imageUrl) {
        hiddenInput.value = imageUrl;
        previewImg.src = imageUrl;
        preview.style.display = 'block';
    } else {
        hiddenInput.value = '';
        preview.style.display = 'none';
    }
}

// Handle Agenda Image Upload (from file)
function handleAgendaImageUpload(input) {
    const file = input.files[0];
    const hiddenInput = document.getElementById('agendaImage');
    const preview = document.getElementById('selectedImagePreview');
    const previewImg = preview.querySelector('img');
    
    // Clear gallery selection
    const gallerySelect = document.getElementById('agendaImageGallery');
    if (gallerySelect) gallerySelect.value = '';
    
    if (file) {
        // Convert to base64 for localStorage
        const reader = new FileReader();
        reader.onload = function(e) {
            hiddenInput.value = e.target.result;
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        hiddenInput.value = '';
        preview.style.display = 'none';
    }
}

function clearSelectedImage() {
    document.getElementById('agendaImage').value = '';
    document.getElementById('agendaImageGallery').value = '';
    
    // Clear file upload
    const fileInput = document.getElementById('agendaImageUpload');
    if (fileInput) fileInput.value = '';
    
    document.getElementById('selectedImagePreview').style.display = 'none';
}

// Feature 2: Real-time Location Picker
function getCurrentLocation() {
    const locationInput = document.getElementById('agendaLocation');
    const statusDiv = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        alert('Geolocation tidak didukung oleh browser Anda!');
        return;
    }
    
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mendapatkan lokasi...';
    statusDiv.classList.remove('error');
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Try to get address from coordinates using reverse geocoding
            const locationName = lat.toFixed(6) + ', ' + lng.toFixed(6);
            locationInput.value = locationName;
            
            statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Lokasi berhasil ditemukan! Koordinat: ' + locationName;
            statusDiv.classList.remove('error');
            
            // Store coordinates for future use
            locationInput.dataset.lat = lat;
            locationInput.dataset.lng = lng;
        },
        function(error) {
            let errorMessage = 'Gagal mendapatkan lokasi.';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Izin lokasi ditolak. Silakan aktifkan GPS dan berikan izin.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Informasi lokasi tidak tersedia.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Permintaan lokasi超时.';
                    break;
            }
            statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + errorMessage;
            statusDiv.classList.add('error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// Feature 3: Default year 2026 for agenda date
function setDefaultAgendaDate() {
    const dateInput = document.getElementById('agendaDate');
    if (dateInput) {
        // Set default date to first day of 2026
        const today = new Date();
        const year = today.getFullYear();
        
        if (year < 2026) {
            dateInput.value = '2026-01-01';
            dateInput.min = '2026-01-01';
        } else {
            dateInput.min = '2026-01-01';
        }
    }
}

// Feature 5: PDF Download for Payment Data
function downloadPaymentPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get payment data
    const payments = getPayments().filter(p => p.status === 'paid');
    const alumni = getAlumni();
    
    // Header
    doc.setFontSize(18);
    doc.text('SEDULUR ALUMNI', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Laporan Data Pembayaran Iuran', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Tanggal: ' + new Date().toLocaleDateString('id-ID'), 105, 38, { align: 'center' });
    
    // Summary
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    doc.text('Total Pembayaran: Rp ' + totalAmount.toLocaleString('id-ID'), 14, 50);
    doc.text('Jumlah Alumni: ' + payments.length, 14, 56);
    
    // Table
    const tableData = payments.map(p => {
        const alumniData = alumni.find(a => a.id === p.alumniId);
        return [
            p.name || 'Tidak diketahui',
            p.month + ' ' + p.year,
            'Rp ' + p.amount.toLocaleString('id-ID'),
            getPaymentMethodLabel(p.paymentMethod),
            p.paymentDate
        ];
    });
    
    doc.autoTable({
        startY: 65,
        head: [['Nama', 'Bulan/Tahun', 'Jumlah', 'Metode', 'Tanggal']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [26, 58, 47] }
    });
    
    // Footer
    doc.setFontSize(8);
    doc.text('Dicetak pada: ' + new Date().toLocaleString('id-ID'), 105, 285, { align: 'center' });
    
    // Save
    doc.save('laporan-pembayaran-' + new Date().toISOString().split('T')[0] + '.pdf');
}

// Download Payment Proof PDF
function downloadPaymentProof(paymentId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const payments = getPayments();
    const payment = payments.find(p => p.id === paymentId);
    
    if (!payment) {
        alert('Data pembayaran tidak ditemukan!');
        return;
    }
    
    const alumni = getAlumni();
    const alumniData = alumni.find(a => a.id === payment.alumniId);
    
    // Header
    doc.setFontSize(18);
    doc.text('SEDULUR ALUMNI', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Bukti Pembayaran', 105, 30, { align: 'center' });
    
    // Payment Details
    doc.setFontSize(11);
    let y = 50;
    
    doc.text('Nama Alumni: ' + (payment.name || 'Tidak diketahui'), 20, y);
    y += 10;
    doc.text('Bulan/Tahun: ' + payment.month + ' ' + payment.year, 20, y);
    y += 10;
    doc.text('Jumlah: Rp ' + payment.amount.toLocaleString('id-ID'), 20, y);
    y += 10;
    doc.text('Metode Pembayaran: ' + getPaymentMethodLabel(payment.paymentMethod), 20, y);
    y += 10;
    doc.text('Tanggal Pembayaran: ' + payment.paymentDate, 20, y);
    y += 10;
    doc.text('Status: LUNAS', 20, y);
    
    // Footer
    doc.setFontSize(8);
    doc.text('Bukti ini sah sebagai tanda bukti pembayaran yang valid.', 105, 250, { align: 'center' });
    doc.text('Dicetak pada: ' + new Date().toLocaleString('id-ID'), 105, 260, { align: 'center' });
    
    // Save
    doc.save('bukti-pembayaran-' + payment.name.replace(/\s+/g, '-') + '-' + payment.month + '-' + payment.year + '.pdf');
}
