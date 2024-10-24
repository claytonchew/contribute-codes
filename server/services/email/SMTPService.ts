import type {
  EmailService,
  EmailOptions,
} from "~~/server/services/email/Email";
import { SMTPClient, type SMTPConnectionOptions, Message } from "emailjs";

export class SMTPService implements EmailService {
  private smtpClient: SMTPClient;
  private smtpConnectionOptions: Partial<
    SMTPConnectionOptions & {
      fromEmail: string;
      replyToEmail: string;
    }
  >;

  constructor() {
    this.smtpConnectionOptions = {
      host: process.env.SMTP_HOST,
      // transpose smtp.port to number if it's a string
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASS,
      fromEmail: process.env.SMTP_FROM_EMAIL,
      replyToEmail:
        process.env.SMTP_REPLY_TO_EMAIL || process.env.SMTP_FROM_EMAIL,
      // evaluate string as bool
      tls: process.env.SMTP_TLS === "true",
    };

    if (
      !this.smtpConnectionOptions ||
      !this.smtpConnectionOptions.host ||
      !this.smtpConnectionOptions.port ||
      !this.smtpConnectionOptions.user ||
      !this.smtpConnectionOptions.password
    ) {
      throw new Error("SMTP configuration is missing");
    }

    this.smtpClient = new SMTPClient(this.smtpConnectionOptions);
  }

  async send(emailOptions: EmailOptions): Promise<void> {
    const { to, subject, html, text } = emailOptions;

    if (!to) throw new Error("Email 'to' is required");

    if (!text && !html) throw new Error("Email 'text' or 'html' is required");

    const message = new Message({
      from: emailOptions.from || this.smtpConnectionOptions.fromEmail,
      "reply-to":
        emailOptions.replyTo ||
        emailOptions.from ||
        this.smtpConnectionOptions.replyToEmail ||
        this.smtpConnectionOptions.fromEmail ||
        undefined,
      to,
      subject,
      text,
      attachment: html ? [{ data: html, alternative: true }] : undefined,
    });

    const { isValid, validationError } = message.checkValidity();

    if (!isValid) throw new Error(validationError);

    try {
      await this.smtpClient.sendAsync(message);
      // eslint-disable-next-line no-console
      console.info("Send email is successful");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Send email failed with SMTP:", error);
      throw error;
    }
  }
}
