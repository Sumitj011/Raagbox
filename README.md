# 🎧 RaagBox

Desi radio, genre by genre. Genre chuno, play dabao, koi signup nahi.

RaagBox ek single-page website hai jo YouTube playlists ko radio stations ki tarah chalati hai: Bollywood, Punjabi, Ghazal aur apne khud ke mixes. Isme synced lyrics, sleep timer, theater mode aur Google login ke saath cloud sync bhi hai.

> Made with ♥ by Spirit

---

## Features

- **Stations:** har station ek YouTube playlist hai. Random gaane se shuru hota hai, shuffle ON/OFF kar sakte ho.
- **All Shuffle:** sab stations ko mila ke ek mix. Next dabane par ya gaana khatam hone par doosri playlist par hop karta hai.
- **Lyrics:** [lrclib.net](https://lrclib.net) se. Synced lyrics line-by-line glow karte hain, sync-less lyrics scroll hote hain. Sync galat ho to `−3s / −0.5s / +0.5s / +3s` buttons se theek karo. Punjabi (Gurmukhi) lyrics Hinglish mein dikhte hain.
- **Favorites aur Recently played.**
- **Sleep timer:** 5 se 60 minute, ya "End of this song".
- **Theater mode:** video chhupa ke sirf wallpaper dikhata hai.
- **Manage panel:** station ka naam, rang aur playlist badlo, naye stations jodo.
- **Export / Import code:** ek device ke stations ka code copy karke doosre device par paste karo, login ke bina.
- **Login (optional):** Google se login karo to stations, favorites aur recent cloud mein save hote hain aur har device par dikhte hain.
- **Install app (PWA / APK):** phone par app ki tarah install ho sakta hai.

---

## Files

| File | Kaam |
|---|---|
| `index.html` | Poori site (HTML, CSS, JS ek hi file mein) |
| `wallpaper.jpg` | Background painting |
| `manifest.json` | App ka naam, rang aur icons (install ke liye) |
| `sw.js` | Service worker: site ko cache karta hai |
| `icon-192.png`, `icon-512.png` | App icons |

Saari files **same folder (root)** mein honi chahiye. Kisi subfolder mein mat rakho.

---

## Local par chalana

`file://` se site khologe to YouTube embed aur login kaam nahi karenge. Local server chalao:

```bash
cd Raagbox
python -m http.server 8000
```

Phir browser mein `http://localhost:8000` kholo.

---

## Stations badalna

`index.html` mein `DEFAULT_STATIONS` dhundo:

```js
const DEFAULT_STATIONS = [
  { en: "Punjabi", hi: "ਪੰਜਾਬੀ", color: "#E0457B", playlist: "PLxxxxxxxxxxxx" },
  ...
];
```

- `playlist` mein YouTube playlist ka poora link ya sirf ID (`PL...`) daalo.
- Playlist **public ya unlisted** honi chahiye, private nahi.
- Site par Manage panel se kiye changes sirf us browser mein (ya login karke us account mein) rehte hain. Sabke liye permanent karna ho to Manage mein **Copy config** dabao aur `DEFAULT_STATIONS` mein paste kar do.

---

## Deploy karna

Ye ek static site hai, to kahin bhi host ho sakti hai: GitHub Pages, Netlify ya Vercel. Repo ki saari files root mein rakho aur deploy karo.

Naya version deploy karne par `sw.js` mein cache ka naam badlo, warna phone par purana version dikh sakta hai:

```js
const CACHE = "raagbox-v2";   // v3, v4 ... karte jao
```

Uske baad **Ctrl+Shift+R** se refresh karo.

---

## Login aur cloud sync (Firebase)

Ye optional hai. `FIREBASE_CONFIG` khaali ho to Login button dikhta hi nahi aur site normal chalti hai.

Ek baar ka setup (sirf site ke owner ko):

1. [console.firebase.google.com](https://console.firebase.google.com) par project banao.
2. **Authentication** mein Google login enable karo.
3. **Firestore Database** banao (production mode).
4. Firestore ke **Rules** mein ye paste karke Publish karo. Isse har user sirf apna data padh-likh sakta hai:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
5. Project settings mein Web app register karo aur `apiKey`, `authDomain`, `projectId`, `appId` ko `index.html` ke `FIREBASE_CONFIG` mein daalo.
6. **Authentication, Settings, Authorized domains** mein apni site ka domain jodo (jaise `sumitj011.github.io` ya `raagbox-chi.vercel.app`).

Baaki users ko kuch setup nahi karna, bas Login dabana hai. Firebase ki `apiKey` secret nahi hoti, use code mein rakhna theek hai. Asli suraksha Firestore Rules se aati hai, isliye wo zaroor lagao.

**Privacy:** login karne par user ke stations, playlist links, favorites aur recent tumhare Firebase project mein save hote hain. Site par iski ek line zaroor likho.

---

## Phone par install karna

**Chrome (Android):** site kholo, menu mein **Install app** ya **Add to Home screen**.

**APK banana:**
1. Upar wali saari files repo mein hon aur site live ho.
2. [pwabuilder.com](https://www.pwabuilder.com) par site ka link daalo.
3. **Package for stores, phir Android, phir APK** chuno aur zip download karo.
4. Zip mein jo signing key hai use sambhal ke rakho, update ke liye wahi chahiye.
5. APK phone par install karo ("Unknown sources" allow karna padega).

App site ka live version kholti hai, to site update karne par APK dobara nahi banana padta.

---

## Offline kya chalta hai

| Chalega | Nahi chalega |
|---|---|
| App khulna (page, wallpaper, icons) | **Gaane** (YouTube se stream hote hain) |
| Stations, favorites, recent dikhna | Lyrics (lrclib chahiye) |
| Buttons, drawer, Manage panel | Login aur cloud sync |
| | Google Fonts aur Punjabi to Hinglish conversion |

Pehli baar app online khulni chahiye, tabhi offline ke liye cache banta hai.

---

## Jaanne wali limits

- **Background playback:** screen lock ya doosri app kholne par YouTube ka player aksar ruk jaata hai. Ye YouTube embed ki limit hai, isse app theek nahi kar sakti.
- **YouTube terms:** theater mode mein video chhupa rehta hai aur sirf audio chalta hai, jo YouTube ke embed terms ke khilaaf ho sakta hai. Apne use ke liye theek hai, par site ko bahut public ya Play Store par daalne se pehle ye socho.
- **Lyrics:** lrclib community database hai. Kuch gaanon ke lyrics wahan hote hi nahi, adhoore hote hain, ya synced nahi hote. Aise gaano mein code poora version nahi bana sakta.
- **Do devices par ek saath changes:** jo aakhri baar save hua wahi bachta hai. Naye changes ke liye doosre device par refresh karna padta hai.

---

## Shortcuts

| Key | Kaam |
|---|---|
| `Space` | Play / Pause |
| `→` | Agla gaana |
| `←` | Pichla gaana |
| `Esc` | Drawer, panel aur menu band |

---

## Credits

- Gaane: YouTube
- Lyrics: [lrclib.net](https://lrclib.net)
- Gurmukhi se Hinglish: [gurmukhi-utils](https://www.npmjs.com/package/gurmukhi-utils)
- Fonts: Yatra One, Mukta, Noto Sans Gurmukhi (Google Fonts)
- Login aur sync: Firebase
