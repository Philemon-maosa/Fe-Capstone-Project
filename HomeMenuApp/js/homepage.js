document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("access");

  if (!token) {
    alert("You must be logged in!");
    window.location.href = "login.html";
    return;
  }

  // Display username
  document.getElementById("welcome-text").textContent = `Welcome, ${username}!`;

  // Buttons
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    alert("You have been logged out.");
    window.location.href = "login.html";
  });

  // Optional: fetch example data from backend
  try {
    const response = await fetch("http://127.0.0.1:8000/api/recipes/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const recipes = await response.json();
      console.log("Recipes:", recipes);
    } else {
      console.warn("Failed to load recipes");
    }
  } catch (err) {
    console.error("Error fetching recipes:", err);
  }
});
