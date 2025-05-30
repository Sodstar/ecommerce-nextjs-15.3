"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";

type BarcodeProps = {
  value: string;
};

const BarcodeImage = ({ value }: BarcodeProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      try {
        // Clear any previous rendering
        while (svgRef.current.firstChild) {
          svgRef.current.removeChild(svgRef.current.firstChild);
        }

        // Only try to render if there's a valid value
        if (value && value.length > 0) {
          // For EAN13, value should be 12 or 13 digits
          // Use a more lenient check to handle real barcode scanner inputs
          const sanitizedValue = value.trim().replace(/\D/g, '');
          
          if (/^\d{12,13}$/.test(sanitizedValue)) {
            JsBarcode(svgRef.current, sanitizedValue, {
              format: "EAN13",
              lineColor: "#000",
              width: 1.5,
              height: 60,
              displayValue: true,
              fontSize: 12,
              margin: 5,
              background: "#ffffff",
            });
            setError(null);
          } else {
            setError("Барикод 12-13 оронтой тоо байх ёстой");
          }
        } else {
          setError("Барикод оруулна уу");
        }
      } catch (error: any) {
        console.error("Barcode generation error:", error);
        setError(`Барикод үүсгэхэд алдаа гарлаа: ${error.message || ''}`);
      }
    }
  }, [value]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-2">
      {error ? (
        <div className="text-sm text-muted-foreground bg-muted/30 py-2 px-4 rounded-md">
          {error}
        </div>
      ) : (
        <svg ref={svgRef} className="w-full max-h-20" />
      )}
    </div>
  );
};

export default BarcodeImage;
