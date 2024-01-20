const myURL = "https://striveschool-api.herokuapp.com/api/product";
const MioToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWFhNWZmYjE4N2U1YzAwMTgxNGM3MjYiLCJpYXQiOjE3MDU2NjQ1MDcsImV4cCI6MTcwNjg3NDEwN30.BSOMwNWpqDGFmbCAzz3QTFlj9KeM5-F3P4-Z3NGE7gY";

let products = [];
let shoppingCart = [];

document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("productForm");
  const productListContainer = document.getElementById("productListContainer");
  const productDetails = document.getElementById("productDetails");
  const cartList = document.getElementById("cartList");

  productForm.addEventListener("submit", handleProductForm);

  function handleProductForm(e) {
    e.preventDefault();
    const productId = document.getElementById("productId").value;
    const updatedProduct = {
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      brand: document.getElementById("brand").value,
      imageUrl: document.getElementById("imageUrl").value,
      price: parseFloat(document.getElementById("price").value),
    };

    const requestOptions = {
      method: productId ? "PUT" : "POST",
      body: JSON.stringify(updatedProduct),
      headers: {
        "Content-Type": "application/json",
        Authorization: MioToken,
      },
    };

    const url = productId ? `${myURL}/${productId}` : myURL;

    fetch(url, requestOptions)
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => {
        console.log(
          productId ? "Prodotto modificato:" : "Prodotto aggiunto:",
          data
        );
        resetForm();
        fetchAndDisplayProducts();
        // Mostro le carte dopo l'invio del modulo
        productListContainer.classList.remove("d-none");
      })
      .catch((error) =>
        console.error(
          productId
            ? "Errore durante la modifica del prodotto:"
            : "Errore durante l'aggiunta del prodotto:",
          error
        )
      );
  }

  function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product) => {
      const productCard = createProductCard(product);
      productList.appendChild(productCard);
    });
  }

  function createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.classList.add("card", "col-md-4", "mb-3");

    productCard.innerHTML = `
      <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">${product.description}</p>
        <p class="card-text">Prezzo: $${product.price}</p>
        <button class="btn btn-primary" onclick="showDetails('${product._id}')">Dettagli</button>
        <button class="btn btn-success" onclick="addToCart('${product._id}')">
          <i class="bi bi-cart-plus"></i> Aggiungi al Carrello
        </button>
        <button class="btn btn-danger" onclick="removeProductHandler('${product._id}')">
          Rimuovi
        </button>
      </div>
    `;

    return productCard;
  }

  function showDetails(productId) {
    fetch(`${myURL}/${productId}`, {
      headers: {
        Authorization: MioToken,
      },
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((product) => {
        const productDetails = document.getElementById("productDetails");
        productDetails.innerHTML = `
          <div class="row">
            <div class="col-md-6">
              <img src="${product.imageUrl}" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
              <h2>${product.name}</h2>
              <p>${product.description}</p>
              <p>Autore: ${product.brand}</p>
              <p>Prezzo: $${product.price}</p>
              <button class="btn btn-success" onclick="addToCart('${product._id}')">
                <i class="bi bi-cart-plus"></i> Aggiungi al Carrello
              </button>
              <button class="btn btn-secondary mt-2" onclick="closeDetails()">Chiudi Dettagli</button>
            </div>
          </div>
        `;

        productDetails.style.display = "block";
      })
      .catch((error) =>
        console.error("Errore durante il recupero dei dettagli:", error)
      );
    window.location.href = `./product-details.html?id=${productId}`;
  }

  function closeDetails() {
    const productDetails = document.getElementById("productDetails");
    productDetails.style.display = "none";
  }

  function fetchAndDisplayProducts() {
    fetch(myURL, {
      headers: {
        Authorization: MioToken,
      },
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((fetchedProducts) => {
        products = fetchedProducts;
        displayProducts(products);
      })
      .catch((error) =>
        console.error("Errore durante il recupero dei prodotti:", error)
      );
  }

  function addToCart(productId) {
    const product = products.find((p) => p._id === productId);

    if (product) {
      shoppingCart.push(product);
      console.log(
        `Prodotto con ID ${productId} aggiunto al carrello`,
        shoppingCart
      );
      updateCartUI();
      closeDetails();
    } else {
      console.error("Prodotto non trovato");
    }
  }

  function updateCartUI() {
    cartList.innerHTML = "";

    shoppingCart.forEach((product) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <p>${product.name} - $${product.price}</p>
      `;

      cartList.appendChild(cartItem);
    });
  }

  function resetForm() {
    productForm.reset();
  }

  function removeProduct(productId) {
    fetch(`${myURL}/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: MioToken,
      },
    })
      .then(handleErrors)
      .then((response) => {
        if (response.ok) {
          console.log("Prodotto eliminato con successo");
          fetchAndDisplayProducts();
        } else {
          console.error(
            "Errore durante l'eliminazione del prodotto:",
            response.statusText
          );
        }
      })
      .catch((error) =>
        console.error("Errore durante l'eliminazione del prodotto:", error)
      );
  }

  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  // Nascondi il contenitore delle carte all'inizio
  const productListContainerw = document.getElementById("productListContainer");
  productListContainerw.classList.add("d-none");

  // Chiamata iniziale per mostrare le carte solo dopo l'invio del modulo
  // fetchAndDisplayProducts();
});
