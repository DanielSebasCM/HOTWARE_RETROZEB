async function handleLogin(response) {
  const token = response.credential;

  try {
    const loginResponse = await fetch(routes.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

   
    const res = await loginResponse.json();
    
    if(!loginResponse.ok) {
      return setNotification(res.message);
    }

    // Save tokens in httpOnly cookies
    document.cookie = `rzauthToken=${res.authToken}; path=/;`;
    document.cookie = `rzrefreshToken=${res.refreshToken}; path=/;`;

    // Redirect to dashboard
    // if (loginResponse.ok) {
    //   location.href = "/";
    // }
  } catch (error) {
    console.log("error");
    console.log(error);
    // location.reload();
  }
}
