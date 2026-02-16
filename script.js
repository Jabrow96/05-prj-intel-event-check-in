// Get all neeeded DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const progressBar = document.getElementById("progressBar");

// Track attendance
let count = 0;
const maxCount = 50;

// Function to handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the values from the form
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team, teamName);

  // Increment count
  count++;
  console.log("Total check-ins:", count);
  attendeeCount.textContent = count;
  

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`progress: ${percentage}`);
  progressBar.style.width = percentage;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

// Show welcome message
const message = `🎉Welcome, ${name} from ${teamName}`;
console.log(message);


form.reset();
})