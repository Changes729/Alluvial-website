import * as esbuild from "esbuild";
import fs from "node:fs";
import http from "node:http";
import { sassPlugin } from "esbuild-sass-plugin";

let PORT = 3000;
const APP_DIR = "src/";
const HTML_DIR = "public/html/";
const CSS_DIR = "public/css/";
const STATIC_DIR = "public/static/";
const OUT_DIR = "dist/";

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.cpSync(HTML_DIR, OUT_DIR, { recursive: true });
fs.cpSync(CSS_DIR, `${OUT_DIR}`, { recursive: true });
fs.cpSync(STATIC_DIR, `${OUT_DIR}/static`, { recursive: true });

var app_list = [];
fs.readdirSync(APP_DIR).forEach((file) => {
  if (/^(app).+(.jsx)?(.tsx)?(.js)?(.ts)?(.scss)?(.css)?$/.test(file)) {
    app_list.push(APP_DIR + file);
  }
});

let ctx = await esbuild.context({
  entryPoints: app_list,
  bundle: true,
  minify: true,
  sourcemap: true,
  loader: { ".htm": "file", ".svg": "text", ".css": "css", ".woff2": "file", ".ttf": "file", ".woff": "file" },
  outdir: `${OUT_DIR}`,
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.IS_PREACT": '"true"',
  },
  plugins: [sassPlugin()],
  conditions: ["production"],
});

let { host, port } = await ctx.serve({
  servedir: OUT_DIR,
});

http
  .createServer((req, res) => {
    const options = {
      hostname: host,
      port: port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    let proxyReq = http.request(options, (proxyRes) => {
      if (proxyRes.statusCode != 200) {
        console.log(
          `request failed with url ${options.path} code: ${proxyRes.statusCode}`
        );

        options.path = "";
        let _req = http.request(options, (anotherRes) => {
          if (anotherRes.statusCode === 200) {
            res.writeHead(anotherRes.statusCode, anotherRes.headers);
            anotherRes.pipe(res, { end: true });
          } else {
            console.log(
              `request failed with url ${options.path} code: ${proxyRes.statusCode}`
            );
            res.end();
          }
        });
        req.pipe(_req, { end: true });
      } /** if code == 200 */ else {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    });

    req.pipe(proxyReq, { end: true });
  })
  .listen(PORT);

await ctx.watch();
console.log(`[serve] listening at http://${host}:${PORT}`);
