let idProduct;
let productSavedInLocalStorage = JSON.parse(localStorage.getItem("order")) || [];

displayProduct();
// Recupèration de l'id du produit à partir de l'URL
function displayProduct() {
  const link = new URL(window.location.href);
  idProduct = link.searchParams.get("id");
  
  fetchProduct(`http://localhost:3000/api/products/${idProduct}`, handleProductResponse);
}

function handleProductResponse(products) {
  document.title = products.name;
  document.querySelector(".item__img").innerHTML = `<img src="${products.imageUrl}" alt="${products.altTxt}">`;

  document.querySelector("#title").innerHTML = products.name;
  document.querySelector("#price").innerHTML = products.price;
  document.querySelector("#description").innerHTML = products.description;

  for (let option of products.colors) {
    const color = `<option value="${option}">${option} </option>`;

    document.querySelector("#colors").insertAdjacentHTML("beforeend", color);
  }
}

// Récupération des informations sur le produit à l'aide de l'URL fournie
function fetchProduct(url, cb) {
  fetch(url)
    .then(checkResponseStatus)
    .then((response) => response.json())
    .then(cb)
    .catch((err) => console.error(err));
}
// Vérification du status de la réponse ( HTTP 200 Ok)
function checkResponseStatus(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}

addToCart();
// Ajout d'un ecouteur d'évènement sur le bouton "Ajouter au panier"
function addToCart() {
  const cartButton = document.querySelector("#addToCart");
  cartButton.addEventListener("click", handleCartButtonClick);
};

//Validation et traitement des options sélectionnées par l'utilisateur ( quantité et couleur)
function handleCartButtonClick(event) {
  event.preventDefault();

  const choiceQuantity = parseInt(document.querySelector("#quantity").value);
  if (!validateQuantity(choiceQuantity)) return;

  const choiceColor = document.querySelector("#colors").value;
  if (!validateColor(choiceColor)) return;

  const optionsProduct = {
    idProduct,
    colorProduct: choiceColor,
    quantityProduct: choiceQuantity,
  };
//Mise à jour des informations sur le produit dans le localStorage
  productSavedInLocalStorage = updateLocalStorage(optionsProduct, productSavedInLocalStorage);


  // Affiche un popup de confirmation lors de l'ajout au panier ( gérée par la fonction handlePopupConfirmation )
  const popupConfirmation = confirmProductAdded();
  handlePopupConfirmation(popupConfirmation);
}
//  Véficication de la validité des options sélectionnées par l'utilisateur (quantité).
function validateQuantity(quantity) {
  if (isNaN(quantity) || quantity < 1 || quantity > 100) {
    alert('Veuillez choisir une quantité valide (entre 1 et 100 maximum)');
    console.log("Quantité non valide");
    return false;
  }
  return true;
}
// Véficication de la validité des options sélectionnées par l'utilisateur (couleur).
function validateColor(color) {
  if (!color || color === "") {
    alert('Veuillez choisir une couleur');
    console.log("Couleur manquante");
    return false;
  }
  return true;
}
function validateColor(color) {
  if (!color || color === "") {
    return false;
  }
  return true;
}

function validateQuantity(quantity) {
  if (isNaN(quantity) || quantity < 1 || quantity > 100) {
    return false;
  }
  return true;
}

function addToCart() {
  const cartButton = document.querySelector("#addToCart");
  cartButton.addEventListener("click", (event) => {
    event.preventDefault();

    const choiceQuantity = parseInt(document.querySelector("#quantity").value);
    if (!validateQuantity(choiceQuantity)) {
      alert("Veuillez choisir une quantité valide (entre 1 et 100 maximum)");
      console.log("Quantité non valide");
      return;
    }

    const choiceColor = document.querySelector("#colors").value;
    if (!validateColor(choiceColor)) {
      alert("Veuillez choisir une couleur");
      console.log("Couleur manquante");
      return;
    }

    let optionsProduct = {
      idProduct: idProduct,
      colorProduct: choiceColor,
      quantityProduct: choiceQuantity,
    };

    let productExist = false;
    if (productSavedInLocalStorage) {
      for (let i = 0; i < productSavedInLocalStorage.length; i++) {
        if (productSavedInLocalStorage[i].idProduct === idProduct && productSavedInLocalStorage[i].colorProduct === choiceColor) {
          if (productSavedInLocalStorage[i].quantityProduct + choiceQuantity > 100) {
            alert("La quantité totale d'un produit ne peut pas dépasser 100");
            console.log("Quantité totale dépasse 100");
            return;
          } else {
            productSavedInLocalStorage[i].quantityProduct = parseInt(productSavedInLocalStorage[i].quantityProduct) + parseInt(choiceQuantity);
          }
          productExist = true;
          break;
        }
      }
    }
    if (!productExist) {
      productSavedInLocalStorage = productSavedInLocalStorage || [];
      productSavedInLocalStorage.push(optionsProduct);
    }

    localStorage.setItem("order", JSON.stringify(productSavedInLocalStorage));

    let popupConfirmation;
    if (optionsProduct) {
      if (window.confirm("Produit ajouté au panier. Voir le panier OK ou retourner à l'accueil ANNULER")) {
        window.location.href = "cart.html";
      } else {
        window.location.href = "index.html";
      }
    }
  });
};

