/*
  Using Grok API from xAI for AI-powered interview question generation.
  Maintains exact interface for chatSession.sendMessage(msg).result.response.text()
*/

const apiKey = process.env.NEXT_PUBLIC_GROK_API_KEY;

export const chatSession = {
    sendMessage: async (inputPrompt) => {
        if (!apiKey) {
            throw new Error('NEXT_PUBLIC_GROK_API_KEY environment variable is not set. Please add it to your .env.local file.');
        }
        
        try {
            const response = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "grok-beta",
                    "messages": [
                        {
                            "role": "user",
                            "content": inputPrompt
                        }
                    ],
                    "temperature": 0.7
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Grok API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Grok API Data:", JSON.stringify(data, null, 2)); // DEBUG LOG
            const content = data.choices[0]?.message?.content || "";

            // Adapt to match the exact interface expected by AddNewInterview.jsx
            // result.response.text()
            return {
                response: {
                    text: () => content
                }
            };

        } catch (error) {
            console.error("Error generating AI response:", error);
            throw error;
        }
    }
};
