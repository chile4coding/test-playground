import BarcodeReader from "~/components/BarCode";
import type { Route } from "./+types/home";
import Login from "~/AuthForm/Login";
import VoiceEventCreator from "~/components/Assistant";
import ClarityDashboard from "~/components/Clarity";
import StripeTerminalApp from "~/components/TapToPay";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      {/* <Login /> */}
      {/* <BarcodeReader /> */}
      {/* <VoiceEventCreator /> */}
      {/* <ClarityDashboard /> */}
      <StripeTerminalApp />
    </div>
  );
}
