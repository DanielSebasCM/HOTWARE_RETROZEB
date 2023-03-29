async function handleLogin(response) {
  const token = response.credential;
  const responsePayload = decodeJwtResponse(token);

  try {
    const loginResponse = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    // Save tokens in local storage

    // Redirect to dashboard
    if (loginResponse.ok) {
      const res = await loginResponse.json();

      const r = await fetch("http://localhost:3000/", {
        method: "GET",
        // TOKEN IN HERE
      });

      window.location.href = "http://localhost:3000/";
    }
  } catch (error) {
    console.log(error);
  }
}

function decodeJwtResponse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
