document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart__items');
    const totalQuantityElement = document.getElementById('totalQuantity');
    const totalPriceElement = document.getElementById('totalPrice');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(cartItem => {
            fetch(`http://localhost:3000/api/products/${cartItem.id}`)
                .then(response => response.json())
                .then(product => {
                    const cartItemElement = document.createElement('article');
                    cartItemElement.className = 'cart__item';
                    cartItemElement.dataset.id = cartItem.id;
                    cartItemElement.dataset.color = cartItem.color;

                    cartItemElement.innerHTML = `
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${cartItem.color}</p>
                                <p>€${product.price}</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Quantity : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Delete</p>
                                </div>
                            </div>
                        </div>
                    `;

                    cartItemsContainer.appendChild(cartItemElement);

                    totalQuantity += cartItem.quantity;
                    totalPrice += product.price * cartItem.quantity;

                    totalQuantityElement.textContent = totalQuantity;
                    totalPriceElement.textContent = totalPrice;

                    cartItemElement.querySelector('.deleteItem').addEventListener('click', () => {
                        cart = cart.filter(item => !(item.id === cartItem.id && item.color === cartItem.color));
                        localStorage.setItem('cart', JSON.stringify(cart));
                        location.reload();
                    });

                    cartItemElement.querySelector('.itemQuantity').addEventListener('change', (event) => {
                        const newQuantity = parseInt(event.target.value, 10);
                        if (newQuantity > 0 && newQuantity <= 100) {
                            const itemToUpdate = cart.find(item => item.id === cartItem.id && item.color === cartItem.color);
                            itemToUpdate.quantity = newQuantity;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            location.reload();
                        } else {
                            alert('Please select a valid quantity (1-100)');
                            event.target.value = cartItem.quantity;
                        }
                    });
                })
                .catch(error => console.error('Error fetching product data:', error));
        });
    }
});
