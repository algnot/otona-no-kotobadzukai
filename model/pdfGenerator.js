const puppeteer = require('puppeteer'); 
const ejs = require('ejs');
const fs = require('fs');
const Logger = require('@taro-common/common-logger');
const { PrismaClient } = require("@prisma/client");
const Config = require('@taro-common/common-config');
const prisma = new PrismaClient();
const logger = new Logger();
const config = new Config();

module.exports = class PdfGenerator {
    template = null;
    model = null;
    id = null;
    data = null;
    context = {}
    templeteMappping = {
        "bill": {
            "template": "bill.ejs",
            "model": "Bill",
            "include": {
                billItem: true,
                userBill: true,
                owner: true,
                payment: true,
            },
            "ref": "ref",
            "context": ["frontend_path", "promptpay_api_url"]
        }
    }

    constructor(template, id) {
        if(!template) throw new Error("Template is required")
        if(!id) throw new Error("Id is required")

        const { model } = this.templeteMappping[template];
        if(!model) throw new Error("Model is not found")

        this.template = template;
        this.model = model;
        this.id = id;
    }

    async getData() {
        const field = this.templeteMappping[this.template].ref;
        let searchField = {};
        searchField[field] = this.id;
        this.data = await prisma[this.model].findFirst({
            where: searchField,
            include: this.templeteMappping[this.template].include
        });
        for(let context of this.templeteMappping[this.template].context) {
            this.context[context] = await config.get(context, "null");
        }
        this.data.context = this.context;
        if (!this.data) {
            throw new Error(`[PDF Generator] Not found ${this.model} with ${this.templeteMappping[this.template].ref} ${this.id}`);
        }
    }

    async generatePdf() {
        const randomUUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
        const page = await browser.newPage();
        await this.getData();
        const html = await this.ejsToHtml();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.pdf({ 
            path: `public/${randomUUID}.pdf`, 
            format: 'A4',
            displayHeaderFooter: true,
        });
        await page.close()
        await browser.close()
        logger.info(`✔️ [PDF Generator] PDF generated: ${randomUUID}.pdf and will be removed in 10 seconds`);
        setTimeout(() => {
            this.removeFile(`public/${randomUUID}.pdf`);
        }, 10000);
        return `public/${randomUUID}.pdf`;
    }

    async ejsToHtml() {
        const filePath = `./paper/${this.templeteMappping[this.template].template}`;
        const html = await ejs.renderFile(filePath, this.data);
        return html;
    }

    async removeFile(filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                logger.error(`❌ [PDF Generator] Error when removing file: ${err.message}`);
            }
            logger.info(`✔️ [PDF Generator] File removed: ${filePath}`);
        })
    }
}