// main.js
const accessToken = localStorage.getItem("access");

// redirect if not logged in
if (!accessToken) {
  alert("Please log in first!");
  window.location.href = "login.html";
}

// Fetch recipes
async function loadRecipes() {
  const response = await fetch("http://127.0.0.1:8000/api/recipes/", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";

  if (response.ok) {
    const recipes = await response.json();

    if (recipes.length === 0) {
      recipeList.innerHTML = "<li>No recipes found yet. Add some ingredients!</li>";
      return;
    }

    recipes.forEach(recipe => {
      const li = document.createElement("li");
      li.textContent = recipe.title;
      recipeList.appendChild(li);
    });
  } else {
    recipeList.innerHTML = "<li>Error loading recipes. Please try again.</li>";
  }
}

loadRecipes();
