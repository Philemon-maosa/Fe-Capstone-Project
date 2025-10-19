// js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get username (email) and password
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      // 🔹 Login request to your live backend
      const response = await fetch("https://maosa.pythonanywhere.com/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login error:", errorData);
        alert(errorData.detail || "Invalid username or password.");
        return;
      }

      const data = await response.json();
      console.log("Backend login response:", data);

      // Check for tokens
      if (!data.access || !data.refresh) {
        alert("Login succeeded but no tokens received. Check backend response.");
        console.log("Backend response:", data);
        return;
      }

      // 🔹 Save tokens and username
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", data.username || username);

      console.log(" Login successful. Tokens stored.");

      // 🔹 Redirect to homepage
      window.location.href = "homepage.html";

    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please check your connection or server.");
    }
  });
});
