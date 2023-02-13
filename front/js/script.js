let url = 'http://localhost:3000/api/products';

// Affiche les produits sur la page d'accueil.
function displayProducts(data) {
  let display = ``;

  display += `<a href="./product.html?id=${data._id}">
                  <article>
                      <img src=${data.imageUrl} alt="${data.altTxt}">
                      <h3 class="productName">${data.name}</h3>
                      <p class="productDescription">${data.description}</p>
                  </article>
              </a>`;

  document.getElementById('items').insertAdjacentHTML("beforeend", display);
}

fetch(url)
  .then(response => response.json())
  .then((products) => {
    for(let data of products) {
      displayProducts(data);
    }
  })
  .catch((err) => console.log('server unavailable:' + err));
