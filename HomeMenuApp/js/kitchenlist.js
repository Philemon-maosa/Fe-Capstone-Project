// js/kitchenlist.js
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token");
  const itemList = document.getElementById("itemList");
  const addItemForm = document.getElementById("addItemForm");
  const itemInput = document.getElementById("itemInput");
  const itemQuantity = document.getElementById("itemQuantity");
  const itemUnit = document.getElementById("itemUnit");
  const suggestBtn = document.getElementById("suggest-btn");
  const suggestionsContainer = document.getElementById("suggestions-container");

  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  // -------------------- Backend URL --------------------
  const BACKEND_URL = "https://maosa.pythonanywhere.com/api";

  // -------------------- Load pantry items --------------------
  async function loadPantryItems() {
    try {
      const response = await axios.get(`${BACKEND_URL}/pantry/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      renderPantryItems(response.data);
    } catch (err) {
      console.error("Error loading pantry items:", err);
      itemList.innerHTML = "<li>Error loading pantry items. Check console.</li>";
    }
  }

  // -------------------- Render pantry items --------------------
  function renderPantryItems(items) {
    if (!items || items.length === 0) {
      itemList.innerHTML = "<li>No ingredients added yet.</li>";
      return;
    }

    itemList.innerHTML = items.map(item => `
      <li data-id="${item.id}">
        ${item.name} ${item.quantity || ""} ${item.unit || ""}
        <button class="delete-btn">Delete</button>
      </li>
    `).join("");

    // Add delete button listeners
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async e => {
        const li = e.target.closest("li");
        const itemId = li.dataset.id;
        try {
          await axios.delete(`${BACKEND_URL}/pantry/${itemId}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          loadPantryItems(); // Refresh list
        } catch (err) {
          console.error("Error deleting item:", err);
          alert("Failed to delete item.");
        }
      });
    });
  }

  // -------------------- Add new pantry item --------------------
  addItemForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = itemInput.value.trim();
    const quantity = itemQuantity.value.trim();
    const unit = itemUnit.value.trim();

    if (!name) return alert("Please enter an ingredient name.");

    try {
      await axios.post(`${BACKEND_URL}/pantry/`, 
        { name, quantity, unit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      itemInput.value = "";
      itemQuantity.value = "";
      itemUnit.value = "";
      loadPantryItems(); // Refresh list
    } catch (err) {
      console.error("Error adding item:", err);
      if (err.response) {
        alert(`Error: ${err.response.status} ${err.response.statusText}`);
      } else {
        alert("Network error. Could not add ingredient. Check console.");
      }
    }
  });

  // -------------------- Suggest recipes --------------------
  suggestBtn.addEventListener("click", async () => {
    try {
      // 1️⃣ Get all pantry items first
      const pantryRes = await axios.get(`${BACKEND_URL}/pantry/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ingredients = pantryRes.data.map(i => i.name);

      if (ingredients.length === 0) {
        alert("No ingredients found. Add some first!");
        return;
      }

      // 2️⃣ Request suggested recipes from backend
      const suggestRes = await axios.post(
        `${BACKEND_URL}/recipes/suggest/`, // ✅ Ensure trailing slash
        { ingredients },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ Render the results
      renderSuggestions(suggestRes.data);
    } catch (err) {
      console.error("Error fetching suggested recipes:", err);

      if (err.response) {
        alert(`Error: ${err.response.status} ${err.response.statusText}`);
      } else {
        alert("Network error while fetching recipes. Check console.");
      }
    }
  });

  // -------------------- Render suggested recipes --------------------
  function renderSuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";
    if (!suggestions || suggestions.length === 0) {
      suggestionsContainer.innerHTML = "<p>No matching recipes found.</p>";
      return;
    }

    suggestions.forEach(s => {
      const div = document.createElement("div");
      div.classList.add("recipe-card");
      div.innerHTML = `
        <h3>${s.recipe}</h3>
        <p><strong>Match:</strong> ${s.match_percent}%</p>
        <p><strong>Missing:</strong> ${s.missing_ingredients.join(", ") || "None"}</p>
      `;
      suggestionsContainer.appendChild(div);
    });
  }

  // -------------------- Initial load --------------------
  loadPantryItems();
});
