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

    const res = await loginResponse.json();

    // Save tokens in httpOnly cookies
    document.cookie = `rzauthToken=${res.authToken}; path=/;`;
    document.cookie = `rzrefreshToken=${res.refreshToken}; path=/;`;

    // Redirect to dashboard
    if (loginResponse.ok) {
      location.href = "/";
    }
  } catch (error) {
    console.log(error);
    location.reload();
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
