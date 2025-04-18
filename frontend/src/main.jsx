import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './print.css'; // 새로 추가한 print CSS

createRoot(document.getElementById('root')).render(
    <App />
)

