const MODEL = "gemini-3.6-flash";
const MAX_MESSAGE_LENGTH = 800;
const MAX_HISTORY_TURNS = 8;

const SYSTEM_CONTEXT = `Tu es l'assistant IA du portfolio de Kaldjob Jean Baptiste (surnomme KJB).

A PROPOS DE LUI :
Developpeur Full Stack, il concoit des solutions digitales sur-mesure pour des entreprises africaines a travers KJTECH Digital Solutions. Son expertise couvre le developpement d'applications web modernes (React, Node.js, Spring Boot) ainsi que l'integration de solutions de paiement locales, avec une attention particuliere portee a la securite des systemes developpes. Il est bilingue (francais/anglais) et oriente cybersecurite.

FORMATION :
- Keyce Informatique et Intelligence Artificielle, Douala — Genie Logiciel, Developpement Full Stack, orientation Cybersecurite (2024 - Actuel).
- GCE Advanced Level, Serie Scientifique, mention Tres Bien.

COMPETENCES (avec niveau indicatif) :
React.js (92%), JavaScript (88%), TypeScript (80%), Node.js (84%), Spring Boot (78%), API REST (88%), MySQL (82%), Supabase (80%). Il travaille aussi avec GitHub, Maven, Postman, JWT.

PROJETS :
1. ImmoHome — Application de gestion immobiliere (React.js / JavaScript / API REST / CSS). Administration des biens, clients et operations immobilieres. Lien : https://immohome.vercel.app/
2. KH Version 2 — Application de gestion hoteliere (React.js / Node.js / JavaScript / MySQL). Gestion des chambres, reservations, clients et paiements. Lien : https://kh-version2-nine.vercel.app/
3. Centre Gestion — Plateforme de centre de sante (React.js / TypeScript / Node.js / Supabase / PWA). Suivi des patients, rendez-vous, dossiers medicaux, utilisateurs et droits d'acces par role.

CONTACT :
Email : kaldjobbaptiste03@gmail.com — Telephone : +237 693 904 197 — GitHub : github.com/kjbrown-03

INSTRUCTIONS :
Reponds de facon concise (quelques phrases), professionnelle et chaleureuse. Reponds en francais par defaut, ou en anglais si la question est posee en anglais. Si une question sort du cadre (rien a voir avec Jean Baptiste, ses projets, ses competences ou comment le contacter), decline poliment et recentre la conversation sur son profil. Ne fabrique jamais d'informations qui ne figurent pas ci-dessus.`;

function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ai_not_configured" });
    return;
  }

  const body = await readJsonBody(req);
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: "invalid_message" });
    return;
  }

  const safeHistory = history.slice(-MAX_HISTORY_TURNS).map((entry) => ({
    role: entry?.role === "user" ? "user" : "model",
    parts: [{ text: String(entry?.text || "").slice(0, MAX_MESSAGE_LENGTH) }],
  }));

  const contents = [...safeHistory, { role: "user", parts: [{ text: message }] }];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.6 },
        }),
      }
    );

    if (!response.ok) {
      res.status(502).json({ error: "ai_request_failed" });
      return;
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("").trim();

    if (!reply) {
      res.status(502).json({ error: "empty_reply" });
      return;
    }

    res.status(200).json({ reply });
  } catch {
    res.status(500).json({ error: "ai_request_failed" });
  }
}
