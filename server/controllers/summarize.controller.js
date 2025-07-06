import axios from "axios";

export const summarizeMessages = async (req, res) => {
  try {
    const { conversations } = req.body;

    if (!conversations || !Array.isArray(conversations) || conversations.length === 0) {
      return res.status(400).json({ error: "No conversations provided" });
    }

    // Process each conversation individually
    const summaryPromises = conversations.map(async (conversation) => {
      if (!conversation.messages || !conversation.senderName) {
        return {
          senderName: conversation.senderName || 'Unknown',
          summary: "No messages to summarize"
        };
      }

      const prompt = `Summarize the following messages from ${conversation.senderName} in 2-4 bullet points:\n\n${conversation.messages}`;

      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "deepseek/deepseek-chat-v3-0324",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "HTTP-Referer": `${process.env.CLIENT_URL}`,
              "X-Title": "Chattr Box",
            },
            timeout: 10000 // 10 seconds timeout
          }
        );

        return {
          senderName: conversation.senderName,
          summary: response.data.choices[0]?.message?.content || "No summary generated"
        };
      } catch (error) {
        console.error(`Error summarizing for ${conversation.senderName}:`, error.message);
        return {
          senderName: conversation.senderName,
          summary: "Failed to generate summary"
        };
      }
    });

    const summaries = await Promise.all(summaryPromises);
    
    res.status(200).json({ summaries });
  } catch (error) {
    console.error("Controller error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};