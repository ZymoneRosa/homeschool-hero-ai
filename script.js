exports.handler = async (event) => {
  try {
    const { topic, grade, subject, learningStyle, contentType } = JSON.parse(event.body || "{}");

    const prompt = `
Create a ${contentType} for:
Grade: ${grade}
Subject: ${subject}
Topic: ${topic}
Learning Style: ${learningStyle}

Make it parent-friendly, printable, organized, and include clear sections.
If it is a worksheet, include student name line, date line, directions, questions, and answer spaces.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI request failed.");
    }

    const content = data.choices?.[0]?.message?.content || "No content generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({ content })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
