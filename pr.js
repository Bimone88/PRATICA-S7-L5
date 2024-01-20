$(document).ready(function () {
  const myURL = "https://striveschool-api.herokuapp.com/api/product";
  const MioToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWFhNWZmYjE4N2U1YzAwMTgxNGM3MjYiLCJpYXQiOjE3MDU2NjQ1MDcsImV4cCI6MTcwNjg3NDEwN30.BSOMwNWpqDGFmbCAzz3QTFlj9KeM5-F3P4-Z3NGE7gY";

  let shoppingCart = [];

  function fetchAndDisplayProducts() {
    fetch(myURL, {
      headers: {
        Authorization: MioToken,
      },
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((products) => {
        displayProducts(products);
      })
      .catch((error) =>
        console.error("Errore durante il recupero dei prodotti:", error)
      );
  }

  function displayProducts(products) {
    const productList = $("#productList");
    productList.empty();

    products.forEach((product) => {
      const productCard = createProductCard(product);
      productList.append(productCard);
    });
  }

  function createProductCard(product) {
    const productCard = $(
      `<div class="card col-md-4 mb-3">
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text">Prezzo: $${product.price}</p>
              <button class="btn btn-primary" onclick="openDetails('${product._id}')">Dettagli</button>
              <button class="btn btn-success" onclick="addToCart('${product._id}')">
                <i class="bi bi-cart-plus"></i> Aggiungi al Carrello
              </button>
              <button class="btn btn-danger" onclick="removeProduct('${product._id}')">Rimuovi</button>
            </div>
          </div>`
    );

    return productCard;
  }

  function openDetails(productId) {
    window.location.href = `details.html?id=${productId}`;
  }

  function addToCart(productId) {
    const product = shoppingCart.find((p) => p._id === productId);

    if (!product) {
      shoppingCart.push(products.find((p) => p._id === productId));
      updateCartUI();
    }
  }

  function updateCartUI() {
    const cartList = $("#cartList");
    cartList.empty();

    shoppingCart.forEach((product) => {
      cartList.append(`<p>${product.name} - $${product.price}</p>`);
    });
  }

  function removeProduct(productId) {
    shoppingCart = shoppingCart.filter((product) => product._id !== productId);
    updateCartUI();
  }

  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  fetchAndDisplayProducts();
});
