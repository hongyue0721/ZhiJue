const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "..");
const files = [
  "src/app/globals.css",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/home/page.tsx",
  "src/app/error.tsx",
  "scripts/clean.js"
];

const ZWS = String.fromCharCode(0x2060);

files.forEach(f => {
  const full = path.join(base, f);
  if (!fs.existsSync(full)) {
    console.log("Not found:", f);
    return;
  }
  const content = fs.readFileSync(full, "utf8");
  const cleaned = content.split(ZWS).join("");
  if (content !== cleaned) {
    fs.writeFileSync(full, cleaned, "utf8");
    console.log("Cleaned:", f, "removed", content.length - cleaned.length, "chars");
  } else {
    console.log("Already clean:", f);
  }
});
