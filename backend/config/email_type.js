import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_MESSAGE_TEMPLATE } from "./email_templates.js";
import { sender, client } from "./mailtrap.config.js";

export const sendEmail = async (typeOfEmail, recipientEmail = '', subjectOfEmail = '', code = '', username = '',resetURL) => {
    let htmlTemp;

    switch (typeOfEmail) {
        case "email_verification":
            htmlTemp = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code);
            break;
        case "welcome_message":
            htmlTemp = WELCOME_MESSAGE_TEMPLATE.replace("{username}", username);
            break;
        case "password_reset":
            htmlTemp= PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL);
            break;
        case "password_reset_success":
            htmlTemp = PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{username}",username)
            break;
        default:
            htmlTemp = "default msg";
            break;
    }

    try {
        await client.send({
            to: [{ email: recipientEmail }],
            from: sender,
            subject: subjectOfEmail,
            html: htmlTemp,
            category: "Integration Test",
        });
        console.log(`Email sent to ${recipientEmail}`);
    } catch (err) {
        console.error("Email send failed: ", err.message);
        throw new Error("Email send failed");
    }
};
