# Gerçek Zamanlı El Hareketleri ve Yüz İfadesi Analiz Platformu (GestureFlow AI)

Bu proje; derin öğrenme ve bilgisayarlı görü (Computer Vision) tekniklerini kullanarak web kamerası üzerinden eş zamanlı el eklemleri takibi, yüz ifadesi (mimik) analizi ve nesne algılama gerçekleştiren yapay zeka destekli interaktif bir web platformudur.

Kullanıcılar el işaretleriyle (👍) temassız fotoğraf çekebilir, çekilen fotoğraflara filtreler uygulayıp kaydedebilir ve gerçek zamanlı takip istatistiklerini panel üzerinden canlı izleyebilir.

---

## 🚀 Öne Çıkan Özellikler

*   **Temassız Kamera Tetikleme (Thumbs Up 👍):** Kameraya karşı yapılan Başparmak Yukarı işareti algılandığında 2 saniyelik görsel bir geri sayım başlar ve otomatik fotoğraf çekilir.
*   **Gerçek Zamanlı İstatistik Paneli:** 
    *   **El Takibi:** Aktif el sayısı, açık parmak sayısı ve sağ/sol el ayrımı.
    *   **Yüz ve Mimik Analizi:** Aktif yüz sayısı ve birincil yüz ifadesi (*Mutlu, Şaşkın, Üzgün, Normal*).
    *   **Nesne Algılama:** Kadraja giren günlük nesnelerin (*telefon, bardak, bilgisayar vb.*) tespiti.
*   **Canlı Görüntü Filtreleri:** Kamera yayınına anlık olarak uygulanabilen filtreler (*Gri Ton, Sepia, Negatif, Bulanık, Kontrast*).
*   **Fotoğraf Galerisi ve Detay İnceleme (Lightbox):** Çekilen fotoğrafların tarihe göre listelendiği, tıklanarak detaylı incelenebildiği ve silinebildiği arayüz.
*   **Fotoğraf Efekt Editörü (Post-Editing):** Çekilen fotoğraflara detay ekranında sonradan filtreler (*Sepia, Gri Ton, Negatif, Bulanık, Sıcak, Soğuk*) uygulayıp kalıcı olarak diske kaydetme.
*   **30 FPS Performans Optimizasyonu:**
    *   Yapay zeka modellerine gönderilen kareler `320x180` çözünürlüğe ölçeklenerek CPU yükü azaltılmıştır.
    *   **Kare Atlama ve Önbellekleme (Frame Skipping Cache):** El takibi 2, yüz mesh takibi 4 ve nesne algılama 8 karede bir çalışacak şekilde paralel işlenerek pürüzsüz 30 FPS görüntü hızı elde edilmiştir.
    *   **Thread-Safe Bellek Yönetimi:** Fotoğraf kaydetme anında OpenCV kamera kilitlenmelerini önlemek için iş parçacığı korumalı (thread-safe) bellek önbelleği kullanılmıştır.

---

## 🛠️ Kullanılan Teknolojiler

*   **Backend:** Python 3.12, Flask, OpenCV (Görüntü İşleme), Multithreading
*   **AI / Machine Learning:** MediaPipe Tasks API (Hands, Face Landmarker, Object Detector)
*   **Frontend:** HTML5 (Semantik Arayüz), CSS3 (Modern Glassmorphism, Grid Layout), Vanilla JavaScript

---

## 📦 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları uygulayabilirsiniz:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/betulcelike/Gercek-Zamanli-El-Hareketleri-ve-Yuz-ifadesi-Analiz-Platformu.git
cd Gercek-Zamanli-El-Hareketleri-ve-Yuz-ifadesi-Analiz-Platformu
```

### 2. Sanal Ortam Oluşturun ve Aktifleştirin
```bash
python -m venv venv
# Windows için:
venv\Scripts\activate
# macOS/Linux için:
source venv/bin/activate
```

### 3. Gerekli Kütüphaneleri Yükleyin
```bash
pip install -r requirements.txt
```

### 4. Uygulamayı Başlatın
```bash
python app.py
```
*Uygulama başlatıldığında tarayıcınızda otomatik olarak `http://127.0.0.1:5000` adresi açılacaktır.*

---

## 📂 Proje Yapısı

```text
├── app.py                  # Flask Sunucusu ve Yapay Zeka İşleme Döngüsü
├── requirements.txt        # Gerekli Python Paketleri
├── .gitignore              # Git Takip Dışı Dosya Listesi (venv, modeller, vb.)
├── README.md               # Proje Açıklama Dosyası
├── static/
│   ├── captured/           # Çekilen Fotoğrafların Kaydedildiği Dizin
│   ├── style.css           # Modern Yüzen/Sabit Panel CSS Tasarımları
│   └── script.js           # AJAX İstekleri, Lightbox ve Galeri Etkinlikleri
└── templates/
    └── index.html          # İki Sütunlu Minimalist Arayüz Tasarımı
```

---

## 🛡️ Lisans
Bu proje eğitim ve kişisel gelişim amacıyla geliştirilmiştir. Ticari olmayan amaçlarla serbestçe kullanılabilir ve geliştirilebilir.
