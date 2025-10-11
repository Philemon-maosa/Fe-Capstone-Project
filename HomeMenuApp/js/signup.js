document.querySelector("#signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const email = document.querySelector("#email").value;

  const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (response.ok) {
    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
  } else {
    alert("Error: Could not register user.");
  }
});
