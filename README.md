# gameLibJs
Library Game Javascript  

sederhana, berbasis canvas 2d. Tanpa menggunakan framework luar. Untuk menangani sentuhan, drag, dan joystick.  
Dibuat untuk mempermudah pembuatan game sederhana berbasis web.  
Fitur :
1. multitouch
2. joystick
3. deteksi bentuk
4. auto reset saat alert
5. Collision
6. Movement
7. Render objek dan gambar
8. animasi


**Cara pemasangannya.**  
Ada beberapa cara untuk pemasangannya:
1. Install keempat library yang diperlukan seperti:
   actor.js
   physics.js
   sprite.js
   joystick.js

   lalu di dalam skrip html nya, masukkan seperti ini di tag body.
   ```html
   <script src="actor.js"></script>
   <script src="joystick.js"></script>
   <script src="physics.js"></script>
   <script src="sprite.js"></script>
   ```
   Cara ini agar bisa memilih langsung mana yang diperlukan, seperti, jika game tidak memerlukan JoyStick, maka hanya install 3 saja, yaitu
   actor.js
   physics.js
   sprite.js

2. Cara mudah dan langsung, install file yang bernama 'gameLib.js' saja yang isinya sudah mengandung keempat library. Cara memakai nya tinggal
   ```html
   <script src="gameLib.js"></script
   ```

3. Pakai cdn, tidak perlu install.
---

## 1. Inisialisasi & Pengaturan Canvas

Sebelum membuat objek atau merender ke layar, hubungkan canvas HTML Anda ke pustaka ini.

```javascript
// Menghubungkan ID Canvas HTML ke pustaka
addCanvasToLib('canvasGame');

```

---

## 2. Manajemen Elemen/Objek

Elemen adalah objek utama dalam gim (pemain, musuh, rintangan, dll.).

### `createElement(object)`

Menambahkan elemen baru ke dalam engine.

```javascript
// Contoh Objek Lingkaran
createElement({
  name: "player",
  type: "circle",
  x: 100,
  y: 100,
  r: 20,          // Jari-jari (radius)
  drag: true,      // Dapat digeser/drag
  border: true,    // Punya batas collision
  click: () => console.log("Player diklik!")
});

// Contoh Objek Persegi Panjang
createElement({
  name: "kotak",
  type: "rect",
  x: 300,
  y: 200,
  w: 60,          // Width
  h: 40,          // Height
  sudut: 45,       // Rotasi dalam derajat
  border: true
});

```

### Properti Lainnya:

* `editProp(name, prop, val)`: Mengubah nilai properti dari objek tertentu.
* `getProp(name, prop)`: Mengambil nilai properti dari objek tertentu.
* `deleteElement(name)`: Menghapus objek berdasarkan nama.

---

## 3. Sistem Interaksi & Drag

Engine ini sudah mendukung *Pointer Event* & *Touch Event* secara otomatis (termasuk multi-touch).

### Event Global Klik

```javascript
globalClick('click', () => {
  console.log("Layar disentuh/diklik!");
});

globalClick('unclick', () => {
  console.log("Sentuhan/klik dilepas!");
});

```

---

## 4. Sistem Joystick

Engine ini menyediakan komponen Joystick bawaan untuk mengontrol objek secara analog.

### Membuat Joystick: `createJoyStick(x, y, r)`

```javascript
// Membuat joystick di koordinat x:100, y:300 dengan jari-jari 40
let joy = createJoyStick(100, 300, 40);

// Menghubungkan Joystick dengan objek "player"
editJoyStick("joyStick0", "attach", "player");

// Mengatur kecepatan pergerakan joystick
editJoyStick("joyStick0", "velocity", { vx: 5, vy: 5 });

// Mengubah tampilan/style Joystick
editJoyStick("joyStick0", "style", {
  'bg-color': 'rgba(0, 0, 0, 0.5)',
  'color': 'red',
  'border': 3
});

```

### Rendering Joystick

Panggil fungsi `renderJoyStick()` di dalam *game loop* Anda:

```javascript
renderJoyStick("joyStick0");

```

---

## 5. Deteksi Benturan & Fisika (Collision & Movement)

### Deteksi Benturan: `isCollision(objek1, objek2, mode)`

Mendukung benturan antara **Circle vs Circle**, **Circle vs Rect**, dan **Rect vs Rect** (termasuk persegi yang diputar menggunakan algoritma SAT).

```javascript
// Cek apakah dua objek saling bersentuhan (mengembalikan boolean)
let bentrok = isCollision("player", "musuh", "check");

// Mengembalikan koordinat dorongan [pushX, pushY] untuk memisahkan objek yang tumpang tindih
let push = isCollision("player", "musuh", "resolve");

```

### Pembaruan Pergerakan & Gravitasi: `updateMovement()`

Panggil `updateMovement()` di dalam *game loop* untuk memproses posisi objek yang memiliki kecepatan (`vx`, `vy`) atau gravitasi.

```javascript
// Mengatur nilai gravitasi global (default: 9.8)
editGravitation(9.8);

// Berikan gravitasi/kecepatan pada elemen
editProp("player", "gravitasi", true);
editProp("player", "vy", -5); // Melompat ke atas

```

---

## 6. Sistem Rendering, Gambar & Animasi

### 1. Rendering Bentuk Dasar

```javascript
// Merender persegi sederhana tanpa perlu membuat elemen
renderRect(x, y, width, height, sudut, axisX, axisY, warna);

// Merender elips/lingkaran sederhana
renderEllipse(x, y, radiusA, radiusB, sudut, warna);

// Merender objek yang sudah dibuat via createElement
renderObjek("player", "blue");

```

### 2. Rendering Gambar & Spritesheet

```javascript
// Memuat gambar/spritesheet (link, namaLib, jumlahBaris, jumlahKolom)
addImgToLib('hero_spritesheet.png', 'heroImg', 4, 4);

// Merender frame spesifik dari gambar ke objek
// renderImg(namaGambar, namaObjek, indexFrame, flipX, flipY)
renderImg('heroImg', 'player', 0, false, false);

```

### 3. Sistem Animasi Spritesheet

```javascript
// Buat urutan frame animasi
// createAnimation(namaAnimasi, namaGambar, [array_index_frame])
createAnimation('walkRight', 'heroImg', [0, 1, 2, 3]);

// Panggil di game loop untuk menjalankan animasi
// renderAnimation(namaAnimasi, namaObjek, intervalDetik, flipX, flipY)
renderAnimation('walkRight', 'player', 0.1, false, false);

```

---

## 7. Contoh Penggunaan Lengkap

Berikut adalah contoh implementasi sederhana dari setup dasar hingga *game loop*:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Demo GameLib1x</title>
  <style>
    canvas { background: #eee; display: block; margin: 0 auto; }
  </style>
</head>
<body>

  <canvas id="canvasGame" width="800" height="400"></canvas>

  <!-- Load script library Anda -->
   <script src="actor.js"></script>
    <script src="joystick.js"></script>
    <script src="physics.js"></script>
    <script src="sprite.js"></script>
    <!--Atau daripada satu-satu, langsung jadi satu saja, src="gameLib.js"-->
  <script>
    // 1. Inisialisasi Canvas
    addCanvasToLib("canvasGame");

    // 2. Buat Elemen Player
    createElement({
      name: "player",
      type: "circle",
      x: 200,
      y: 200,
      r: 25,
      border: true
    });

    // 3. Buat Elemen Rintangan
    createElement({
      name: "wall",
      type: "rect",
      x: 400,
      y: 200,
      w: 100,
      h: 100,
      sudut: 0,
      border: true,
      static: true
    });

    // 4. Buat Joystick
    createJoyStick(100, 300, 50);
    editJoyStick("joyStick0", "attach", "player");

    // 5. Game Loop
    function gameLoop() {
      const canvas = document.getElementById("canvasGame");
      const ctx = canvas.getContext("2d");

      // Clear Canvas setiap frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update Fisika & Pergerakan
      updateMovement();

      // Render Objek
      renderObjek("wall", "grey");
      renderObjek("player", "dodgerblue");

      // Render Joystick
      renderJoyStick("joyStick0");

      requestAnimationFrame(gameLoop);
    }

    // Jalankan Game Loop
    gameLoop();
  </script>
</body>
</html>

```
