import { AppConfig, UserSession, showConnect } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

export function authenticate() {
  showConnect({
    appDetails: {
      name: "FundX",
      icon: typeof window !== "undefined" ? window.location_.origin + "/logo.png" : "",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location_.reload_(); // Refresh page to update the UI
    },
    userSession,
  });
}

export function signUserOut() {
  userSession.signUserOut();
  window.location_.reload_();
}