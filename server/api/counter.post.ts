// server/api/counter.post.ts
import { promises as fs } from "fs"
import path from "path"

const FILE = path.join(process.cwd(), "counter.txt")

export default defineEventHandler(async () => {
  let count = 0

  try {
    count = Number(await fs.readFile(FILE, "utf8"))
  } catch {
    // ファイルがなければ0から開始
  }

  count++

  await fs.writeFile(FILE, String(count))

  return { count }
})