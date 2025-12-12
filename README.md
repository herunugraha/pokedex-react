⭐ Pokédex – React + TailwindCSS + PokeAPI

Aplikasi Pokédex modern dengan UI responsif, animasi halus, loader interaktif, dan detail Pokémon lengkap — terintegrasi langsung dengan PokeAPI. Dibangun dengan React, TailwindCSS, serta custom SVG Pokéball Loader + Progress Bar untuk pengalaman pengguna yang lebih imersif.

🚀 Fitur Utama

🔎 1. Pencarian Global Pokémon

•	Cari Pokémon berdasarkan nama atau ID.

•	Fitur pencarian memanfaatkan seluruh data dari PokeAPI (lebih dari 1000 Pokémon).


📋 2. Daftar Pokémon dengan Pagination

•	Menampilkan list Pokémon dengan card berwarna berdasarkan tipe.

•	Terdapat infinite pagination atau load more.


🌀 3. Loader Animasi Pokéball + Progress Bar

•	Gambar Pokémon dimuat menggunakan XHR Blob Loader sehingga progress bar real-time dapat ditampilkan.

•	Pokéball SVG berputar memberikan efek visual profesional.


🧾 4. Detail Pokémon Sangat Lengkap

•	Modal detail menampilkan:

  •	Gambar resolusi tinggi (artwork resmi).
  
  •	Tipe Pokémon dengan badge warna khusus.
  
  •	Tinggi & berat.
  
•	Abilities.

•	Base stats dengan indikator persentase dan warna sesuai kategori.

🔊 5. Suara (Cry) Pokémon

•	Mengambil audio cry dari repository resmi PokeAPI.

•	Dilengkapi tombol mute, replay, dan indikator playing.


🎨 6. UI & UX Modern

•	Responsive untuk mobile, tablet, dan desktop.

•	Tone warna mengikuti tipe Pokémon.

•	Smooth animation & transition.

•	Modal fullscreen di mobile, compact di desktop.


🖼️ Preview UI

<img width="1090" height="852" alt="image" src="https://github.com/user-attachments/assets/85984795-3ed3-4a40-b6ce-8ba3d7603efa" />


🛠️ Tech Stack

•	React – UI Component Architecture

•	Tailwind CSS – Utility-first styling

•	React Router – Navigasi halaman

•	PokeAPI – Data Pokémon (sprite, stats, cry audio)

•	XMLHttpRequest Blob Loader – Loader gambar + progress bar

•	SVG Pokéball Animation – Interaktif & ringan

⚙️ Cara Menjalankan Secara Lokal

1️⃣ Clone repository

git clone 

cd pokedex

2️⃣ Install dependencies

npm install


3️⃣ Jalankan aplikasi

npm start



🎯 Tujuan Proyek

•	Proyek ini dibuat sebagai:

•	Latihan integrasi API dalam aplikasi frontend modern.

•	Studi kasus UI/UX responsif dengan animasi interaktif.


💡 Pengembangan Lanjutan (Opsional)

•	Menambahkan fitur Favorites (localStorage).

•	Menampilkan evolution chain Pokémon.

•	Tab Moves dan deskripsi lengkap dari PokeAPI.

•	Mode Dark Theme.
•	Deploy ke Vercel / Netlify dengan CI/CD.
