/**
 * Seduulur Alumni - Main Application
 */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initParticles();
    initStats();
    loadAgendas();
    loadGalleryPreview();
    loadPaymentHistory();
    initHeroAnimations();
    
    // Payment Form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
    
    // Gallery Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleGalleryFilter(btn.dataset.filter));
    });
    
    // Lightbox
    initLightbox();
});

// Hero Animations (Slo-mo effect)
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Add staggered animations to title lines
    const titleLines = heroTitle.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(40px) scale(0.95)';
        line.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0) scale(1)';
        }, 300 + (index * 500));
    });
    
    // Animate subtitle
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        subtitle.style.opacity = '0';
        subtitle.style.transition = 'all 1s ease 1.3s';
        subtitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 1300);
    }
    
    // Animate buttons
    const buttons = document.querySelector('.hero-buttons');
    if (buttons) {
        buttons.style.opacity = '0';
        buttons.style.transition = 'all 1s ease 1.6s';
        buttons.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            buttons.style.opacity = '1';
            buttons.style.transform = 'translateY(0)';
        }, 1600);
    }
    
    // Animate badge
    const badge = document.querySelector('.hero-badge');
    if (badge) {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(-20px)';
        badge.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Particles Animation
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) {
        // Try login particles
        const loginParticles = document.getElementById('loginParticles');
        if (!loginParticles) return;
        
        createParticles(loginParticles);
        return;
    }
    
    createParticles(particlesContainer);
}

function createParticles(container) {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        container.appendChild(particle);
    }
}

// Animated Stats
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;
    
    // Load real data from database
    loadRealStats();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats(statNumbers);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Load Real Statistics from Database
function loadRealStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;
    
    // Get real data from database
    const alumni = getAlumni();
    const totalIncome = getTotalIncome();
    const agendas = getAgendas();
    const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    // Calculate payment compliance
    const paidPayments = getPayments().filter(p => p.month === currentMonth && p.year === currentYear && p.status === 'paid');
    const uniquePaidAlumni = new Set(paidPayments.map(p => p.alumniId));
    const complianceRate = alumni.length > 0 ? Math.round((uniquePaidAlumni.size / alumni.length) * 100) : 0;
    
    // Map data-target attributes to real values
    statNumbers.forEach(stat => {
        const type = stat.dataset.type;
        switch(type) {
            case 'alumni':
                stat.dataset.target = alumni.length;
                break;
            case 'kas':
                stat.dataset.target = totalIncome;
                break;
            case 'agenda':
                stat.dataset.target = agendas.length;
                break;
            case 'compliance':
                stat.dataset.target = complianceRate;
                break;
        }
    });
}

function animateStats(stats) {
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCount = () => {
            current += increment;
            if (current < target) {
                stat.textContent = formatNumber(Math.floor(current));
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = formatNumber(target);
            }
        };
        
        updateCount();
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Load Agendas
function loadAgendas() {
    const agendaGrid = document.getElementById('agendaGrid');
    if (!agendaGrid) return;
    
    const agendas = getUpcomingAgendas();
    
    if (agendas.length === 0) {
        agendaGrid.innerHTML = '<div class="empty-state"><p>Belum ada agenda mendatang</p></div>';
        return;
    }
    
    agendaGrid.innerHTML = agendas.map(agenda => `
        <div class="agenda-card" onclick="showAgendaMap('${encodeURIComponent(agenda.location)}', '${encodeURIComponent(agenda.title)}')">
            <div class="agenda-image" style="background-image: url('${agenda.image}')">
                <span class="agenda-badge">${agenda.type === 'tahunan' ? 'Tahunan' : 'Bulanan'}</span>
            </div>
            <div class="agenda-content">
                <div class="agenda-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(agenda.date)}
                </div>
                <h3 class="agenda-title">${agenda.title}</h3>
                <p class="agenda-desc">${agenda.description}</p>
                <div class="agenda-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${agenda.location}
                    <span class="map-hint">(Klik untuk lihat peta)</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Show Agenda Location on Google Maps
function showAgendaMap(location, title) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapUrl, '_blank');
}

// Load Gallery Preview
function loadGalleryPreview() {
    const galleryPreview = document.getElementById('galleryPreview');
    if (!galleryPreview) return;
    
    // Also load full gallery for gallery page
    const galleryGrid = document.getElementById('galleryGrid');
    
    const gallery = getGallery();
    const displayGallery = galleryPreview || galleryGrid;
    
    if (!displayGallery) return;
    
    const items = gallery.slice(0, galleryPreview ? 4 : 8);
    
    displayGallery.innerHTML = items.map(item => `
        <div class="gallery-item" data-id="${item.id}" data-category="${item.category}">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
    `).join('');
    
    // Add click handlers for lightbox
    if (!galleryPreview) {
        setupGalleryClickHandlers();
    }
}

function setupGalleryClickHandlers() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            openLightbox(item.dataset.id);
        });
    });
}

// Lightbox
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateLightbox(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateLightbox(1));
    }
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

let currentLightboxIndex = 0;
let galleryItems = [];

function openLightbox(id) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const title = document.getElementById('lightboxTitle');
    const desc = document.getElementById('lightboxDesc');
    const date = document.getElementById('lightboxDate');
    
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    currentLightboxIndex = galleryItems.findIndex(item => item.dataset.id === id);
    
    const gallery = getGallery();
    const item = gallery.find(g => g.id === id);
    
    if (item && img && title && desc && date) {
        img.src = item.image;
        title.textContent = item.title;
        desc.textContent = item.description;
        date.textContent = formatDate(item.date);
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = galleryItems.length - 1;
    } else if (currentLightboxIndex >= galleryItems.length) {
        currentLightboxIndex = 0;
    }
    
    const item = galleryItems[currentLightboxIndex];
    if (item) {
        openLightbox(item.dataset.id);
    }
}

// Gallery Filter
function handleGalleryFilter(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.filter-btn').classList.add('active');
    
    // Filter items
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    const gallery = getGalleryByCategory(category);
    
    galleryGrid.innerHTML = gallery.map(item => `
        <div class="gallery-item" data-id="${item.id}" data-category="${item.category}">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
    `).join('');
    
    setupGalleryClickHandlers();
}

// Payment History
function loadPaymentHistory() {
    const paymentHistory = document.getElementById('paymentHistory');
    if (!paymentHistory) return;
    
    const payments = getPayments()
        .filter(p => p.status === 'paid')
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
        .slice(0, 5);
    
    if (payments.length === 0) {
        paymentHistory.innerHTML = '<div class="empty-state"><i class="fas fa-receipt"></i><p>Belum ada riwayat pembayaran</p></div>';
        return;
    }
    
    paymentHistory.innerHTML = payments.map(payment => `
        <div class="payment-history-item">
            <div class="payment-history-icon">
                <i class="fas fa-check"></i>
            </div>
            <div class="payment-history-info">
                <h4>${payment.name}</h4>
                <span>${payment.month} ${payment.year} - ${formatCurrency(payment.amount)}</span>
            </div>
        </div>
    `).join('');
}

// Handle Payment Submit
function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const amount = parseInt(form.paymentAmount.value);
    
    // Validate minimum payment
    if (amount < 5000) {
        alert('Minimal pembayaran adalah Rp 5.000');
        return;
    }
    
    const payment = {
        alumniId: 'guest_' + Date.now(),
        name: form.payerName.value,
        email: form.payerEmail.value,
        phone: form.payerPhone.value,
        amount: amount,
        month: form.paymentMonth.value,
        year: parseInt(form.paymentYear.value),
        paymentMethod: form.paymentMethod.value,
        note: form.paymentNote.value,
        status: 'paid' // Langsung lunas
    };
    
    addPayment(payment);
    
    // Show success modal
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
    }
    
    // Reset form
    form.reset();
    document.getElementById('paymentAmount').value = '5000';
    
    // Hide payment details box
    const detailsBox = document.getElementById('paymentDetailsBox');
    if (detailsBox) {
        detailsBox.style.display = 'none';
    }
    
    // Refresh history
    loadPaymentHistory();
}

// Modal Functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Utility Functions
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
});