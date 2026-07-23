/**
 * El Takip Uygulaması - Frontend JavaScript
 * Filtre yönetimi ve interaktif kontroller
 */

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elementleri
    const videoStream = document.getElementById('video-stream');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const brightnessSlider = document.getElementById('brightness');
    const saturationSlider = document.getElementById('saturation');
    const contrastSlider = document.getElementById('contrast');

    // Değer göstergeleri
    const brightnessValue = document.getElementById('brightness-value');
    const saturationValue = document.getElementById('saturation-value');
    const contrastValue = document.getElementById('contrast-value');

    // Mevcut filtre durumu
    let currentFilter = 'normal';
    let settings = {
        brightness: 100,
        saturation: 100,
        contrast: 100
    };



    /**
     * CSS filtresini video akışının tamamına uygula
     */
    function applyFilters() {
        let filterStr = '';

        // Temel ayarlar
        filterStr += `brightness(${settings.brightness}%) `;
        filterStr += `saturate(${settings.saturation}%) `;
        filterStr += `contrast(${settings.contrast}%) `;

        // Özel filtreler
        switch (currentFilter) {
            case 'grayscale':
                filterStr += 'grayscale(100%) ';
                break;
            case 'sepia':
                filterStr += 'sepia(80%) ';
                break;
            case 'invert':
                filterStr += 'invert(100%) ';
                break;
            case 'blur':
                filterStr += 'blur(4px) ';
                break;
            case 'contrast':
                filterStr += 'contrast(150%) ';
                break;
            default:
                break;
        }

        videoStream.style.filter = filterStr.trim();
    }

    /**
     * Filtre butonlarını yönet
     */
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Aktif sınıfını güncelle
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filtreyi uygula
            currentFilter = this.dataset.filter;
            applyFilters();

            // Görsel geri bildirim
            animateButton(this);
        });
    });

    /**
     * Slider değişikliklerini yönet
     */
    brightnessSlider.addEventListener('input', function () {
        settings.brightness = this.value;
        brightnessValue.textContent = `${this.value}%`;
        applyFilters();
    });

    saturationSlider.addEventListener('input', function () {
        settings.saturation = this.value;
        saturationValue.textContent = `${this.value}%`;
        applyFilters();
    });

    contrastSlider.addEventListener('input', function () {
        settings.contrast = this.value;
        contrastValue.textContent = `${this.value}%`;
        applyFilters();
    });

    /**
     * Buton tıklama animasyonu
     */
    function animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'none';
        }, 100);
    }

    /**
     * FPS hesaplama
     */
    let frameCount = 0;
    let lastTime = performance.now();
    const fpsDisplay = document.getElementById('fps-value');

    function updateFPS() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
            if (fpsDisplay) {
                fpsDisplay.textContent = frameCount;
            }
            frameCount = 0;
            lastTime = currentTime;
        }

        requestAnimationFrame(updateFPS);
    }

    // FPS sayacını başlat
    updateFPS();

    /**
     * Video stream hata yönetimi
     */
    videoStream.addEventListener('error', function () {
        console.error('Video stream yüklenemedi');
        videoStream.style.background = 'linear-gradient(135deg, #1a1a25, #0a0a0f)';
        videoStream.alt = 'Kamera bağlantısı kurulamadı. Lütfen sayfayı yenileyin.';
    });

    /**
     * Sidebar navigasyonu
     */
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });

    /**
     * Keyboard shortcuts
     */
    document.addEventListener('keydown', function (e) {
        // Filtre kısayolları
        const shortcuts = {
            '1': 'normal',
            '2': 'grayscale',
            '3': 'sepia',
            '4': 'invert',
            '5': 'blur',
            '6': 'contrast'
        };

        if (shortcuts[e.key]) {
            const btn = document.querySelector(`[data-filter="${shortcuts[e.key]}"]`);
            if (btn) btn.click();
        }

        // Reset (R tuşu)
        if (e.key.toLowerCase() === 'r') {
            resetSettings();
        }
    });

    /**
     * Ayarları sıfırla
     */
    function resetSettings() {
        settings = { brightness: 100, saturation: 100, contrast: 100 };

        brightnessSlider.value = 100;
        saturationSlider.value = 100;
        contrastSlider.value = 100;

        brightnessValue.textContent = '100%';
        saturationValue.textContent = '100%';
        contrastValue.textContent = '100%';

        currentFilter = 'normal';
        filterButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-filter="normal"]').classList.add('active');

        applyFilters();
    }

    /**
     * Geri sayım ve Fotoğraf Çekim Yönetimi
     */
    let isCountingDown = false;
    let cooldownActive = false;
    const countdownOverlay = document.getElementById('countdown-overlay');

    async function triggerCapture() {
        try {
            triggerShutterFlash();
            const response = await fetch('/capture_now', { method: 'POST' });
            const data = await response.json();
            if (data.status === 'success') {
                loadPhotos(); // Galeriyi yeniden yükle
            }
        } catch (error) {
            console.error('Fotoğraf çekilemedi:', error);
        }
    }

    function startCountdown() {
        if (isCountingDown || cooldownActive) return;
        isCountingDown = true;

        let seconds = 2;
        countdownOverlay.textContent = seconds;
        countdownOverlay.classList.add('show');

        const interval = setInterval(() => {
            seconds--;
            if (seconds > 0) {
                countdownOverlay.textContent = seconds;
            } else {
                clearInterval(interval);
                countdownOverlay.classList.remove('show');
                triggerCapture();
                isCountingDown = false;

                // 4 saniyelik tetikleme koruması (cooldown)
                cooldownActive = true;
                setTimeout(() => {
                    cooldownActive = false;
                }, 4000);
            }
        }, 1000);
    }

    /**
     * Işık Kutusu (Lightbox) ve Fotoğraf Efekt Editörü
     */
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxDeleteBtn = document.getElementById('lightbox-delete-btn');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const effectButtons = document.querySelectorAll('.effect-btn');
    const saveEffectBtn = document.getElementById('save-effect-btn');
    
    let activePhotoFilename = '';
    let activeEffect = 'normal';

    function openLightbox(url, timestamp) {
        if (!lightboxModal) return;
        activePhotoFilename = url.split('/').pop();
        
        // Image source with cache buster to force reload if edited
        lightboxImg.src = url + '?t=' + new Date().getTime();
        lightboxImg.style.filter = 'none';

        const dateObj = new Date(timestamp);
        const formattedDate = dateObj.toLocaleDateString('tr-TR') + ' ' + dateObj.toLocaleTimeString('tr-TR');
        lightboxDate.textContent = `Tarih: ${formattedDate}`;

        // Reset effects toolbar
        activeEffect = 'normal';
        effectButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-effect') === 'normal') {
                btn.classList.add('active');
            }
        });

        lightboxModal.style.display = 'flex';
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.style.display = 'none';
        }
    }

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', function(e) {
            // Close if clicking outside lightbox-content card
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Efekt Butonları Tıklama Takibi (Anlık CSS Filtre Önizleme)
    effectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            effectButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            activeEffect = this.getAttribute('data-effect');
            
            // CSS Filtre önizlemelerini uygula
            let filterStr = 'none';
            switch (activeEffect) {
                case 'grayscale': filterStr = 'grayscale(100%)'; break;
                case 'sepia': filterStr = 'sepia(80%)'; break;
                case 'invert': filterStr = 'invert(100%)'; break;
                case 'blur': filterStr = 'blur(4px)'; break;
                case 'warm': filterStr = 'contrast(110%) saturate(120%) sepia(20%)'; break;
                case 'cool': filterStr = 'contrast(105%) saturate(110%) hue-rotate(10deg)'; break;
            }
            lightboxImg.style.filter = filterStr;
        });
    });

    // Efekti Kalıcı Olarak Sunucuda Kaydet
    if (saveEffectBtn) {
        saveEffectBtn.addEventListener('click', async () => {
            if (!activePhotoFilename || activeEffect === 'normal') {
                alert('Lütfen kaydetmek için önce farklı bir filtre seçin.');
                return;
            }

            saveEffectBtn.disabled = true;
            const originalText = saveEffectBtn.innerHTML;
            saveEffectBtn.textContent = 'Kaydediliyor...';

            try {
                const response = await fetch('/apply_filter_to_photo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: activePhotoFilename,
                        filter_type: activeEffect
                    })
                });
                const data = await response.json();
                if (data.status === 'success') {
                    alert('Efekt başarıyla fotoğrafa uygulandı ve kaydedildi.');
                    
                    // Lightbox görselini cache buster ile yenile ve filtresini temizle
                    const originalUrl = `/static/captured/${activePhotoFilename}`;
                    lightboxImg.src = originalUrl + '?t=' + new Date().getTime();
                    lightboxImg.style.filter = 'none';
                    
                    // Normal butonunu aktif yap
                    effectButtons.forEach(b => b.classList.remove('active'));
                    const normalBtn = Array.from(effectButtons).find(b => b.getAttribute('data-effect') === 'normal');
                    if (normalBtn) normalBtn.classList.add('active');
                    activeEffect = 'normal';

                    loadPhotos(); // Galeriyi yenile
                } else {
                    alert('Efekt uygulanamadı: ' + data.message);
                }
            } catch (error) {
                console.error('Efekt kaydetme hatası:', error);
                alert('Sunucu hatası oluştu.');
            } finally {
                saveEffectBtn.disabled = false;
                saveEffectBtn.innerHTML = originalText;
            }
        });
    }

    async function deletePhoto(filename) {
        if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return;
        try {
            const response = await fetch(`/delete_photo/${filename}`, { method: 'POST' });
            const data = await response.json();
            if (data.status === 'success') {
                closeLightbox();
                loadPhotos(); // Galeriyi güncelle
            } else {
                alert('Fotoğraf silinemedi: ' + data.message);
            }
        } catch (error) {
            console.error('Silme hatası:', error);
        }
    }

    if (lightboxDeleteBtn) {
        lightboxDeleteBtn.addEventListener('click', () => {
            if (activePhotoFilename) {
                deletePhoto(activePhotoFilename);
            }
        });
    }

    /**
     * Galeriyi Yükle ve Oluştur
     */
    async function loadPhotos() {
        const gallery = document.getElementById('photo-gallery');
        if (!gallery) return;

        try {
            const response = await fetch('/list_photos');
            const data = await response.json();

            gallery.innerHTML = '';

            if (!data.photos || data.photos.length === 0) {
                gallery.innerHTML = '<span class="no-photos-msg" style="color: var(--text-muted); font-size: 13px;">Henüz fotoğraf çekilmedi.</span>';
                return;
            }

            data.photos.forEach(photo => {
                const item = document.createElement('div');
                item.className = 'gallery-photo-item';
                item.setAttribute('data-url', photo.url);
                item.innerHTML = `
                    <img src="${photo.url}" alt="Captured Photo">
                    <span class="gallery-photo-badge">Zamanlayıcı</span>
                    <button class="gallery-photo-delete-icon" title="Fotoğrafı Sil">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                `;

                // Fotoğrafa tıklayınca Lightbox aç
                item.querySelector('img').addEventListener('click', () => {
                    openLightbox(photo.url, photo.timestamp);
                });

                // Silme butonuna tıklayınca direkt sil
                item.querySelector('.gallery-photo-delete-icon').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deletePhoto(photo.filename);
                });

                gallery.appendChild(item);
            });
        } catch (error) {
            console.error('Fotoğraflar yüklenemedi:', error);
        }
    }

    /**
     * İstatistik güncellemesi ve Başparmak takibi
     */
    const faceExpressionVal = document.getElementById('face-expression-val');
    const detectedObjectsVal = document.getElementById('detected-objects-val');
    const liveHandsVal = document.getElementById('live-hands-val');
    const liveFingersVal = document.getElementById('live-fingers-val');
    const liveHandTypeVal = document.getElementById('live-hand-type-val');
    const liveFacesVal = document.getElementById('live-faces-val');
    const liveExpressionVal = document.getElementById('live-expression-val');

    async function updateStats() {
        try {
            const response = await fetch('/stats');
            const data = await response.json();

            if (data.status === 'active') {
                document.querySelector('.status-dot').classList.add('active');
            }

            // Yüz ifadesini güncelle
            if (data.face_expression && faceExpressionVal) {
                faceExpressionVal.textContent = data.face_expression;
            }

            // Algılanan nesneleri güncelle
            if (detectedObjectsVal) {
                if (data.detected_objects && data.detected_objects.length > 0) {
                    const uniqueObjects = [...new Set(data.detected_objects)];
                    detectedObjectsVal.textContent = uniqueObjects.join(', ');
                } else {
                    detectedObjectsVal.textContent = 'Hiçbiri';
                }
            }

            // Canlı Takip İstatistiklerini güncelle
            if (liveHandsVal) liveHandsVal.textContent = data.hand_count !== undefined ? data.hand_count : '0';
            if (liveFingersVal) liveFingersVal.textContent = data.total_fingers !== undefined ? data.total_fingers : '0';
            if (liveHandTypeVal) liveHandTypeVal.textContent = data.hand_types || 'Hiçbiri';
            if (liveFacesVal) liveFacesVal.textContent = data.face_count !== undefined ? data.face_count : '0';
            if (liveExpressionVal) liveExpressionVal.textContent = data.face_expression || 'Normal';

            // Başparmak Yukarı (👍) Hareketi algılandıysa geri sayımı başlat
            if (data.thumbs_up_detected) {
                startCountdown();
            }
        } catch (error) {
            console.log('Stats güncellenemedi');
        }
    }

    function triggerShutterFlash() {
        const flash = document.getElementById('shutter-flash');
        if (flash) {
            flash.classList.add('flash');
            setTimeout(() => {
                flash.classList.remove('flash');
            }, 100);
        }
    }

    // Başlangıçta fotoğrafları listele
    loadPhotos();

    // Her 1 saniyede bir istatistikleri güncelle
    setInterval(updateStats, 1000);
    updateStats();

    // Baslangic mesaji
    console.log('El Takip Uygulamasi baslatildi');
    console.log('Klavye kisayollari: 1-6 filtreler, R sifirlama');
});
