const lessonForm = document.getElementById("lessonForm");
const output = document.getElementById("lessonOutput");
const generateBtn = document.getElementById("generateBtn");

let freeLessons = Number(localStorage.getItem("freeLessonsRemaining") ?? 5);
localStorage.setItem("freeLessonsRemaining", freeLessons);

function updateCounter() {
  let counter = document.getElementById("freeLessonCounter");
  if (!counter) {
    counter = document.createElement("p");
    counter.id = "freeLessonCounter";
    counter.style.fontWeight = "700";
    counter.style.marginTop = "15px";
    generateBtn.insertAdjacentElement("afterend", counter);
  }
  counter.textContent = `${freeLessons} free lessons remaining`;
}

function gradeBand(grade) {
  const g = String(grade).toLowerCase();
  if (g.includes("k") || g.includes("1") || g.includes("2")) return "early";
  if (g.includes("3") || g.includes("4") || g.includes("5")) return "elementary";
  if (g.includes("6") || g.includes("7") || g.includes("8")) return "middle";
  return "high";
}

function createOfflineLesson({ grade, subject, topic, learningStyle, contentType }) {
  const band = gradeBand(grade);

  const levels = {
    early: {
      objective: `Students will explain ${topic} using simple words, pictures, and hands-on examples.`,
      warmup: `Draw or point to something that reminds you of ${topic}. Say one sentence about it.`,
      practice: [
        `Circle the picture or answer that matches ${topic}.`,
        `Draw your own example of ${topic}.`,
        `Tell a parent one thing you learned.`
      ]
    },
    elementary: {
      objective: `Students will understand ${topic}, explain it, and complete guided practice.`,
      warmup: `Write 2 things you already know about ${topic}.`,
      practice: [
        `Solve or explain one example about ${topic}.`,
        `Create your own example.`,
        `Write 3 sentences explaining what you learned.`
      ]
    },
    middle: {
      objective: `Students will analyze ${topic}, apply it to examples, and explain their reasoning.`,
      warmup: `Write a quick prediction: Why does ${topic} matter in ${subject}?`,
      practice: [
        `Define ${topic} in your own words.`,
        `Explain one real-world example.`,
        `Answer one challenge question using evidence or steps.`
      ]
    },
    high: {
      objective: `Students will evaluate ${topic}, apply it independently, and produce a written response.`,
      warmup: `Write a short paragraph explaining what you already know about ${topic}.`,
      practice: [
        `Summarize the key concept.`,
        `Apply ${topic} to a real-world situation.`,
        `Write a short response defending your answer.`
      ]
    }
  };

  const L = levels[band];

  return `
${grade} ${subject}: ${topic}
Type: ${contentType}
Learning Style: ${learningStyle}

OBJECTIVE
${L.objective}

WARM-UP
${L.warmup}

MINI LESSON
${topic} is an important part of ${subject}. Today, the student will learn what it means, see examples, and practice using it independently.

For a ${learningStyle}, use examples, conversation, movement, or visuals that match how the student learns best.

GUIDED PRACTICE
1. Parent demonstrates one example.
2. Student tries one example with help.
3. Parent asks: “How did you get your answer?”

WORKSHEET
Name: ______________________   Date: ______________________

1. What is ${topic}?
____________________________________________________

2. Give one example of ${topic}.
____________________________________________________

3. ${L.practice[0]}
____________________________________________________

4. ${L.practice[1]}
____________________________________________________

5. ${L.practice[2]}
____________________________________________________

EXIT TICKET
What is one thing you learned today?
____________________________________________________

ANSWER KEY
Answers may vary. Look for understanding, correct reasoning, and effort.

PARENT TIP
If the student struggles, use a simpler example and model the first answer together.
`;
}

updateCounter();

lessonForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (freeLessons <= 0) {
    output.innerHTML = `
      <h3>Your free lessons are used up.</h3>
      <p>You have used all 5 free lesson generations.</p>
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

  freeLessons--;
  localStorage.setItem("freeLessonsRemaining", freeLessons);
  updateCounter();

  const lesson = createOfflineLesson(payload);

  output.innerHTML = `
    <div class="output-actions">
      <button type="button" onclick="window.print()">Print</button>
      <button type="button" id="copyLessonBtn">Copy</button>
    </div>
    <pre style="white-space: pre-wrap; font-family: inherit;">${lesson}</pre>
  `;

  document.getElementById("copyLessonBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(lesson);
    document.getElementById("copyLessonBtn").textContent = "Copied!";
  });
});
