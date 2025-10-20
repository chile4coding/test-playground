import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, Loader2, CreditCard } from "lucide-react";

// Type definitions for Stripe Terminal
interface StripeTerminal {
  create: (config: TerminalConfig) => Terminal;
}

interface TerminalConfig {
  onFetchConnectionToken: () => Promise<string>;
  onUnexpectedReaderDisconnect: () => void;
}

interface Terminal {
  discoverReaders: (config: DiscoverConfig) => Promise<DiscoverResult>;
  connectReader: (reader: Reader) => Promise<ConnectResult>;
  disconnectReader: () => Promise<void>;
  collectPaymentMethod: (clientSecret: string) => Promise<CollectResult>;
  processPayment: (paymentIntent: PaymentIntent) => Promise<ProcessResult>;
  cancelCollectPaymentMethod: () => Promise<void>;
}

interface DiscoverConfig {
  simulated: boolean;
}

interface Reader {
  id: string;
  label: string;
  device_type: string;
  serial_number?: string;
  status?: string;
}

interface DiscoverResult {
  discoveredReaders: Reader[];
  error?: StripeError;
}

interface ConnectResult {
  reader: Reader;
  error?: StripeError;
}

interface CollectResult {
  paymentIntent: PaymentIntent;
  error?: StripeError;
}

interface ProcessResult {
  paymentIntent: PaymentIntent;
  error?: StripeError;
}

interface PaymentIntent {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

interface StripeError {
  message: string;
  code?: string;
}

interface Log {
  message: string;
  type: "info" | "success" | "error";
  time: string;
}

type PaymentStatus = "success" | "failed" | null;
type ConnectionStatus =
  | "Not Connected"
  | "Connected"
  | "Disconnected"
  | "Connection Failed";

declare global {
  interface Window {
    StripeTerminal: StripeTerminal;
  }
}

let basUrl = "http://localhost:3001";

const StripeTerminalApp: React.FC = () => {
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [reader, setReader] = useState<Reader | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("Not Connected");
  const [error, setError] = useState<string>("");
  const [amount, setAmount] = useState<string>("10.00");
  const [processing, setProcessing] = useState<boolean>(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const terminalRef = useRef<Terminal | null>(null);

  const addLog = (
    message: string,
    type: "info" | "success" | "error" = "info"
  ): void => {
    setLogs((prev) => [
      ...prev,
      { message, type, time: new Date().toLocaleTimeString() },
    ]);
  };

  // Initialize Stripe Terminal
  useEffect(() => {
    const initializeTerminal = (): (() => void) => {
      try {
        // Load Stripe Terminal JS
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/terminal/v1/";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.StripeTerminal) {
            addLog("Stripe Terminal SDK loaded successfully", "success");
          }
        };

        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        addLog(`Failed to load Stripe Terminal: ${errorMessage}`, "error");
        setError(errorMessage);
        return () => {};
      }
    };

    return initializeTerminal();
  }, []);

  // Fetch connection token from your backend
  const fetchConnectionToken = async (): Promise<string> => {
    try {
      // Replace this with your actual backend endpoint
      const response = await fetch(basUrl + "/api/terminal/connection-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.secret;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      addLog(`Connection token error: ${errorMessage}`, "error");
      throw err;
    }
  };

  // Initialize terminal connection
  const connectTerminal = async (): Promise<void> => {
    try {
      setProcessing(true);
      setError("");
      addLog("Initializing Stripe Terminal...", "info");

      if (!window.StripeTerminal) {
        throw new Error("Stripe Terminal SDK not loaded");
      }

      const term = window.StripeTerminal.create({
        onFetchConnectionToken: fetchConnectionToken,
        onUnexpectedReaderDisconnect: unexpectedDisconnect,
      });

      terminalRef.current = term;
      setTerminal(term);
      addLog("Terminal instance created", "success");

      // Discover readers
      addLog("Discovering readers...", "info");
      const discoverResult = await term.discoverReaders({
        simulated: true, // Set to false for real devices
      });

      if (discoverResult.error) {
        throw new Error(discoverResult.error.message);
      }

      if (discoverResult.discoveredReaders.length === 0) {
        throw new Error("No readers found");
      }

      addLog(
        `Found ${discoverResult.discoveredReaders.length} reader(s)`,
        "success"
      );

      // Connect to first available reader
      const selectedReader = discoverResult.discoveredReaders[0];
      addLog(`Connecting to ${selectedReader.label}...`, "info");

      const connectResult = await term.connectReader(selectedReader);

      if (connectResult.error) {
        throw new Error(connectResult.error.message);
      }

      setReader(connectResult.reader);
      setStatus("Connected");
      addLog(`Connected to ${connectResult.reader.label}`, "success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      addLog(`Connection failed: ${errorMessage}`, "error");
      setStatus("Connection Failed");
    } finally {
      setProcessing(false);
    }
  };

  const unexpectedDisconnect = (): void => {
    setStatus("Disconnected");
    setReader(null);
    addLog("Reader unexpectedly disconnected", "error");
  };

  // Create payment intent on your backend
  const createPaymentIntent = async (
    amountInCents: number
  ): Promise<string> => {
    try {
      const response = await fetch(
        basUrl + "/api/terminal/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountInCents,
            currency: "usd",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.client_secret;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      addLog(`Payment intent error: ${errorMessage}`, "error");
      throw err;
    }
  };

  // Process payment
  const processPayment = async (): Promise<void> => {
    if (!terminal || !reader) {
      setError("Please connect to a reader first");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setPaymentStatus(null);
      addLog(`Processing payment for $${amount}...`, "info");

      const amountInCents = Math.round(parseFloat(amount) * 100);

      // Create payment intent
      addLog("Creating payment intent...", "info");
      const clientSecret = await createPaymentIntent(amountInCents);
      addLog("Payment intent created", "success");

      // Collect payment method
      addLog("Present card to reader...", "info");
      const collectResult = await terminal.collectPaymentMethod(clientSecret);

      if (collectResult.error) {
        throw new Error(collectResult.error.message);
      }

      addLog("Card presented successfully", "success");

      // Process payment
      addLog("Processing payment...", "info");
      const processResult = await terminal.processPayment(
        collectResult.paymentIntent
      );

      if (processResult.error) {
        throw new Error(processResult.error.message);
      }

      // Capture payment on backend
      addLog("Capturing payment...", "info");
      const captureResponse = await fetch(
        basUrl + "/api/terminal/capture-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_intent_id: processResult.paymentIntent.id,
          }),
        }
      );

      if (!captureResponse.ok) {
        throw new Error("Failed to capture payment");
      }

      setPaymentStatus("success");
      addLog(`Payment successful! Amount: $${amount}`, "success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setPaymentStatus("failed");
      addLog(`Payment failed: ${errorMessage}`, "error");
    } finally {
      setProcessing(false);
    }
  };

  // Cancel payment
  const cancelPayment = async (): Promise<void> => {
    if (terminal && processing) {
      try {
        await terminal.cancelCollectPaymentMethod();
        addLog("Payment cancelled", "info");
        setProcessing(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        addLog(`Cancel failed: ${errorMessage}`, "error");
      }
    }
  };

  // Disconnect reader
  const disconnectReader = async (): Promise<void> => {
    if (terminal && reader) {
      try {
        await terminal.disconnectReader();
        setReader(null);
        setStatus("Disconnected");
        addLog("Reader disconnected", "info");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        addLog(`Disconnect failed: ${errorMessage}`, "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <CreditCard className="text-purple-600" size={32} />
            Stripe Terminal Tap-to-Pay
          </h1>
          <p className="text-gray-600 mb-6">
            Full TypeScript implementation with React
          </p>

          {/* Status Banner */}
          <div
            className={`p-4 rounded-lg mb-6 ${
              status === "Connected"
                ? "bg-green-100 border border-green-200"
                : status === "Disconnected"
                ? "bg-gray-100 border border-gray-200"
                : "bg-yellow-100 border border-yellow-200"
            }`}>
            <div className="flex items-center gap-2">
              {status === "Connected" ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-gray-600" size={20} />
              )}
              <span className="font-semibold">Status: {status}</span>
              {reader && (
                <span className="text-sm text-gray-600 ml-2">
                  ({reader.label})
                </span>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Connection Controls */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Connection</h2>
            <div className="flex gap-3">
              <button
                onClick={connectTerminal}
                disabled={processing || reader !== null}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                {processing && !reader ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Connecting...
                  </span>
                ) : (
                  "Connect Reader"
                )}
              </button>
              <button
                onClick={disconnectReader}
                disabled={!reader || processing}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                Disconnect
              </button>
            </div>
          </div>

          {/* Payment Controls */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Payment</h2>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={processing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 text-black"
                  placeholder="10.00"
                />
              </div>
              <button
                onClick={processPayment}
                disabled={!reader || processing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                {processing && reader ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                  </span>
                ) : (
                  "Collect Payment"
                )}
              </button>
              {processing && (
                <button
                  onClick={cancelPayment}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                paymentStatus === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}>
              <div className="flex items-center gap-2">
                {paymentStatus === "success" ? (
                  <>
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="font-semibold text-green-800">
                      Payment Successful!
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="font-semibold text-red-800">
                      Payment Failed
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No activity yet...</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="mb-2">
                  <span className="text-gray-500">[{log.time}]</span>{" "}
                  <span
                    className={
                      log.type === "error"
                        ? "text-red-400"
                        : log.type === "success"
                        ? "text-green-400"
                        : "text-blue-400"
                    }>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            ⚠️ Backend Implementation Required
          </h3>
          <p className="text-blue-800 text-sm mb-2">
            You need to create these backend endpoints:
          </p>
          <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
            <li>
              <code className="bg-blue-100 px-2 py-0.5 rounded">
                POST /api/terminal/connection-token
              </code>{" "}
              - Returns connection token
            </li>
            <li>
              <code className="bg-blue-100 px-2 py-0.5 rounded">
                POST /api/terminal/create-payment-intent
              </code>{" "}
              - Creates PaymentIntent
            </li>
            <li>
              <code className="bg-blue-100 px-2 py-0.5 rounded">
                POST /api/terminal/capture-payment
              </code>{" "}
              - Captures payment
            </li>
          </ul>
          <p className="text-blue-800 text-sm mt-3">
            Set{" "}
            <code className="bg-blue-100 px-2 py-0.5 rounded">
              simulated: false
            </code>{" "}
            in discoverReaders() for real hardware.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripeTerminalApp;
