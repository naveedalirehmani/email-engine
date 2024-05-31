import Instance from "@/services/api";

export function getPrimaryMails() {
  const url = `/mail-data/azure/primary`;
  return Instance.get(url);
}

export function getJunkMails() {
  const url = `/mail-data/azure/junk`;
  return Instance.get(url);
}

export function getTashMails() {
  const url = `/mail-data/azure/trash`;
  return Instance.get(url);
}

export function getSentMail() {
  const url = `/mail-data/azure/sent`;
  return Instance.get(url);
}

export function sendMail(emailData: {}) {
  const url = `/mail-data/azure/send`;
  return Instance.post(url, emailData);
}
