const lessonForm = document.getElementById("lessonForm");
const output = document.getElementById("lessonOutput");
const generateBtn = document.getElementById("generateBtn");

let freeLessons = Number(localStorage.getItem("freeLessonsRemaining") ?? 5);
localStorage.setItem("freeLessonsRemaining", freeLessons);

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getGradeNumber(grade) {
  const g = String(grade).toLowerCase();
  if (g.includes("k")) return 0;
  const match = g.match(/\d+/);
  return match ? Number(match[0]) : 5;
}

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

function makeMathProblems(gradeText) {
  const grade = getGradeNumber(gradeText);
  const problems = [];
  const answers = [];

  for (let i = 1; i <= 10; i++) {
    let q, a;

    if (grade <= 2) {
      const x = rand(1, grade === 0 ? 10 : 30);
      const y = rand(1, grade === 0 ? 10 : 30);
      if (i % 2 === 0 && x > y) {
        q = `${x} - ${y} = _____`;
        a = x - y;
      } else {
        q = `${x} + ${y} = _____`;
        a = x + y;
      }
    } else if (grade <= 5) {
      if (i <= 3) {
        const x = rand(2, 12), y = rand(2, 12);
        q = `${x} × ${y} = _____`;
        a = x * y;
      } else if (i <= 6) {
        const y = rand(2, 12), a0 = rand(2, 12);
        q = `${y * a0} ÷ ${y} = _____`;
        a = a0;
      } else {
        const den = [4, 6, 8, 10, 12][rand(0, 4)];
        const n1 = rand(1, den - 1);
        const n2 = rand(1, den - n1);
        q = `${n1}/${den} + ${n2}/${den} = _____`;
        a = `${n1 + n2}/${den}`;
      }
    } else if (grade <= 8) {
      if (i <= 3) {
        const a1 = rand(2, 9), b1 = rand(3, 12), scale = rand(2, 5);
        q = `Solve the ratio: ${a1}:${b1} = ${a1 * scale}:_____`;
        a = b1 * scale;
      } else if (i <= 6) {
        const x = (rand(10, 99) / 10).toFixed(1);
        const y = (rand(10, 99) / 10).toFixed(1);
        q = `${x} + ${y} = _____`;
        a = (Number(x) + Number(y)).toFixed(1);
      } else {
        const x = rand(2, 10), b = rand(1, 15), ans = rand(2, 12);
        q = `${x}x + ${b} = ${x * ans + b}. Find x.`;
        a = ans;
      }
    } else {
      if (i <= 4) {
        const m = rand(2, 8), b = rand(1, 12), xVal = rand(2, 10);
        q = `${m}x + ${b} = ${m * xVal + b}. Solve for x.`;
        a = xVal;
      } else if (i <= 7) {
        const l = rand(5, 20), w = rand(3, 15);
        q = `A rectangle has length ${l} and width ${w}. Find the area.`;
        a = `${l * w} square units`;
      } else {
        const base = rand(6, 20), height = rand(4, 16);
        q = `A triangle has base ${base} and height ${height}. Find the area.`;
        a = `${(base * height) / 2} square units`;
      }
    }

    problems.push(`${i}. ${q}`);
    answers.push(`${i}. ${a}`);
  }

  return { problems, answers };
}

function buildLesson(payload) {
  const { grade, subject, topic, learningStyle, contentType } = payload;
  const math = makeMathProblems(grade);

  return `
${grade} ${subject}: ${topic}
Type: ${contentType}
Learning Style: ${learningStyle}

OBJECTIVE
Students will practice ${topic} using real grade-level math problems.

WARM-UP
1. Count forward by 2s, 5s, or 10s.
2. Review one easy example together.

MINI LESSON
Today we are learning ${topic}. First, look at the numbers carefully. Then choose the correct operation or strategy. Show your work.

WORKSHEET
Name: ____________________________    Date: ____________________________

Directions: Solve each problem. Show your work.

${math.problems.join("\n")}

CHALLENGE QUESTION
Create your own ${topic} problem and solve it:
____________________________________________________
____________________________________________________

EXIT TICKET
What strategy helped you most today?
____________________________________________________

ANSWER KEY
${math.answers.join("\n")}
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
    topic: document.getElementById("topic").value || "Math Practice",
    learningStyle: document.getElementById("learningStyle").value,
    contentType: document.getElementById("contentType").value
  };

  freeLessons--;
  localStorage.setItem("freeLessonsRemaining", freeLessons);
  updateCounter();

  const lesson = buildLesson(payload);

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
