import Quagga from "quagga";
import React from "react";

const quaggaConfig = {
  inputStream: {
    type: "LiveStream",
    constraints: {
      width: { min: 640 },
      height: { min: 480 },
      facingMode: "environment",
      aspectRatio: { min: 1, max: 2 },
    },
  },
  locator: {
    patchSize: "medium",
    halfSample: true,
  },
  numOfWorkers: 2,
  frequency: 10,
  decoder: {
    readers: [
      {
        format: "ean_reader",
        config: {},
      },
    ],
  },
  locate: true,
};

export default function useQuagga({
  onDetected,
}: {
  onDetected: (isbn: string) => void;
}) {
  // Init Quagga
  React.useEffect(() => {
    Quagga.init(quaggaConfig, (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
      Quagga.onDetected((result: any) => {
        const isbn = result.codeResult.code;
        return onDetected(isbn);
      });
      Quagga.onProcessed(function (result: any) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute("width")),
              parseInt(drawingCanvas.getAttribute("height"))
            );
            result.boxes
              .filter(function (box: any) {
                return box !== result.box;
              })
              .forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: "green",
                  lineWidth: 2,
                });
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: "#00F",
              lineWidth: 2,
            });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: "x", y: "y" },
              drawingCtx,
              { color: "red", lineWidth: 3 }
            );
          }
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
