const http = require("http");
const fs = require("fs");
const url = require("url");
const { dirname } = require("path");

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
// html templates
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
    let pathName = req.url;

    if (pathName === "/api") {
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(data);
    } else if (pathName === "/" || pathName === "/overview") {
        res.writeHead(200, { "Content-type": "text/html" });
        res.end(overviewTemplate);
    } else if (pathName === "/product") {
        res.end("/product");
    } else {
        res.writeHead(404);
        res.end("page was not found");
    }
});

server.listen(8000, () => console.log("Server has been started"));
