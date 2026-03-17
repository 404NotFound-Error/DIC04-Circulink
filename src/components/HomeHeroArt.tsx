import React from 'react';

const HomeHeroArt: React.FC = () => {
  return (
    <svg
      viewBox="0 0 760 520"
      className="w-full h-auto"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heroBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#72bd79" />
          <stop offset="55%" stopColor="#9cd69b" />
          <stop offset="100%" stopColor="#d9f1ce" />
        </linearGradient>
        <linearGradient id="heroFade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      <rect width="760" height="520" rx="36" fill="url(#heroBg)" />
      <rect x="26" y="18" width="708" height="54" rx="27" fill="#ffffff" fillOpacity="0.18" filter="url(#softBlur)" />
      <circle cx="144" cy="108" r="96" fill="#7cc982" fillOpacity="0.26" />
      <circle cx="674" cy="130" r="116" fill="#e6f7da" fillOpacity="0.4" />
      <circle cx="668" cy="392" r="126" fill="#6cb874" fillOpacity="0.18" />
      <path d="M48 460C148 402 236 390 346 404C454 418 560 450 712 414V520H48Z" fill="#f4fff0" fillOpacity="0.28" />

      <ellipse cx="404" cy="430" rx="182" ry="34" fill="#29583e" fillOpacity="0.14" />

      <path d="M210 194H269L284 322H515" stroke="#18452f" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M278 222H533L497 358H306L278 222Z" stroke="#18452f" strokeWidth="8" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.16" />
      <path d="M330 230L352 350" stroke="#18452f" strokeWidth="5" strokeLinecap="round" />
      <path d="M385 230L395 350" stroke="#18452f" strokeWidth="5" strokeLinecap="round" />
      <path d="M440 230L438 350" stroke="#18452f" strokeWidth="5" strokeLinecap="round" />
      <path d="M495 230L481 350" stroke="#18452f" strokeWidth="5" strokeLinecap="round" />
      <path d="M287 265H521" stroke="#18452f" strokeWidth="5" strokeLinecap="round" />
      <path d="M298 307H505" stroke="#18452f" strokeWidth="5" strokeLinecap="round" />
      <path d="M500 359L538 406" stroke="#18452f" strokeWidth="10" strokeLinecap="round" />
      <circle cx="332" cy="409" r="27" fill="#17472f" />
      <circle cx="534" cy="409" r="27" fill="#17472f" />
      <circle cx="332" cy="409" r="11" fill="#6db97a" />
      <circle cx="534" cy="409" r="11" fill="#6db97a" />

      <path d="M304 218C317 173 350 144 392 144C434 144 463 172 474 218Z" fill="#7ccf82" fillOpacity="0.34" />

      <path d="M322 158L346 181L367 159L389 168L380 193V249H312V193L302 168Z" fill="#2d7b44" />
      <path d="M337 181C350 170 363 170 375 181" stroke="#dff7d9" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M350 178L343 164" stroke="#dff7d9" strokeWidth="5" strokeLinecap="round" />
      <path d="M364 178L371 164" stroke="#dff7d9" strokeWidth="5" strokeLinecap="round" />

      <path d="M255 181C255 164 268 151 285 151C302 151 315 164 315 181V238H255Z" fill="#3a9153" />
      <path d="M268 180C269 165 276 156 286 156C296 156 303 165 302 180" stroke="#d8f3d5" strokeWidth="5" strokeLinecap="round" fill="none" />

      <rect x="442" y="148" width="34" height="112" rx="12" fill="#2a7042" />
      <rect x="450" y="128" width="18" height="28" rx="8" fill="#205937" />
      <rect x="448" y="182" width="22" height="54" rx="8" fill="#dff4d5" fillOpacity="0.46" />

      <rect x="228" y="194" width="46" height="50" rx="12" fill="#2e7b43" />
      <ellipse cx="241" cy="182" rx="13" ry="24" transform="rotate(-24 241 182)" fill="#2f8d46" />
      <ellipse cx="261" cy="176" rx="14" ry="26" transform="rotate(18 261 176)" fill="#24733b" />
      <path d="M251 194V166" stroke="#d9f0d6" strokeWidth="4" strokeLinecap="round" />

      <path d="M396 274C396 247 415 224 443 224C471 224 492 246 492 274V339H396Z" fill="#2c7844" fillOpacity="0.95" />
      <path d="M416 268C418 248 429 238 444 238C459 238 471 248 472 268" stroke="#d5efd2" strokeWidth="6" strokeLinecap="round" fill="none" />

      <path d="M342 329C342 309 357 294 376 294C395 294 409 309 409 329C409 355 387 372 375 386C362 372 342 355 342 329Z" fill="#2d7041" />
    </svg>
  );
};

export default HomeHeroArt;