# Borang Digital OHU/SIS-1 (Sharps Injury Surveillance)

Borang digital 4 halaman yang meniru reka letak rasmi **OHU/SIS-1 (Epidemiology Section)** Kementerian Kesihatan Malaysia dan menghantar kesemua **52 lajur data** terus ke dalam Google Sheets mengikut format **WEHU Sheet 1**.

## Ciri-Ciri Utama
- **Reka Letak Rasmi 4 Halaman (A4):** Sepadan dengan borang cetak rasmi KKM (`1/4` hingga `4/4`) termasuk mod cetakan/simpanan PDF (`Ctrl+P` / butang **Cetak / PDF**).
- **Kotak Digit & Pilihan Interaktif (`*`):** Kotak digit auto-maju bagi NRIC, umur, tarikh, dan tempoh perkhidmatan, serta klik untuk memotong pilihan bertanda `*` (*delete where is not applicable*).
- **Integrasi Google Sheets (52 Lajur):** Menghantar rekod terus ke Google Sheet melalui Google Apps Script Web App (`Code.gs`), lengkap dengan perlindungan angka sifar hadapan (`0`) untuk NRIC dan nombor telefon.

## Cara Menjalankan Secara Tempatan (Localhost)
Jalankan pelayan PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
```
Kemudian buka `http://localhost:8080` di pelayar web.

## Hos Statik (GitHub Pages)
Projek ini juga menyokong pengehosan statik secara terus (contohnya **GitHub Pages**) tanpa memerlukan `server.ps1` kerana `app.js` berhubung terus dengan URL Google Apps Script Web App apabila dibuka di luar `localhost`.
