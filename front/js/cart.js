//Change le titre de la page actuel par "Mon panier".
document.title = "Mon panier";


//Récupération des données depuis localStorage
function getFromCache(){
    const jsonFromCache = JSON.parse(localStorage.getItem("order"));
return jsonFromCache;
}

//Requete pour faire remonté données d'un produit spécifique

async function getProductFromAPI(id){
let res = await fetch ("http://localhost:3000/api/products/" + id);
return await res.json();
};

// Initialisation des variables
let panier = getFromCache() || [];
if (panier.length === 0) {
document.querySelector("h1").innerHTML= "Votre panier est vide 😭";
}

//Affichage des produits dans le produit 
async function displayProduct(){

// On crée un element, on ne va pas le chercher !
for (let article of panier){
const data = await getProductFromAPI(article.idProduct);

let articleElt = document.createElement("article");
articleElt.classList.add("cart__item");
articleElt.dataset.id = article.idProduct;
articleElt.dataset.color = article.colorProduct;
articleElt.innerHTML = `<div class="cart__item__img">
<img src="${data.imageUrl}" alt="${data.altTxt}">
</div>
<div class="cart__item__content">
<div class="cart__item__content__description">
  <h2>${data.name}</h2>
  <p>${article.colorProduct}</p>
  <p>${data.price} €</p>
</div>
<div class="cart__item__content__settings">
  <div class="cart__item__content__settings__quantity">
    <p>Qté : </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantityProduct}">
  </div>
  <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer</p>
  </div>
</div>
</div>`;
// Ajout dans le DOM
document.getElementById("cart__items").insertAdjacentElement("beforeend", articleElt)
}
removeItem();
quantityModified();

};



//Calcul de la quantité totale des produits dans le panier 

function quantityTotal(){

  let qtyTotal = 0;
  
  for (let article of panier ){
  
  qtyTotal += parseInt(article.quantityProduct) ;
  
  }
  // Affichage du total
  document.getElementById("totalQuantity").textContent = qtyTotal;
  
  
  }
  

// Calcul le prix total des produits dans le panier 




async function priceTotal(){

    let amountTotal = 0;
   
    for (let article of panier ){

        // Calcul le montant total de tous les produits présents dans le panier en utilisant getProductFromAPI
        let productData = await getProductFromAPI(article.idProduct);

        //Opération pour connaitre le montant total
        amountTotal += article.quantityProduct * productData.price;
   
        // Le montant total est ensuite affiché dans le DOM.
        document.getElementById("totalPrice").textContent = amountTotal;

      
};

}

//Suppresion d'un produit du panier
function removeItem() {
  let btn_delete = document.querySelectorAll(".deleteItem");
  btn_delete.forEach( button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        // Selection de l'élément à supprimer en fonction de son id ET sa couleur
        let item = event.target.closest('.cart__item');
        let id = item.dataset.id;
        let color = item.dataset.color;
        panier = panier.filter((product) => product.idProduct !== id && product.colorProduct !== color);
        localStorage.setItem("order", JSON.stringify(panier));
        // Alerte produit supprimé et refresh
        alert("Ce produit a bien été supprimé du panier");
        window.location.reload();
    });
  });
}



// Modification de la quantité d'un produit

function quantityModified() {
    let inputs = document.querySelectorAll(".itemQuantity");
    inputs.forEach(input => {
        input.addEventListener("change", event => {
            event.preventDefault();
            let item = event.target.closest(".cart__item");
            let id = item.dataset.id;
            let color = item.dataset.color;
            let newQuantity = parseInt(event.target.value);
            
            //Si la quantité est mise à jour, les données sont mises à jour dans le tableau panier et enregistrées dans le cache local.
            if (newQuantity === 0 || newQuantity > 100) {
                alert("La quantité doit être comprise entre 1 et 100");
                return;
            }
            
            let productIndex = panier.findIndex(
                product => product.idProduct === id && product.colorProduct === color
            );
            panier[productIndex].quantityProduct = newQuantity;
            localStorage.setItem("order", JSON.stringify(panier));
            quantityTotal();
          
        });
        
      priceTotal();
    });
  };


  

// Application 
displayProduct()
quantityTotal();
priceTotal();
removeItem();


//*********************************FORMULAIRE*********************************


//Instauration formulaire avec regex
function getForm() {
    // Ajout des Regex
    let form = document.querySelector(".cart__order__form");

    //Création des expressions régulières
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
    let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

    // Ecoute de la modification du prénom
    form.firstName.addEventListener('change', function() {
        validFirstName(this);
    });

    // Ecoute de la modification du nom
    form.lastName.addEventListener('change', function() {
        validLastName(this);
    });

    // Ecoute de la modification de l'adresse
    form.address.addEventListener('change', function() {
        validAddress(this);
    });

    // Ecoute de la modification de la ville
    form.city.addEventListener('change', function() {
        validCity(this);
    });

    // Ecoute de la modification du mail
    form.email.addEventListener('change', function() {
        validEmail(this);
    });



    
    //validation du prénom
    const validFirstName = function(inputFirstName) {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (charRegExp.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = '';
        } else {
            firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation du nom
    const validLastName = function(inputLastName) {
        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (charRegExp.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = '';
        } else {
            lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de l'adresse
    const validAddress = function(inputAddress) {
        let addressErrorMsg = inputAddress.nextElementSibling;

        if (addressRegExp.test(inputAddress.value)) {
            addressErrorMsg.innerHTML = '';
        } else {
            addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de la ville
    const validCity = function(inputCity) {
        let cityErrorMsg = inputCity.nextElementSibling;

        if (charRegExp.test(inputCity.value)) {
            cityErrorMsg.innerHTML = '';
        } else {
            cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

  //validation de l'email
const validEmail = function(inputEmail) {
    let emailErrorMsg = inputEmail.nextElementSibling;
  
    if (!emailInput.checkValidity()) {
      emailErrorMsg.innerHTML = "Veuillez entrer une adresse email valide";
    } else if (!emailRegex.test(emailInput.value)) {
      emailErrorMsg.innerHTML = "Veuillez entrer une adresse email valide";
    } else {
      emailErrorMsg.innerHTML = "";
    }
  };
  
    }

    
getForm();


//Envoi des informations client au localstorage
function postForm(){
    const btn_commander = document.getElementById("order");

    //Ecouter le panier
    btn_commander.addEventListener("click", (event)=>{
        //Récupération des coordonnées du formulaire client
        let inputName = document.getElementById('firstName');
        let inputLastName = document.getElementById('lastName');
        let inputAdress = document.getElementById('address');
        let inputCity = document.getElementById('city');
        let inputMail = document.getElementById('email');

        // Vérifier que tous les champs sont valides
        if (inputName.value === '' || inputLastName.value === '' || inputAdress.value === '' || inputCity.value === '' || inputMail.value === '') {
            alert("Veuillez remplir tous les champs.");
            event.preventDefault();
            return;
        }

           // Vérifier que l'email est valide
           let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
           if (!inputMail.checkValidity() || !emailRegExp.test(inputMail.value)) {
               alert("L'adresse email n'est pas valide.");
               event.preventDefault();
               return;
           }

     

        //Construction d'un array depuis le local storage
        let idProducts = [];
        let productSavedInLocalStorage = JSON.parse(localStorage.getItem("order"));
        for (let i = 0; i<productSavedInLocalStorage.length;i++) {
            idProducts.push(productSavedInLocalStorage[i].idProduct);
        }
        console.log(idProducts);

        let order = {
            contact : {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAdress.value,
                city: inputCity.value,
                email: inputMail.value,
            }, 
            products: idProducts,
        } 

        const options = {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Accept': 'application/json', 
                "Content-Type": "application/json" 
            },
        };

        fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        document.location.href = "confirmation.html?orderId=" + data.orderId;
        localStorage.clear();
      })
      .catch((err) => {
        console.error(err);
      });
  })
}
postForm();


