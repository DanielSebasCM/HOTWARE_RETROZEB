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