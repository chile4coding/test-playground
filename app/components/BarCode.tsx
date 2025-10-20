import { useEffect, useRef, useContext } from "react";
import Quagga from "@ericblade/quagga2";

const BarcodeReader = () => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!Quagga || !scannerRef.current) return;

    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
        },
        decoder: {
          readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
        },
      },
      function (err: any) {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((result: any) => {
      const code = result.codeResult.code;
      console.log("Detected:", code);
      alert(`Barcode Detected: ${code}`);
      Quagga.stop();
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      <h2>Scan Barcode</h2>
      <div ref={scannerRef} style={{ width: 400, height: 300 }} />
    </div>
  );
};

export default BarcodeReader;
