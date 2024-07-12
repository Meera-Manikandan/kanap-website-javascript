document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items');

    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const productLink = document.createElement('a');
                productLink.setAttribute = ("href", `./product.html?id=${product._id}`);

                const productArticle = document.createElement('article');

                const productImg = document.createElement('img');
                productImg.src = product.imageUrl;
                productImg.alt = product.altTxt;

                const productName = document.createElement('h3');
                productName.className = 'productName';
                productName.textContent = product.name;

                const productDescription = document.createElement('p');
                productDescription.className = 'productDescription';
                productDescription.textContent = product.description;

                productArticle.appendChild(productImg);
                productArticle.appendChild(productName);
                productArticle.appendChild(productDescription);
                productLink.appendChild(productArticle);
                itemsContainer.appendChild(productLink);
            });
        })
        .catch(error => console.error('Error fetching product data:', error));
});
