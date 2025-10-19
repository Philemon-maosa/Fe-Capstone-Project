// js/signup.js

document.querySelector("#signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const fullname = document.querySelector("#fullname").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  const confirmPassword = document.querySelector("#confirm-password").value.trim();

  // 🔹 Basic validation
  if (!fullname || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    // 🔹 STEP 1: Register the user
    const signupResponse = await fetch("https://maosa.pythonanywhere.com/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password,
        email,
        full_name: fullname,
      }),
    });

    const signupData = await signupResponse.json().catch(() => ({}));
    console.log("Signup response:", signupResponse.status, signupData);

    if (!signupResponse.ok) {
      alert(signupData.detail || "Signup failed. Please check your input.");
      return;
    }

    // 🔹 STEP 2: Automatically log the user in
    const loginResponse = await fetch("https://maosa.pythonanywhere.com/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const loginData = await loginResponse.json().catch(() => ({}));
    console.log("Login response:", loginResponse.status, loginData);

    if (!loginResponse.ok) {
      alert("Signup succeeded, but automatic login failed. Please login manually.");
      window.location.href = "login.html";
      return;
    }

    // 🔹 STEP 3: Save JWT tokens or ask user to log in manually
    if (!loginData.access || !loginData.refresh) {
      console.warn("No tokens in response:", loginData);
      localStorage.setItem("username", loginData.username || fullname);
      alert("Signup successful! Please log in manually to get tokens.");
      window.location.href = "login.html";
      return;
    }

    // ✅ Tokens received — store them
    localStorage.setItem("access_token", loginData.access);
    localStorage.setItem("refresh_token", loginData.refresh);
    localStorage.setItem("username", loginData.username || fullname);

    console.log("Signup and login successful. Tokens stored.");

    // 🔹 Redirect to homepage
    alert("Signup & login successful!");
    window.location.href = "homepage.html";

  } catch (err) {
    console.error("Network error:", err);
    alert("Network error. Please check your internet connection or backend server.");
  }
});
