# WSP – Women Sport Power

אב טיפוס mobile-first לאתר החדש של [wsp-womensportpower.com](https://www.wsp-womensportpower.com).

- `index.html` – קובץ יחיד (HTML/CSS/JS), RTL, מצב בהיר/כהה.
- התוכן (פודקאסט, תכניות, תתי־קטגוריות, קצרים) מוגדר באובייקט `P` בתוך הסקריפט, לפי מזהי YouTube.
- תמונות הכרטיסים נלקחות מפריים פנימי של הסרטון (`maxres2` → `sd2` → `hq2` → `mq2` → `hqdefault`).
- ניתוב לפי hash: `#home`, `#programs`, `#p-<program>`, `#v-<youtubeId>`, `#search`, `#about`.

הרצה מקומית: לפתוח את `index.html` בדפדפן, או `npx serve .`
