const express = require('express');
const router = express.Router();
const { default: ModelClient, isUnexpected } = require('@azure-rest/ai-inference');
const { AzureKeyCredential } = require('@azure/core-auth');

// POST /api/ai/gpt5 (now using Azure ModelClient and GPT-4.1)
router.post('/gpt5', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const token = process.env["GITHUB_TOKEN"];
    const endpoint = "https://models.github.ai/inference";
    const model = "openai/gpt-4.1";

    const client = ModelClient(
      endpoint,
      new AzureKeyCredential(token),
    );

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 1,
        top_p: 1,
        model: model
      }
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    res.json({ response: response.body.choices[0].message.content });
  } catch (err) {
    console.error("Azure ModelClient API error:", err);
    res.status(500).json({ error: 'Failed to get response from Azure ModelClient' });
  }
});

module.exports = router;
