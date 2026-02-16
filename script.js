// Get DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const progressBar = document.getElementById("progressBar");
const attendeeCountEl = document.getElementById("attendeeCount");
const greetingEl = document.getElementById("greeting");
const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");

// Track attendance
let count = 0;
const maxCount = 50;

// Track per-team totals
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

// Update UI elements (count, team totals, progress)
function updateUI() {
  attendeeCountEl.textContent = count;

  const percent = Math.min(100, Math.round((count / maxCount) * 100));
  progressBar.style.width = `${percent}%`;

  // change color when goal reached
  if (percent >= 100) {
    progressBar.style.backgroundImage =
      "linear-gradient(90deg, #16a34a, #10b981)";
  } else {
    progressBar.style.backgroundImage =
      "linear-gradient(90deg, #0071c5, #00aeef)";
  }

  waterCountEl.textContent = teamCounts.water;
  zeroCountEl.textContent = teamCounts.zero;
  powerCountEl.textContent = teamCounts.power;
}

// Show a short personalized greeting
function showGreeting(name, teamName) {
  greetingEl.textContent = `🎉 Welcome, ${name} — thanks for joining ${teamName}!`;
  greetingEl.classList.add("success-message");
  greetingEl.style.display = "block";

  // hide after 4 seconds
  setTimeout(function () {
    greetingEl.style.display = "none";
  }, 4000);
}

// Handle form submit (check-in)
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value; // 'water' | 'zero' | 'power'

  // Basic validation (name + team required)
  if (!name) {
    greetingEl.textContent = "Please enter a name to check in.";
    greetingEl.classList.remove("success-message");
    greetingEl.style.display = "block";
    return;
  }
  if (!team) {
    greetingEl.textContent = "Please select a team.";
    greetingEl.classList.remove("success-message");
    greetingEl.style.display = "block";
    return;
  }

  // Prevent exceeding the attendance goal
  if (count >= maxCount) {
    greetingEl.textContent =
      "Attendance goal reached — no more check-ins allowed.";
    greetingEl.classList.remove("success-message");
    greetingEl.style.display = "block";
    return;
  }

  // Update totals
  count += 1;
  if (teamCounts.hasOwnProperty(team)) {
    teamCounts[team] += 1;
  }

  // Update UI and show greeting
  updateUI();
  const teamName = teamSelect.selectedOptions[0].text;
  showGreeting(name, teamName);

  // Reset form and focus the name field for the next check-in
  form.reset();
  nameInput.focus();
});
