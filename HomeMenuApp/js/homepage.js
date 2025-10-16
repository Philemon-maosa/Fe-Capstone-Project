document.addEventListener("DOMContentLoaded", () => {
  const dashboardSection = document.getElementById("dashboard-section");
  const ingredientsSection = document.getElementById("ingredients-section");
  const viewIngredientsBtn = document.getElementById("view-ingredients");
  const backBtn = document.getElementById("back-to-dashboard");
  const pantryContainer = document.getElementById("pantry-container");
  const addIngredientBtn = document.getElementById("add-ingredient-btn");
  const recipeContainer = document.getElementById("recipes-container"); // if dynamic recipes
  const viewRecipesBtn = document.getElementById("view-recipes");

  const API_BASE_URL = "http://127.0.0.1:8000";
  let accessToken = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  if (!accessToken || !username) {
    alert("You are not logged in. Please login first.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("welcome-text").textContent = `Welcome, ${username}!`;

  function logoutUser() {
    localStorage.clear();
    alert("Session expired. Please login again.");
    window.location.href = "login.html";
  }

  // Fetch pantry
  async function fetchPantry() {
    pantryContainer.innerHTML = "";
    try {
      const response = await fetch(`${API_BASE_URL}/api/pantry/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + accessToken,
        },
      });

      if (response.status === 401) return logoutUser();
      if (!response.ok) {
        alert("Failed to fetch pantry items.");
        return;
      }

      const data = await response.json();
      if (data.length === 0) {
        pantryContainer.innerHTML = "<li>No ingredients yet!</li>";
        return;
      }

      data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} — ${item.quantity}`;
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.style.marginLeft = "10px";
        delBtn.addEventListener("click", () => deleteIngredient(item.id));
        li.appendChild(delBtn);
        pantryContainer.appendChild(li);
      });

    } catch (err) {
      console.error("Error fetching pantry:", err);
      alert("Network error while fetching pantry.");
    }
  }

  // Add ingredient
  if (addIngredientBtn) {
    addIngredientBtn.addEventListener("click", async () => {
      const nameInput = document.getElementById("ingredient-name");
      const quantityInput = document.getElementById("ingredient-quantity");
      const name = nameInput.value.trim();
      const quantity = quantityInput.value;

      if (!name || !quantity) {
        alert("Please enter ingredient name and quantity.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/pantry/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
          },
          body: JSON.stringify({ name, quantity }),
        });

        if (!response.ok) {
          const errData = await response.json();
          console.error("Add ingredient error:", errData);
          alert(errData.detail || "Failed to add ingredient.");
          return;
        }

        nameInput.value = "";
        quantityInput.value = "";
        fetchPantry();
      } catch (err) {
        console.error("Network error:", err);
        alert("Network error. Could not add ingredient.");
      }
    });
  }

  // Delete ingredient
  async function deleteIngredient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pantry/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + accessToken,
        },
      });

      if (response.status === 401) return logoutUser();
      if (!response.ok) {
        alert("Failed to delete ingredient.");
        return;
      }

      fetchPantry();
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Could not delete ingredient.");
    }
  }

  // Show pantry section
  viewIngredientsBtn.addEventListener("click", async () => {
    dashboardSection.style.display = "none";
    ingredientsSection.style.display = "block";
    await fetchPantry();
  });

  // Back to dashboard
  backBtn.addEventListener("click", () => {
    ingredientsSection.style.display = "none";
    dashboardSection.style.display = "block";
  });

  // Fetch recipes dynamically (optional)
  if (viewRecipesBtn) {
    viewRecipesBtn.addEventListener("click", async () => {
      dashboardSection.style.display = "none";
      if (recipeContainer) recipeContainer.innerHTML = "<p>Loading recipes...</p>";
      try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
          },
        });

        if (response.status === 401) return logoutUser();
        if (!response.ok) {
          alert("Failed to fetch recipes.");
          return;
        }

        const data = await response.json();
        if (!recipeContainer) {
          window.location.href = "recipes.html";
          return;
        }

        recipeContainer.innerHTML = "";
        data.forEach(recipe => {
          const div = document.createElement("div");
          div.textContent = recipe.name;
          recipeContainer.appendChild(div);
        });

      } catch (err) {
        console.error("Error fetching recipes:", err);
        alert("Network error while fetching recipes.");
      }
    });
  }
});
