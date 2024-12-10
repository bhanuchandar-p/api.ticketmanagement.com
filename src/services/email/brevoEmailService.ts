import * as brevo from '@getbrevo/brevo';
const apiInstance:any = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;



const sendForgotPasswordEmail = async(email: string, link: string) => {
    try {
        // const res = await apiInstance.sendTransacEmail(sendSmtpEmail);
        const html = `<div><p>Click <a href='${link}'>here</a> to reset password</p></div>` 

        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = 'Password Reset';
        sendSmtpEmail.sender = {email: process.env.FROM_EMAIL, name: process.env.FROM_NAME};
        sendSmtpEmail.to = [{email: email}];
        sendSmtpEmail.htmlContent = html;
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        if (response) {
            return true;
        }
        
    } catch (error) {
        throw error;
    }
}


export {sendForgotPasswordEmail};

