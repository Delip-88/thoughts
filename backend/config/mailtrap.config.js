import { MailtrapClient } from "mailtrap";

if (!process.env.MAILTRAP_TOKEN) {
  throw new Error("MAILTRAP_TOKEN is not defined in .env file");
}

export const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "admin@rajeshshrestha2059.com.np",
  name: "From your blog site",
};




// const sendEmail = async () => {
//     const email="cocof100mb@gmail.com"
//     try {
//       await client.send({
//         to: [{email}],
//         from: sender,
//         subject: "Test Email",
//         text: "This is a test email",
//       });
//       console.log("Email sent successfully");
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   };
  
//   sendEmail();
  