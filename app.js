require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const axios = require("axios");
const { Server } = require("socket.io");
const { BakongKHQR, khqrData, MerchantInfo } = require("bakong-khqr");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(cors());
app.use(express.json());
      
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ["websocket", "polling"]
});
              
// CONFIGURATION
const TOKEN = process.env.BAKONG_TOKEN?.trim() || null;
const MERCHANT_ID = process.env.BAKONG_MERCHANT_ID?.trim() || null;
const MERCHANT_NAME = process.env.BAKONG_MERCHANT_NAME?.trim() || "D-pos-system"; 
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || null;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || null;
const BAKONG_ENABLED = !!(TOKEN && MERCHANT_ID);

const pendingOrders = new Map();
const bot = TELEGRAM_BOT_TOKEN ? new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false }) : null;

// --- API ROUTES ---

// 1. បញ្ជូន Firebase Config ទៅកាន់ Frontend
app.get("/api/config", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  });
});

// 2. បង្កើត QR Code សម្រាប់ទូទាត់
app.post("/api/create-order", (req, res) => {
  try {
    const { customer, cart, seller } = req.body;
    if (!customer || !cart || cart.length === 0) return res.status(400).json({ error: "Invalid data" });

    const amountUSD = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
    if (amountUSD <= 0) return res.status(400).json({ error: "Invalid total" });

    const billNumber = "INV-" + Date.now();
    const expirationTimestamp = Date.now() + (5 * 60 * 1000); // ផុតកំណត់ក្នុង 5 នាទី
    
    let qrString = "mock_qr_string_testing";
    let md5 = "mock_md5_" + Date.now();

    // បង្កើត KHQR តាមស្តង់ដារធនាគារជាតិ
    if (BAKONG_ENABLED) {
      const optionalData = {
        currency: khqrData.currency.usd, 
        amount: amountUSD,
        billNumber,
        storeLabel: MERCHANT_NAME,
        terminalLabel: "POS-001",
        expirationTimestamp: expirationTimestamp 
      };

      const merchantInfo = new MerchantInfo(MERCHANT_ID, MERCHANT_NAME, "Phnom Penh", "BAKOCKPP", "5999", optionalData);
      const khqr = new BakongKHQR();
      const result = khqr.generateMerchant(merchantInfo);
      
      if (result && result.data) {
        qrString = result.data.qr;
        md5 = result.data.md5;
      }
    }

    // រក្សាទុកទិន្នន័យបណ្តោះអាសន្នរង់ចាំការស្កេន
    pendingOrders.set(md5, { customer, cart, amount: amountUSD, billNumber, seller });

    res.json({ qrString, md5, amount: amountUSD, expireAt: expirationTimestamp });
  } catch (err) {
    console.error("QR Generate Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 3. ពិនិត្យមើលស្ថានភាពទូទាត់ (Check Status)
app.post("/api/check-status", async (req, res) => {
  const { md5 } = req.body;
  if (!md5) return res.status(400).json({ error: "MD5 missing" });
  if (!BAKONG_ENABLED) return res.json({ status: "pending" });

  try {
    const response = await axios.post(
      "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
      { md5, merchantId: MERCHANT_ID },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    // 0 = ជោគជ័យ
    if (response.data && response.data.responseCode === 0) {
      handleSuccess(md5);
      return res.json({ status: "success" });
    }
  } catch (e) { /* ignore checking errors to prevent crashing */ }

  res.json({ status: "pending" });
});

// 4. អនុវត្តពេលទូទាត់ជោគជ័យ និងផ្ញើសារ Telegram
function handleSuccess(md5) {
  if (!pendingOrders.has(md5)) return;
  const order = pendingOrders.get(md5);

  // ប្រាប់ទៅ Frontend ឱ្យបិទផ្ទាំង QR
  io.emit("payment-success", { md5 });

  // ផ្ញើសារជូនដំណឹងចូល Telegram Group
  if (bot && TELEGRAM_CHAT_ID) {
    const items = order.cart.map(i => `🔸 ${i.name} (x${i.qty} ${i.unit}) - $${(i.price * i.qty).toLocaleString('en-US', {minimumFractionDigits: 2})}`).join("\n");
    const sellerName = order.seller?.name || "Unknown";
    const sellerRole = order.seller?.role || "Seller";
    const adminName = order.seller?.adminName || "Admin";
    const addressInfo = order.customer.address || "មិនបញ្ជាក់";

    const message = `
✅ *ការទូទាត់ទទួលបានជោគជ័យ (PAID)*
━━━━━━━━━━━━━━━━━━━━
💰 *ទឹកប្រាក់សរុប:* $${order.amount.toLocaleString('en-US', {minimumFractionDigits: 2})} USD
🛍️ *អតិថិជន:* ${order.customer.name}
📞 *ទំនាក់ទំនង:* ${order.customer.phone}
📍 *ទីតាំង/ការដឹកជញ្ជូន:* ${addressInfo}
━━━━━━━━━━━━━━━━━━━━
👨‍💼 *គណនីលក់ (POS):* ${sellerName} [${sellerRole.toUpperCase()}]
🛡️ *អ្នកគ្រប់គ្រង (Admin):* ${adminName}
📝 *វិក្កយបត្រ:* #${order.billNumber}
━━━━━━━━━━━━━━━━━━━━
*បញ្ជីទំនិញ:*
${items}
`;
    bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: "Markdown" }).catch(err => console.error("Telegram Error:", err));
  }
  
  // លុបទិន្នន័យចេញពី Memory បន្ទាប់ពីទូទាត់រួច
  pendingOrders.delete(md5);
}

// ✅ កំណត់ Port សម្រាប់ Render.com
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 D-pos-system Backend is running on port ${PORT}`);
    console.log(`🏪 Merchant Name: ${MERCHANT_NAME}`);
    if(BAKONG_ENABLED) console.log(`✅ Bakong KHQR: ដំណើរការ (Enabled)`);
    else console.log(`❌ Bakong KHQR: មិនដំណើរការ (ពិនិត្យមើល .env របស់អ្នក)`);
    if(TELEGRAM_BOT_TOKEN) console.log(`✅ Telegram Bot: ដំណើរការ (Enabled)`);
    console.log(`======================================================\n`);
});
