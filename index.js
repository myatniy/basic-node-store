const { createServer } = require("http");
const { readFileSync } = require("fs");
const { parse } = require("url");
const replaceTemplate =  require(`${__dirname}/my-modules/replaceTemplate`);
const log = console.log;

const data = readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const htmlTemplates = {
    card: readFileSync(`${__dirname}/templates/card.html`, "utf-8"),
    overview: readFileSync(`${__dirname}/templates/overview.html`, "utf-8"),
    product: readFileSync(`${__dirname}/templates/product.html`, "utf-8")
}

const server = createServer((req, res) => {
    const {query, pathname} = parse(req.url, true);

    /* Basic router */
    // api
    if (pathname === "/api") {
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(data);

    // main page
    } else if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { "Content-type": "text/html" });

        const cardsHtml = dataObj.map(el => replaceTemplate(htmlTemplates.card, el)).join("\n\n");
        const outputHtml = htmlTemplates.overview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

        res.end(outputHtml);

    // certain product
    } else if (pathname === "/product") {
        res.writeHead(200, { "Content-type": "text/html" });
        const product = dataObj[query.id];
        const output = replaceTemplate(htmlTemplates.product, product);

        res.end(output);

    // unknown pathname
    } else {
        res.writeHead(404);
        res.end("page was not found");
    }
});

server.listen(8000);
