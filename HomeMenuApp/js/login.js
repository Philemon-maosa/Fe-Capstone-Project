// js/login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ Get username and password
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      // 🔹 Call your custom login endpoint
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error:", errorData);
        alert(errorData.detail || "Invalid username or password.");
        return;
      }

      // 🔹 Parse returned tokens
      const data = await response.json();

      // Check that your backend actually returns access and refresh tokens
      if (!data.access || !data.refresh) {
        alert("Login succeeded but no tokens received. Check backend response.");
        console.log("Backend response:", data);
        return;
      }

      // 🔹 Store tokens in localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", username);

      console.log("Login successful. Tokens stored.");

      // 🔹 Redirect to homepage
      window.location.href = "homepage.html";

    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Make sure your backend is running on http://127.0.0.1:8000");
    }
  });
});
