// يولّد أيقونة التطبيق وشاشة البداية من تصميم SVG (يحتاج sharp، ويأتي مع @capacitor/assets)
// الفكرة: عملة ذهبية (الراتب والحسبة) يخرج منها سهم منحني للأعلى (التحويل للأهل)، على خلفية خضراء.
// المخرجات في resources/ بالأسماء التي يقرأها @capacitor/assets:
//   icon-only.png, icon-foreground.png, icon-background.png, splash.png, splash-dark.png
const path = require('path');
const sharp = require('sharp');

const OUT = __dirname;

const BG_DEFS = `
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#13805F"/>
    <stop offset="0.5" stop-color="#0F6A4F"/>
    <stop offset="1" stop-color="#094231"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.25" cy="0.2" r="0.6">
    <stop offset="0" stop-color="#FBBF24" stop-opacity="0.22"/>
    <stop offset="1" stop-color="#FBBF24" stop-opacity="0"/>
  </radialGradient>
  <pattern id="stripes" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="6" height="44" fill="#ffffff" fill-opacity="0.035"/>
  </pattern>`;

const MARK_DEFS = `
  <linearGradient id="coin" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FCD34D"/>
    <stop offset="0.55" stop-color="#F59E0B"/>
    <stop offset="1" stop-color="#C2410C"/>
  </linearGradient>
  <linearGradient id="coinInner" x1="1" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#FDE68A"/>
    <stop offset="1" stop-color="#D97706"/>
  </linearGradient>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#052e22" flood-opacity="0.45"/>
  </filter>`;

// الشعار مرسوم داخل مربع 1024 ومتمركز
const MARK = `
  <g filter="url(#shadow)">
    <!-- العملة -->
    <circle cx="448" cy="585" r="235" fill="url(#coin)"/>
    <circle cx="448" cy="585" r="182" fill="none" stroke="#FFFBEB" stroke-opacity="0.55" stroke-width="14"/>
    <circle cx="448" cy="585" r="150" fill="url(#coinInner)" fill-opacity="0.55"/>
    <!-- خطوط الحسبة داخل العملة -->
    <rect x="365" y="530" width="166" height="26" rx="13" fill="#FFFBEB" fill-opacity="0.92"/>
    <rect x="409" y="580" width="122" height="26" rx="13" fill="#FFFBEB" fill-opacity="0.75"/>
    <rect x="453" y="630" width="78" height="26" rx="13" fill="#FFFBEB" fill-opacity="0.6"/>
    <!-- سهم التحويل المنحني -->
    <path d="M585 445 C 640 360, 700 300, 785 262" fill="none" stroke="#FFFFFF" stroke-width="58" stroke-linecap="round"/>
    <path d="M688 236 L 806 252 L 760 362" fill="none" stroke="#FFFFFF" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- لمعة صغيرة -->
    <path d="M820 470 l 16 40 l 40 16 l -40 16 l -16 40 l -16 -40 l -40 -16 l 40 -16 z" fill="#FDE68A"/>
  </g>`;

function background(size) {
  return `
    <rect width="${size}" height="${size}" fill="url(#bg)"/>
    <rect width="${size}" height="${size}" fill="url(#stripes)"/>
    <rect width="${size}" height="${size}" fill="url(#glow)"/>`;
}

function svg(size, inner) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs>${BG_DEFS}${MARK_DEFS}</defs>${inner}</svg>`);
}

// يضع الشعار بحجم markSize في منتصف لوحة size
function centeredMark(size, markSize) {
  const scale = markSize / 1024;
  const offset = (size - markSize) / 2;
  return `<g transform="translate(${offset} ${offset}) scale(${scale})">${MARK}</g>`;
}

async function main() {
  // أيقونة كاملة (للأجهزة القديمة)
  await sharp(svg(1024, background(1024) + MARK)).png().toFile(path.join(OUT, 'icon-only.png'));
  // أيقونة تكيّفية: الشعار داخل المنطقة الآمنة (حوالي 62% من المساحة)
  await sharp(svg(1024, centeredMark(1024, 640))).png().toFile(path.join(OUT, 'icon-foreground.png'));
  await sharp(svg(1024, background(1024))).png().toFile(path.join(OUT, 'icon-background.png'));
  // شاشة البداية
  const splash = svg(2732, background(2732) + centeredMark(2732, 900));
  await sharp(splash).png().toFile(path.join(OUT, 'splash.png'));
  await sharp(splash).png().toFile(path.join(OUT, 'splash-dark.png'));
  console.log('تم توليد الأيقونة وشاشة البداية في resources/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
