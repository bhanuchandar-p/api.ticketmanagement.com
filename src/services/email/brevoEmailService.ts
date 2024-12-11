import * as brevo from '@getbrevo/brevo';
import { emailConfig } from '../../config/emailConfig';
import BadRequestException from '../../exceptions/badReqException';
const apiInstance:any = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = emailConfig.API_KEY;



const sendEmailtoResetPassword = async(email: string, link: string) => {
    try {
        const html = `<body>
            <p>You're receiving this e-mail because you or someone else has requested a password reset for your user account at <strong>Ticket Management</strong>.</p>
            
            <p>Click the link below to reset your password:</p>
            <p><a href="${link}">Reset Password</a></p>
            
            <p>If you did not request a password reset you can safely ignore this email.</p>
            </body>` 

        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = 'Password Reset';
        sendSmtpEmail.sender = {email: emailConfig.FROM_EMAIL, name: emailConfig.FROM_NAME};
        sendSmtpEmail.to = [{email: email}];
        sendSmtpEmail.htmlContent = html;
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        if (!response) {
            throw new BadRequestException('Failed to send email');
        }
        return true;
        
    } catch (error) {
        throw error;
    }
}


export { sendEmailtoResetPassword };

