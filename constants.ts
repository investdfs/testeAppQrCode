import React from 'react';

export const APP_NAME = "QR Scan Pro";
export const SUPPORTED_FORMATS = ['qr_code'];
export const HISTORY_STORAGE_KEY = 'qr_scan_history';

// SVG Icons as constants to keep components clean
export const ICONS = {
  QR: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-24 h-24", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 4v1m6 11h2m-6 0h-2v4h-4v-5h5v-5h-6l2 3m5 2v-2h6l-2-2m2 6h-6M6 16H4m2 0V6h10" }),
    React.createElement("rect", { x: 3, y: 3, width: 7, height: 7, rx: 1, strokeWidth: 1.5 }),
    React.createElement("rect", { x: 14, y: 3, width: 7, height: 7, rx: 1, strokeWidth: 1.5 }),
    React.createElement("rect", { x: 3, y: 14, width: 7, height: 7, rx: 1, strokeWidth: 1.5 })
  ),
  CAMERA: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }),
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })
  ),
  CLOSE: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
  ),
  COPY: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" })
  ),
  EXTERNAL_LINK: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" })
  ),
  TRASH: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" })
  ),
  HISTORY: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })
  )
};