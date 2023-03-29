// JWTs
// https://jwt.io/
// Google Project Setup
// https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
// Extract information from JWT on the browser
function decodeJwtResponse(token) {
  // This does not validate the JWT, this only parses it
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

///////////////
// Browser
///////////////
// Code Generator (Button)
// https://developers.google.com/identity/gsi/web/tools/configurator
// handleLogin function
// https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
async function handleLogin(response) {
  const jwt = response.credential;

  // We can also decode the JWT here to get the user's name and email
  const responsePayload = decodeJwtResponse(jwt);

  try {
    const loginResponse = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: jwt,
        id_google_auth: responsePayload.sub,
        email: responsePayload.email,
        first_name: responsePayload.given_name,
        last_name: responsePayload.family_name,
        picture: responsePayload.picture,
      }),
    });
    const res = await loginResponse.json();
    console.log(res);

    // Save tokens in local storage

    // Redirect to dashboard
  } catch (error) {
    console.log(error);
    location.reload();
  }
}

// @zeb.mx
// @luuna.mx
// @nooz.mx
// @mappa.mx
///////////////
// Server
///////////////
// Validating tokens on the server
// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
// Decoding tokens on server
// npm i jwt-decode
// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(CLIENT_ID);
// app.post("/handle-login", async (req, res) => {
//   const ticket = await client.verifyIdToken({
//     idToken: req.body.token,
//     audience: CLIENT_ID,
//   });
//   const payload = ticket.getPayload();
//   console.log({ payload });
//   res.send({ payload });
// });

// Passport.js usage
// https://www.loginradius.com/blog/engineering/google-authentication-with-nodejs-and-passportjs/
