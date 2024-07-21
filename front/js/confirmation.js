document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    document.getElementById('orderId').textContent = orderId;

    if (!orderId) {
        alert("Order ID is missing. Please check your order details.");
    }
});