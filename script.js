const lessonForm = document.getElementById("lessonForm");
const output = document.getElementById("lessonOutput");
const generateBtn = document.getElementById("generateBtn");

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderText(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

lessonForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    grade: document.getElementById("grade").value,
    subject: document.getElementById("subject").value,
    topic: document.getElementById("topic").value || "Today’s lesson",
    learningStyle: document.getElementById("learningStyle").value,
    contentType: document.getElementById("contentType").value
  };

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  output.innerHTML = `<h3>Creating your ${payload.subject} lesson...</h3><p>Please wait.</p>`;

  try {
    const response = await fetch("/.netlify/functions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The AI generator could not complete the request.");
    }

    output.innerHTML = `
      <div class="output-actions">
        <button type="button" onclick="window.print()">Print</button>
        <button type="button" id="copyLessonBtn">Copy</button>
      </div>
      <div class="generated-content">${renderText(data.content)}</div>
    `;

    document.getElementById("copyLessonBtn").addEventListener("click", async () => {
      await navigator.clipboard.writeText(data.content);
      document.getElementById("copyLessonBtn").textContent = "Copied!";
    });

  } catch (error) {
    output.innerHTML = `
      <h3>Free Sample Lesson: 5th Grade Fractions</h3>
      <p><strong>Objective:</strong> Students will understand how to identify and simplify fractions.</p>

      <h3>Warm-Up</h3>
      <p>Write these fractions: 1/2, 2/4, 3/6. Ask: What do they have in common?</p>

      <h3>Mini Lesson</h3>
      <p>A fraction shows part of a whole. The top number is the numerator. The bottom number is the denominator.</p>

      <h3>Guided Practice</h3>
      <p>1. What fraction is shaded if 3 out of 8 pieces are colored?</p>
      <p>2. Simplify 2/4.</p>
      <p>3. Simplify 4/8.</p>

      <h3>Worksheet</h3>
      <p>Name: __________________ Date: __________</p>
      <p>1. Simplify 6/12: __________</p>
      <p>2. Simplify 3/9: __________</p>
      <p>3. Which is bigger: 1/2 or 1/4? __________</p>
      <p>4. Draw a circle and shade 1/3 of it.</p>
      <p>5. Write one fraction equal to 1/2: __________</p>

      <h3>Answer Key</h3>
      <p>1. 1/2</p>
      <p>2. 1/3</p>
      <p>3. 1/2</p>
      <p>4. Drawing should show one-third shaded.</p>
      <p>5. Examples: 2/4, 3/6, 4/8</p>

      <p><strong>Note:</strong> This free sample appears when AI credits are unavailable.</p>
    `;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate With AI";
  }
});
