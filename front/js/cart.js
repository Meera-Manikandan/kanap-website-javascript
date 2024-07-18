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
