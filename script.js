// ==========================================
// 1. AREA KONFIGURASI 
// ==========================================
const config = {
    coverImageDesktop: "assets/images/lompat-batu-desktop.jpg", 
    coverImageMobile: "assets/images/lompat-batu-mobile.jpg", 
    eventDate: "2026-11-14T13:00:00", 
    whatsappNumber: "6282294703180", 
    guestNamePlaceholder: "Tamu Kehormatan"
};

// ==========================================
// 2. NAMA TAMU DARI LINK
// ==========================================
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('name') || urlParams.get('to');
const guestNameElement = document.getElementById('guest-name');

if (guestNameElement) {
    guestNameElement.textContent = guestName ? decodeURIComponent(guestName) : config.guestNamePlaceholder;
}

// ==========================================
// 3. NAVIGASI TOMBOL BUKA UNDANGAN
// ==========================================
const openBtn = document.getElementById('open-btn');
if (openBtn) {
    openBtn.addEventListener('click', () => {
       window.location.href = 'undangan.html' + window.location.search;
    });
}

// ==========================================
// 4. SISTEM AUDIO (OTOMATIS BACA HALAMAN)
// ==========================================
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

// Deteksi apakah sedang di halaman Cover atau Isi Undangan
const isCoverPage = document.getElementById('cover') !== null;
const songPath = isCoverPage ? "assets/audio/jamrud.mp3" : "assets/audio/jamrud.mp3";

if (audio) {
    audio.src = songPath;
    audio.load();
}

if (musicBtn) {
    musicBtn.style.display = 'flex';
}

const unlockAudio = () => {
    if (audio && audio.paused) {
        audio.play().then(() => {
            if (musicBtn) {
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
            }
        }).catch(() => {});
    }
    // Hapus deteksi setelah disentuh pertama kali
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('scroll', unlockAudio);
};

// Aktifkan musik saat ada interaksi (klik/sentuh/scroll)
document.addEventListener('click', unlockAudio);
document.addEventListener('touchstart', unlockAudio);
document.addEventListener('scroll', unlockAudio);

// Tombol Play/Pause manual
if (musicBtn && audio) {
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Cegah bentrok animasi
        if (audio.paused) {
            audio.play().then(() => {
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
            });
        } else {
            audio.pause();
            musicBtn.classList.remove('playing');
            musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    });
}

// ==========================================
// 5. ANIMASI SCROLL (MUNCUL KETIKA DIGESER)
// ==========================================
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target); 
        }
    });
}, { root: null, rootMargin: '0px', threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(section => {
    observer.observe(section);
});

// ==========================================
// 6. COUNTDOWN TIMER
// ==========================================
function updateCountdown() {
    const targetTime = new Date(config.eventDate).getTime();
    const now = new Date().getTime();
    const diff = targetTime - now;

    const daysCover = document.getElementById('days');
    const hoursCover = document.getElementById('hours');
    const minutesCover = document.getElementById('minutes');
    const secondsCover = document.getElementById('seconds');

    const daysIsi = document.getElementById('days-2');
    const hoursIsi = document.getElementById('hours-2');
    const minutesIsi = document.getElementById('minutes-2');
    const secondsIsi = document.getElementById('seconds-2');

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dStr = String(days).padStart(2, '0');
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(minutes).padStart(2, '0');
    const sStr = String(seconds).padStart(2, '0');

    if (daysCover) {
        daysCover.textContent = dStr; hoursCover.textContent = hStr;
        minutesCover.textContent = mStr; secondsCover.textContent = sStr;
    }
    if (daysIsi) {
        daysIsi.textContent = dStr; hoursIsi.textContent = hStr;
        minutesIsi.textContent = mStr; secondsIsi.textContent = sStr;
    }
}
setInterval(updateCountdown, 1000);
document.addEventListener("DOMContentLoaded", updateCountdown);

// ==========================================
// 7. RESPONSIVE BACKGROUND
// ==========================================
function updateResponsiveBackground() {
    const coverBg = document.getElementById('cover-bg');
    if (!coverBg) return;
    if (window.innerWidth < 768) {
        coverBg.style.backgroundImage = `url('${config.coverImageMobile}')`;
    } else {
        coverBg.style.backgroundImage = `url('${config.coverImageDesktop}')`;
    }
}
updateResponsiveBackground();
window.addEventListener('resize', updateResponsiveBackground);

// ==========================================
// 8. RSVP WHATSAPP
// ==========================================
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const name = document.getElementById('rsvp-name').value.trim();
        const status = document.getElementById('rsvp-status').value;
        const msg = `Shalom / Ya'ahowu.\nHalo Panitia, saya *${name}*, mengonfirmasi bahwa saya *${status}* pada perayaan HUT GEMA NIAS ke-17.\n\nMemaknai usia 17 tahun sebagai masa peralihan menuju kedewasaan, ini adalah momen penting bagi kita untuk bangkit dan bersinar setelah melewati berbagai tantangan.\n\nMari bersama mewujudkan "RISE & SHINE: Satu Generasi Menuju Generasi Baru!"\nTerima kasih.`;
        window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    });
}

// ==========================================
// 9. FUNGSI SALIN NOMOR REKENING
// ==========================================
window.salinRekening = function() {
    const rekeningEl = document.getElementById('rekening-num');
    if (!rekeningEl) return;
    const nomorRekening = rekeningEl.innerText.replace(/\s+/g, '');
    navigator.clipboard.writeText(nomorRekening).then(() => {
        const btnSalin = document.querySelector('.btn-salin');
        const teksAsli = btnSalin.innerHTML;
        btnSalin.innerHTML = '<i class="fa-solid fa-check"></i> Berhasil Disalin!';
        btnSalin.style.background = '#28a745';
        btnSalin.style.color = '#fff';
        btnSalin.style.borderColor = '#28a745';
        setTimeout(() => {
            btnSalin.innerHTML = teksAsli;
            btnSalin.style.background = '';
            btnSalin.style.color = '';
            btnSalin.style.borderColor = '';
        }, 2000);
    });
};

// ==========================================
// 10. GALERI FOTO SLIDER (15 FOTO)
// ==========================================
let currentSlideIndex = 0;
const totalSlides = 15;

function updateGallery() {
    const track = document.getElementById('galleryTrack');
    const counterNum = document.getElementById('currentSlideNum');
    const dots = document.querySelectorAll('.dot');
    if (!track) return;

    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    if (counterNum) counterNum.textContent = currentSlideIndex + 1;

    dots.forEach((dot, index) => {
        if (index === currentSlideIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

window.moveSlide = function(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex < 0) currentSlideIndex = totalSlides - 1;
    else if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
    updateGallery();
};

window.jumpSlide = function(index) {
    currentSlideIndex = index;
    updateGallery();
};

document.addEventListener("DOMContentLoaded", updateGallery);
