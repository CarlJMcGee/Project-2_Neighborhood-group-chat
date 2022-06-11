async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document
    .querySelector("#exampleInputPassword1")
    .value.trim();

  if (email && password) {
    const response = await fetch("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      alert(response.statusText);
    }
  }
}

async function signUpFormHandler(event) {
  event.preventDefault();

  const fullName = document
    .querySelector("#username_signup")
    .value.trim()
    .split(" ");
  const firstName = fullName[0];
  const lastName = fullName[1];
  const email = document.querySelector("#log-in").value.trim();
  const password = document
    .querySelector("#exampleInputPassword1")
    .value.trim();

  if (username && email && password) {
    const response = await fetch("/api/user", {
      method: "post",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      alert(response.statusText);
    }
  }
}
document
  .querySelector(".login-form")
  .addEventListener("submit", loginFormHandler);

document
  .querySelector(".signup-form")
  .addEventListener("submit", signUpFormHandler);
