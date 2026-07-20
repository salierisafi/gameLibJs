# gameLibJs
Library Game Javascript  

sederhana, berbasis canvas 2d. Tanpa menggunakan framework luar. Untuk menangani sentuhan, drag, dan joystick.  
Dibuat untuk mempermudah pembuatan game sederhana berbasis web.  
Fitur :
1. multitouch
2. joystick
3. deteksi bentuk
4. auto reset saat alert


Di bawah ini pakai AI

---

## 🛠️ Cara Penggunaan Library

### 1. Inisialisasi Canvas

Panggil fungsi ini di awal untuk mengaitkan library dengan elemen `<canvas>` di HTML kamu.

```javascript
// Hubungkan library ke Canvas dengan ID-nya
addCanvasToLib("myCanvas");

```

---

### 2. Membuat Elemen 2D

Gunakan `createElement()` untuk menambahkan objek ke dalam daftar yang bisa diinteraksi.

#### 🔹 Contoh 1: Karakter yang Dikontrol Joystick

```javascript
createElement({
  name: "hero",
  type: "circle",       // Opsi: "circle", "ellipse", atau "rect"
  x: 100,               // Posisi X awal
  y: 100,               // Posisi Y awal
  r: 20,                // Radius
  vx: 5,                // Kecepatan gerak X (opsional, default: 3)
  vy: 5,                // Kecepatan gerak Y (opsional, default: 3)
  dynamicAng: true,     // 🔄 Karakter otomatis berputar menghadap arah joystick
  border: true          // Menandai elemen punya batas benturan
});

```

#### 🔹 Contoh 2: Elemen/Tombol yang Bisa Digeser (Drag) & Diklik

```javascript
createElement({
  name: "tombolSetting",
  type: "rect",
  x: 300,
  y: 50,
  a: 40,                // Setengah lebar (width / 2)
  b: 20,                // Setengah tinggi (height / 2)
  sudut: 0,             // Rotasi awal (dalam derajat)
  drag: true,           // Bikin elemen bisa digeser pakai mouse/touch
  click: () => {
    console.log("Elemen diklik!");
  }
});

```

---

### 3. Memasang & Mengatur Virtual Joystick

#### 🔹 Langkah A: Buat & Sambungkan ke Karakter

```javascript
// 1. Buat Joystick di posisi (X: 100, Y: 300) dengan radius 40
createJoyStick(100, 300, 40);

// 2. Sambungkan joystick ("joyStick0") ke elemen ("hero")
editJoyStick("joyStick0", "attach", "hero");

```

#### 🔹 Langkah B: Kustomisasi Tampilan Joystick (Opsional)

```javascript
editJoyStick("joyStick0", "style", {
  "radius": 50,           // Ukuran joystick
  "bg-color": "black",    // Warna background
  "color": "red",         // Warna analog/bola joystick
  "bg-opacity": 50,       // Transparansi background (0-100)
  "opacity": 80           // Transparansi analog
});

```

#### 🔹 Langkah C: Tambahkan Aksi Berdasarkan Arah/Sudut (Opsional)

```javascript
// Jalankan fungsi saat joystick ditarik ke arah tertentu
editJoyStick("joyStick0", "isAngle", {
  From: 1.5,              // Sudut awal (dalam Radian)
  To: 3.0,                // Sudut akhir (dalam Radian)
  Run: () => {
    console.log("Joystick ditarik ke arah tertentu!");
  }
});

```

---

### 4. Menjalankan di Game Loop

Panggil fungsi `renderJoyStick()` di dalam *loop* utama aplikasi/game kamu.

```javascript
function gameLoop() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // 1. Bersihkan canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Gambar elemen kamu di sini...
  // (Gunakan getProp("namaElemen") untuk mengambil koordinat x, y, sudut terbaru)

  // 3. Render Joystick
  renderJoyStick("joyStick0");

  requestAnimationFrame(gameLoop);
}

// Jalankan game loop
gameLoop();

```

---

### 🔹 Helper Utility Tambahan

* **Ambil Data Terbaru Elemen:** `getProp("hero")` ➔ Mengembalikan properti `{x, y, r, sudut, ...}` terbaru setelah digerakkan/ditempatkan.
* **Ubah Properti Elemen:** `editProp("hero", "vx", 8)` ➔ Mengubah properti `vx` milik elemen "hero" menjadi 8.
