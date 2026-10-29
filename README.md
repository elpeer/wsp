# WSP – Women Sport Power

אב טיפוס mobile-first לאתר החדש של [wsp-womensportpower.com](https://www.wsp-womensportpower.com).

- `index.html` – קובץ יחיד (HTML/CSS/JS), RTL, מצב בהיר/כהה.
- התוכן (פודקאסט, תכניות, תתי־קטגוריות, קצרים) מוגדר באובייקט `P` בתוך הסקריפט, לפי מזהי YouTube.
- תמונות הכרטיסים נלקחות מפריים פנימי של הסרטון (`maxres2` → `sd2` → `hq2` → `mq2` → `hqdefault`).
- ניתוב לפי hash: `#home`, `#programs`, `#p-<program>`, `#v-<youtubeId>`, `#search`, `#about`.

הרצה מקומית: לפתוח את `index.html` בדפדפן, או `npx serve .`

## PWA, התקנה והתראות
- `manifest.webmanifest`, `sw.js` (מטמון לעבודה בלי קליטה + קבלת Push), אייקונים ב־`icons/`.
- מרכז התראות (פעמון) עם בחירת נושאים, ומדריך התקנה ויזואלי לאייפון / אנדרואיד / מחשב.
- **כדי ששליחת Push תעבוד בפועל** צריך שרת: ליצור מפתחות VAPID (`npx web-push generate-vapid-keys`),
  להכניס את המפתח הציבורי ל־`PUSH.vapidPublicKey` וכתובת שמירת מנויים ל־`PUSH.subscribeUrl` ב־`index.html`.
  השרת שומר את ה־subscription + הנושאים, ושולח הודעות בפורמט JSON: `{title, body, url, image, tag}`.
- באייפון התראות עובדות רק אחרי התקנה למסך הבית (iOS 16.4+). ההתקנה וה־Service Worker דורשים HTTPS.
