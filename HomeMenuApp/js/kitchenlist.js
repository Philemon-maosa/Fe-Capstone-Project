document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addItemForm");
  const itemInput = document.getElementById("itemInput");
  const itemList = document.getElementById("itemList");

  // Load items from localStorage
  let items = JSON.parse(localStorage.getItem("kitchenItems")) || [];

  const renderItems = () => {
    itemList.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item}</span>
        <button data-index="${index}">Delete</button>
      `;
      itemList.appendChild(li);
    });
  };

  renderItems();

  // Add item
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newItem = itemInput.value.trim();
    if (!newItem) return;

    items.push(newItem);
    localStorage.setItem("kitchenItems", JSON.stringify(items));
    renderItems();
    itemInput.value = "";
  });

  // Delete item
  itemList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = e.target.getAttribute("data-index");
      items.splice(index, 1);
      localStorage.setItem("kitchenItems", JSON.stringify(items));
      renderItems();
    }
  });
});
