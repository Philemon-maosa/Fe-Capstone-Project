document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access");
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!token) {
    alert("You must be logged in!");
    window.location.href = "login.html";
    return;
  }

  if (!recipeId) {
    alert("No recipe selected!");
    window.location.href = "recipes.html";
    return;
  }

  const titleEl = document.getElementById("recipe-title");
  const descEl = document.getElementById("recipe-description");
  const instructionsEl = document.getElementById("recipe-instructions");
  const ingredientsList = document.getElementById("ingredients-list");

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/recipes/${recipeId}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch recipe details. Status: ${response.status}`);

    const recipe = await response.json();

    // Populate recipe details
    titleEl.textContent = recipe.title || "No title";
    descEl.textContent = recipe.description || "No description available.";
    instructionsEl.textContent = recipe.instructions || "No instructions provided.";

    // Populate ingredients
    ingredientsList.innerHTML = "";
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      recipe.ingredients.forEach((ing) => {
        const li = document.createElement("li");
        li.textContent = `${ing.name}${ing.quantity ? ` - ${ing.quantity}` : ""}${ing.unit ? ` ${ing.unit}` : ""}`;
        ingredientsList.appendChild(li);
      });
    } else {
      ingredientsList.innerHTML = "<li>No ingredients listed.</li>";
    }

  } catch (error) {
    console.error("Error fetching recipe:", error);
    titleEl.textContent = "Error loading recipe";
    descEl.textContent = "";
    instructionsEl.textContent = "";
    ingredientsList.innerHTML = "<li>Could not load ingredients.</li>";
  }

  // Back button
  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "recipes.html";
  });
});
