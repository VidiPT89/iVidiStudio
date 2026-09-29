export const LANG_KEY = "ividi-hq-lang";
export const THEME_KEY = "ividi-hq-theme";

// Runs before first paint (inlined in <head>) so the page never flashes the wrong theme.
export const NO_FLASH_SCRIPT = `(function(){try{
var t=localStorage.getItem("${THEME_KEY}")||"system";
var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.style.colorScheme=d?"dark":"light";
var l=localStorage.getItem("${LANG_KEY}")||(navigator.language.toLowerCase().indexOf("pt")===0?"pt":"en");
r.lang=l==="pt"?"pt-PT":"en";
}catch(e){document.documentElement.dataset.theme="dark"}})();`;
