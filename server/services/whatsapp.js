const axios = require('axios');

const sendWhatsAppMessage = async (to, body) => {
    try {
        console.log('------------------------------------------------');
        console.log(`📞 WHATSAPP MOCK ALERT to ${to}`);
        console.log(`📝 MESSAGE: ${body}`);
        console.log('------------------------------------------------');

        // NOTE: For real messages, you would use Twilio or Meta API here.
        // Example: await axios.post('https://api.twilio.com/...', { to, body });

        return { success: true, mock: true };
    } catch (error) {
        console.error('WhatsApp Service Error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendWhatsAppMessage };
