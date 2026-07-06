import { HfInference } from "@huggingface/inference";

export const chatCompletion = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format" });
        }

        const hfToken = process.env.HUGGINGFACE_API_KEY || process.env.VITE_HUGGINGFACE_API_KEY;
        
        if (!hfToken) {
            return res.status(500).json({ error: "Hugging Face API key is missing on the server" });
        }

        const hf = new HfInference(hfToken);

        const template = `You are TARS, the official AI assistant for CXO Connect. CXO Connect is an exclusive network bridging forward-thinking companies and elite fractional leaders (like fractional CMOs, CFOs, etc.).
Your strict rules:
1. ONLY answer questions regarding CXO Connect, finding fractional leaders, or joining the network.
2. If asked ANYTHING outside the usage of the website's core (e.g., coding, general knowledge, math, unrelated advice), you must politely decline and state that you can only assist with CXO Connect related inquiries.
3. Keep your answers concise, professional, and helpful.
4. NEVER use markdown bold (**) or italic (*) marks anywhere in your response. Keep the text clean.
5. If your answer is in points, format it nicely with standard bullet points.
6. All answers MUST be under 100 words.`;

        // Ensure system prompt is first
        const formattedMessages = [
            { role: "system", content: template },
            ...messages
        ];

        const result = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: formattedMessages,
            max_tokens: 180,
            temperature: 0.1
        });

        // Strip out all * and ** marks completely
        let finalResponse = result.choices[0].message.content.trim().replace(/\*/g, '');

        res.json({ response: finalResponse });
    } catch (error) {
        console.error("Error generating chat response:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};
