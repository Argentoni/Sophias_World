import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = new URL("../public/assets/sprites/", import.meta.url).pathname;

const files = new Map([
  ["clothes/top-sky-heart.svg", clothing(`<path d="M178 268 Q256 228 334 268 L366 352 L326 374 L306 330 L306 438 L206 438 L206 330 L186 374 L146 352 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M256 333 C236 310 204 329 218 357 C228 377 256 392 256 392 C256 392 284 377 294 357 C308 329 276 310 256 333 Z" fill="#FFB6D5"/>`)],
  ["clothes/top-mint-ribbon.svg", clothing(`<path d="M174 270 Q256 232 338 270 L365 358 L324 378 L305 334 L305 438 L207 438 L207 334 L188 378 L147 358 Z" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M230 314 L256 335 L282 314 L282 372 L256 352 L230 372 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="4"/>`)],
  ["clothes/top-sunflower.svg", clothing(`<path d="M176 270 Q256 232 336 270 L362 355 L322 374 L303 333 L303 438 L209 438 L209 333 L190 374 L150 355 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><circle cx="256" cy="348" r="21" fill="#D8AA82"/><g fill="#FFB6D5"><ellipse cx="256" cy="313" rx="11" ry="25"/><ellipse cx="256" cy="383" rx="11" ry="25"/><ellipse cx="221" cy="348" rx="25" ry="11"/><ellipse cx="291" cy="348" rx="25" ry="11"/></g>`)],
  ["clothes/top-rainbow.svg", clothing(`<path d="M176 270 Q256 232 336 270 L362 355 L322 374 L303 333 L303 438 L209 438 L209 333 L190 374 L150 355 Z" fill="#F8D7E8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M214 365 A42 42 0 0 1 298 365" fill="none" stroke="#FFB6D5" stroke-width="10"/><path d="M228 365 A28 28 0 0 1 284 365" fill="none" stroke="#A0D8F0" stroke-width="10"/><path d="M242 365 A14 14 0 0 1 270 365" fill="none" stroke="#FFE8A8" stroke-width="10"/>`)],
  ["clothes/bottom-denim.svg", clothing(`<path d="M204 416 L308 416 L326 548 L280 548 L256 464 L232 548 L186 548 Z" fill="#78A6D8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M209 445 L303 445" stroke="#FAF4E8" stroke-width="6" stroke-linecap="round"/>`)],
  ["clothes/bottom-lilac.svg", clothing(`<path d="M198 420 L314 420 L348 548 Q256 590 164 548 Z" fill="#D4B8FF" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M205 455 Q256 488 307 455" fill="none" stroke="#FAF4E8" stroke-width="6"/>`)],
  ["clothes/bottom-mint.svg", clothing(`<path d="M202 418 L310 418 L330 548 L282 548 L256 468 L230 548 L182 548 Z" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><circle cx="225" cy="452" r="8" fill="#FAF4E8"/><circle cx="287" cy="452" r="8" fill="#FAF4E8"/>`)],
  ["clothes/bottom-star-skirt.svg", clothing(`<path d="M196 420 L316 420 L352 552 Q256 590 160 552 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><g fill="#FFE8A8"><path d="M226 488 l8 16 18 3-13 12 3 18-16-8-16 8 3-18-13-12 18-3z"/><path d="M288 462 l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2z"/></g>`)],
  ["clothes/dress-starry-blue.svg", clothing(`<path d="M180 270 Q256 222 332 270 L360 358 L322 378 L304 340 L354 590 Q256 640 158 590 L208 340 L190 378 L152 358 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><g fill="#FFE8A8"><path d="M252 348 l8 17 18 2-13 13 3 18-16-9-16 9 3-18-13-13 18-2z"/><path d="M292 500 l7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2z"/></g>`)],
  ["clothes/dress-flower-pink.svg", clothing(`<path d="M182 270 Q256 224 330 270 L358 356 L320 378 L304 342 L352 588 Q256 636 160 588 L208 342 L192 378 L154 356 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><g><circle cx="256" cy="430" r="12" fill="#D8AA82"/><ellipse cx="256" cy="402" rx="10" ry="22" fill="#FAF4E8"/><ellipse cx="256" cy="458" rx="10" ry="22" fill="#FAF4E8"/><ellipse cx="228" cy="430" rx="22" ry="10" fill="#FAF4E8"/><ellipse cx="284" cy="430" rx="22" ry="10" fill="#FAF4E8"/></g>`)],
  ["clothes/dress-moon-yellow.svg", clothing(`<path d="M182 270 Q256 224 330 270 L358 356 L320 378 L304 342 L352 588 Q256 636 160 588 L208 342 L192 378 L154 356 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M278 372 A42 42 0 1 1 234 326 A34 34 0 1 0 278 372 Z" fill="#FAF4E8"/>`)],
  ["clothes/shoes-pink.svg", clothing(`<path d="M180 632 Q222 608 252 636 L250 668 L172 668 Q158 650 180 632 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M332 632 Q290 608 260 636 L262 668 L340 668 Q354 650 332 632 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/>`)],
  ["clothes/shoes-yellow.svg", clothing(`<path d="M178 632 Q220 608 252 636 L250 668 L172 668 Q158 650 178 632 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M334 632 Q292 608 260 636 L262 668 L340 668 Q354 650 334 632 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/>`)],
  ["clothes/shoes-mint.svg", clothing(`<path d="M178 632 Q220 608 252 636 L250 668 L172 668 Q158 650 178 632 Z" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M334 632 Q292 608 260 636 L262 668 L340 668 Q354 650 334 632 Z" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/>`)],
  ["clothes/acc-bow-pink.svg", clothing(`<path d="M228 122 L180 92 Q160 126 180 160 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><path d="M284 122 L332 92 Q352 126 332 160 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><circle cx="256" cy="126" r="18" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="6"/>`)],
  ["clothes/acc-glasses-star.svg", clothing(`<path d="M206 190 l15 30 33 5-24 23 6 33-30-16-30 16 6-33-24-23 33-5z" fill="none" stroke="#6E4A2C" stroke-width="7"/><path d="M306 190 l15 30 33 5-24 23 6 33-30-16-30 16 6-33-24-23 33-5z" fill="none" stroke="#6E4A2C" stroke-width="7"/><path d="M244 230 L268 230" stroke="#6E4A2C" stroke-width="7"/>`)],
  ["clothes/acc-bag-bunny.svg", clothing(`<path d="M326 410 Q374 394 394 438 L384 526 Q352 552 314 526 L306 438 Q310 420 326 410 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7"/><path d="M342 414 Q338 360 362 352 Q382 370 360 418" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="6"/><path d="M366 418 Q382 365 404 362 Q420 385 386 430" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="6"/><circle cx="340" cy="468" r="5" fill="#6E4A2C"/><circle cx="366" cy="468" r="5" fill="#6E4A2C"/>`)],
  ["clothes/acc-crown-soft.svg", clothing(`<path d="M196 122 L226 72 L256 122 L286 72 L316 122 L302 162 L210 162 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><circle cx="226" cy="72" r="10" fill="#FFB6D5"/><circle cx="286" cy="72" r="10" fill="#A0D8F0"/>`)],
  ["clothes/acc-necklace-heart.svg", clothing(`<path d="M214 292 Q256 332 298 292" fill="none" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/><path d="M256 324 C242 306 220 319 230 340 C238 354 256 364 256 364 C256 364 274 354 282 340 C292 319 270 306 256 324 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["furniture/bed-pink.svg", icon(260, 170, `<rect x="30" y="72" width="204" height="70" rx="28" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="8"/><rect x="48" y="42" width="82" height="54" rx="18" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="6"/><path d="M42 142 L42 160 M220 142 L220 160" stroke="#6E4A2C" stroke-width="8" stroke-linecap="round"/><circle cx="188" cy="92" r="22" fill="#FFE8A8"/>`)],
  ["furniture/desk-mint.svg", icon(190, 150, `<rect x="34" y="60" width="122" height="38" rx="14" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="7"/><path d="M52 98 L42 138 M138 98 L148 138" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/><rect x="72" y="34" width="48" height="40" rx="10" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="6"/>`)],
  ["furniture/rug-star.svg", icon(260, 120, `<ellipse cx="130" cy="62" rx="105" ry="42" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="7"/><path d="M130 30 l10 22 24 3-17 16 4 24-21-12-21 12 4-24-17-16 24-3z" fill="#FFE8A8"/>`)],
  ["furniture/pet-bed.svg", icon(170, 120, `<ellipse cx="85" cy="72" rx="62" ry="36" fill="#D8AA82" stroke="#6E4A2C" stroke-width="7"/><ellipse cx="85" cy="66" rx="42" ry="20" fill="#FAF4E8"/><path d="M48 58 Q85 28 122 58" fill="none" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/>`)],
  ["furniture/chair-heart.svg", icon(150, 170, `<path d="M75 46 C50 18 12 38 24 72 C34 100 75 118 75 118 C75 118 116 100 126 72 C138 38 100 18 75 46 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7"/><path d="M52 116 L42 156 M98 116 L108 156" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/>`)],
  ["furniture/mirror-flower.svg", icon(130, 210, `<ellipse cx="65" cy="92" rx="42" ry="62" fill="#DDEFFC" stroke="#6E4A2C" stroke-width="7"/><g fill="#FFB6D5"><ellipse cx="65" cy="18" rx="13" ry="24"/><ellipse cx="65" cy="166" rx="13" ry="24"/><ellipse cx="16" cy="92" rx="20" ry="12"/><ellipse cx="114" cy="92" rx="20" ry="12"/></g><path d="M65 154 L65 196" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/>`)],
  ["furniture/bookshelf-rainbow.svg", icon(170, 220, `<rect x="26" y="24" width="118" height="168" rx="18" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="8"/><path d="M34 80 H136 M34 132 H136" stroke="#6E4A2C" stroke-width="6"/><rect x="44" y="44" width="16" height="34" fill="#FFB6D5"/><rect x="66" y="38" width="16" height="40" fill="#A0D8F0"/><rect x="92" y="94" width="18" height="36" fill="#B5E6C5"/><rect x="52" y="146" width="58" height="24" rx="12" fill="#FFE8A8"/>`)],
  ["furniture/lamp-moon.svg", icon(120, 180, `<path d="M70 26 A40 40 0 1 1 36 82 A32 32 0 1 0 70 26 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7"/><path d="M60 94 V150" stroke="#6E4A2C" stroke-width="7"/><ellipse cx="60" cy="156" rx="34" ry="12" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/>`)],
  ["furniture/plant-smile.svg", icon(130, 160, `<path d="M44 78 Q14 42 48 28 Q76 44 64 82" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="6"/><path d="M72 82 Q62 36 104 34 Q116 66 80 92" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="6"/><rect x="34" y="84" width="62" height="54" rx="16" fill="#D8AA82" stroke="#6E4A2C" stroke-width="7"/><circle cx="54" cy="110" r="4" fill="#6E4A2C"/><circle cx="76" cy="110" r="4" fill="#6E4A2C"/><path d="M56 124 Q65 132 74 124" fill="none" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["furniture/toy-horse.svg", icon(190, 150, `<path d="M50 96 Q44 54 78 44 L126 54 Q150 66 142 102 L122 104 L116 78 L82 78 L76 104 Z" fill="#D8AA82" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M126 54 L154 32 L150 68" fill="#D8AA82" stroke="#6E4A2C" stroke-width="7"/><circle cx="132" cy="64" r="4" fill="#6E4A2C"/><path d="M32 122 Q95 144 158 122" fill="none" stroke="#6E4A2C" stroke-width="8" stroke-linecap="round"/>`)],
  ["furniture/closet-pastel.svg", icon(180, 230, `<rect x="26" y="24" width="128" height="178" rx="18" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="8"/><path d="M90 28 V198" stroke="#6E4A2C" stroke-width="6"/><circle cx="74" cy="114" r="5" fill="#6E4A2C"/><circle cx="106" cy="114" r="5" fill="#6E4A2C"/><path d="M44 52 Q90 24 136 52" fill="none" stroke="#FAF4E8" stroke-width="7"/>`)],
  ["furniture/sofa-cloud.svg", icon(260, 150, `<path d="M48 82 Q36 38 78 38 Q96 12 130 36 Q166 12 186 42 Q230 38 220 84 L224 118 L36 118 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="8" stroke-linejoin="round"/><path d="M58 118 L48 138 M204 118 L214 138" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/>`)],
  ["furniture/table-juice.svg", icon(190, 150, `<rect x="38" y="68" width="114" height="34" rx="14" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7"/><path d="M56 102 L46 138 M134 102 L144 138" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/><path d="M86 32 H122 L116 68 H92 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="6"/><path d="M104 32 L118 18" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["furniture/kitchen-stove.svg", icon(170, 210, `<rect x="28" y="36" width="114" height="144" rx="18" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="8"/><rect x="46" y="92" width="78" height="58" rx="10" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="6"/><circle cx="60" cy="64" r="9" fill="#FFB6D5"/><circle cx="86" cy="64" r="9" fill="#B5E6C5"/><circle cx="112" cy="64" r="9" fill="#FFE8A8"/>`)],
  ["furniture/fridge-star.svg", icon(160, 230, `<rect x="28" y="24" width="104" height="180" rx="20" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="8"/><path d="M28 90 H132" stroke="#6E4A2C" stroke-width="6"/><path d="M92 132 l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#FFE8A8"/><path d="M112 54 V76 M112 110 V158" stroke="#FAF4E8" stroke-width="7" stroke-linecap="round"/>`)],
  ["furniture/beanbag-pink.svg", icon(160, 120, `<path d="M44 94 Q22 48 64 28 Q112 10 132 62 Q142 102 84 104 Q56 108 44 94 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="8"/><path d="M62 46 Q86 30 116 50" fill="none" stroke="#FAF4E8" stroke-width="7" stroke-linecap="round"/>`)],
  ["furniture/wall-shelf.svg", icon(180, 110, `<rect x="26" y="56" width="128" height="18" rx="9" fill="#D8AA82" stroke="#6E4A2C" stroke-width="6"/><path d="M46 74 L34 98 M134 74 L146 98" stroke="#6E4A2C" stroke-width="6"/><path d="M78 42 L58 30 Q46 50 62 62 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="5"/><path d="M102 42 L122 30 Q134 50 118 62 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["furniture/toy-box.svg", icon(180, 140, `<rect x="24" y="58" width="132" height="58" rx="14" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7"/><path d="M38 58 Q90 24 142 58" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7"/><circle cx="90" cy="86" r="10" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["objects/juice-cup.svg", icon(80, 100, `<path d="M18 20 H62 L56 86 H24 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><path d="M26 36 H54" stroke="#FAF4E8" stroke-width="6"/><path d="M42 20 L56 4" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["objects/book-blue.svg", icon(100, 80, `<path d="M14 22 Q36 8 50 22 Q64 8 86 22 V64 Q64 50 50 64 Q36 50 14 64 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="6"/><path d="M50 22 V64" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["objects/pet-bowl.svg", icon(100, 70, `<ellipse cx="50" cy="46" rx="36" ry="16" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="6"/><path d="M18 42 Q50 68 82 42" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/>`)],
  ["objects/pet-toy.svg", icon(90, 90, `<circle cx="45" cy="45" r="30" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><path d="M22 45 H68 M45 22 V68" stroke="#FAF4E8" stroke-width="7" stroke-linecap="round"/>`)],
  ["objects/dog-biscuit.svg", icon(90, 70, `<path d="M24 18 Q45 4 66 18 Q84 34 66 52 Q45 66 24 52 Q6 34 24 18 Z" fill="#D8AA82" stroke="#6E4A2C" stroke-width="6"/><circle cx="34" cy="34" r="4" fill="#6E4A2C"/><circle cx="54" cy="40" r="4" fill="#6E4A2C"/>`)],
  ["objects/water-bowl.svg", icon(100, 70, `<ellipse cx="50" cy="46" rx="36" ry="16" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="6"/><path d="M22 42 Q50 58 78 42" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["objects/apple-snack.svg", icon(90, 80, `<path d="M45 32 C30 12 8 30 18 54 C26 74 45 66 45 66 C45 66 64 74 72 54 C82 30 60 12 45 32 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><path d="M46 30 Q46 12 58 8" stroke="#6E4A2C" stroke-width="5" stroke-linecap="round"/>`)],
  ["objects/swing.svg", icon(230, 220, `<path d="M42 188 L82 30 H148 L188 188" fill="none" stroke="#6E4A2C" stroke-width="8" stroke-linecap="round"/><path d="M88 36 L82 130 M142 36 L148 130" stroke="#6E4A2C" stroke-width="5"/><rect x="74" y="130" width="84" height="26" rx="12" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/>`)],
  ["objects/slide.svg", icon(250, 210, `<path d="M62 170 Q136 132 182 54 L212 70 Q160 164 84 190 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="8" stroke-linejoin="round"/><path d="M168 54 H214 V188" fill="none" stroke="#6E4A2C" stroke-width="8" stroke-linecap="round"/><path d="M174 92 H220" stroke="#6E4A2C" stroke-width="6"/>`)],
  ["pets/dog-cream.svg", dog("#F5D7B5")],
  ["pets/dog-caramel.svg", dog("#D8AA82")],
  ["pets/dog-cocoa.svg", dog("#A6754F")],
  ["pets/pet-collar-pink.svg", petOverlay(`<rect x="54" y="72" width="78" height="14" rx="7" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["pets/pet-bow-blue.svg", petOverlay(`<path d="M78 32 L42 18 Q30 44 48 62 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="5"/><path d="M98 32 L134 18 Q146 44 128 62 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="5"/><circle cx="88" cy="38" r="12" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["pets/pet-cape-star.svg", petOverlay(`<path d="M52 82 Q92 118 142 86 L156 134 Q100 160 42 134 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="5"/><path d="M100 105 l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2z" fill="#FFE8A8"/>`)],
  ["pets/pet-glasses-round.svg", petOverlay(`<circle cx="70" cy="58" r="16" fill="none" stroke="#6E4A2C" stroke-width="5"/><circle cx="112" cy="58" r="16" fill="none" stroke="#6E4A2C" stroke-width="5"/><path d="M86 58 H96" stroke="#6E4A2C" stroke-width="5"/>`)],
  ["pets/pet-bandana-mint.svg", petOverlay(`<path d="M56 82 H130 L96 126 Z" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="5"/><circle cx="94" cy="102" r="6" fill="#FFB6D5"/>`)]
]);

addExpandedAssets();
rebuildDollhouseAssetPack();

for (const [path, svg] of files) {
  const fullPath = join(root, path);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, svg);
}

function rebuildDollhouseAssetPack() {
  files.clear();

  const tops = [
    ["outfit-001", "rose", "#F9A8C9", "#FFF5F8", "star"],
    ["top-sky-heart", "sky", "#8FD4F3", "#FF9FC8", "heart"],
    ["top-mint-ribbon", "mint", "#9EDDBA", "#F7A5CA", "bow"],
    ["top-sunflower", "sun", "#F8D46B", "#9CCB7B", "flower"],
    ["top-rainbow", "rainbow", "#F5B5CD", "#7EC7E8", "rainbow"],
    ["top-cat-pocket", "pocket", "#F7B2D1", "#FFF5F8", "pocket"],
    ["top-cloud-dream", "cloud", "#B9E8F8", "#FFE27A", "cloud"],
    ["top-strawberry", "berry", "#FF9CB6", "#8BCB78", "strawberry"],
    ["top-sailor-bow", "sailor", "#FFF7E8", "#78BFE8", "sailor"]
  ];
  for (const [id, , base, accent, motif] of tops) {
    files.set(`clothes/${id}.svg`, topWearable(base, accent, motif));
  }

  const bottoms = [
    ["bottom-denim", "#6FA7D7", "#F9D26F", "short"],
    ["bottom-lilac", "#C9A6EF", "#FFF5F8", "skirt"],
    ["bottom-mint", "#9EDDBA", "#FFF5F8", "short"],
    ["bottom-star-skirt", "#7FC4E7", "#FFE27A", "star-skirt"],
    ["bottom-tutu-pink", "#F7A9CD", "#FFE6F0", "tutu"],
    ["bottom-rainbow-leggings", "#FFF7E8", "#85C8EA", "leggings"],
    ["bottom-heart-shorts", "#F59ABC", "#FFF5F8", "heart-short"],
    ["bottom-cloud-skirt", "#B9E8F8", "#FFF5F8", "cloud-skirt"]
  ];
  for (const [id, base, accent, kind] of bottoms) {
    files.set(`clothes/${id}.svg`, bottomWearable(base, accent, kind));
  }

  const dresses = [
    ["dress-starry-blue", "#84C8EB", "#FFE27A", "stars"],
    ["dress-flower-pink", "#F6A4C6", "#FFF5F8", "flower"],
    ["dress-moon-yellow", "#F7D66B", "#FFF5F8", "moon"],
    ["dress-cupcake-lilac", "#C6A6EE", "#F9A8C9", "cupcake"],
    ["dress-rainbow-tutu", "#FFF7E8", "#F6A4C6", "rainbow"],
    ["dress-rose-red", "#F1829F", "#FFF5F8", "rose"]
  ];
  for (const [id, base, accent, motif] of dresses) {
    files.set(`clothes/${id}.svg`, dressWearable(base, accent, motif));
  }

  const shoes = [
    ["shoes-pink", "#F69FC4", "#FFF5F8"],
    ["shoes-yellow", "#F7D66B", "#FFF5F8"],
    ["shoes-mint", "#93D9B1", "#FFF5F8"],
    ["shoes-lilac-boots", "#BFA0EB", "#FFF5F8"],
    ["shoes-blue-sneakers", "#7EC7E8", "#FFF5F8"]
  ];
  for (const [id, base, accent] of shoes) files.set(`clothes/${id}.svg`, shoesWearable(base, accent));

  const accessories = [
    ["acc-bow-pink", accessoryWearable("bow", "#F59ABC", "#FFF0F6")],
    ["acc-glasses-star", accessoryWearable("glasses", "#F7D66B", "#83C7EB")],
    ["acc-bag-bunny", accessoryWearable("bag", "#FFF5F8", "#F6A4C6")],
    ["acc-crown-soft", accessoryWearable("crown", "#F7D66B", "#F59ABC")],
    ["acc-necklace-heart", accessoryWearable("necklace", "#F59ABC", "#F7D66B")],
    ["acc-hat-bear", accessoryWearable("hat", "#D7A978", "#FFF2D8")],
    ["acc-flower-clip", accessoryWearable("flower", "#F59ABC", "#F7D66B")],
    ["acc-wing-backpack", accessoryWearable("wings", "#FFF8F2", "#9FD8F0")],
    ["acc-magic-wand", accessoryWearable("wand", "#F7D66B", "#F59ABC")],
    ["acc-kitty-ear", accessoryWearable("ears", "#F59ABC", "#FFF0F6")]
  ];
  for (const [id, svg] of accessories) files.set(`clothes/${id}.svg`, svg);

  Object.entries(furnitureAssets()).forEach(([id, svg]) => files.set(`furniture/${id}.svg`, svg));
  Object.entries(objectAssets()).forEach(([id, svg]) => files.set(`objects/${id}.svg`, svg));

  files.set("pets/dog-cream.svg", dogDollhouse("#F5D7B5", "#E8B68E"));
  files.set("pets/dog-caramel.svg", dogDollhouse("#D8A066", "#9E6941"));
  files.set("pets/dog-cocoa.svg", dogDollhouse("#8D5A3A", "#5E3A28"));
  Object.entries(petAccessoryAssets()).forEach(([id, svg]) => files.set(`pets/${id}.svg`, svg));
}

function wearableSvg(content) {
  return wrapSvg(406, 844, content);
}

function topWearable(base, accent, motif) {
  const motifSvg = wearableMotif(motif, accent);
  return wearableSvg(`<path d="M118 500 C94 494 78 475 82 454 L104 382 C110 360 127 346 151 340 C166 351 184 358 203 358 C222 358 240 351 255 340 C279 346 296 360 302 382 L324 454 C328 475 312 494 288 500 L263 427 L263 487 C247 501 225 509 203 509 C181 509 159 501 143 487 L143 427 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/>
<path d="M151 340 C166 366 184 380 203 380 C222 380 240 366 255 340 L240 330 C229 344 218 351 203 351 C188 351 177 344 166 330 Z" fill="#FFF8F1" stroke="#7A4C34" stroke-width="4"/>
<path d="M97 452 L126 465 M309 452 L280 465" stroke="#FFF8F1" stroke-width="6" opacity="0.72"/>
<path d="M147 486 C166 498 183 503 203 503 C223 503 240 498 259 486" fill="none" stroke="#FFF8F1" stroke-width="5" opacity="0.64"/>
<path d="M160 370 C176 388 230 388 246 370" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.24"/>
${motifSvg}`);
}

function bottomWearable(base, accent, kind) {
  if (kind === "skirt" || kind === "star-skirt" || kind === "tutu" || kind === "cloud-skirt") {
    const frill = kind === "tutu" ? `<path d="M111 560 C148 625 258 625 295 560 L324 610 C270 660 136 660 82 610 Z" fill="${accent}" stroke="#7A4C34" stroke-width="5" opacity="0.9"/>` : "";
    const motif = kind === "star-skirt" ? star(203, 545, 24, accent) : kind === "cloud-skirt" ? cloud(203, 548, "#FFF8F1") : "";
    return wearableSvg(`<path d="M123 464 C144 477 178 484 203 484 C228 484 262 477 283 464 L316 590 C270 634 136 634 90 590 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/>
<path d="M126 466 C170 491 236 491 280 466" fill="none" stroke="#FFF8F1" stroke-width="7" opacity="0.78"/>
<path d="M112 568 C160 596 246 596 294 568" fill="none" stroke="#FFFFFF" stroke-width="7" opacity="0.26"/>
${frill}${motif}`);
  }
  if (kind === "leggings") {
    return wearableSvg(`<path d="M126 462 C146 474 178 480 203 480 C228 480 260 474 280 462 L294 608 L247 608 L226 512 L180 608 L132 608 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/>
${[0, 1, 2, 3].map((i) => `<path d="M136 ${497 + i * 25} H270" stroke="${["#F49ABB", "#F7D66B", "#9DD8B6", "#83C7EB"][i]}" stroke-width="14" opacity="0.82"/>`).join("")}
<path d="M203 484 L180 608 M203 484 L226 512 L247 608" stroke="#7A4C34" stroke-width="4" opacity="0.55"/>`);
  }
  const motif = kind === "heart-short" ? `${heart(164, 514, 15, accent)}${heart(242, 514, 15, accent)}` : "";
  return wearableSvg(`<path d="M124 462 C145 474 178 480 203 480 C228 480 261 474 282 462 L296 560 L247 574 L203 514 L159 574 L110 560 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/>
<path d="M128 470 C169 494 237 494 278 470" fill="none" stroke="#FFF8F1" stroke-width="7" opacity="0.68"/>
<path d="M203 494 L203 552" stroke="#FFF8F1" stroke-width="4" opacity="0.66"/>
${motif}`);
}

function dressWearable(base, accent, motif) {
  const motifSvg = wearableMotif(motif, accent, 520);
  return wearableSvg(`<path d="M116 506 C94 500 78 480 82 456 L105 383 C112 358 129 344 153 338 C167 354 184 363 203 363 C222 363 239 354 253 338 C277 344 294 358 301 383 L324 456 C328 480 312 500 290 506 L270 438 L318 650 C270 702 136 702 88 650 L136 438 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/>
<path d="M153 338 C168 370 185 386 203 386 C221 386 238 370 253 338 L238 329 C228 344 217 352 203 352 C189 352 178 344 168 329 Z" fill="#FFF8F1" stroke="#7A4C34" stroke-width="4"/>
<path d="M108 454 L132 466 M298 466 L322 454" stroke="#FFF8F1" stroke-width="6" opacity="0.7"/>
<path d="M118 642 C160 676 246 676 288 642" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.28"/>
<path d="M146 427 C164 446 242 446 260 427" fill="none" stroke="#FFFFFF" stroke-width="7" opacity="0.28"/>
${motifSvg}`);
}

function shoesWearable(base, accent) {
  return wearableSvg(`<path d="M119 794 C137 776 170 778 184 798 L181 828 L116 828 C101 816 104 802 119 794 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/>
<path d="M287 794 C269 776 236 778 222 798 L225 828 L290 828 C305 816 302 802 287 794 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/>
<path d="M126 803 H174 M232 803 H280" stroke="${accent}" stroke-width="6" opacity="0.86"/>
<path d="M126 817 H178 M228 817 H280" stroke="#FFFFFF" stroke-width="5" opacity="0.34"/>`);
}

function accessoryWearable(kind, base, accent) {
  if (kind === "bow") return wearableSvg(`<path d="M171 134 C137 108 113 126 122 164 C140 174 158 168 184 148 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><path d="M235 148 C262 168 280 174 298 164 C307 126 283 108 235 134 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><circle cx="203" cy="142" r="17" fill="${accent}" stroke="#7A4C34" stroke-width="5"/>`);
  if (kind === "glasses") return wearableSvg(`<circle cx="146" cy="226" r="32" fill="none" stroke="${base}" stroke-width="6"/><circle cx="260" cy="226" r="32" fill="none" stroke="${base}" stroke-width="6"/><path d="M178 226 H228" stroke="${base}" stroke-width="6"/><path d="M113 190 L104 210 L84 213 L99 227 L95 248 L113 238 L132 248 L128 227 L143 213 L122 210 Z" fill="${accent}" stroke="#7A4C34" stroke-width="4"/>`);
  if (kind === "bag") return wearableSvg(`<path d="M312 520 C314 472 356 462 378 506 L366 608 C346 632 306 625 292 598 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><path d="M317 516 C330 478 358 478 369 516" fill="none" stroke="#7A4C34" stroke-width="5"/><path d="M328 546 C316 528 296 542 305 564 C313 584 334 594 334 594 C334 594 356 584 364 564 C373 542 352 528 340 546 Z" fill="${accent}"/>`);
  if (kind === "crown") return wearableSvg(`<path d="M142 124 L170 72 L203 125 L236 72 L264 124 L254 164 C220 178 186 178 152 164 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><circle cx="170" cy="74" r="9" fill="${accent}"/><circle cx="236" cy="74" r="9" fill="#83C7EB"/>`);
  if (kind === "necklace") return wearableSvg(`<path d="M160 350 C176 384 230 384 246 350" fill="none" stroke="#7A4C34" stroke-width="5"/><path d="M203 375 C192 360 174 371 182 389 C188 402 203 410 203 410 C203 410 218 402 224 389 C232 371 214 360 203 375 Z" fill="${base}" stroke="#7A4C34" stroke-width="4"/>`);
  if (kind === "hat") return wearableSvg(`<path d="M109 154 C128 82 278 82 297 154 C268 187 138 187 109 154 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><circle cx="146" cy="112" r="27" fill="${base}" stroke="#7A4C34" stroke-width="5"/><circle cx="260" cy="112" r="27" fill="${base}" stroke="#7A4C34" stroke-width="5"/><path d="M164 156 C184 171 222 171 242 156" fill="none" stroke="${accent}" stroke-width="6"/>`);
  if (kind === "flower") return wearableSvg(`${flower(112, 154, base, accent, 1.1)}`);
  if (kind === "wings") return wearableSvg(`<path d="M70 432 C34 380 48 330 122 382 C130 428 113 466 80 488 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><path d="M336 432 C372 380 358 330 284 382 C276 428 293 466 326 488 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><path d="M95 404 L122 455 M311 404 L284 455" stroke="${accent}" stroke-width="5" opacity="0.7"/>`);
  if (kind === "wand") return wearableSvg(`<path d="M298 552 L360 448" stroke="#7A4C34" stroke-width="7"/><path d="M361 414 L376 444 L409 449 L385 472 L391 505 L361 489 L331 505 L337 472 L313 449 L346 444 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><circle cx="334" cy="491" r="6" fill="${accent}"/><circle cx="374" cy="438" r="5" fill="#83C7EB"/>`);
  return wearableSvg(`<path d="M112 147 L152 76 L181 157 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><path d="M294 147 L254 76 L225 157 Z" fill="${base}" stroke="#7A4C34" stroke-width="5"/><path d="M150 154 C184 136 222 136 256 154" fill="none" stroke="#7A4C34" stroke-width="5"/>`);
}

function wearableMotif(motif, accent, y = 414) {
  if (motif === "star" || motif === "stars") return star(203, y, 30, "#FFF8F1") + (motif === "stars" ? star(245, y + 58, 15, accent) : "");
  if (motif === "heart" || motif === "rose") return heart(203, y, 28, accent);
  if (motif === "bow" || motif === "sailor") return bow(203, y, 24, accent);
  if (motif === "flower") return flower(203, y, "#FFF8F1", accent, 1.15);
  if (motif === "rainbow") return rainbow(203, y + 18, 48);
  if (motif === "cloud") return cloud(203, y, "#FFF8F1") + star(238, y + 42, 13, accent);
  if (motif === "strawberry") return strawberry(203, y, 1.1);
  if (motif === "pocket") return `<path d="M167 ${y - 30} H239 V${y + 28} C220 ${y + 50} 186 ${y + 50} 167 ${y + 28} Z" fill="#FFF8F1" stroke="#7A4C34" stroke-width="4"/><circle cx="187" cy="${y}" r="5" fill="#7A4C34"/><circle cx="219" cy="${y}" r="5" fill="#7A4C34"/><path d="M190 ${y + 18} C198 ${y + 25} 208 ${y + 25} 216 ${y + 18}" fill="none" stroke="#7A4C34" stroke-width="4"/>`;
  if (motif === "cupcake") return `<path d="M164 ${y - 24} H242 L232 ${y + 48} C215 ${y + 62} 191 ${y + 62} 174 ${y + 48} Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="4"/><path d="M164 ${y - 24} C170 ${y - 58} 236 ${y - 58} 242 ${y - 24} Z" fill="${accent}" stroke="#7A4C34" stroke-width="4"/><circle cx="203" cy="${y - 58}" r="8" fill="#E95E7E"/>`;
  if (motif === "moon") return `<path d="M222 ${y - 38} A43 43 0 1 1 178 ${y + 18} A32 32 0 1 0 222 ${y - 38} Z" fill="#FFF8F1"/>`;
  return "";
}

function furnitureAssets() {
  return {
    "bed-pink": icon(300, 210, `<ellipse cx="150" cy="174" rx="118" ry="24" fill="#7A4C34" opacity="0.12"/><path d="M42 100 H254 C270 100 282 112 282 128 V164 H36 V106 C36 103 39 100 42 100 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><path d="M58 66 H136 C151 66 162 78 162 93 V112 H42 V82 C42 73 49 66 58 66 Z" fill="#FFF8F1" stroke="#7A4C34" stroke-width="5"/><path d="M150 100 H282 V128 H150 Z" fill="#FFE7F0"/><circle cx="220" cy="118" r="25" fill="#F7D66B"/><path d="M58 164 V190 M258 164 V190" stroke="#7A4C34" stroke-width="7"/>`),
    "desk-mint": icon(220, 170, `<ellipse cx="110" cy="140" rx="72" ry="18" fill="#7A4C34" opacity="0.12"/><path d="M40 68 C70 54 150 54 180 68 L170 106 H50 Z" fill="#9EDDBA" stroke="#7A4C34" stroke-width="6"/><path d="M62 106 L50 152 M158 106 L170 152" stroke="#7A4C34" stroke-width="6"/><rect x="82" y="34" width="56" height="44" rx="13" fill="#F7D66B" stroke="#7A4C34" stroke-width="5"/><path d="M52 82 C85 93 135 93 168 82" fill="none" stroke="#FFF8F1" stroke-width="6" opacity="0.7"/>`),
    "rug-star": icon(300, 140, `<ellipse cx="150" cy="74" rx="120" ry="46" fill="#7EC7E8" stroke="#7A4C34" stroke-width="6"/><ellipse cx="150" cy="68" rx="92" ry="28" fill="#A7DDF2" opacity="0.55"/><path d="M150 34 L162 59 L190 63 L170 83 L175 112 L150 98 L125 112 L130 83 L110 63 L138 59 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="4"/>`),
    "pet-bed": icon(190, 135, `<ellipse cx="95" cy="105" rx="72" ry="20" fill="#7A4C34" opacity="0.12"/><path d="M36 72 C45 36 145 36 154 72 L146 108 C119 124 71 124 44 108 Z" fill="#D7A978" stroke="#7A4C34" stroke-width="6"/><ellipse cx="95" cy="76" rx="48" ry="22" fill="#FFF2D8"/><path d="M54 69 C76 47 114 47 136 69" fill="none" stroke="#7A4C34" stroke-width="5"/>`),
    "chair-heart": icon(180, 190, `<ellipse cx="90" cy="162" rx="54" ry="16" fill="#7A4C34" opacity="0.12"/><path d="M90 58 C64 20 18 42 31 85 C43 122 90 144 90 144 C90 144 137 122 149 85 C162 42 116 20 90 58 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><path d="M66 130 L54 176 M114 130 L126 176" stroke="#7A4C34" stroke-width="6"/><path d="M55 80 C68 109 90 122 90 122 C90 122 112 109 125 80" fill="none" stroke="#FFF8F1" stroke-width="6" opacity="0.65"/>`),
    "mirror-flower": icon(150, 230, `<ellipse cx="75" cy="203" rx="42" ry="12" fill="#7A4C34" opacity="0.12"/><g fill="#F6A4C6" stroke="#7A4C34" stroke-width="4"><ellipse cx="75" cy="24" rx="14" ry="24"/><ellipse cx="75" cy="178" rx="14" ry="24"/><ellipse cx="20" cy="100" rx="23" ry="13"/><ellipse cx="130" cy="100" rx="23" ry="13"/></g><ellipse cx="75" cy="100" rx="46" ry="72" fill="#DDF3FF" stroke="#7A4C34" stroke-width="6"/><path d="M55 70 C68 55 92 55 105 70" stroke="#FFFFFF" stroke-width="7" opacity="0.7"/><path d="M75 169 V215" stroke="#7A4C34" stroke-width="6"/>`),
    "bookshelf-rainbow": icon(190, 235, `<ellipse cx="95" cy="214" rx="58" ry="14" fill="#7A4C34" opacity="0.12"/><rect x="34" y="28" width="122" height="178" rx="20" fill="#FFF8F1" stroke="#7A4C34" stroke-width="7"/><path d="M43 86 H147 M43 140 H147" stroke="#7A4C34" stroke-width="5"/><rect x="54" y="48" width="16" height="36" rx="4" fill="#F6A4C6"/><rect x="77" y="43" width="17" height="41" rx="4" fill="#7EC7E8"/><rect x="102" y="99" width="20" height="39" rx="5" fill="#9EDDBA"/><path d="M58 162 H132 C138 162 142 167 142 173 C130 190 69 190 48 173 C48 167 52 162 58 162 Z" fill="#F7D66B"/>`),
    "lamp-moon": icon(135, 190, `<ellipse cx="68" cy="172" rx="43" ry="12" fill="#7A4C34" opacity="0.12"/><path d="M82 24 A46 46 0 1 1 43 91 A34 34 0 1 0 82 24 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="6"/><path d="M68 100 V159" stroke="#7A4C34" stroke-width="6"/><ellipse cx="68" cy="164" rx="38" ry="13" fill="#F6A4C6" stroke="#7A4C34" stroke-width="5"/>`),
    "plant-smile": icon(145, 175, `<ellipse cx="72" cy="155" rx="45" ry="12" fill="#7A4C34" opacity="0.12"/><path d="M48 78 C16 46 39 20 68 62" fill="#9EDDBA" stroke="#7A4C34" stroke-width="5"/><path d="M82 82 C72 34 118 22 113 72" fill="#9EDDBA" stroke="#7A4C34" stroke-width="5"/><rect x="34" y="88" width="76" height="56" rx="18" fill="#D7A978" stroke="#7A4C34" stroke-width="6"/><circle cx="59" cy="114" r="4" fill="#7A4C34"/><circle cx="85" cy="114" r="4" fill="#7A4C34"/><path d="M62 128 C68 135 76 135 82 128" fill="none" stroke="#7A4C34" stroke-width="4"/>`),
    "toy-horse": icon(220, 170, `<ellipse cx="110" cy="143" rx="76" ry="14" fill="#7A4C34" opacity="0.12"/><path d="M55 106 C48 64 82 48 118 59 C150 67 158 88 149 114 L125 114 L116 83 H84 L76 114 Z" fill="#D7A978" stroke="#7A4C34" stroke-width="6"/><path d="M124 59 L165 36 L158 78" fill="#D7A978" stroke="#7A4C34" stroke-width="6"/><circle cx="138" cy="67" r="4" fill="#7A4C34"/><path d="M34 132 C80 157 140 157 186 132" fill="none" stroke="#7A4C34" stroke-width="8"/><path d="M71 78 C92 67 118 70 138 84" fill="none" stroke="#FFF8F1" stroke-width="5" opacity="0.55"/>`),
    "closet-pastel": icon(200, 245, `<ellipse cx="100" cy="224" rx="62" ry="14" fill="#7A4C34" opacity="0.12"/><rect x="32" y="28" width="136" height="190" rx="22" fill="#F6A4C6" stroke="#7A4C34" stroke-width="7"/><path d="M100 32 V214" stroke="#7A4C34" stroke-width="5"/><circle cx="82" cy="124" r="5" fill="#7A4C34"/><circle cx="118" cy="124" r="5" fill="#7A4C34"/><path d="M50 58 C76 36 124 36 150 58" fill="none" stroke="#FFF8F1" stroke-width="7" opacity="0.66"/>`),
    "sofa-cloud": icon(300, 170, `<ellipse cx="150" cy="142" rx="112" ry="18" fill="#7A4C34" opacity="0.12"/><path d="M52 96 C40 54 82 42 104 58 C124 26 160 35 172 62 C212 43 252 62 239 102 L242 136 H48 Z" fill="#FFF8F1" stroke="#7A4C34" stroke-width="7"/><path d="M70 136 L60 158 M230 136 L240 158" stroke="#7A4C34" stroke-width="6"/><path d="M83 91 C120 112 182 112 219 91" fill="none" stroke="#F6A4C6" stroke-width="8" opacity="0.62"/>`),
    "table-juice": icon(220, 165, `<ellipse cx="110" cy="144" rx="70" ry="13" fill="#7A4C34" opacity="0.12"/><path d="M42 84 C74 71 146 71 178 84 L168 112 H52 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="6"/><path d="M66 112 L54 154 M154 112 L166 154" stroke="#7A4C34" stroke-width="6"/><path d="M92 34 H132 L126 76 H98 Z" fill="#7EC7E8" stroke="#7A4C34" stroke-width="5"/><path d="M112 34 L128 14" stroke="#7A4C34" stroke-width="4"/>`),
    "kitchen-stove": icon(185, 225, `<ellipse cx="92" cy="206" rx="54" ry="13" fill="#7A4C34" opacity="0.12"/><rect x="32" y="36" width="120" height="160" rx="22" fill="#FFF8F1" stroke="#7A4C34" stroke-width="7"/><rect x="50" y="101" width="84" height="62" rx="14" fill="#B9E8F8" stroke="#7A4C34" stroke-width="5"/><circle cx="60" cy="70" r="9" fill="#F6A4C6"/><circle cx="92" cy="70" r="9" fill="#9EDDBA"/><circle cx="124" cy="70" r="9" fill="#F7D66B"/><path d="M59 126 H125" stroke="#FFFFFF" stroke-width="5" opacity="0.62"/>`),
    "fridge-star": icon(180, 245, `<ellipse cx="90" cy="224" rx="53" ry="14" fill="#7A4C34" opacity="0.12"/><rect x="36" y="28" width="108" height="190" rx="24" fill="#9FD8F0" stroke="#7A4C34" stroke-width="7"/><path d="M36 93 H144" stroke="#7A4C34" stroke-width="5"/><path d="M102 140 L111 158 L131 161 L116 175 L120 196 L102 186 L84 196 L88 175 L73 161 L93 158 Z" fill="#F7D66B"/><path d="M122 55 V78 M122 118 V170" stroke="#FFF8F1" stroke-width="6"/>`),
    "beanbag-pink": icon(180, 135, `<ellipse cx="90" cy="113" rx="61" ry="15" fill="#7A4C34" opacity="0.12"/><path d="M42 102 C18 57 65 18 112 28 C156 38 154 105 93 111 C67 115 50 111 42 102 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="7"/><path d="M62 54 C82 39 114 43 132 63" fill="none" stroke="#FFF8F1" stroke-width="7" opacity="0.65"/>`),
    "wall-shelf": icon(205, 125, `<ellipse cx="102" cy="112" rx="72" ry="8" fill="#7A4C34" opacity="0.09"/><rect x="30" y="66" width="145" height="20" rx="10" fill="#D7A978" stroke="#7A4C34" stroke-width="5"/><path d="M52 87 L37 113 M153 87 L168 113" stroke="#7A4C34" stroke-width="5"/><path d="M84 48 L58 34 C49 56 62 70 84 62 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="4"/><path d="M120 48 L146 34 C155 56 142 70 120 62 Z" fill="#7EC7E8" stroke="#7A4C34" stroke-width="4"/>`),
    "toy-box": icon(205, 155, `<ellipse cx="102" cy="135" rx="72" ry="13" fill="#7A4C34" opacity="0.12"/><rect x="26" y="70" width="153" height="58" rx="17" fill="#F7D66B" stroke="#7A4C34" stroke-width="6"/><path d="M43 70 C70 36 135 36 162 70 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><circle cx="102" cy="96" r="11" fill="#7EC7E8" stroke="#7A4C34" stroke-width="4"/>`),
    "dollhouse-pastel": icon(220, 215, `<ellipse cx="110" cy="194" rx="66" ry="13" fill="#7A4C34" opacity="0.12"/><path d="M32 92 L110 28 L188 92 V180 H32 Z" fill="#F7B2D1" stroke="#7A4C34" stroke-width="7"/><path d="M63 96 H96 V130 H63 Z M124 96 H157 V130 H124 Z" fill="#B9E8F8" stroke="#7A4C34" stroke-width="4"/><path d="M88 180 V140 H132 V180" fill="#F7D66B" stroke="#7A4C34" stroke-width="5"/><path d="M32 92 H188" stroke="#FFF8F1" stroke-width="5"/>`),
    "art-easel": icon(170, 205, `<ellipse cx="85" cy="188" rx="54" ry="12" fill="#7A4C34" opacity="0.12"/><path d="M85 26 L38 184 M85 26 L132 184 M56 139 H114" stroke="#7A4C34" stroke-width="7"/><rect x="42" y="50" width="86" height="82" rx="13" fill="#FFF8F1" stroke="#7A4C34" stroke-width="6"/><path d="M57 93 C75 67 99 68 114 94" fill="none" stroke="#F6A4C6" stroke-width="7"/><circle cx="67" cy="109" r="8" fill="#7EC7E8"/><circle cx="101" cy="111" r="7" fill="#F7D66B"/>`),
    "floor-cushion-star": icon(170, 120, `<ellipse cx="85" cy="100" rx="55" ry="12" fill="#7A4C34" opacity="0.12"/><path d="M85 18 L103 52 L141 58 L114 84 L120 121 L85 103 L50 121 L56 84 L29 58 L67 52 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="6"/><path d="M58 70 C75 84 95 84 112 70" fill="none" stroke="#FFF8F1" stroke-width="5"/>`),
    "tea-table": icon(205, 155, `<ellipse cx="102" cy="136" rx="72" ry="13" fill="#7A4C34" opacity="0.12"/><ellipse cx="102" cy="80" rx="68" ry="27" fill="#FFF8F1" stroke="#7A4C34" stroke-width="6"/><path d="M64 102 L52 145 M140 102 L152 145" stroke="#7A4C34" stroke-width="6"/><path d="M80 48 H124 L118 76 H86 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="5"/><circle cx="146" cy="76" r="12" fill="#F7D66B" stroke="#7A4C34" stroke-width="4"/>`),
    "play-tent": icon(220, 230, `<ellipse cx="110" cy="209" rx="70" ry="13" fill="#7A4C34" opacity="0.12"/><path d="M32 200 L110 26 L188 200 Z" fill="#B9E8F8" stroke="#7A4C34" stroke-width="7"/><path d="M110 26 V200" stroke="#7A4C34" stroke-width="5"/><path d="M110 105 C75 132 74 166 74 200 H146 C146 166 145 132 110 105 Z" fill="#FFF8F1" stroke="#7A4C34" stroke-width="5"/><path d="M60 103 H160" stroke="#F6A4C6" stroke-width="9"/><path d="M48 145 H172" stroke="#F7D66B" stroke-width="9"/>`),
    "toy-kitchen": icon(200, 225, `<ellipse cx="100" cy="205" rx="60" ry="13" fill="#7A4C34" opacity="0.12"/><rect x="28" y="42" width="144" height="150" rx="22" fill="#F7B2D1" stroke="#7A4C34" stroke-width="7"/><rect x="47" y="101" width="106" height="62" rx="14" fill="#FFF8F1" stroke="#7A4C34" stroke-width="5"/><circle cx="63" cy="72" r="8" fill="#7EC7E8"/><circle cx="100" cy="72" r="8" fill="#F7D66B"/><circle cx="137" cy="72" r="8" fill="#9EDDBA"/><path d="M61 130 H139" stroke="#F6A4C6" stroke-width="7"/>`),
    "aquarium-bubble": icon(190, 155, `<ellipse cx="95" cy="137" rx="66" ry="12" fill="#7A4C34" opacity="0.12"/><rect x="27" y="38" width="136" height="88" rx="20" fill="#B9E8F8" stroke="#7A4C34" stroke-width="6"/><path d="M36 91 C70 75 110 107 154 86" fill="none" stroke="#7EC7E8" stroke-width="8"/><path d="M80 73 C101 55 124 73 103 91 C96 88 88 82 80 73 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="4"/><circle cx="51" cy="62" r="6" fill="#FFF8F1"/><circle cx="143" cy="57" r="5" fill="#FFF8F1"/><path d="M44 126 H146" stroke="#7A4C34" stroke-width="6"/>`),
    "vanity-heart": icon(205, 220, `<ellipse cx="102" cy="200" rx="62" ry="13" fill="#7A4C34" opacity="0.12"/><ellipse cx="102" cy="67" rx="47" ry="53" fill="#DDF3FF" stroke="#7A4C34" stroke-width="6"/><path d="M102 51 C84 31 54 46 64 72 C73 97 102 111 102 111 C102 111 131 97 140 72 C150 46 120 31 102 51 Z" fill="#F7B2D1" opacity="0.65"/><rect x="42" y="124" width="120" height="46" rx="16" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><path d="M64 170 L52 207 M140 170 L152 207" stroke="#7A4C34" stroke-width="6"/><circle cx="102" cy="148" r="7" fill="#F7D66B"/>`),
    "plush-bunny": icon(135, 160, `<ellipse cx="68" cy="144" rx="44" ry="12" fill="#7A4C34" opacity="0.12"/><path d="M49 52 C34 2 62 4 68 56" fill="#FFF8F1" stroke="#7A4C34" stroke-width="6"/><path d="M86 52 C101 2 73 4 67 56" fill="#FFF8F1" stroke="#7A4C34" stroke-width="6"/><circle cx="68" cy="80" r="43" fill="#FFF8F1" stroke="#7A4C34" stroke-width="6"/><ellipse cx="68" cy="121" rx="34" ry="28" fill="#F7B2D1" stroke="#7A4C34" stroke-width="5"/><circle cx="55" cy="74" r="5" fill="#7A4C34"/><circle cx="81" cy="74" r="5" fill="#7A4C34"/><path d="M59 93 C64 99 72 99 77 93" fill="none" stroke="#7A4C34" stroke-width="4"/>`),
    "blocks-rainbow": icon(165, 125, `<ellipse cx="83" cy="108" rx="58" ry="11" fill="#7A4C34" opacity="0.12"/><rect x="18" y="61" width="45" height="37" rx="9" fill="#F6A4C6" stroke="#7A4C34" stroke-width="5"/><rect x="62" y="36" width="46" height="62" rx="9" fill="#F7D66B" stroke="#7A4C34" stroke-width="5"/><rect x="106" y="53" width="39" height="45" rx="9" fill="#7EC7E8" stroke="#7A4C34" stroke-width="5"/><path d="M40 73 L46 85 L59 87 L49 96 L52 109 L40 103 L28 109 L31 96 L21 87 L34 85 Z" fill="#FFF8F1"/><circle cx="85" cy="61" r="8" fill="#FFF8F1"/><path d="M119 76 H134" stroke="#FFF8F1" stroke-width="5"/>`)
  };
}

function objectAssets() {
  return {
    "juice-cup": icon(92, 118, `<ellipse cx="46" cy="106" rx="30" ry="8" fill="#7A4C34" opacity="0.12"/><path d="M20 25 H72 L64 98 H28 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><path d="M29 42 H63" stroke="#FFF8F1" stroke-width="6"/><path d="M47 25 L64 7" stroke="#7A4C34" stroke-width="5"/><path d="M34 66 C43 78 52 78 61 66" fill="none" stroke="#FFF8F1" stroke-width="5" opacity="0.72"/>`),
    "book-blue": icon(118, 92, `<ellipse cx="59" cy="78" rx="42" ry="8" fill="#7A4C34" opacity="0.12"/><path d="M16 26 C33 14 49 14 59 27 C69 14 85 14 102 26 V72 C84 62 70 62 59 75 C48 62 34 62 16 72 Z" fill="#8ED0F0" stroke="#7A4C34" stroke-width="6"/><path d="M59 27 V75" stroke="#7A4C34" stroke-width="5"/><path d="M29 39 C38 35 46 36 52 42 M72 42 C80 36 88 35 96 39" stroke="#FFF8F1" stroke-width="4" opacity="0.7"/>`),
    "pet-bowl": bowl("#9FD8F0", "#F6A4C6"),
    "water-bowl": bowl("#9EDDBA", "#8ED0F0"),
    "pet-toy": icon(98, 98, `<ellipse cx="49" cy="84" rx="34" ry="8" fill="#7A4C34" opacity="0.12"/><circle cx="49" cy="48" r="34" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><path d="M24 48 H74 M49 23 V73" stroke="#FFF8F1" stroke-width="7"/><path d="M30 28 C42 40 55 42 68 32" fill="none" stroke="#FFFFFF" stroke-width="5" opacity="0.34"/>`),
    "dog-biscuit": icon(105, 78, `<ellipse cx="52" cy="66" rx="35" ry="7" fill="#7A4C34" opacity="0.12"/><path d="M25 19 C34 6 48 10 52 22 C56 10 71 6 80 19 C93 28 88 45 75 49 C72 62 57 63 52 52 C47 63 33 62 29 49 C16 45 12 28 25 19 Z" fill="#D7A978" stroke="#7A4C34" stroke-width="6"/><circle cx="42" cy="35" r="4" fill="#7A4C34"/><circle cx="63" cy="39" r="4" fill="#7A4C34"/>`),
    "apple-snack": icon(102, 92, `<ellipse cx="51" cy="78" rx="33" ry="8" fill="#7A4C34" opacity="0.12"/><path d="M51 35 C34 11 9 32 20 61 C29 84 51 72 51 72 C51 72 73 84 82 61 C93 32 68 11 51 35 Z" fill="#F1829F" stroke="#7A4C34" stroke-width="6"/><path d="M53 34 C52 19 60 11 72 9" stroke="#7A4C34" stroke-width="5"/><path d="M59 18 C73 15 80 24 70 35 C60 34 54 27 59 18 Z" fill="#9EDDBA" stroke="#7A4C34" stroke-width="4"/>`),
    "swing": icon(250, 235, `<ellipse cx="125" cy="214" rx="82" ry="12" fill="#7A4C34" opacity="0.12"/><path d="M45 204 L90 32 H160 L205 204" fill="none" stroke="#7A4C34" stroke-width="8"/><path d="M96 40 L89 143 M154 40 L161 143" stroke="#7A4C34" stroke-width="5"/><path d="M78 143 C102 156 148 156 172 143 L163 172 H87 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><path d="M91 153 C112 162 138 162 159 153" stroke="#FFF8F1" stroke-width="5" opacity="0.65"/>`),
    "slide": icon(270, 230, `<ellipse cx="142" cy="210" rx="86" ry="12" fill="#7A4C34" opacity="0.12"/><path d="M55 190 C123 158 165 100 193 45 L226 60 C190 142 130 196 78 208 Z" fill="#8ED0F0" stroke="#7A4C34" stroke-width="8"/><path d="M184 45 H232 V202" fill="none" stroke="#7A4C34" stroke-width="8"/><path d="M188 91 H236 M176 129 H222" stroke="#7A4C34" stroke-width="6"/><path d="M88 184 C138 158 172 112 197 66" stroke="#FFF8F1" stroke-width="6" opacity="0.6"/>`),
    "strawberry-milk": icon(100, 125, `<ellipse cx="50" cy="112" rx="31" ry="8" fill="#7A4C34" opacity="0.12"/><rect x="26" y="24" width="48" height="80" rx="14" fill="#F7B2D1" stroke="#7A4C34" stroke-width="6"/><rect x="33" y="10" width="34" height="20" rx="7" fill="#FFF8F1" stroke="#7A4C34" stroke-width="5"/><path d="M50 52 C38 38 22 50 30 67 C36 82 50 91 50 91 C50 91 64 82 70 67 C78 50 62 38 50 52 Z" fill="#FFF8F1"/><path d="M50 24 L67 5" stroke="#7A4C34" stroke-width="5"/>`),
    "orange-juice-box": icon(96, 120, `<ellipse cx="48" cy="108" rx="30" ry="8" fill="#7A4C34" opacity="0.12"/><path d="M22 24 H74 L67 104 H29 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="6"/><path d="M30 44 H66" stroke="#FFF8F1" stroke-width="6"/><circle cx="48" cy="70" r="16" fill="#FFB45E" stroke="#7A4C34" stroke-width="4"/><path d="M48 24 L65 6" stroke="#7A4C34" stroke-width="5"/>`),
    "cupcake-heart": icon(108, 98, `<ellipse cx="54" cy="85" rx="34" ry="8" fill="#7A4C34" opacity="0.12"/><path d="M26 48 H82 L75 83 C62 93 46 93 33 83 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="6"/><path d="M25 48 C26 20 53 25 54 25 C55 25 82 20 83 48 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><path d="M54 36 C45 25 31 34 38 47 C43 57 54 63 54 63 C54 63 65 57 70 47 C77 34 63 25 54 36 Z" fill="#FFF8F1"/>`),
    "sandwich-star": icon(122, 86, `<ellipse cx="61" cy="74" rx="41" ry="8" fill="#7A4C34" opacity="0.12"/><path d="M19 28 C45 8 77 8 103 28 L91 66 H31 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="6"/><path d="M30 48 H92" stroke="#9EDDBA" stroke-width="10"/><path d="M61 24 L68 38 L84 40 L72 52 L75 68 L61 60 L47 68 L50 52 L38 40 L54 38 Z" fill="#FFF8F1"/>`),
    "tea-set": icon(135, 95, `<ellipse cx="67" cy="82" rx="46" ry="7" fill="#7A4C34" opacity="0.12"/><path d="M34 38 H84 L77 66 C65 77 53 77 41 66 Z" fill="#F6A4C6" stroke="#7A4C34" stroke-width="6"/><path d="M84 46 C109 40 104 66 84 63" fill="none" stroke="#7A4C34" stroke-width="5"/><circle cx="104" cy="66" r="12" fill="#F7D66B" stroke="#7A4C34" stroke-width="5"/><path d="M18 78 H118" stroke="#7A4C34" stroke-width="5"/>`),
    "bubble-wand": icon(104, 134, `<ellipse cx="52" cy="119" rx="31" ry="7" fill="#7A4C34" opacity="0.1"/><path d="M34 114 L62 45" stroke="#7A4C34" stroke-width="7"/><circle cx="64" cy="36" r="23" fill="none" stroke="#8ED0F0" stroke-width="7"/><circle cx="30" cy="39" r="9" fill="#DDF3FF" stroke="#7A4C34" stroke-width="4"/><circle cx="76" cy="81" r="11" fill="#DDF3FF" stroke="#7A4C34" stroke-width="4"/><circle cx="47" cy="16" r="6" fill="#FFF8F1" stroke="#7A4C34" stroke-width="3"/>`),
    "star-ball": icon(102, 102, `<ellipse cx="51" cy="88" rx="33" ry="8" fill="#7A4C34" opacity="0.12"/><circle cx="51" cy="50" r="36" fill="#8ED0F0" stroke="#7A4C34" stroke-width="6"/><path d="M51 24 L60 42 L80 45 L65 59 L69 79 L51 69 L33 79 L37 59 L22 45 L42 42 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="4"/>`),
    "carrot-snack": icon(104, 92, `<ellipse cx="52" cy="79" rx="31" ry="8" fill="#7A4C34" opacity="0.12"/><path d="M32 29 C53 27 78 40 82 43 C63 68 34 76 23 72 C19 52 23 36 32 29 Z" fill="#FFB45E" stroke="#7A4C34" stroke-width="6"/><path d="M32 29 C28 9 47 21 50 28 C56 5 70 18 62 34" fill="#9EDDBA" stroke="#7A4C34" stroke-width="5"/><path d="M41 46 L60 42 M34 60 L50 56" stroke="#FFF8F1" stroke-width="4"/>`),
    "berry-bowl": icon(110, 90, `<ellipse cx="55" cy="78" rx="38" ry="8" fill="#7A4C34" opacity="0.12"/><ellipse cx="55" cy="55" rx="39" ry="18" fill="#9EDDBA" stroke="#7A4C34" stroke-width="6"/><path d="M20 51 C31 78 79 78 90 51" fill="#FFF8F1" stroke="#7A4C34" stroke-width="6"/><circle cx="39" cy="41" r="9" fill="#F1829F" stroke="#7A4C34" stroke-width="3"/><circle cx="57" cy="35" r="9" fill="#8ED0F0" stroke="#7A4C34" stroke-width="3"/><circle cx="73" cy="43" r="9" fill="#C6A6EE" stroke="#7A4C34" stroke-width="3"/>`),
    "rice-bone": icon(112, 80, `<ellipse cx="56" cy="68" rx="35" ry="7" fill="#7A4C34" opacity="0.12"/><path d="M30 30 C22 15 40 8 52 22 C64 8 82 15 74 30 V48 C82 63 64 70 52 56 C40 70 22 63 30 48 Z" fill="#FFF8F1" stroke="#7A4C34" stroke-width="6"/><circle cx="46" cy="40" r="3" fill="#F7D66B"/><circle cx="62" cy="40" r="3" fill="#F7D66B"/>`),
    "pet-milk": icon(92, 110, `<ellipse cx="46" cy="98" rx="28" ry="7" fill="#7A4C34" opacity="0.12"/><rect x="25" y="23" width="42" height="70" rx="13" fill="#FFF8F1" stroke="#7A4C34" stroke-width="6"/><rect x="32" y="9" width="28" height="20" rx="6" fill="#8ED0F0" stroke="#7A4C34" stroke-width="5"/><path d="M37 54 C45 43 55 43 63 54 C55 68 45 68 37 54 Z" fill="#F6A4C6"/>`)
  };
}

function bowl(base, accent) {
  return icon(110, 82, `<ellipse cx="55" cy="70" rx="38" ry="8" fill="#7A4C34" opacity="0.12"/><ellipse cx="55" cy="47" rx="39" ry="18" fill="${base}" stroke="#7A4C34" stroke-width="6"/><path d="M20 44 C31 70 79 70 90 44" fill="${accent}" stroke="#7A4C34" stroke-width="6"/><path d="M33 43 C47 51 63 51 77 43" fill="none" stroke="#FFF8F1" stroke-width="5" opacity="0.66"/>`);
}

function petAccessoryAssets() {
  return {
    "pet-collar-pink": icon(210, 170, `<rect x="63" y="89" width="88" height="16" rx="8" fill="#F6A4C6" stroke="#7A4C34" stroke-width="5"/><circle cx="107" cy="112" r="8" fill="#F7D66B" stroke="#7A4C34" stroke-width="4"/>`),
    "pet-bow-blue": icon(210, 170, `<path d="M96 47 L52 29 C38 60 56 78 96 63 Z" fill="#8ED0F0" stroke="#7A4C34" stroke-width="5"/><path d="M118 47 L162 29 C176 60 158 78 118 63 Z" fill="#8ED0F0" stroke="#7A4C34" stroke-width="5"/><circle cx="107" cy="55" r="14" fill="#F7D66B" stroke="#7A4C34" stroke-width="5"/>`),
    "pet-cape-star": icon(210, 170, `<path d="M58 92 C94 128 145 128 178 92 L190 145 C145 168 75 168 28 145 Z" fill="#8ED0F0" stroke="#7A4C34" stroke-width="5"/><path d="M110 112 L118 128 L136 131 L123 143 L126 162 L110 153 L94 162 L97 143 L84 131 L102 128 Z" fill="#F7D66B"/>`),
    "pet-glasses-round": icon(210, 170, `<circle cx="84" cy="67" r="18" fill="none" stroke="#F7D66B" stroke-width="5"/><circle cx="129" cy="67" r="18" fill="none" stroke="#F7D66B" stroke-width="5"/><path d="M102 67 H111" stroke="#F7D66B" stroke-width="5"/>`),
    "pet-bandana-mint": icon(210, 170, `<path d="M64 96 H152 L108 138 Z" fill="#9EDDBA" stroke="#7A4C34" stroke-width="5"/><circle cx="108" cy="116" r="6" fill="#F6A4C6"/>`),
    "pet-flower-clip": icon(210, 170, `${flower(62, 46, "#F6A4C6", "#F7D66B", 0.9)}`),
    "pet-star-hat": icon(210, 170, `<path d="M68 48 C90 22 126 22 148 48 L156 78 C126 91 90 91 60 78 Z" fill="#F7D66B" stroke="#7A4C34" stroke-width="5"/><path d="M108 35 L114 48 L128 50 L118 60 L120 75 L108 68 L96 75 L98 60 L88 50 L102 48 Z" fill="#F6A4C6"/>`),
    "pet-rainbow-scarf": icon(210, 170, `<path d="M62 92 H154 L144 113 H72 Z" fill="#FFF8F1" stroke="#7A4C34" stroke-width="5"/><path d="M70 101 H146" stroke="#F6A4C6" stroke-width="5"/><path d="M72 109 H144" stroke="#F7D66B" stroke-width="5"/><path d="M140 111 L170 142" stroke="#8ED0F0" stroke-width="10"/><path d="M152 111 L182 142" stroke="#9EDDBA" stroke-width="10"/>`)
  };
}

function dogDollhouse(body, ear) {
  return icon(210, 170, `<ellipse cx="108" cy="145" rx="70" ry="17" fill="#7A4C34" opacity="0.12"/><path d="M160 112 C193 78 194 122 178 136" fill="none" stroke="#7A4C34" stroke-width="8"/><ellipse cx="108" cy="109" rx="62" ry="42" fill="${body}" stroke="#7A4C34" stroke-width="7"/><ellipse cx="72" cy="134" rx="18" ry="28" fill="${body}" stroke="#7A4C34" stroke-width="6"/><ellipse cx="132" cy="134" rx="18" ry="28" fill="${body}" stroke="#7A4C34" stroke-width="6"/><path d="M64 63 C38 20 26 65 37 98 C51 105 63 94 70 78 Z" fill="${ear}" stroke="#7A4C34" stroke-width="6"/><path d="M132 63 C158 20 170 65 159 98 C145 105 133 94 126 78 Z" fill="${ear}" stroke="#7A4C34" stroke-width="6"/><circle cx="98" cy="72" r="52" fill="${body}" stroke="#7A4C34" stroke-width="7"/><ellipse cx="98" cy="91" rx="40" ry="27" fill="#FFF2D8" opacity="0.92"/><ellipse cx="78" cy="64" rx="18" ry="16" fill="#FFF2D8" opacity="0.5"/><circle cx="80" cy="70" r="6" fill="#4B2E20"/><circle cx="116" cy="70" r="6" fill="#4B2E20"/><circle cx="78" cy="67" r="2.4" fill="#FFFFFF"/><circle cx="114" cy="67" r="2.4" fill="#FFFFFF"/><path d="M91 87 C96 92 101 92 106 87" fill="none" stroke="#4B2E20" stroke-width="4"/><path d="M86 99 C96 109 110 109 120 99" fill="none" stroke="#4B2E20" stroke-width="4"/><ellipse cx="62" cy="89" rx="12" ry="7" fill="#F6A4C6" opacity="0.36"/><ellipse cx="134" cy="89" rx="12" ry="7" fill="#F6A4C6" opacity="0.36"/>`);
}

function star(x, y, radius, fill) {
  return `<path d="${starPath(x, y, radius)}" fill="${fill}" stroke="#7A4C34" stroke-width="${Math.max(3, radius / 6)}"/>`;
}

function starPath(x, y, radius) {
  return Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 5;
    const r = index % 2 === 0 ? radius : radius * 0.46;
    const px = round(x + Math.cos(angle) * r);
    const py = round(y + Math.sin(angle) * r);
    return `${index === 0 ? "M" : "L"}${px} ${py}`;
  }).join(" ") + " Z";
}

function heart(x, y, size, fill) {
  return `<path d="M${x} ${y - size * 0.35} C${x - size * 0.78} ${y - size * 1.18} ${x - size * 1.48} ${y - size * 0.08} ${x} ${y + size * 1.04} C${x + size * 1.48} ${y - size * 0.08} ${x + size * 0.78} ${y - size * 1.18} ${x} ${y - size * 0.35} Z" fill="${fill}" stroke="#7A4C34" stroke-width="${Math.max(3, size / 8)}"/>`;
}

function bow(x, y, size, fill) {
  return `<path d="M${x - 5} ${y} C${x - size * 2.1} ${y - size * 1.2} ${x - size * 2.4} ${y + size * 1.3} ${x - 5} ${y + size * 0.72} Z" fill="${fill}" stroke="#7A4C34" stroke-width="4"/><path d="M${x + 5} ${y} C${x + size * 2.1} ${y - size * 1.2} ${x + size * 2.4} ${y + size * 1.3} ${x + 5} ${y + size * 0.72} Z" fill="${fill}" stroke="#7A4C34" stroke-width="4"/><circle cx="${x}" cy="${y + size * 0.25}" r="${size * 0.52}" fill="#FFF8F1" stroke="#7A4C34" stroke-width="4"/>`;
}

function flower(x, y, petal, center, scale = 1) {
  const rx = 12 * scale;
  const ry = 22 * scale;
  const distance = 22 * scale;
  return `<g stroke="#7A4C34" stroke-width="${4 * scale}" fill="${petal}">${Array.from({ length: 6 }, (_, i) => {
    const angle = i * Math.PI / 3;
    return `<ellipse cx="${round(x + Math.cos(angle) * distance)}" cy="${round(y + Math.sin(angle) * distance)}" rx="${rx}" ry="${ry}" transform="rotate(${round(angle * 180 / Math.PI)} ${round(x + Math.cos(angle) * distance)} ${round(y + Math.sin(angle) * distance)})"/>`;
  }).join("")}<circle cx="${x}" cy="${y}" r="${13 * scale}" fill="${center}"/></g>`;
}

function cloud(x, y, fill) {
  return `<path d="M${x - 48} ${y + 8} C${x - 55} ${y - 20} ${x - 24} ${y - 28} ${x - 10} ${y - 14} C${x + 4} ${y - 45} ${x + 46} ${y - 31} ${x + 42} ${y + 5} C${x + 62} ${y + 3} ${x + 65} ${y + 32} ${x + 38} ${y + 34} H${x - 34} C${x - 55} ${y + 34} ${x - 65} ${y + 14} ${x - 48} ${y + 8} Z" fill="${fill}" stroke="#7A4C34" stroke-width="4"/>`;
}

function rainbow(x, y, radius) {
  return `<path d="M${x - radius} ${y} A${radius} ${radius} 0 0 1 ${x + radius} ${y}" fill="none" stroke="#F6A4C6" stroke-width="10"/><path d="M${x - radius + 14} ${y} A${radius - 14} ${radius - 14} 0 0 1 ${x + radius - 14} ${y}" fill="none" stroke="#F7D66B" stroke-width="10"/><path d="M${x - radius + 28} ${y} A${radius - 28} ${radius - 28} 0 0 1 ${x + radius - 28} ${y}" fill="none" stroke="#8ED0F0" stroke-width="10"/>`;
}

function strawberry(x, y, scale = 1) {
  return `<path d="M${x} ${y - 28 * scale} C${x - 28 * scale} ${y - 58 * scale} ${x - 62 * scale} ${y - 18 * scale} ${x} ${y + 52 * scale} C${x + 62 * scale} ${y - 18 * scale} ${x + 28 * scale} ${y - 58 * scale} ${x} ${y - 28 * scale} Z" fill="#E95E7E" stroke="#7A4C34" stroke-width="${5 * scale}"/><path d="M${x - 22 * scale} ${y - 30 * scale} C${x - 4 * scale} ${y - 52 * scale} ${x + 4 * scale} ${y - 52 * scale} ${x + 22 * scale} ${y - 30 * scale}" fill="#9EDDBA" stroke="#7A4C34" stroke-width="${4 * scale}"/><circle cx="${x - 14 * scale}" cy="${y}" r="${3 * scale}" fill="#FFE7A8"/><circle cx="${x + 14 * scale}" cy="${y}" r="${3 * scale}" fill="#FFE7A8"/><circle cx="${x}" cy="${y + 24 * scale}" r="${3 * scale}" fill="#FFE7A8"/>`;
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function addExpandedAssets() {
  files.set("clothes/top-cat-pocket.svg", clothing(`<path d="M176 270 Q256 230 336 270 L364 356 L324 376 L304 334 L304 438 L208 438 L208 334 L188 376 L148 356 Z" fill="#FFD7E8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M220 350 H292 V414 Q256 444 220 414 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="5"/><path d="M236 350 L246 326 L256 350 L266 326 L276 350" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="4"/><circle cx="244" cy="382" r="5" fill="#6E4A2C"/><circle cx="268" cy="382" r="5" fill="#6E4A2C"/><path d="M247 400 Q256 408 265 400" fill="none" stroke="#6E4A2C" stroke-width="4"/>`));
  files.set("clothes/top-cloud-dream.svg", clothing(`<path d="M176 270 Q256 232 336 270 L362 355 L322 374 L303 333 L303 438 L209 438 L209 333 L190 374 L150 355 Z" fill="#CFEFFF" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M218 380 Q212 350 240 350 Q252 328 276 350 Q306 348 300 382 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="5"/><path d="M238 407 l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2z" fill="#FFE8A8"/>`));
  files.set("clothes/top-strawberry.svg", clothing(`<path d="M176 270 Q256 232 336 270 L362 355 L322 374 L303 333 L303 438 L209 438 L209 333 L190 374 L150 355 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M256 332 C232 306 204 330 218 362 C229 389 256 410 256 410 C256 410 283 389 294 362 C308 330 280 306 256 332 Z" fill="#F75B73" stroke="#6E4A2C" stroke-width="5"/><path d="M238 327 Q256 305 274 327" fill="#8FCF91" stroke="#6E4A2C" stroke-width="4"/><g fill="#FFE8A8"><circle cx="244" cy="356" r="3"/><circle cx="266" cy="356" r="3"/><circle cx="256" cy="378" r="3"/></g>`));
  files.set("clothes/top-sailor-bow.svg", clothing(`<path d="M176 270 Q256 232 336 270 L362 355 L322 374 L303 333 L303 438 L209 438 L209 333 L190 374 L150 355 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M214 292 Q256 328 298 292 L286 338 Q256 362 226 338 Z" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="5"/><path d="M242 344 L218 328 Q205 348 222 366 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="4"/><path d="M270 344 L294 328 Q307 348 290 366 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="4"/><circle cx="256" cy="346" r="10" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="4"/>`));
  files.set("clothes/bottom-tutu-pink.svg", clothing(`<path d="M198 420 H314 L338 478 Q256 520 174 478 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M188 462 Q256 560 324 462 L356 550 Q256 604 156 550 Z" fill="#FFD7E8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M202 484 Q256 526 310 484" fill="none" stroke="#FAF4E8" stroke-width="7"/>`));
  files.set("clothes/bottom-rainbow-leggings.svg", clothing(`<path d="M202 418 L310 418 L330 548 L282 548 L256 468 L230 548 L182 548 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M210 438 H302" stroke="#FFB6D5" stroke-width="16"/><path d="M214 468 H298" stroke="#FFE8A8" stroke-width="16"/><path d="M220 498 H292" stroke="#B5E6C5" stroke-width="16"/><path d="M226 528 H286" stroke="#A0D8F0" stroke-width="16"/><path d="M256 466 L232 548 M256 466 L280 548" stroke="#6E4A2C" stroke-width="5"/>`));
  files.set("clothes/bottom-heart-shorts.svg", clothing(`<path d="M204 416 L308 416 L326 548 L280 548 L256 464 L232 548 L186 548 Z" fill="#FF9FC8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M226 460 C216 448 200 456 206 472 C211 484 226 492 226 492 C226 492 241 484 246 472 C252 456 236 448 226 460 Z" fill="#FAF4E8"/><path d="M286 460 C276 448 260 456 266 472 C271 484 286 492 286 492 C286 492 301 484 306 472 C312 456 296 448 286 460 Z" fill="#FAF4E8"/>`));
  files.set("clothes/bottom-cloud-skirt.svg", clothing(`<path d="M198 420 L314 420 L350 550 Q256 592 162 550 Z" fill="#CFEFFF" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M204 482 Q198 452 226 452 Q238 430 262 452 Q292 450 286 484 Z" fill="#FAF4E8"/><path d="M262 522 Q278 496 306 520" fill="none" stroke="#FAF4E8" stroke-width="8" stroke-linecap="round"/>`));
  files.set("clothes/dress-cupcake-lilac.svg", clothing(`<path d="M182 270 Q256 224 330 270 L358 356 L320 378 L304 342 L352 588 Q256 636 160 588 L208 342 L192 378 L154 356 Z" fill="#D9C1FF" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M222 446 H290 L278 522 Q256 540 234 522 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="5"/><path d="M224 446 Q256 402 288 446" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="5"/><circle cx="256" cy="412" r="8" fill="#F75B73" stroke="#6E4A2C" stroke-width="3"/>`));
  files.set("clothes/dress-rainbow-tutu.svg", clothing(`<path d="M182 270 Q256 224 330 270 L358 356 L320 378 L304 342 L338 466 Q256 506 174 466 L208 342 L192 378 L154 356 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M204 380 A52 52 0 0 1 308 380" fill="none" stroke="#FFB6D5" stroke-width="11"/><path d="M220 380 A36 36 0 0 1 292 380" fill="none" stroke="#FFE8A8" stroke-width="11"/><path d="M236 380 A20 20 0 0 1 276 380" fill="none" stroke="#A0D8F0" stroke-width="11"/><path d="M174 466 Q256 616 338 466 L364 590 Q256 646 148 590 Z" fill="#FFD7E8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/>`));
  files.set("clothes/dress-rose-red.svg", clothing(`<path d="M182 270 Q256 224 330 270 L358 356 L320 378 L304 342 L352 588 Q256 636 160 588 L208 342 L192 378 L154 356 Z" fill="#FF8DAE" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M256 424 C238 402 212 420 226 446 C238 470 256 482 256 482 C256 482 274 470 286 446 C300 420 274 402 256 424 Z" fill="#FAF4E8"/><path d="M238 520 Q256 492 274 520 Q256 548 238 520 Z" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="4"/>`));
  files.set("clothes/shoes-lilac-boots.svg", clothing(`<path d="M176 600 H246 L250 668 H172 Q158 650 178 632 Z" fill="#D4B8FF" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M336 600 H266 L262 668 H340 Q354 650 334 632 Z" fill="#D4B8FF" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M182 628 H244 M268 628 H330" stroke="#FAF4E8" stroke-width="6" stroke-linecap="round"/>`));
  files.set("clothes/shoes-blue-sneakers.svg", clothing(`<path d="M178 632 Q220 608 252 636 L250 668 L172 668 Q158 650 178 632 Z" fill="#83C7EB" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M334 632 Q292 608 260 636 L262 668 L340 668 Q354 650 334 632 Z" fill="#83C7EB" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M190 640 L232 640 M280 640 L322 640" stroke="#FAF4E8" stroke-width="6" stroke-linecap="round"/>`));
  files.set("clothes/acc-hat-bear.svg", clothing(`<path d="M162 132 Q256 40 350 132 Q342 176 256 184 Q170 176 162 132 Z" fill="#D8AA82" stroke="#6E4A2C" stroke-width="7"/><circle cx="190" cy="98" r="30" fill="#D8AA82" stroke="#6E4A2C" stroke-width="7"/><circle cx="322" cy="98" r="30" fill="#D8AA82" stroke="#6E4A2C" stroke-width="7"/><path d="M214 136 Q256 160 298 136" fill="none" stroke="#FAF4E8" stroke-width="7" stroke-linecap="round"/>`));
  files.set("clothes/acc-flower-clip.svg", clothing(`<g stroke="#6E4A2C" stroke-width="5"><ellipse cx="150" cy="144" rx="12" ry="24" fill="#FFB6D5"/><ellipse cx="150" cy="200" rx="12" ry="24" fill="#FFB6D5"/><ellipse cx="122" cy="172" rx="24" ry="12" fill="#FFB6D5"/><ellipse cx="178" cy="172" rx="24" ry="12" fill="#FFB6D5"/><circle cx="150" cy="172" r="13" fill="#FFE8A8"/></g>`));
  files.set("clothes/acc-wing-backpack.svg", clothing(`<path d="M124 388 Q52 336 66 458 Q114 466 144 426 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7"/><path d="M388 388 Q460 336 446 458 Q398 466 368 426 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7"/><path d="M318 410 Q364 398 386 438 L376 526 Q344 552 306 526 L298 438 Q302 420 318 410 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7"/><path d="M342 446 l7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#FFE8A8"/>`));
  files.set("clothes/acc-magic-wand.svg", clothing(`<path d="M328 430 L390 342" stroke="#6E4A2C" stroke-width="8" stroke-linecap="round"/><path d="M390 322 l9 19 21 3-15 15 4 21-19-10-19 10 4-21-15-15 21-3z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="5"/><circle cx="356" cy="382" r="6" fill="#FFB6D5"/><circle cx="376" cy="356" r="5" fill="#A0D8F0"/>`));
  files.set("clothes/acc-kitty-ear.svg", clothing(`<path d="M172 128 L208 64 L236 144 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M340 128 L304 64 L276 144 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M204 144 Q256 120 308 144" fill="none" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/>`));

  files.set("furniture/dollhouse-pastel.svg", icon(190, 190, `<path d="M24 82 L95 24 L166 82 V162 H24 Z" fill="#FFD7E8" stroke="#6E4A2C" stroke-width="8" stroke-linejoin="round"/><path d="M58 82 H88 V116 H58 Z M104 82 H134 V116 H104 Z" fill="#CFEFFF" stroke="#6E4A2C" stroke-width="5"/><path d="M76 162 V126 H114 V162" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="6"/><path d="M24 82 H166" stroke="#FAF4E8" stroke-width="6"/>`));
  files.set("furniture/art-easel.svg", icon(150, 190, `<path d="M75 24 L34 166 M75 24 L116 166 M50 126 H100" stroke="#6E4A2C" stroke-width="8" stroke-linecap="round"/><rect x="38" y="44" width="74" height="74" rx="10" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7"/><path d="M52 82 Q70 58 92 82" fill="none" stroke="#FFB6D5" stroke-width="8" stroke-linecap="round"/><circle cx="62" cy="98" r="8" fill="#A0D8F0"/><circle cx="89" cy="100" r="7" fill="#FFE8A8"/>`));
  files.set("furniture/floor-cushion-star.svg", icon(150, 100, `<path d="M75 18 l16 30 34 5-25 23 6 33-31-16-31 16 6-33-25-23 34-5z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="7" stroke-linejoin="round"/><path d="M50 62 Q75 78 100 62" fill="none" stroke="#FAF4E8" stroke-width="6" stroke-linecap="round"/>`));
  files.set("furniture/tea-table.svg", icon(180, 140, `<ellipse cx="90" cy="72" rx="62" ry="24" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7"/><path d="M52 92 L42 128 M128 92 L138 128" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/><path d="M70 48 H110 L104 72 H76 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="5"/><path d="M104 54 Q128 48 122 68 Q116 80 104 68" fill="none" stroke="#6E4A2C" stroke-width="5"/><circle cx="128" cy="68" r="10" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="5"/>`));
  files.set("furniture/play-tent.svg", icon(190, 210, `<path d="M28 180 L95 28 L162 180 Z" fill="#CFEFFF" stroke="#6E4A2C" stroke-width="8" stroke-linejoin="round"/><path d="M95 28 V180" stroke="#6E4A2C" stroke-width="6"/><path d="M95 96 Q62 122 64 180 H126 Q128 122 95 96 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="6"/><path d="M58 92 H132" stroke="#FFB6D5" stroke-width="9" stroke-linecap="round"/><path d="M42 132 H148" stroke="#FFE8A8" stroke-width="9" stroke-linecap="round"/>`));
  files.set("furniture/toy-kitchen.svg", icon(180, 210, `<rect x="24" y="38" width="132" height="142" rx="18" fill="#FFD7E8" stroke="#6E4A2C" stroke-width="8"/><rect x="42" y="92" width="96" height="58" rx="12" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="6"/><circle cx="60" cy="66" r="8" fill="#A0D8F0"/><circle cx="90" cy="66" r="8" fill="#FFE8A8"/><circle cx="120" cy="66" r="8" fill="#B5E6C5"/><path d="M54 120 H126" stroke="#FFB6D5" stroke-width="7" stroke-linecap="round"/>`));
  files.set("furniture/aquarium-bubble.svg", icon(170, 140, `<rect x="24" y="34" width="122" height="80" rx="18" fill="#CFEFFF" stroke="#6E4A2C" stroke-width="7"/><path d="M32 86 Q70 70 108 86 Q128 96 140 86" fill="none" stroke="#83C7EB" stroke-width="8"/><path d="M72 72 Q92 54 112 72 Q92 90 72 72 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="5"/><circle cx="46" cy="58" r="6" fill="#FAF4E8"/><circle cx="128" cy="54" r="5" fill="#FAF4E8"/><path d="M42 114 H128" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/>`));
  files.set("furniture/vanity-heart.svg", icon(180, 205, `<ellipse cx="90" cy="62" rx="42" ry="48" fill="#DDEFFC" stroke="#6E4A2C" stroke-width="7"/><path d="M90 46 C74 28 48 42 56 66 C64 88 90 100 90 100 C90 100 116 88 124 66 C132 42 106 28 90 46 Z" fill="#FFD7E8" opacity="0.7"/><rect x="36" y="112" width="108" height="42" rx="14" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="7"/><path d="M56 154 L46 190 M124 154 L134 190" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/><circle cx="90" cy="134" r="7" fill="#FFE8A8"/>`));
  files.set("furniture/plush-bunny.svg", icon(120, 145, `<path d="M42 46 Q28 4 48 6 Q66 22 60 56" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7"/><path d="M78 46 Q92 4 72 6 Q54 22 60 56" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7"/><circle cx="60" cy="70" r="38" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="7"/><ellipse cx="60" cy="108" rx="34" ry="28" fill="#FFD7E8" stroke="#6E4A2C" stroke-width="6"/><circle cx="48" cy="64" r="5" fill="#6E4A2C"/><circle cx="72" cy="64" r="5" fill="#6E4A2C"/><path d="M52 82 Q60 90 68 82" fill="none" stroke="#6E4A2C" stroke-width="4" stroke-linecap="round"/>`));
  files.set("furniture/blocks-rainbow.svg", icon(150, 110, `<rect x="18" y="56" width="42" height="34" rx="8" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><rect x="58" y="34" width="42" height="56" rx="8" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="6"/><rect x="98" y="50" width="36" height="40" rx="8" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="6"/><path d="M34 70 l5 9 10 1-7 7 2 10-10-5-10 5 2-10-7-7 10-1z" fill="#FAF4E8"/><circle cx="79" cy="58" r="8" fill="#FAF4E8"/><path d="M112 68 H128" stroke="#FAF4E8" stroke-width="6" stroke-linecap="round"/>`));

  files.set("objects/strawberry-milk.svg", icon(90, 110, `<rect x="24" y="20" width="42" height="76" rx="12" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><rect x="30" y="8" width="30" height="18" rx="6" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="5"/><path d="M45 48 C35 36 22 46 28 60 C33 72 45 80 45 80 C45 80 57 72 62 60 C68 46 55 36 45 48 Z" fill="#FAF4E8"/><path d="M45 20 L58 2" stroke="#6E4A2C" stroke-width="5" stroke-linecap="round"/>`));
  files.set("objects/orange-juice-box.svg", icon(85, 105, `<path d="M20 22 H65 L60 94 H25 Z" fill="#FFE08A" stroke="#6E4A2C" stroke-width="6" stroke-linejoin="round"/><path d="M28 42 H58" stroke="#FAF4E8" stroke-width="6"/><circle cx="43" cy="64" r="14" fill="#FFB35C" stroke="#6E4A2C" stroke-width="4"/><path d="M43 22 L57 4" stroke="#6E4A2C" stroke-width="5"/>`));
  files.set("objects/cupcake-heart.svg", icon(95, 90, `<path d="M24 44 H72 L66 78 Q48 88 30 78 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="6"/><path d="M22 44 Q24 18 48 24 Q72 18 74 44 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><path d="M48 34 C40 24 28 32 34 44 C38 52 48 58 48 58 C48 58 58 52 62 44 C68 32 56 24 48 34 Z" fill="#FAF4E8"/>`));
  files.set("objects/sandwich-star.svg", icon(110, 75, `<path d="M18 24 Q55 2 92 24 L82 58 H28 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="6" stroke-linejoin="round"/><path d="M26 44 H84" stroke="#B5E6C5" stroke-width="10" stroke-linecap="round"/><path d="M55 20 l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2z" fill="#FAF4E8"/>`));
  files.set("objects/tea-set.svg", icon(120, 85, `<path d="M32 34 H78 L72 62 Q55 76 38 62 Z" fill="#FFB6D5" stroke="#6E4A2C" stroke-width="6"/><path d="M78 42 Q102 36 96 58 Q90 72 74 60" fill="none" stroke="#6E4A2C" stroke-width="5"/><circle cx="92" cy="62" r="12" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="5"/><path d="M18 72 H106" stroke="#6E4A2C" stroke-width="6" stroke-linecap="round"/>`));
  files.set("objects/bubble-wand.svg", icon(90, 120, `<path d="M30 104 L56 40" stroke="#6E4A2C" stroke-width="7" stroke-linecap="round"/><circle cx="58" cy="32" r="20" fill="none" stroke="#A0D8F0" stroke-width="7"/><circle cx="28" cy="34" r="8" fill="#CFEFFF" stroke="#6E4A2C" stroke-width="4"/><circle cx="66" cy="72" r="10" fill="#CFEFFF" stroke="#6E4A2C" stroke-width="4"/><circle cx="40" cy="14" r="6" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="3"/>`));
  files.set("objects/star-ball.svg", icon(90, 90, `<circle cx="45" cy="45" r="32" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="6"/><path d="M45 22 l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="4"/>`));
  files.set("objects/carrot-snack.svg", icon(90, 80, `<path d="M30 26 Q52 26 72 36 Q54 62 22 68 Q18 42 30 26 Z" fill="#FFB35C" stroke="#6E4A2C" stroke-width="6"/><path d="M30 26 Q24 8 42 18 Q48 2 58 20" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="5" stroke-linecap="round"/><path d="M38 42 L56 38 M32 56 L46 52" stroke="#FAF4E8" stroke-width="4" stroke-linecap="round"/>`));
  files.set("objects/berry-bowl.svg", icon(100, 80, `<ellipse cx="50" cy="52" rx="36" ry="18" fill="#B5E6C5" stroke="#6E4A2C" stroke-width="6"/><path d="M18 48 Q50 76 82 48" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="6"/><circle cx="36" cy="38" r="9" fill="#FF7AA7" stroke="#6E4A2C" stroke-width="3"/><circle cx="52" cy="32" r="9" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="3"/><circle cx="66" cy="40" r="9" fill="#D4B8FF" stroke="#6E4A2C" stroke-width="3"/>`));
  files.set("objects/rice-bone.svg", icon(100, 70, `<path d="M28 28 Q20 14 36 10 Q48 10 50 22 Q52 10 64 10 Q80 14 72 28 L72 42 Q80 56 64 60 Q52 60 50 48 Q48 60 36 60 Q20 56 28 42 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="6"/><circle cx="40" cy="35" r="3" fill="#FFE8A8"/><circle cx="60" cy="35" r="3" fill="#FFE8A8"/>`));
  files.set("objects/pet-milk.svg", icon(80, 95, `<rect x="22" y="20" width="36" height="62" rx="10" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="6"/><rect x="28" y="8" width="24" height="18" rx="5" fill="#A0D8F0" stroke="#6E4A2C" stroke-width="5"/><path d="M32 48 Q40 38 48 48 Q40 62 32 48 Z" fill="#FFB6D5"/>`));

  files.set("pets/pet-flower-clip.svg", petOverlay(`<g stroke="#6E4A2C" stroke-width="4"><ellipse cx="52" cy="22" rx="8" ry="15" fill="#FFB6D5"/><ellipse cx="52" cy="58" rx="8" ry="15" fill="#FFB6D5"/><ellipse cx="34" cy="40" rx="15" ry="8" fill="#FFB6D5"/><ellipse cx="70" cy="40" rx="15" ry="8" fill="#FFB6D5"/><circle cx="52" cy="40" r="9" fill="#FFE8A8"/></g>`));
  files.set("pets/pet-star-hat.svg", petOverlay(`<path d="M64 32 Q92 6 120 32 L128 66 Q92 80 56 66 Z" fill="#FFE8A8" stroke="#6E4A2C" stroke-width="5"/><path d="M92 18 l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2z" fill="#FFB6D5"/>`));
  files.set("pets/pet-rainbow-scarf.svg", petOverlay(`<path d="M54 82 H132 L122 102 H64 Z" fill="#FAF4E8" stroke="#6E4A2C" stroke-width="5"/><path d="M60 91 H126" stroke="#FFB6D5" stroke-width="5"/><path d="M62 99 H124" stroke="#FFE8A8" stroke-width="5"/><path d="M118 100 L144 126" stroke="#A0D8F0" stroke-width="10" stroke-linecap="round"/><path d="M126 100 L152 126" stroke="#B5E6C5" stroke-width="10" stroke-linecap="round"/>`));
}

function clothing(content) {
  return wrapSvg(512, 768, content);
}

function icon(width, height, content) {
  return wrapSvg(width, height, content);
}

function wrapSvg(width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
  <g id="art-source" stroke-linecap="round" stroke-linejoin="round">${content}</g>
  <mask id="art-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">
    <use href="#art-source" fill="#fff" stroke="#fff"/>
  </mask>
  <linearGradient id="gloss" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.45"/>
    <stop offset="0.42" stop-color="#FFFFFF" stop-opacity="0.12"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
  <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="145%">
    <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#6E4A2C" flood-opacity="0.18"/>
  </filter>
</defs>
<use href="#art-source" filter="url(#soft-shadow)"/>
<use href="#art-source"/>
<ellipse cx="${width * 0.34}" cy="${height * 0.18}" rx="${width * 0.34}" ry="${height * 0.2}" fill="url(#gloss)" mask="url(#art-mask)" pointer-events="none"/>
</svg>`;
}

function dog(color) {
  return icon(210, 170, `<ellipse cx="108" cy="124" rx="70" ry="28" fill="#6E4A2C" opacity="0.14"/>
<path d="M156 102 Q196 64 190 126" fill="none" stroke="#6E4A2C" stroke-width="9"/>
<ellipse cx="108" cy="98" rx="62" ry="43" fill="${color}" stroke="#6E4A2C" stroke-width="7"/>
<ellipse cx="70" cy="126" rx="18" ry="28" fill="${color}" stroke="#6E4A2C" stroke-width="6"/>
<ellipse cx="132" cy="128" rx="18" ry="28" fill="${color}" stroke="#6E4A2C" stroke-width="6"/>
<path d="M64 60 Q38 16 28 66 Q32 100 58 91 Z" fill="#E8B68E" stroke="#6E4A2C" stroke-width="7"/>
<path d="M132 60 Q158 16 168 66 Q164 100 138 91 Z" fill="#E8B68E" stroke="#6E4A2C" stroke-width="7"/>
<circle cx="98" cy="68" r="50" fill="${color}" stroke="#6E4A2C" stroke-width="7"/>
<ellipse cx="98" cy="86" rx="38" ry="25" fill="#FFF0D8" stroke="#6E4A2C" stroke-width="4" opacity="0.92"/>
<ellipse cx="78" cy="60" rx="18" ry="16" fill="#FFF0D8" opacity="0.52"/>
<circle cx="80" cy="66" r="6" fill="#4B2E20"/>
<circle cx="116" cy="66" r="6" fill="#4B2E20"/>
<circle cx="78" cy="63" r="2.5" fill="#FFFFFF"/>
<circle cx="114" cy="63" r="2.5" fill="#FFFFFF"/>
<path d="M92 82 Q98 88 104 82" fill="none" stroke="#4B2E20" stroke-width="4"/>
<path d="M86 92 Q98 104 110 92" fill="none" stroke="#4B2E20" stroke-width="4"/>
<ellipse cx="62" cy="82" rx="12" ry="7" fill="#FF9BB1" opacity="0.38"/>
<ellipse cx="134" cy="82" rx="12" ry="7" fill="#FF9BB1" opacity="0.38"/>`);
}

function petOverlay(content) {
  return icon(190, 150, content);
}
