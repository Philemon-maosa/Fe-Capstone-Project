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

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/recipes/${recipeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch recipe details.");

    const recipe = await response.json();

    document.getElementById("recipe-title").textContent = recipe.title;
    document.getElementById("recipe-description").textContent = recipe.description;
    document.getElementById("recipe-instructions").textContent = recipe.instructions;

    const ingredientsList = document.getElementById("ingredients-list");
    ingredientsList.innerHTML = "";

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      recipe.ingredients.forEach((ing) => {
        const li = document.createElement("li");
        li.textContent = `${ing.name} (${ing.quantity || ''} ${ing.unit || ''})`;
        ingredientsList.appendChild(li);
      });
    } else {
      ingredientsList.innerHTML = "<li>No ingredients listed.</li>";
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Error loading recipe details.");
  }

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "recipes.html";
  });
});
