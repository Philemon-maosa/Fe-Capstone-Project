document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
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
        alert("Invalid username or password.");
        return;
      }

      const data = await response.json();

      // ✅ Store tokens in localStorage
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", username);

      alert("✅ Login successful!");
      window.location.href = "homepage.html"; // redirect to homepage
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please check your connection or server.");
    }
  });
});
