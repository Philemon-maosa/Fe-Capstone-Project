document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access");
  if (!token) {
    alert("You must log in!");
    window.location.href = "login.html";
    return;
  }

  const itemList = document.getElementById("itemList");
  const form = document.getElementById("addItemForm");
  const nameInput = document.getElementById("itemInput");
  const quantityInput = document.getElementById("itemQuantity");
  const unitInput = document.getElementById("itemUnit");
  const suggestBtn = document.getElementById("suggest-btn");
  const suggestionsContainer = document.getElementById("suggestions-container");

  // 🔹 Fetch pantry items from backend
  async function loadPantryItems() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/pantry/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load pantry items");
      const items = await res.json();
      renderItems(items);
    } catch (err) {
      console.error(err);
      itemList.innerHTML = "<li>Error loading pantry items.</li>";
    }
  }

  // 🔹 Render pantry items
  function renderItems(items) {
    itemList.innerHTML = "";
    if (!items || items.length === 0) {
      itemList.innerHTML = "<li>No ingredients added yet.</li>";
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name} (${item.quantity || ""} ${item.unit || ""})</span>
        <button data-id="${item.id}" class="delete-btn">Delete</button>
      `;
      itemList.appendChild(li);
    });

    // Delete functionality
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/pantry/${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to delete item");
          loadPantryItems();
        } catch (err) {
          console.error(err);
          alert("Could not delete item.");
        }
      });
    });
  }

  // 🔹 Add new pantry item
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const quantity = quantityInput.value.trim();
    const unit = unitInput.value.trim();
    if (!name) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/pantry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, quantity, unit }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      nameInput.value = "";
      quantityInput.value = "";
      unitInput.value = "";
      loadPantryItems();
    } catch (err) {
      console.error(err);
      alert("Could not add item.");
    }
  });

  // 🔹 Suggest recipes
  if (suggestBtn) {
    suggestBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/pantry/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load pantry items");

        const pantryItems = await res.json();
        const ingredients = pantryItems.map((i) => i.name);
        if (ingredients.length === 0) {
          alert("No ingredients found. Add some first!");
          return;
        }

        const suggestRes = await fetch("http://127.0.0.1:8000/api/recipes/suggest/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ingredients }),
        });

        if (!suggestRes.ok) throw new Error("Failed to fetch suggestions");

        const suggestions = await suggestRes.json();
        renderSuggestions(suggestions);
      } catch (err) {
        console.error(err);
        alert("Error fetching suggested recipes.");
      }
    });
  }

  // 🔹 Render suggested recipes
  function renderSuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";
    if (!suggestions || suggestions.length === 0) {
      suggestionsContainer.innerHTML = "<p>No matching recipes found.</p>";
      return;
    }

    suggestions.forEach((s) => {
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

  // 🔹 Initial load
  loadPantryItems();
});
