document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ingredient-form");
    const list = document.getElementById("ingredients-list");
    const token = localStorage.getItem("access");
    const API_URL = "http://127.0.0.1:8000/api/pantry/";

    if (!token) {
        alert("Please log in first!");
        window.location.href = "login.html";
        return;
    }

    // ✅ Fetch and display ingredients
    async function loadIngredients() {
        list.innerHTML = ""; // clear list first
        try {
            const response = await fetch(API_URL, {
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch ingredients");

            const ingredients = await response.json();
            ingredients.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `
                    ${item.name} 
                    <button class="delete-btn" data-id="${item.id}">❌</button>
                `;
                list.appendChild(li);
            });
        } catch (error) {
            console.error("Error loading ingredients:", error);
        }
    }

    // ✅ Add new ingredient
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("ingredient-name").value.trim();

        if (!name) return alert("Please enter an ingredient name.");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) throw new Error("Failed to add ingredient");

            form.reset();
            await loadIngredients(); // refresh list
        } catch (error) {
            console.error("Error adding ingredient:", error);
        }
    });

    // ✅ Delete ingredient
    list.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = e.target.getAttribute("data-id");
            if (!confirm("Are you sure you want to delete this ingredient?")) return;

            try {
                const response = await fetch(`${API_URL}${id}/`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` },
                });

                if (response.ok) {
                    e.target.parentElement.remove(); // remove from list instantly
                } else {
                    throw new Error("Failed to delete ingredient");
                }
            } catch (error) {
                console.error("Error deleting ingredient:", error);
            }
        }
    });

    // Initial load
    loadIngredients();
});
