import Instance from "@/services/api";

export default class UserService {
  static loginHandler() {
    return Instance.post(`/authentication/oauth/outlook`);
  }

  static logoutHandler() {
    const url = `/authentication/logout`;
    return Instance.get(url);
  }
}
