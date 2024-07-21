document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart__items');
    const totalQuantityElement = document.getElementById('totalQuantity');
    const totalPriceElement = document.getElementById('totalPrice');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty.';
        cartItemsContainer.appendChild(emptyMessage);
    } else {
        let totalQuantity = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            fetchProduct(item.id).then(product => {
                const itemPrice = product.price * item.quantity;
                totalQuantity += item.quantity;
                totalPrice += itemPrice;

                const cartItem = createCartItemElement(product, item);
                cartItemsContainer.appendChild(cartItem);

                totalQuantityElement.textContent = totalQuantity;
                totalPriceElement.textContent = totalPrice.toFixed(2);
            });
        });
    }
    document.querySelector('.cart__order__form').addEventListener('submit', handleFormSubmit);
});

function fetchProduct(id) {
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(response => response.json());
}

function createCartItemElement(product, item) {
    const article = document.createElement('article');
    article.classList.add('cart__item');
    article.dataset.id = item.id;
    article.dataset.color = item.color;

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('cart__item__img');
    const img = document.createElement('img');
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);
    imgDiv.appendChild(img);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('cart__item__content');

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cart__item__content__description');
    const h2 = document.createElement('h2');
    h2.textContent = product.name;
    const pColor = document.createElement('p');
    pColor.textContent = item.color;
    const pPrice = document.createElement('p');
    pPrice.textContent = `€${product.price}`;
    descriptionDiv.appendChild(h2);
    descriptionDiv.appendChild(pColor);
    descriptionDiv.appendChild(pPrice);

    const settingsDiv = document.createElement('div');
    settingsDiv.classList.add('cart__item__content__settings');

    const quantityDiv = document.createElement('div');
    quantityDiv.classList.add('cart__item__content__settings__quantity');
    const pQuantity = document.createElement('p');
    pQuantity.textContent = 'Quantity: ';
    const inputQuantity = document.createElement('input');
    inputQuantity.type = 'number';
    inputQuantity.classList.add('itemQuantity');
    inputQuantity.name = 'itemQuantity';
    inputQuantity.min = '1';
    inputQuantity.max = '100';
    inputQuantity.value = item.quantity;
    inputQuantity.addEventListener('change', (event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (newQuantity <= 0 || newQuantity > 100) {
            alert('Please enter a valid quantity between 1 and 100.');
            return;
        }
        updateCartItem(item.id, item.color, newQuantity);
    });
    quantityDiv.appendChild(pQuantity);
    quantityDiv.appendChild(inputQuantity);

    const deleteDiv = document.createElement('div');
    deleteDiv.classList.add('cart__item__content__settings__delete');
    const pDelete = document.createElement('p');
    pDelete.classList.add('deleteItem');
    pDelete.textContent = 'Delete';
    pDelete.addEventListener('click', () => {
        removeCartItem(item.id, item.color);
    });
    deleteDiv.appendChild(pDelete);

    settingsDiv.appendChild(quantityDiv);
    settingsDiv.appendChild(deleteDiv);

    contentDiv.appendChild(descriptionDiv);
    contentDiv.appendChild(settingsDiv);

    article.appendChild(imgDiv);
    article.appendChild(contentDiv);

    return article;
}

function updateCartItem(productId, productColor, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cart.find(item => item.id === productId && item.color === productColor);

    if (cartItem) {
        cartItem.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload(); // Reload to reflect the updated cart
    }
}

function removeCartItem(productId, productColor) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.id === productId && item.color === productColor));
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); // Reload to reflect the updated cart
}

function handleFormSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const email = document.getElementById('email').value.trim();

    // Clear previous error messages
    clearError('firstNameErrorMsg');
    clearError('emailErrorMsg');

    // Validate first name
    if (firstName.toLowerCase() === 'test' || firstName.toLowerCase() === 'hello') {
        displayError('firstNameErrorMsg', 'First name cannot be "test" or "hello".');
        return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        displayError('emailErrorMsg', 'Please enter a valid email address.');
        return;
    }

    // Validate presence of all fields
    if (!firstName || !lastName || !address || !city || !email) {
        alert('All fields are required.');
        return;
    }

    // Create contact object
    const contact = {
        firstName,
        lastName,
        address,
        city,
        email
    };

    // Create products array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = cart.map(item => item.id);

    // Send POST request
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contact, products })
    })
        .then(response => response.json())
        .then(data => {
            if (data.orderId) {
                const orderId = data.orderId;
                localStorage.removeItem('cart'); // Clear the cart
                window.location.href = `confirmation.html?orderId=${orderId}`;
            } else {
                alert('There was an issue with your order. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function clearError(elementId) {
    document.getElementById(elementId).style.display = 'none';
    document.getElementById(elementId).textContent = '';
}

function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.style.display = 'block';
    errorElement.textContent = message;
}