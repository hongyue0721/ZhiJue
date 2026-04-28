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

const needle = Buffer.from("e281a0", "hex")

for (const rel of targets) {
  const full = path.join(base, rel)
  const buf = fs.readFileSync(full)
  let idx = buf.indexOf(needle)
  let result = buf
  let count = 0
  while (idx !== -1) {
    count++
    const before = result.subarray(0, idx)
    const after = result.subarray(idx + 3)
    result = Buffer.concat([before, after])
    idx = result.indexOf(needle)
  }
  fs.writeFileSync(full, result)
  console.log(rel + ": removed " + count + " occurrences")
}
