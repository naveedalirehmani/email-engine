export * as ServerTypes from "./responses";
export * from "./routes";
export * from './endpoint';

export interface Email {
  id: string;
  receivedDateTime: string;
  subject: string;
  bodyPreview: string;
  isRead: boolean;
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  body: {
    content: string;
  };
}
