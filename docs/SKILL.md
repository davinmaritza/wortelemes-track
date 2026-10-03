---
name: hot-wheels-tracker-expert
description: Specialized instructions for building, styling, and integrating the Hot Wheels diecast collection tracker and showcase platform.
---

# Hot Wheels Tracker Domain Skill

Gunakan skill ini saat merancang, menulis kode, atau memodifikasi fitur di repositori **Wortelemes-Track**.

---

## 1. Domain Terminology Hot Wheels & Diecast
- **Casting**: Model cetakan mobil (contoh: *'69 Ford Mustang Boss 302*, *Nissan Fairlady Z*).
- **Tampo**: Decal / grafis sablon pada bodi mobil.
- **Carded vs Loose**: Kondisi diecast masih dalam blister/kemasan pabrik (*Carded*) vs sudah dibuka (*Loose*).
- **Mainline**: Lini reguler Hot Wheels (harga terjangkau).
- **Premium / Car Culture**: Lini bodi metal, base metal, dan ban karet (*Real Riders*).
- **RLC (Red Line Club)**: Edisi kolektor terbatas resmi Mattel Creations dengan cat spectraflame.
- **TH / STH**: *Treasure Hunt* & *Super Treasure Hunt* (varian langka dalam batch mainline dengan ban karet dan cat spectraflame).
- **Segment / Series Index**: Penomoran dalam 1 rilis set, misal `3/6` (*artinya mobil ke-3 dari 6 mobil dalam set Sunset Race*).

---

## 2. API Integration: Hot Wheels Fandom MediaWiki
Untuk fitur autocomplete dan autofill informasi diecast:

### Search Endpoint:
```http
GET https://hotwheels.fandom.com/api.php?action=opensearch&search={QUERY}&limit=8&format=json
```
Response format:
- `[0]`: query string
- `[1]`: array of titles (misal: `["Nissan Skyline", "Nissan Skyline GT-R (BNR34)"]`)
- `[3]`: array of URLs wiki

### Details & Thumbnail Endpoint:
```http
GET https://hotwheels.fandom.com/api.php?action=query&titles={PAGE_TITLE}&prop=pageimages|info&inprop=url&pithumbsize=600&format=json
```
Response format:
Ekstrak `query.pages[pageId].thumbnail.source` untuk URL gambar resmi diecast.

---

## 3. UI/UX Rules for Hot Wheels Showcase Aesthetic
1. **Background**: Dark minimal canvas (`bg-[#0c0d12]`) dengan card border lembut (`border-white/10`).
2. **Badges**:
   - RLC: Badge merah menyala (`bg-red-600/20 text-red-400 border border-red-500/30`)
   - STH/TH: Badge emas (`bg-amber-500/20 text-amber-300 border border-amber-500/30`)
   - Index Number: Badge bulat nomor biru seperti di app (`bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold`)
3. **Card Layout**:
   - Foto diecast di atas latar belakang kontras/transparan.
   - Nama model huruf kapital tebal (*bold uppercase*).
   - Baris badge info: `[1] (Index)` • `[2026]` • `[Series Name]` • `[Color]`.
   - Tombol interaksi cepat (+ / - qty, star favorite, direct WhatsApp order).
