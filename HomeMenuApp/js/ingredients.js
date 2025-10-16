document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access");
  const form = document.getElementById("ingredient-form");
  const input = document.getElementById("ingredient-name");
  const list = document.getElementById("ingredients-list");

  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  // 🔹 Load ingredients from backend
  async function loadIngredients() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/recipes/ingredients/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        list.innerHTML = `<li>Failed to load ingredients (Status: ${response.status})</li>`;
        return;
      }

      const ingredients = await response.json();
      list.innerHTML = "";

      if (ingredients.length === 0) {
        list.innerHTML = "<li>No ingredients added yet.</li>";
        return;
      }

      ingredients.forEach(addIngredientToDOM);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
      list.innerHTML = "<li>Error loading ingredients.</li>";
    }
  }

  // 🔹 Add ingredient to backend
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (name === "") return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/recipes/ingredients/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        alert("Failed to add ingredient!");
        return;
      }

      const newIngredient = await response.json();
      addIngredientToDOM(newIngredient);
      input.value = "";
    } catch (err) {
      console.error("Error adding ingredient:", err);
    }
  });

  // 🔹 Add ingredient item to DOM
  function addIngredientToDOM(ingredient) {
    const li = document.createElement("li");
    li.textContent = ingredient.name;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete-btn");

    delBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/recipes/ingredients/${ingredient.id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) li.remove();
        else alert("Failed to delete ingredient.");
      } catch (err) {
        console.error("Error deleting ingredient:", err);
      }
    });

    li.appendChild(delBtn);
    list.appendChild(li);
  }

  // Load ingredients initially
  loadIngredients();
});
