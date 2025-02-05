function showAlert(type: "success" | "error", message: string) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', type === 'success' ? 'alert-success' : 'alert-error');
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
  }
  