const lessonForm = document.getElementById('lessonForm');
const output = document.getElementById('lessonOutput');
const generateBtn = document.getElementById('generateBtn');

function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderGeneratedText(text) {
  const safe = escapeHtml(text);
  return safe
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h3>$1</h3>')
    .replace(/^# (.*)$/gm, '<h2>$1</h2>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

async function callGenerator(payload) {
  // Netlify Functions URL first. If you deploy on Vercel, the fallback API route is also included.
  let response = await fetch('/.netlify/functions/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (response.status === 404) {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'The AI generator could not complete the request.');
  }
  return data.content;
}

if (lessonForm) {
  lessonForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const payload = {
      grade: document.getElementById('grade').value,
      subject: document.getElementById('subject').value,
      topic: document.getElementById('topic').value || 'Today’s Topic',
      learningStyle: document.getElementById('learningStyle').value,
      contentType: document.getElementById('contentType').value
    };

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    output.innerHTML = `
      <h3>Creating your ${payload.subject} lesson...</h3>
      <p>Please keep this page open while the AI writes the lesson, worksheet, quiz, and answer key.</p>
    `;

    try {
      const content = await callGenerator(payload);
      output.innerHTML = `
        <div class="output-actions">
          <button type="button" onclick="window.print()">Print</button>
          <button type="button" id="copyLessonBtn">Copy</button>
        </div>
        <div class="generated-content"><p>${renderGeneratedText(content)}</p></div>
      `;
      document.getElementById('copyLessonBtn').addEventListener('click', async () => {
        await navigator.clipboard.writeText(content);
        document.getElementById('copyLessonBtn').textContent = 'Copied!';
      });
    } catch (error) {
      output.innerHTML = `
        <h3>AI generator is not connected yet.</h3>
        <p>${escapeHtml(error.message)}</p>
        <p><strong>Fix:</strong> Add your OpenAI API key as an environment variable named <code>OPENAI_API_KEY</code> in Netlify or Vercel, then redeploy.</p>
      `;
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate With AI';
    }
  });
}
