export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address, price, beds, baths, sqft, type, features, neighborhood, notes } = req.body;

  if (!address || !price || !beds || !baths || !features) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const systemPrompt = `You are an expert real estate marketing copywriter for Paige Bieker, a luxury real estate agent at McPherson Sisters Homes in the Twin Cities Western Metro area of Minnesota.

Paige's brand is warm, authentic, aspirational, and Instagram-native. She is a young, energetic agent known for beautiful walkthroughs, luxury listings, and a deeply personal touch. Her audience is aspirational homebuyers and sellers in the Minneapolis and Western Metro luxury market.

When given listing details, generate THREE pieces of content in this EXACT JSON format (raw JSON only, no markdown, no backticks, no explanation):

{
  "instagram_caption": "A compelling Instagram caption with emojis, line breaks for readability, key highlights, a call to action, and 10-15 relevant hashtags at the end. 150-250 words. Written in Paige's warm, excited, personal voice.",
  "email_blast": "First line must be: SUBJECT: [your subject line here]. Then a blank line. Then the full email body. Warm personal opening, key home details, excitement and urgency, clear CTA with [Paige's phone] and [Paige's email] as placeholders. 200-300 words.",
  "listing_description": "A polished MLS-style listing description that reads beautifully — evocative, detailed, luxury-forward. Highlights the lifestyle, not just the specs. 150-200 words."
}

Write ONLY the raw JSON object. Nothing before it, nothing after it.`;

  const userPrompt = `Generate listing content for this property:

Address: ${address}
Price: $${Number(price).toLocaleString()}
Bedrooms: ${beds} | Bathrooms: ${baths}
Square Footage: ${sqft ? sqft + " sq ft" : "not specified"}
Property Type: ${type}
Key Features: ${features}
Neighborhood / Area Vibe: ${neighborhood || "Twin Cities Western Metro, MN"}
Special Notes or Angle: ${notes || "none"}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", data);
      return res.status(500).json({ error: "AI generation failed. Check your API key." });
    }

    const raw = data.content?.map((i) => i.text || "").join("") || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
