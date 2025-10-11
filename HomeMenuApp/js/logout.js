document.querySelector("#logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  alert("Logged out successfully!");
  window.location.href = "login.html";
});
