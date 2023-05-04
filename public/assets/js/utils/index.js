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

function setNotification(message, type = "error") {
  const notificationContainer = document.querySelector(".notification-container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.classList.add("notification--" + type);
  notification.innerHTML = `
    <div class="notification__content">
      <div class="notification__icon">
        <span class="icon"></span>
      </div>
      <p class="notification__message">
        ${message}
      </p>
    </div>
    <button class="notification__close icon" type="submit" value="exito"></button>
  `
  const closeBtn = notification.querySelector(".notification__close");
  closeBtn.addEventListener("click", () => {
    notificationContainer.removeChild(notification);
  });

  setTimeout(() => {
    notificationContainer.removeChild(notification);
  }, 5000);

  notificationContainer.appendChild(notification);
}
