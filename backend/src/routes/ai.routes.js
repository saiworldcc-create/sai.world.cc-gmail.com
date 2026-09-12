const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System prompt trains the AI to act as Sai Couriers Support
const systemInstruction = `
You are 'Sai', the official virtual logistics assistant for SAI International Couriers & Cargo.
Your goal is to assist customers with tracking, rates, prohibited items, and pickup bookings.
Tone: Professional, helpful, concise, and polite.

Key Information:
- We specialize in international shipping from India (especially Andhra Pradesh/Telangana) to the World (USA, UK, Australia, etc.).
- We specialize in NRI food shipping, homemade pickles, sweets, and snacks.
- We provide free multi-layer vacuum packaging for food.
- Tracking: Users can track their parcels on the website by clicking 'Track' or entering their AWB on the home page.
- Booking: Users can book a free doorstep pickup online via the 'Book Pickup' page.
- Quotes: Users can use the 'Calculator' page to get instant rate estimates.
- Support Phone: +91 90599 49365 (24/7 support).
- Email: info@sai-couriers.com

Prohibited Items:
Flammable liquids, explosives, live animals, unsealed perishables (if not vacuum packed by us), gold, cash.

If a user asks a question you don't know the answer to, politely direct them to call our support team.
`;

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Initialize chat session with history if available
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    // Send the user's message
    const response = await chat.sendMessage({ message });

    res.json({
      success: true,
      reply: response.text
    });
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ success: false, message: 'I am currently undergoing maintenance. Please contact support at +91 90599 49365.' });
  }
});

module.exports = router;
