// js/recipes.js
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token"); // JWT token from login
  const recipesList = document.getElementById("recipes-list");

  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  const BACKEND_URL = "https://maosa.pythonanywhere.com/api"; // Fixed base URL

  // -------------------- Fetch all recipes --------------------
  async function loadAllRecipes() {
    try {
      const response = await axios.get(`${BACKEND_URL}/recipes/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      renderRecipes(response.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      recipesList.innerHTML = "<p>Error loading recipes. Make sure your backend is running and accessible.</p>";
    }
  }

  // -------------------- Render recipes --------------------
  function renderRecipes(recipes) {
    if (!recipes || recipes.length === 0) {
      recipesList.innerHTML = "<p>No recipes available.</p>";
      return;
    }

    recipesList.innerHTML = recipes.map(r => `
      <div class="recipe-card">
        <h3>${r.title}</h3>
        <p>${r.description || "No description available."}</p>
        <button class="view-btn" data-id="${r.id}">View Recipe</button>
      </div>
    `).join("");

    // Add "View Recipe" button click listeners
    document.querySelectorAll(".view-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const recipeId = e.target.dataset.id;
        window.location.href = `recipe-detail.html?id=${recipeId}`;
      });
    });
  }

  // -------------------- Suggested recipes --------------------
  const suggestBtn = document.getElementById("suggest-btn");
  if (suggestBtn) {
    suggestBtn.addEventListener("click", async () => {
      recipesList.innerHTML = "<p>Loading suggested recipes...</p>";

      // Use ingredients stored in localStorage (from kitchenlist.js)
      const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
      if (ingredients.length === 0) {
        recipesList.innerHTML = "<p>No ingredients found. Add some ingredients first!</p>";
        return;
      }

      try {
        const suggestRes = await axios.post(
          `${BACKEND_URL}/recipes/suggest/`, // Corrected endpoint
          { ingredients },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const suggestions = suggestRes.data;

        if (!suggestions || suggestions.length === 0) {
          recipesList.innerHTML = "<p>No matching recipes found.</p>";
          return;
        }

        recipesList.innerHTML = suggestions.map(s => `
          <div class="recipe-card">
            <h3>${s.recipe}</h3>
            <p><strong>Match:</strong> ${s.match_percent}%</p>
            <p><strong>Missing:</strong> ${s.missing_ingredients.join(", ") || "None"}</p>
          </div>
        `).join("");
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        recipesList.innerHTML = "<p>Error loading suggestions. Check console for details.</p>";
      }
    });
  }

  // -------------------- Initial load --------------------
  loadAllRecipes();
});
