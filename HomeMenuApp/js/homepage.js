document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("access");

  // ✅ Redirect if not logged in
  if (!token) {
    alert("You must be logged in!");
    window.location.href = "login.html";
    return;
  }

  // ✅ Display username
  const welcomeText = document.getElementById("welcome-text");
  if (welcomeText) {
    welcomeText.textContent = `Welcome, ${username || "User"}!`;
  }

  // ✅ Logout button (from navbar)
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      alert("You have been logged out.");
      window.location.href = "login.html";
    });
  }

  // ✅ “My Ingredients” button
  const myIngredientsBtn = document.getElementById("view-ingredients");
  if (myIngredientsBtn) {
    myIngredientsBtn.addEventListener("click", () => {
      window.location.href = "ingredients.html";
    });
  }

  // ✅ “View Recipes” button
  const viewRecipesBtn = document.getElementById("view-recipes");
  if (viewRecipesBtn) {
    viewRecipesBtn.addEventListener("click", () => {
      window.location.href = "recipes.html";
    });
  }

  // Optional: Fetch recipes for dashboard preview
  try {
    const response = await fetch("http://127.0.0.1:8000/api/recipes/", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      alert("Session expired. Please log in again.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (response.ok) {
      const recipes = await response.json();
      console.log("✅ Recipes loaded:", recipes);

      // Example: Display count on homepage if needed
      const recipeCountEl = document.getElementById("recipe-count");
      if (recipeCountEl) {
        recipeCountEl.textContent = `${recipes.length} recipes available`;
      }
    } else {
      console.warn("Failed to load recipes:", response.status);
    }
  } catch (err) {
    console.error("Error fetching recipes:", err);
  }
});
