document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  const unregisterForm = document.getElementById("unregister-form");
  const unregisterMessageDiv = document.getElementById("unregister-message");
  const unregisterActivitySelect = document.getElementById("unregister-activity");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        const participantsList = details.participants
          .map(participant => `<li>${participant}</li>`)
          .join("");

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <p><strong>Participants:</strong></p>
          <ul class="participants-list">
            ${participantsList || "<li>No participants yet</li>"}
          </ul>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

      populateUnregisterDropdown(activities);
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);

      // Refresh activities
      fetchActivities();
      
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Handle unregister form submission
  unregisterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("unregister-email").value;
    const activity = document.getElementById("unregister-activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        unregisterMessageDiv.textContent = result.message;
        unregisterMessageDiv.className = "success";
        unregisterForm.reset();
      } else {
        unregisterMessageDiv.textContent = result.detail || "An error occurred";
        unregisterMessageDiv.className = "error";
      }

      unregisterMessageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        unregisterMessageDiv.classList.add("hidden");
      }, 5000);

      // Refresh activities
      fetchActivities();
    } catch (error) {
      unregisterMessageDiv.textContent = "Failed to unregister. Please try again.";
      unregisterMessageDiv.className = "error";
      unregisterMessageDiv.classList.remove("hidden");
      console.error("Error unregistering:", error);
    }
  });

  // Populate unregister activity dropdown
  function populateUnregisterDropdown(activities) {
    unregisterActivitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
    Object.keys(activities).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      unregisterActivitySelect.appendChild(option);
    });
  }

  // Dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = document.body.classList.contains("dark-mode")
      ? "Light Mode"
      : "Dark Mode";
  });

  // Initialize app
  fetchActivities();
});
