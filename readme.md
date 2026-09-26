Sebelumnya kami selaku tim IT dari acara ACEFEST-2025 ingin menggucapkan terimakasih sebesar besarnya kepada seluruh pihat yang berpartisipasi dalam pembuatan dan pengembanggan website ujian ini.

Dan juga saya pribadi sebagai perwakilan dari tim IT ACEFEST 2025 ingin meminta maaf sebesar besarnya jika mana proses pembuatan dan pengembangan yang kami lakukan tidak bisa maksimal. Hal ini di akibatkan dari beberpaa faktor seperti minimnya waktu pengerjaan, waktu bimbingan dan tidak adanya contoh dari tahun tahun sebelumnya.

Website ini dibuat untuk kebutuhan ujian online ACEFEST 2025, dengan sistem yang berfokus pada kemudahan akses, keamanan data peserta, dan kelancaran proses ujian dalam satu waktu yang cukup banyak. Kami berusaha menyusun platform ini semaksimal mungkin dengan keterbatasan waktu dan referensi yang tersedia.

## Autor

Website ini sepenuhnya di buat oleh tim IT ACEFEST 2025 dan beberapa pihat terkait. Untuk license kami tidak menggunakan karena menurut saya pribadi ini masih jauh dari kata sempurna. Bila mana kalian ada masukkan atau hal lainnya silahkan di sampaikan langsung ke Autor.

## Tujuan Project

Project ini dibuat dengan tujuan utama untuk:

- mempermudah proses pendaftaran dan ujian online peserta
- menyimpan data peserta dan hasil ujian dengan sistem yang lebih terstruktur
- meminimalisir kebutuhan penggunaan server konvensional yang rumit
- memudahkan panitia dalam melakukan monitoring dan pengelolaan ujian
- menyediakan halaman admin dan halaman peserta dalam satu platform yang terintegrasi

## Software Requitements

Dalam pembuatan ini kami menggunakan beberapa api dari platform tertentu untuk mengatasi sistem backend yang rumit seperti:

1. Cloudflare
2. Google Drive
3. Node.js
4. Wrangler CLI
5. Cloudflare D1 Database
6. Cloudflare R2 Storage

Kami menggunakan Cloudflare untuk menyimpan seluruh data dari peserta lomba. Sistem yang kami buat sama seperti di MySQL, tetapi kami menggunakan database dari Cloudflare (D1 & R2) agar lebih fleksibel untuk kebutuhan berbasis serverless. Untuk skema lebih lanjut akan di jelaskan secara rinci di bawah.

Untuk Drive ini awalnya kami buat untuk menyimpan semua foto bukti transaksi dari pendaftaran. Fungsi ini dipakai agar data dokumentasi tetap aman dan rapi tanpa harus menyimpan semua file di server utama. Cara penggunaannya dan alur penyimpanan juga akan di jelaskan lebih lanjut di bawah.

## Fitur Utama

- halaman utama untuk informasi dan akses ujian
- halaman admin untuk pengelolaan data dan hasil ujian
- halaman peserta untuk proses pendaftaran dan pengerjaan soal
- sistem ujian berbasis web yang dapat diakses secara online
- penyimpanan data peserta berbasis cloudflare
- integrasi file hasil ujian dan dokumentasi bukti transaksi
- sistem modular yang memudahkan pengembangan ke depannya

## Struktur Folder

Berikut adalah struktur folder utama dari project ini beserta file-file yang ada di dalamnya.

### Root Project

- [Guide_setup.md](Guide_setup.md)
- [index.html](index.html)
- [index2.html](index2.html)
- [results.html](results.html)
- [admin-upload.html](admin-upload.html)
- [package.json](package.json)
- [package-lock.json](package-lock.json)
- [wrangler.toml](wrangler.toml)
- [readme.md](readme.md)
- [js.zip](js.zip)
- [PAI/](PAI/)
- [PAI.zip](PAI.zip)
- [ujian/](ujian/)
- [ujian.zip](ujian.zip)
- [src/](src/)
- [worker/](worker/)
- [css/](css/)
- [js/](js/)
- [exams/](exams/)
- [admin/](admin/)
- [pengumpulan_mhq.html](pengumpulan_mhq.html)
- [pengumpulan_mtq.html](pengumpulan_mtq.html)
- [pengumpulan_news_anchor.html](pengumpulan_news_anchor.html)
- [pengumpulan_story_telling.html](pengumpulan_story_telling.html)
- [__pengumpulan_desain_poster.html](__pengumpulan_desain_poster.html)
- [SURAT_INTEGRITAS_DAN_ORISINALITAS_DESAIN_POSTER.pdf](SURAT_INTEGRITAS_DAN_ORISINALITAS_DESAIN_POSTER.pdf)

### Folder [admin/](admin/)

- [admin/.htaccess](admin/.htaccess)
- [admin/index.html](admin/index.html)
- [admin/admin-upload.html](admin/admin-upload.html)

### Folder [css/](css/)

- [css/style.css](css/style.css)

### Folder [js/](js/)

- [js/auth.js](js/auth.js)
- [js/exam.js](js/exam.js)
- [js/results.js](js/results.js)
- [js/utils.js](js/utils.js)
- [js/video-submission.js](js/video-submission.js)

### Folder [src/](src/)

- [src/index.js](src/index.js)
- [src/index1.js](src/index1.js)

### Folder [worker/](worker/)

- [worker/schema.sql](worker/schema.sql)
- [worker/worker.js](worker/worker.js)

### Folder [exams/](exams/)

- [exams/index.html](exams/index.html)
- [exams/results.html](exams/results.html)
- [exams/akhir_exam.html](exams/akhir_exam.html)
- [exams/exam_html](exams/exam_html)
- [exams/exam--_lctp.html](exams/exam--_lctp.html)
- [exams/exam_lctp.html](exams/exam_lctp.html)
- [exams/exam_lctp_2.html](exams/exam_lctp_2.html)
- [exams/exam_olimpiade_ipa.html](exams/exam_olimpiade_ipa.html)
- [exams/exam_olimpiade_ips.html](exams/exam_olimpiade_ips.html)
- [exams/exam_olimpiade_math.html](exams/exam_olimpiade_math.html)
- [exams/exam_olimpiade_pai.html](exams/exam_olimpiade_pai.html)
- [exams/exam_olimpiade_pai_2.html](exams/exam_olimpiade_pai_2.html)
- [exams/exam_olimpiade_ujicoba.html](exams/exam_olimpiade_ujicoba.html)
- [exams/handwritten_submission.html](exams/handwritten_submission.html)
- [exams/ipaexam.html](exams/ipaexam.html)
- [exams/ipaexam_2.html](exams/ipaexam_2.html)
- [exams/ipsexam.html](exams/ipsexam.html)
- [exams/ipsexam_2.html](exams/ipsexam_2.html)
- [exams/lctpexam_2.html](exams/lctpexam_2.html)
- [exams/lpcasics.html](exams/lpcasics.html)
- [exams/lpccoklat.html](exams/lpccoklat.html)
- [exams/lpclemon.html](exams/lpclemon.html)
- [exams/mathexam.html](exams/mathexam.html)
- [exams/mathexam_2.html](exams/mathexam_2.html)
- [exams/paiexam_2.html](exams/paiexam_2.html)
- [exams/soal_ujicoba/](exams/soal_ujicoba/)
- [exams/soalipa/](exams/soalipa/)
- [exams/soalips/](exams/soalips/)
- [exams/soallctp/](exams/soallctp/)
- [exams/soalmath/](exams/soalmath/)
- [exams/soal_ujicoba.zip](exams/soal_ujicoba.zip)
- [exams/ujicobaexam.html](exams/ujicobaexam.html)
- [_index.html](_index.html)
- [__exam_olimpiade_ipa_2.html](__exam_olimpiade_ipa_2.html)
- [__exam_olimpiade_ips_2.html](__exam_olimpiade_ips_2.html)
- [__exam_olimpiade_math_2.html](__exam_olimpiade_math_2.html)
- [____exam_lctp.html](____exam_lctp.html)
- [____exam_olimpiade_ipa.html](____exam_olimpiade_ipa.html)
- [____exam_olimpiade_ips.html](____exam_olimpiade_ips.html)
- [____exam_olimpiade_math.html](____exam_olimpiade_math.html)
- [____exam_olimpiade_pai.html](____exam_olimpiade_pai.html)
- [____index.html](____index.html)

### Folder [PAI/](PAI/)

- [PAI/exam_olimpiade_pai.html](PAI/exam_olimpiade_pai.html)
- [PAI/paiexam.html](PAI/paiexam.html)

### Folder [ujian/](ujian/)

- [ujian/IPA/](ujian/IPA/)
- [ujian/IPS/](ujian/IPS/)
- [ujian/LCTP/](ujian/LCTP/)
- [ujian/MATH/](ujian/MATH/)

## Arsitektur Sistem Kerja

Kami di sini menggunakan sistem yang di sebut "serverless" atau bisa di bilang tanpa server. Kaami benar-benar hanya mengandalakan data base Cloudflare di sini. Apa yang membuat ini bisa menampung sekian ribu peserta dalam waktu yang bersamaan? jawabnnya ada di Cloudflare dan pihak hosting.

Tetapi Cloudflare disini memang berperan penting sebagai penyedia proxy untuk exam ini. Tanpa ada proxy ini maka web akan down karena banyaknya user yang mengakses di satu waktu yang bersamaan.

Sistem ini bekerja dengan memanfaatkan frontend yang ringan dan backend yang dijalankan melalui Cloudflare Worker. Data peserta, hasil ujian, dan keperluan validasi disimpan ke database D1, sedangkan file pendukung seperti foto bukti transaksi disimpan ke storage R2 atau Google Drive. Dengan pola seperti ini project ini dapat berjalan cukup efektif meskipun di sisi backend tidak menggunakan server konvensional yang komplek.

```
┌─────────────────────────────────────────────────────────┐
│                    CLOUDFLARE INFRASTRUCTURE            │
├─────────────────────────────────────────────────────────┤
│  Frontend (SPA)    │     Workers       │   D1 Database  │
│  - HTML/CSS/JS     │   - API Routes    │   - peserta    │
│  - React/Vue (opt) │   - Auth Logic    │   - results    │
│  - Static Assets   │   - Validation    │   - submissions│
│                    │   - Business Logic│                │
└─────────────────────────────────────────────────────────┘
         │                     │                  │
         └─────────────────────┴──────────────────┘
                        ↓
         (HTTPS via Cloudflare Proxy)
                        ↓
                   Student Devices
```

## Cara Menjalankan Project

Untuk menjalankan project ini, langkah yang biasa kami lakukan adalah:

1. pastikan Node.js sudah terinstall di komputer
2. buka folder project ini di terminal atau VS Code
3. jalankan perintah berikut:

```bash
npm install
npx wrangler dev
```

4. jika project ini sudah siap untuk di deploy, maka bisa lanjut dengan:

```bash
npm run deploy
```

Perlu diingat, konfigurasi environment dan database Cloudflare harus disesuaikan terlebih dahulu agar project ini bisa berjalan dengan benar di lingkungan masing-masing.

## Catatan Penting

- Project ini masih dalam tahap pengembangan dan perlu terus di update
- Masih ada beberapa bagian yang bisa diperbaiki dari sisi struktur, dokumentasi, dan optimasi performa
- Apabila ada masukkan, saran, atau kritik, kami siap menerima dengan terbuka
- kami berharap project ini dapat menjadi bahan pembelajaran dan referensi untuk pengembangan selanjutnya

Semoga website ini dapat bermanfaat, dan semoga proses pembuatan serta pengembangannya menjadi bekal yang berharga bagi tim IT ACEFEST 2025 dan semua pihak yang terlibat.

Terimakasih atas waktu, kerja keras, serta perhatian yang telah diberikan.

## Penutup

Website ini dibuat dengan penuh usaha, semangat, dan rasa tanggung jawab dari tim IT ACEFEST 2025. Kami menyadari bahwa masih banyak kekurangan yang ada, tetapi kami berharap semua proses yang sudah berjalan ini dapat memberikan manfaat yang besar bagi acara ACEFEST 2025 dan para peserta yang mengikuti ujian ini.

Jika mana kalian ada masukkan atau hal lainnya silahkan di sampaikan langsung ke Autor.

Terimakasih sebesar besarnya.

