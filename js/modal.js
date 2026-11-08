//? Function Open List
export function OpenList(...elements) {
  elements.forEach((element) => {
    element.classList.add("show");
  });
}
//? function close List

export function CloseList(...elements) {
  elements.forEach((element) => {
    element.classList.remove("show");
  });
}

//? Icon shown inside the alert for every action type
const alertIcons = {
  success: "fa-solid fa-check",
  error: "fa-solid fa-xmark",
  warning: "fa-solid fa-triangle-exclamation",
  danger: "fa-regular fa-trash-can",
  info: "fa-solid fa-circle-info",
};

//? Reusable themed alert; resolves true on confirm and false when dismissed
export function showAlert({
  type = "info",
  title = "Notice",
  message = "",
  confirmLabel = "OK",
  cancelLabel = "",
} = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");

    overlay.className = "delete-overlay";

    overlay.innerHTML = `
      <div class="delete-modal alert-${type}" role="alertdialog" aria-modal="true">
        <div class="delete-icon">
          <i class="${alertIcons[type] || alertIcons.info}"></i>
        </div>

        <h2></h2>

        <p></p>

        <div class="delete-actions">
          ${
            cancelLabel
              ? `<button type="button" class="cancel-delete">${cancelLabel}</button>`
              : ""
          }
          <button type="button" class="confirm-delete">${confirmLabel}</button>
        </div>
      </div>
    `;

    //? textContent keeps alert text safe from user HTML
    overlay.querySelector("h2").textContent = title;
    overlay.querySelector("p").textContent = message;

    document.body.appendChild(overlay);

    const close = (result) => {
      overlay.classList.remove("show");

      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 200);
    };

    overlay
      .querySelector(".cancel-delete")
      ?.addEventListener("click", () => close(false));

    overlay
      .querySelector(".confirm-delete")
      .addEventListener("click", () => close(true));

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        close(false);
      }
    });

    document.addEventListener("keydown", function handleEscape(event) {
      if (event.key === "Escape" && overlay.isConnected) {
        document.removeEventListener("keydown", handleEscape);
        close(false);
      }
    });

    requestAnimationFrame(() => {
      overlay.classList.add("show");
    });
  });
}

//? Confirmation alert whose message names the exact item being deleted
export function confirmDelete({
  title = "Delete this item?",
  message,
  itemName = "",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
} = {}) {
  const finalMessage =
    message ||
    (itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : "Are you sure you want to delete this item? This action cannot be undone.");

  return showAlert({
    type: "danger",
    title,
    message: finalMessage,
    confirmLabel,
    cancelLabel,
  });
}
