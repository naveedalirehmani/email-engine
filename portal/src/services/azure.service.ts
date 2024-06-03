import Instance from "@/services/api";

interface EmailData {
  subject?: string;
  body?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  messageId?: string;
}

export default class AzureMailService {
  static getPrimaryMails() {
    const url = `/mail-data/azure/primary`;
    return Instance.get(url);
  }

  static getJunkMails() {
    const url = `/mail-data/azure/junk`;
    return Instance.get(url);
  }

  static getTrashMails() {
    const url = `/mail-data/azure/trash`;
    return Instance.get(url);
  }

  static getSentMail() {
    const url = `/mail-data/azure/sent`;
    return Instance.get(url);
  }

  static sendMail(emailData: EmailData) {
    const url = `/mail-data/azure/send`;
    return Instance.post(url, emailData);
  }

  static getMailSummary() {
    const url = `/mail-data/azure/summary`;
    return Instance.get(url);
  }

  static replyMail(emailData: EmailData) {
    const url = `/mail-data/azure/reply`;
    return Instance.post(url, emailData);
  }
}
