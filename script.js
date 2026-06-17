const lessonForm = document.getElementById("lessonForm");
const output = document.getElementById("lessonOutput");
const generateBtn = document.getElementById("generateBtn");
const startFreeBtn = document.querySelector(".btn-primary, .start-free, a[href='#generator']");

let freeLessons = localStorage.getItem("freeLessonsRemaining");

if (freeLessons === null) {
  freeLessons = 5;
  localStorage.setItem("freeLessonsRemaining", freeLessons);
} else {
  freeLessons = Number(freeLessons);
}

function updateFreeLessonText() {
  if (!document.getElementById("freeLessonCounter")) {
    const counter = document.createElement("p");
    counter.id = "freeLessonCounter";
    counter.style.fontWeight = "700";
    counter.style.marginTop = "15px";
    generateBtn.insertAdjacentElement("afterend", counter);
  }

  document.getElementById("freeLessonCounter").textContent =
    `${freeLessons} free lesson${freeLessons === 1 ? "" : "s"} remaining`;
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderText(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

if (startFreeBtn) {
  startFreeBtn.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.setItem("freeLessonsRemaining", 5);
    freeLessons = 5;
    updateFreeLessonText();

    document.getElementById("generator").scrollIntoView({
      behavior: "smooth"
    });
  });
}

updateFreeLessonText();

lessonForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (freeLessons <= 0) {
    output.innerHTML = `
      <h3>Your free lessons are used up.</h3>
      <p>You have used all 5 free lesson generations.</p>
      <p>Please choose a paid plan to continue creating lessons.</p>
      <a href="pricing.html" class="btn-primary">View Plans</a>
    `;
    return;
  }

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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The AI generator could not complete the request.");
    }

    freeLessons -= 1;
    localStorage.setItem("freeLessonsRemaining", freeLessons);
    updateFreeLessonText();

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
      <h3>AI generator error</h3>
      <p>${escapeHtml(error.message)}</p>
      <p>If this says quota exceeded, add credits to your OpenAI account.</p>
    `;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate With AI";
  }
});
