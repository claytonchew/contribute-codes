export type EmailProvider = "smtp";

export type EmailService = {
  send(emailOptions: EmailOptions): Promise<void>;
};

export type EmailOptions = {
  from?: string;
  replyTo?: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
};
