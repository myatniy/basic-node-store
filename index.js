const http = require("http");
const fs = require("fs");
const url = require("url");
const { dirname } = require("path");

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const htmlTemplates = {
    card: fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8"),
    overview: fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8"),
    product: fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8")
}

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

    return output;
};

const server = http.createServer((req, res) => {
    let pathName = req.url;

    if (pathName === "/api") {
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(data);
    } else if (pathName === "/" || pathName === "/overview") {
        res.writeHead(200, { "Content-type": "text/html" });

        const cardsHtml = dataObj.map(el => replaceTemplate(htmlTemplates.card, el)).join("\n\n");
        const outputHtml = htmlTemplates.overview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

        res.end(outputHtml);
    } else if (pathName === "/product") {
        res.end("/product");
    } else {
        res.writeHead(404);
        res.end("page was not found");
    }
});

server.listen(8000, () => console.log("Server has been started"));
