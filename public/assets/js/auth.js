(function updateTokens() {
  const fourMinutes = 1000 * 60 * 4;
  refreshTokens();

  const interval = setInterval(() => {
    refreshTokens();
  }, fourMinutes);

  return () => clearInterval(interval);
})();

async function refreshTokens() {
  const { refreshToken } = getTokens();
  if (!refreshToken) return;

  try {
    const res = await fetch("/token/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const data = await res.json();

    deleteTokens();
    setTokens(data);
  } catch (err) {
    deleteTokens();
    console.log(err);
  }
}

// UTILS
function setTokens(tokens) {
  const { authToken, refreshToken } = tokens;

  if (authToken) {
    document.cookie = `rzauthToken=${authToken}; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30
    )}; path=/;`;
  }

  if (refreshToken) {
    document.cookie = `rzrefreshToken=${refreshToken}; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30
    )}; path=/;`;
  }
}

function getTokens() {
  const cookies = document.cookie.split(";");
  const tokens = {};
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    tokens[key.trim()] = value;
  });
  return { authToken: tokens.rzauthToken, refreshToken: tokens.rzrefreshToken };
}

function deleteTokens() {
  // Delete cookies
  document.cookie =
    "rzauthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "rzrefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
