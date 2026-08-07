import fs from "fs";
import path from "path";

function walk(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      console.log(prefix + "📁 " + entry.name);
      walk(path.join(dir, entry.name), prefix + "  ");
    } else if (entry.name.endsWith(".vue")) {
      console.log(prefix + "📄 " + entry.name);
    }
  }
}

walk("./pages");