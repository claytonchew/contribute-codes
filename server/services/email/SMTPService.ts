import type { EmailService, EmailOptions } from "./Email";
import { SMTPClient, Message } from "emailjs";

export class SMTPService implements EmailService {
  private smtpClient: SMTPClient;

  constructor() {
    const { smtp } = useRuntimeConfig();

    if (!smtp || !smtp.host || !smtp.port || !smtp.user || !smtp.password) {
      throw new Error("SMTP configuration is missing");
    }

    this.smtpClient = new SMTPClient({
      ...smtp,
      // evaluate string if it's a string
      tls: typeof smtp.tls === "string" ? smtp.tls === "true" : smtp.tls,
      // transpose smtp.port to number if it's a string
      port: typeof smtp.port === "string" ? parseInt(smtp.port) : smtp.port,
    });
  }

  async send(emailOptions: EmailOptions): Promise<void> {
    const { to, subject, html, text } = emailOptions;

    if (!to) throw new Error("Email 'to' is required");

    if (!text || !html) throw new Error("Email 'text' or 'html' is required");

    const message = new Message({
      from: emailOptions.from || useRuntimeConfig().smtp.fromEmail,
      "reply-to":
        emailOptions.replyTo ||
        useRuntimeConfig().smtp.replyToEmail ||
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
