const express = require('express');
const router = express.Router();
const PdfGenerator = require('../model/pdfGenerator');
const Logger = require('@taro-common/common-logger');
const logger = new Logger();
const fs = require('fs');

router.get('/dowload/:template/:id', async (req, res) => {
    try {
        const { template, id } = req.params;
        const pdfGenerator = new PdfGenerator(template, id);
        const filePath = await pdfGenerator.generatePdf();
        res.download(filePath);
    } catch (error) {
        logger.error(`❌ [PDF Generator] Error when generating pdf: ${error}`);
        res.status(500).send(error.message);
    }
})

router.get('/preview/:template/:id', async (req, res) => {
    try {
        const { template, id } = req.params;
        const pdfGenerator = new PdfGenerator(template, id);
        const filePath = await pdfGenerator.generatePdf();
        const file = fs.readFileSync(__dirname + "/../" + filePath);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(file);
    } catch (error) {
        logger.error(`❌ [PDF Generator] Error when generating pdf: ${error}`);
        res.status(500).send(error.message);
    }
})

router.get('/debug/:template/:id', async (req, res) => {
    try {
        const { template, id } = req.params;
        const pdfGenerator = new PdfGenerator(template, id);
        await pdfGenerator.getData();
        const html = await pdfGenerator.ejsToHtml();
        res.send(html);
    } catch (error) {
        logger.error(`❌ [PDF Generator] Error when generating pdf: ${error}`);
        res.status(500).send(error.message);
    }
})

exports.router = router;