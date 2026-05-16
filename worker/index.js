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

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    let content;
    try { ({ content } = await request.json()); } catch { return new Response('Invalid JSON', { status: 400 }); }
    if (!content) return new Response('Missing content', { status: 400 });

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: content.slice(0, 12000) },
        ],
      }),
    });

    if (!res.ok) return new Response(`OpenAI error: ${await res.text()}`, { status: 502, headers: CORS });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]+\}/);
    if (!match) return new Response('No JSON in response', { status: 500, headers: CORS });

    return new Response(match[0], { headers: { ...CORS, 'Content-Type': 'application/json' } });
  },
};
