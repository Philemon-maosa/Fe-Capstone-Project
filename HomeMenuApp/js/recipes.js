document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access");
  const recipesList = document.getElementById("recipes-list");

  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  // 🔹 Fetch all recipes initially
  async function loadAllRecipes() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/recipes/recipes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        recipesList.innerHTML = `<p>Failed to load recipes. Status: ${response.status}</p>`;
        return;
      }

      const recipes = await response.json();
      renderRecipes(recipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      recipesList.innerHTML = "<p>Error loading recipes.</p>";
    }
  }

  // 🔹 Render recipes into cards
  function renderRecipes(recipes) {
    if (!recipes || recipes.length === 0) {
      recipesList.innerHTML = "<p>No recipes available.</p>";
      return;
    }

    recipesList.innerHTML = recipes
      .map(
        (r) => `
        <div class="recipe-card">
          <h3>${r.title}</h3>
          <p>${r.description || "No description available."}</p>
          <button class="view-btn" data-id="${r.id}">View Recipe</button>
        </div>
      `
      )
      .join("");

    // Add event listeners for recipe detail
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const recipeId = e.target.dataset.id;
        window.location.href = `recipe-detail.html?id=${recipeId}`;
      });
    });
  }

  // 🔹 Handle suggested recipes
  const suggestBtn = document.getElementById("suggest-btn");
  if (suggestBtn) {
    suggestBtn.addEventListener("click", async () => {
      recipesList.innerHTML = "<p>Loading suggested recipes...</p>";

      // Load ingredients from localStorage
      const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
      if (ingredients.length === 0) {
        recipesList.innerHTML =
          "<p>No ingredients found. Please add some ingredients first!</p>";
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/recipes/recipes/suggest/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ingredients }),
          }
        );

        if (!response.ok) {
          recipesList.innerHTML = `<p>Failed to load suggestions. Status: ${response.status}</p>`;
          return;
        }

        const suggestions = await response.json();

        if (suggestions.length === 0) {
          recipesList.innerHTML = "<p>No matching recipes found.</p>";
          return;
        }

        recipesList.innerHTML = suggestions
          .map(
            (s) => `
            <div class="recipe-card">
              <h3>${s.recipe}</h3>
              <p><strong>Match:</strong> ${s.match_percent}%</p>
              <p><strong>Missing:</strong> ${s.missing_ingredients.join(", ") || "None"}</p>
            </div>
          `
          )
          .join("");
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        recipesList.innerHTML = "<p>Error loading suggestions.</p>";
      }
    });
  }

  // Load all recipes by default when the page opens
  loadAllRecipes();
});
