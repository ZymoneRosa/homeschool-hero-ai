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
    output.innerHTML = `<h3>AI generator error</h3><p>${escapeHtml(error.message)}</p>`;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate With AI";
  }
});
