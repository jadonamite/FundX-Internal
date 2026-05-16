import { AppConfig, UserSession, showConnect } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

export function authenticate() {
  showConnect({
    appDetails: {
      name: "FundX",
      icon: typeof window !== "undefined" ? window.location.origin + "/logo.png" : "",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload(); // Refresh page to update the UI
    },
    userSession,
  });
}

export function signUserOut() {
  userSession.signUserOut();
  window.location.reload();
}

// ⟳ echo · src/app/campaigns/[id]/page.tsx
//               {/* Donation Input */}
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <h4 className="font-bold text-slate-900 text-lg">Make a contribution</h4>
//                   <p className="text-sm text-slate-500">Support {campaign.creator} to make this happen.</p>