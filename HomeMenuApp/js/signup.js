// js/signup.js

document.querySelector("#signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const fullname = document.querySelector("#fullname").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  const confirmPassword = document.querySelector("#confirm-password").value.trim();

  // Validation
  if (!fullname || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    // 1️⃣ Signup request
    const signupResponse = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password,
        email,
        full_name: fullname,
      }),
    });

    if (!signupResponse.ok) {
      const errorData = await signupResponse.json();
      console.error("Signup error:", errorData);
      alert(errorData.detail || "Signup failed! Check console for details.");
      return;
    }

    // 2️⃣ Automatic login using your backend login endpoint
    const loginResponse = await fetch("http://127.0.0.1:8000/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    if (!loginResponse.ok) {
      alert("Signup succeeded, but automatic login failed. Please login manually.");
      window.location.href = "login.html";
      return;
    }

    const loginData = await loginResponse.json();

    // Ensure tokens are returned
    if (!loginData.access || !loginData.refresh) {
      alert("Login succeeded but no tokens received. Check backend response.");
      console.log("Backend response:", loginData);
      return;
    }

    // 3️⃣ Store tokens in localStorage
    localStorage.setItem("access_token", loginData.access);
    localStorage.setItem("refresh_token", loginData.refresh);
    localStorage.setItem("username", fullname);

    console.log("Signup and login successful. Tokens stored.");

    // Redirect to homepage
    window.location.href = "homepage.html";

  } catch (err) {
    console.error("Network error:", err);
    alert("Network error. Please check your connection or server.");
  }
});
