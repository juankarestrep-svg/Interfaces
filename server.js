const http = require("http");
const fs = require("fs");
const path = require("path");

const archivo = path.join(__dirname, "usuarios.json");
if (!fs.existsSync(archivo)) fs.writeFileSync(archivo, "[]");

const tipos = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript" };

http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);

    if (url === "/api/usuarios" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(fs.readFileSync(archivo));
        return;
    }

    if (url === "/api/usuarios" && req.method === "POST") {
        let cuerpo = "";
        req.on("data", d => cuerpo += d);
        req.on("end", () => {
            try {
                JSON.parse(cuerpo);
                fs.writeFileSync(archivo, cuerpo);
                res.writeHead(200);
                res.end("ok");
            } catch (e) {
                res.writeHead(400);
                res.end("error");
            }
        });
        return;
    }

    const ruta = url === "/" ? "/calculadora de construccion.html" : url;
    const completa = path.join(__dirname, ruta);

    if (!completa.startsWith(__dirname) || ruta === "/usuarios.json" || ruta === "/server.js") {
        res.writeHead(403);
        res.end();
        return;
    }

    fs.readFile(completa, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("No encontrado");
            return;
        }
        res.writeHead(200, { "Content-Type": tipos[path.extname(completa)] || "application/octet-stream" });
        res.end(data);
    });
}).listen(5500, () => console.log("http://127.0.0.1:5500"));