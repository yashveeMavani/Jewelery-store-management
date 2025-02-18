const json2csv = require('json2csv').parse;
const pdf = require('html-pdf');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');

hbs.registerHelper('eq', (a, b) => a === b);

exports.exportToCSV = (res, data, filename) => {
    const csv = json2csv(data);

    res.attachment(filename);
    res.send(csv);
};

exports.exportToPDF = async(res, data, templateName, filename) => {
    console.log(__dirname);
    const templatePath = path.resolve(__dirname, `../templates/${templateName}`);
    console.log(templatePath);
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = hbs.compile(templateHtml);

    const html = compiledTemplate({ data });
   
    

    pdf.create(html).toStream((err, stream) => {
        if (err) return res.status(500).send('Failed to generate PDF');
        res.attachment(filename);
        stream.pipe(res);
    });


    
};