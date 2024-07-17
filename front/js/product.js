document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');

    fetch(`http://localhost:3000/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const imgContainer = document.querySelector('.item__img');
            const productImg = document.createElement('img');
            productImg.src = product.imageUrl;
            productImg.alt = product.altTxt;
            imgContainer.appendChild(productImg);

            document.getElementById('title').textContent = product.name;
            document.getElementById('price').textContent = product.price;
            document.getElementById('description').textContent = product.description;

            const colorsSelect = document.getElementById('colors');
            product.colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                colorsSelect.appendChild(option);
            });

            const addToCartButton = document.getElementById('addToCart');
            addToCartButton.addEventListener('click', () => {
                const selectedColor = colorsSelect.value;
                const quantity = parseInt(document.getElementById('quantity').value, 10);

                if (!selectedColor || quantity <= 0 || quantity > 100) {
                    alert('Please select a valid color and quantity.');
                    return;
                }

                const cartItem = {
                    id: productId,
                    color: selectedColor,
                    quantity: quantity
                };

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === cartItem.id && item.color === cartItem.color);

                if (existingItem) {
                    existingItem.quantity += cartItem.quantity;
                } else {
                    cart.push(cartItem);
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Product added to cart');
            });
        })
        .catch(error => console.error('Error fetching product data:', error));
});
