import type { EmailProvider, EmailService } from "./Email";
import { SMTPService } from "./SMTPService";

export function useEmail(provider: EmailProvider): EmailService {
  switch (provider) {
    case "smtp":
      return new SMTPService();
    default:
      throw new Error(`Unsupported email provider: ${provider}`);
  }
}
