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
const attendeeListEl = document.getElementById("attendeeList");

// Track attendance
let count = 0;
const maxCount = 50;

// Track per-team totals
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

// Stored attendees (name, team, teamName)
let attendees = [];
const storageKey = "attendanceState";

// Save state to localStorage
function saveState() {
  var state = {
    count: count,
    teamCounts: teamCounts,
    attendees: attendees,
  };
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (e) {
    console.error("Could not save state:", e);
  }
}

// Load state from localStorage
function loadState() {
  var raw = localStorage.getItem(storageKey);
  if (!raw) {
    updateUI();
    renderAttendeeList();
    return;
  }
  try {
    var state = JSON.parse(raw);
    if (typeof state.count === "number") {
      count = state.count;
    }
    if (state.teamCounts) {
      teamCounts.water = state.teamCounts.water || 0;
      teamCounts.zero = state.teamCounts.zero || 0;
      teamCounts.power = state.teamCounts.power || 0;
    }
    if (Array.isArray(state.attendees)) {
      attendees = state.attendees;
    }
  } catch (e) {
    console.error("Failed to load saved data:", e);
  }

  updateUI();
  renderAttendeeList();
}

// Update UI elements (count, team totals, progress)
function updateUI() {
  attendeeCountEl.textContent = count;

  var percent = Math.min(100, Math.round((count / maxCount) * 100));
  progressBar.style.width = percent + "%";

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

  renderAttendeeList();
}

// Render attendee list under team cards
function renderAttendeeList() {
  attendeeListEl.innerHTML = "";
  if (!attendees || attendees.length === 0) {
    var li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No attendees yet — be the first to check in!";
    attendeeListEl.appendChild(li);
    return;
  }

  // show newest first
  for (var i = attendees.length - 1; i >= 0; i--) {
    var a = attendees[i];
    var initials = a.name
      .split(" ")
      .map(function (p) {
        return p[0];
      })
      .slice(0, 2)
      .join("")
      .toUpperCase();

    var teamEmoji = "🌊";
    if (a.team === "zero") {
      teamEmoji = "🌿";
    }
    if (a.team === "power") {
      teamEmoji = "⚡";
    }

    var li = document.createElement("li");
    li.className = "attendee-item";
    li.innerHTML =
      `<div class="attendee-avatar ${a.team}">${initials}</div>` +
      `<div class="attendee-info">` +
      `<div class="attendee-name">${a.name}</div>` +
      `<div class="attendee-team">${teamEmoji} ${a.teamName}</div>` +
      `</div>`;

    attendeeListEl.appendChild(li);
  }
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

  var name = nameInput.value.trim();
  var team = teamSelect.value; // 'water' | 'zero' | 'power'

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

  var teamName = teamSelect.selectedOptions[0].text;

  // add attendee to the list and persist
  attendees.push({ name: name, team: team, teamName: teamName });
  saveState();

  // Update UI and show greeting
  updateUI();
  showGreeting(name, teamName);

  // Reset form and focus the name field for the next check-in
  form.reset();
  nameInput.focus();
});

// Initialize from storage
loadState();
