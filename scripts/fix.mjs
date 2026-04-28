import fs from "node:fs"
import path from "node:path"

const base = "D:\\OneDrive\\Desktop\\work"
const targets = [
  "src/app/globals.css",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/home/page.tsx",
  "src/app/error.tsx"
]

for (const rel of targets) {
  const full = path.join(base, rel)
  const buf = fs.readFileSync(full)
  const out = []
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0xe2 && buf[i+1] === 0x81 && buf[i+2] === 0xa0) {
      i += 2
      continue
    }
    out.push(buf[i])
  }
  fs.writeFileSync(full, Buffer.from(out))
  console.log(rel + ": " + buf.length + " -> " + out.length)
}
