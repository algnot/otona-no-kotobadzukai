const axios = require('axios');
const Logger = require('@taro-common/common-logger');
const Config = require('@taro-common/common-config');
const logger = new Logger();
const config = new Config();

module.exports = class Mailer {
    templateMapping = {
        "invoice": "mailjs_invoice_template",
    }

    async sendEmailByTemplete(template, data) {
        try {
            const response = await this.sendToMailJs(template, data);
            logger.info(`✔️  [Mailer] Send email success: ${JSON.stringify(response)}`);
        } catch (error) {
            logger.error(`❌ [Mailer] Send email failed: ${error}`);
        }
    }

    async sendToMailJs(template, data){
        const serviceId = await config.get("mailjs_service_id");
        const userId = await config.get("mailjs_user_id");
        const accessToken = await config.get("mailjs_access_token");
        const templateId = await config.get(this.templateMapping[template]);
        const mailApi = await config.get("mailjs_api_url");
        const response = await axios.post(mailApi, {
            service_id: serviceId,
            template_id: templateId,
            user_id: userId,
            accessToken: accessToken,
            template_params: data
        })
        return response;
    }
}