document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access");

  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  const recipesList = document.getElementById("recipes-list");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/recipes/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const recipes = await response.json();

      if (recipes.length === 0) {
        recipesList.innerHTML = "<p>No recipes available yet.</p>";
        return;
      }

      recipesList.innerHTML = recipes
        .map(
          (recipe) => `
          <div class="recipe-card">
            <h3>${recipe.title}</h3>
            <p>${recipe.description || "No description available."}</p>
            <button class="view-btn" data-id="${recipe.id}">View Recipe</button>
          </div>
        `
        )
        .join("");

      // Add event listeners for "View Recipe" buttons
      document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const recipeId = e.target.dataset.id;
          window.location.href = `recipe-detail.html?id=${recipeId}`;
        });
      });
    } else {
      recipesList.innerHTML = "<p>Failed to load recipes.</p>";
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipesList.innerHTML = "<p>Error loading recipes.</p>";
  }
});
