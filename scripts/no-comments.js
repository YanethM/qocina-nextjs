#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");

const staged = execSync("git diff --cached --name-only --diff-filter=ACM", {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter((f) => /^src\/.*\.(ts|tsx|css)$/.test(f));

if (staged.length === 0) process.exit(0);

let found = false;

for (const file of staged) {
  const content = execSync("git show :" + file, { encoding: "utf8" });
  const lines = content.split("\n");
  const ext = file.split(".").pop();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let hit = false;

    if (ext === "css") {
      hit = /\/\*/.test(line);
    } else {
      hit = /\{\/\*/.test(line);
      if (!hit) {
        const trimmed = line.trim();
        if (trimmed.startsWith("//") && !/^\/\/\s*https?:\/\//.test(trimmed)) {
          hit = true;
        }
      }
    }

    if (hit) {
      console.error("\x1b[31m\u2717 Comment found:\x1b[0m " + file + ":" + (i + 1));
      console.error("  " + line.trim());
      found = true;
    }
  }
}

if (found) {
  console.error("\n\x1b[31m\u2717 Commit blocked: remove all comments before committing.\x1b[0m\n");
  process.exit(1);
}
