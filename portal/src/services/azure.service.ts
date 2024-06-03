import Instance from "@/services/api";
import { Endpoints } from "@/types/endpoint";

interface EmailData {
  subject?: string;
  body?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  messageId?: string;
}

export default class AzureMailService {
  private static Azure = "/mail-data/azure";
  static getPrimaryMails() {
    const url = `${AzureMailService.Azure}/${Endpoints.PRIMARY}`;
    return Instance.get(url);
  }

  static getJunkMails() {
    const url = `${AzureMailService.Azure}/${Endpoints.JUNK}`;
    return Instance.get(url);
  }

  static getTrashMails() {
    const url = `${AzureMailService.Azure}/${Endpoints.TRASH}`;
    return Instance.get(url);
  }

  static getSentMail() {
    const url = `${AzureMailService.Azure}/${Endpoints.SENT}`;
    return Instance.get(url);
  }

  static sendMail(emailData: EmailData) {
    const url = `${AzureMailService.Azure}/${Endpoints.SEND}`;
    return Instance.post(url, emailData);
  }

  static getMailSummary() {
    const url = `${AzureMailService.Azure}/${Endpoints.SUMMARY}`;
    return Instance.get(url);
  }

  static replyMail(emailData: EmailData) {
    const url = `${AzureMailService.Azure}/${Endpoints.REPLY}`;
    return Instance.post(url, emailData);
  }
}
