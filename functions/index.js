const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { OpenAI } = require('openai');

const SYSTEM = `Du bist ein Reisebuchungs-Parser. Extrahiere aus der E-Mail alle Reisedaten und antworte NUR mit gültigem JSON, ohne Markdown-Codeblock.

Schema (unbekannte Felder als null):
{
  "name": "Reiseziel auf Deutsch (z.B. 'Ibiza', 'Barcelona', 'Tirol')",
  "emoji": "passendes Emoji aus: ☀ 🫒 🍇 ❄ 🏖 🏔 🌊 🎿 🏛 🌴 🗺 ✈",
  "colorIdx": 0,
  "dateFrom": "YYYY-MM-DD",
  "dateTo": "YYYY-MM-DD",
  "type": "flight | train | drive",
  "flightFrom": "IATA",
  "flightFromCity": "Stadt",
  "flightTo": "IATA",
  "flightToCity": "Stadt",
  "flightNo": "z.B. FR180",
  "flightDepart": "HH:MM",
  "flightArrive": "HH:MM",
  "trainNo": "z.B. RJ 123",
  "trainFrom": "Bahnhof",
  "trainTo": "Bahnhof",
  "trainDepart": "HH:MM",
  "trainArrive": "HH:MM",
  "trainWagon": "Wagennummer",
  "trainSeats": "z.B. '23, 24'",
  "hotelName": "Name",
  "hotelLoc": "Stadt/Adresse",
  "hotelCi": "HH:MM",
  "hotelCo": "HH:MM",
  "costFlight": 0,
  "costHotel": 0,
  "costOther": 0,
  "paid": 0,
  "insurance": false
}

colorIdx-Mapping: 0=Peach (warm, Strand, Süden), 1=Sage (Natur, Wandern), 2=Sky (Meer, Insel), 3=Plum (Stadt, Kultur), 4=Sand (Wüste, Safari)`;

exports.parseBookingEmail = onCall({ region: 'europe-west3' }, async (request) => {
  const content = request.data?.content;
  if (!content) throw new HttpsError('invalid-argument', 'Kein Inhalt');

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new HttpsError('internal', 'API Key nicht konfiguriert');

  const client = new OpenAI({ apiKey });

  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: content.slice(0, 12000) },
    ],
  });

  const text = res.choices[0]?.message?.content || '';
  const match = text.match(/\{[\s\S]+\}/);
  if (!match) throw new HttpsError('internal', 'Kein JSON erhalten');

  return JSON.parse(match[0]);
});
