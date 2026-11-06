const costService = require('../services/costService');
const chatCache = new Map();
const { GoogleGenAI } = require('@google/genai');

let ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (e) {
    console.warn('Gemini initialization warning:', e.message);
  }
}

const systemInstruction = `
You are 'Sai', the official virtual logistics assistant for SAI International Couriers & Cargo.
Your goal is to assist customers with tracking, rates, prohibited items, and pickup bookings.
Tone: Professional, helpful, concise, and polite.

Key Information:
- We specialize in international shipping from India (especially Andhra Pradesh/Telangana) to the World (USA, UK, Australia, UAE, Europe, etc.).
- We specialize in NRI food shipping, homemade pickles, sweets, spices, and snacks.
- We provide free multi-layer vacuum packaging for food parcels.
- Tracking: Users can track their parcels on the website by clicking 'Track' or entering their AWB on the home page.
- Booking: Users can book a free doorstep pickup online via the 'Book Pickup' page (/book-pickup).
- Quotes: Users can use the 'Calculator' page (/calculator) to get instant rate estimates.
- Support Phone: +91 90599 49365 (24/7 support).
- Email: info@sai-couriers.com

Prohibited Items:
Flammable liquids, explosives, live animals, unsealed perishables (if not vacuum packed by us), gold, cash.

If a user asks a question you don't know the answer to, politely direct them to call our support team at +91 90599 49365.
`;

function getLogisticsFallbackResponse(message) {
  const q = (message || '').toLowerCase();

  if (q.includes('track') || q.includes('awb') || q.includes('where is my') || q.includes('status')) {
    return "You can track your consignment in real-time by entering your AWB number on the Home page or visiting our Tracking Portal. For live milestone checkpoints and customs status, feel free to submit a support ticket in our Help Center or contact our 24/7 central dispatch desk at +91 90599 49365.";
  }

  if (q.includes('pickle') || q.includes('food') || q.includes('sweet') || q.includes('nri') || q.includes('vacuum') || q.includes('snack') || q.includes('spices')) {
    return "Yes! Sai International Couriers specializes in NRI homemade food parcel delivery to 195+ countries including USA, UK, Canada, Australia, and UAE. We provide complimentary multi-layer commercial vacuum sealing (120-micron oxygen barrier pouches) and leak-proof boxing to ensure zero odor, zero oil leakage, and full aviation compliance.";
  }

  if (q.includes('rate') || q.includes('price') || q.includes('cost') || q.includes('charge') || q.includes('quote') || q.includes('how much') || q.includes('fee')) {
    return "You can calculate exact door-to-door courier charges using our online Rate Calculator (/calculator). Charges are transparent and based on destination country and gross or volumetric weight (L x W x H in cm / 5000), including complimentary pickup and vacuum packaging.";
  }

  if (q.includes('pickup') || q.includes('book') || q.includes('doorstep') || q.includes('collect') || q.includes('home') || q.includes('schedule')) {
    return "We offer free doorstep pickup across Andhra Pradesh and Telangana, including Kadapa, Hyderabad, Vijayawada, Tirupati, Kurnool, and Nellore. You can schedule a pickup online at our 'Book Pickup' portal (/book-pickup) or call us directly at +91 90599 49365 before 2:00 PM for guaranteed same-day collection.";
  }

  if (q.includes('prohibit') || q.includes('banned') || q.includes('allow') || q.includes('liquid') || q.includes('battery') || q.includes('gold')) {
    return "Prohibited and restricted items include flammable liquids, aerosols, perfumes, loose lithium batteries, explosives, live plants/animals, cash, gold/bullion, and unregistered narcotics. For full shipping compliance guidelines, please visit our Prohibited Items guide (/prohibited-items).";
  }

  if (q.includes('branch') || q.includes('office') || q.includes('address') || q.includes('kadapa') || q.includes('hyderabad') || q.includes('location')) {
    return "Our central headquarters and main hub is located beside SBI, Railway Station Road, Kadapa, AP (+91 90599 49365). Our international air cargo gateway operates from the Cargo Terminal, Rajiv Gandhi International Airport (RGIA), Shamshabad, Hyderabad. Visit our Branches page (/branches) for all regional locations.";
  }

  if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('helpline') || q.includes('number') || q.includes('email') || q.includes('support')) {
    return "You can reach Sai International Couriers 24/7 at +91 90599 49365 or email us at info@sai-couriers.com. Our support supervisors are available around the clock to assist you.";
  }

  return "Hello! I am Sai, your logistics assistant. I can assist you with tracking your parcel, shipping homemade NRI pickles and food parcels, checking international shipping rates, and booking free doorstep pickups in Andhra Pradesh and Telangana. How can I assist you today? You can also reach our 24/7 team directly at +91 90599 49365.";
}

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const normalizedQuery = message.trim().toLowerCase();
    if (chatCache.has(normalizedQuery)) {
      return res.json({ success: true, reply: chatCache.get(normalizedQuery), cached: true });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (ai && process.env.GEMINI_API_KEY && costService.canMakeAiRequest()) {
      try {
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction, temperature: 0.3 }
        });
        const response = await chat.sendMessage({ message: message.trim() });
        if (response && response.text) {
          costService.recordAiRequest(180);
          chatCache.set(normalizedQuery, response.text);
          return res.json({ success: true, reply: response.text, provider: 'gemini_flash' });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call error, falling back to local logistics engine:', geminiErr.message);
      }
    }

    // High-fidelity Logistics Knowledge Engine Fallback
    const fallbackReply = getLogisticsFallbackResponse(message);
    chatCache.set(normalizedQuery, fallbackReply);
    return res.json({ success: true, reply: fallbackReply, provider: 'local_knowledge_engine' });
  } catch (err) {
    console.error('Chat error:', err);
    return res.json({
      success: true,
      reply: "Thank you for reaching out to Sai International Couriers. For immediate assistance with your booking or tracking, please call our 24/7 support line at +91 90599 49365 or visit our Help Center."
    });
  }
};
