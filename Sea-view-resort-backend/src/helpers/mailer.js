import nodemailer from "nodemailer";
import { resolve } from "path";
import exphbs from "nodemailer-express-handlebars";
import { config } from "dotenv";

config();

// In development or when DISABLE_MAILER=true we provide a noop transport
// to avoid blocking the server if SMTP is unreachable.
let transport;
if (
  process.env.DISABLE_MAILER === "true" ||
  process.env.NODE_ENV !== "production"
) {
  transport = {
    sendMail: async (mailOptions) => {
      console.log("[mailer] disabled - would send:", {
        to: mailOptions.to,
        subject: mailOptions.subject,
        template: mailOptions.template,
      });
      return Promise.resolve({ accepted: [mailOptions.to] });
    },
    use: () => {},
  };
} else {
  transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  transport.use(
    "compile",
    exphbs({
      viewEngine: {
        extname: ".handlebars",
        partialsDir: resolve("./src/views/emails/"),
        defaultLayout: false,
      },
      viewPath: resolve("./src/views/emails/"),
      extName: ".handlebars",
    }),
  );
}

export default transport;
