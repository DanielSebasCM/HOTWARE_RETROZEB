(function sidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const togglerBtn = document.getElementById("sidebar-toggler");

  if (!sidebar || !togglerBtn) return;
  togglerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
    sidebar.classList.add("transition");
  });
})();

(function toggleButtonSelection() {
  const toggleButtonContainer = document.querySelectorAll(
    ".toggle-buttons-container"
  );

  toggleButtonContainer.forEach((container) => {
    const toggleButtons = container.querySelectorAll(".toggle-button");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        toggleButtons.forEach((button) => {
          button.classList.remove("toggle-button--active");
        });
        button.classList.add("toggle-button--active");
      });
    });
  });
})();

(function selectactiveTeams() {
  const teamOptions = document.getElementById("team-options");
  if (!teamOptions) return;
  const form = teamOptions.closest("form");

  teamOptions.addEventListener("change", () => {
    return form.submit();
  });
})();

(function closeNotification() {
  const closeBtn = document.querySelectorAll(".notification__close");
  closeBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.parentElement.classList.add("hide");
    });
  });
})();

(function hideNotificationAfterTime() {
  const notification = document.querySelectorAll(".notification");
  if (!notification) return;

  notification.forEach((notification) => {
    setTimeout(() => {
      notification.classList.add("hide");
    }, 5000);
  });
})();

(function logout() {
  if (location.pathname == "/login") return deleteTokens();

  const logoutForm = document.getElementById("logout-form");
  logoutForm.addEventListener("submit", (e) => {
    deleteTokens();
  });
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
    console.log(err);
  }
}

(function updateTokens() {
  const fourMinutes = 1000 * 60 * 4;

  const interval = setInterval(() => {
    refreshTokens();
  }, fourMinutes);

  return () => clearInterval(interval);
})();

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
