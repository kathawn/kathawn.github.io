// Đóng gói thành 1 file HTML tự chứa (JS + CSS inline) để publish/mở trực tiếp.
// Dùng: node build.mjs [--esbuild <đường dẫn esbuild>]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const flag = process.argv.indexOf("--esbuild");
const esbuild = require(flag > -1 ? process.argv[flag + 1] : "esbuild");

mkdirSync("dist", { recursive: true });
await esbuild.build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2020",
  jsx: "automatic",
  outdir: "dist/assets",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "none",
  logLevel: "warning",
});

const js = readFileSync("dist/assets/main.js", "utf8").replace(/<\/script/gi, "<\\/script");
const css = readFileSync("dist/assets/main.css", "utf8").replace(/<\/style/gi, "<\\/style");

const head = `<title>Nguyen Minh Quan — Business Analyst</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Portfolio of Nguyen Minh Quan, aspiring Business Analyst: BoardVerse and Cinema E-Ticketing projects, academic highlights and toolkit.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=swap">
<style>${css}</style>`;

const body = `<div id="root"></div>
<script type="module">${js}</script>`;

// Bản để publish (trình bao <html>/<head>/<body> được thêm lúc publish)
writeFileSync("dist/portfolio.html", `${head}\n${body}\n`);
// Bản mở trực tiếp bằng trình duyệt
writeFileSync(
  "dist/index.html",
  `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`,
);
console.log(
  "built",
  (js.length / 1024).toFixed(0) + "KB js",
  (css.length / 1024).toFixed(0) + "KB css",
);
