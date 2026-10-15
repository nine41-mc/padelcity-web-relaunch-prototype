/** Shared with the client store in ./a11y.ts – server-safe (no "use client"), used by SiteShell. */
export const A11Y_STORAGE_KEY = "pc-a11y";

/** Inline, pre-paint version of read() + applyA11yPrefs() for SiteShell. */
export const a11yPrePaintScript = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(A11Y_STORAGE_KEY)})||"{}"),e=document.documentElement;if(p.size)e.setAttribute("data-a11y-size",String(p.size));if(p.spacing)e.setAttribute("data-a11y-spacing",String(p.spacing));if(p.font==="readable")e.setAttribute("data-a11y-font","readable");if(p.motion==="off")e.setAttribute("data-a11y-motion","off");if(p.contrast==="high")e.setAttribute("data-a11y-contrast","high");}catch(_){}})();`;
