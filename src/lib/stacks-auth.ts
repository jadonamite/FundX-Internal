import { AppConfig, UserSession, showConnect } from "@stacks/connect";

const appConfig_ = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig_ });

export function authenticate() {
  showConnect({
    appDetails: {
      name: "FundX",
      icon: typeof window !== "undefined" ? window.location.origin + "/logo.png" : "",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload_(); // Refresh page to update the UI
    },
    userSession,
  });
}

export function signUserOut() {
  userSession.signUserOut();
  window.location.reload_();
}