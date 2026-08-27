import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Provide testing URL for other persons/devices on the same Wi-Fi network
const networkIp = '192.168.1.7';
const port = window.location.port || '5173';
console.log(
  '%c🚀 SAI INTERNATIONAL COURIERS & CARGO %c\n' +
  '🌐 Testing URL for other devices / phones on this Wi-Fi:\n' +
  `👉 http://${networkIp}:${port}/`,
  'background: #1B44E4; color: #fff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
  'color: #0F2537; font-size: 13px; font-weight: bold; line-height: 1.6;'
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

