import fs from "fs"
import pdf from "html-pdf"
import ejs from "ejs"
import { getBaseUrl } from "./server.js";

const template = getBaseUrl("template/template.html");
var compiled = ejs.compile(fs.readFileSync(template, 'utf8'));

var html = compiled({ title : 'EJS', text : 'Hello, World!' });

pdf.create(html).toFile('./result.pdf',() => {
    console.log('pdf done')
})