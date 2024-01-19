const myURL = "https://striveschool-api.herokuapp.com/api/product";
const MioToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWFhNWZmYjE4N2U1YzAwMTgxNGM3MjYiLCJpYXQiOjE3MDU2NjQ1MDcsImV4cCI6MTcwNjg3NDEwN30.BSOMwNWpqDGFmbCAzz3QTFlj9KeM5-F3P4-Z3NGE7gY";

document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("productForm");
  const productList = document.getElementById("productList");

  productForm.addEventListener("submit", function (e) {
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

    if (productId) {
      fetch(`${myURL}/${productId}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Prodotto modificato:", data);
          resetForm();
          fetchAndDisplayProducts();
        })
        .catch((error) =>
          console.error("Errore durante la modifica del prodotto:", error)
        );
    } else {
      fetch(myURL, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Prodotto aggiunto:", data);
          resetForm();
          fetchAndDisplayProducts();
        })
        .catch((error) =>
          console.error("Errore durante l'aggiunta del prodotto:", error)
        );
    }
  });

  function displayProducts(products) {
    productList.innerHTML = "";
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card", "col-md-4", "mb-3");

      productCard.innerHTML = `
        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text">Prezzo: $${product.price}</p>
          <button class="btn btn-primary" onclick="showDetails('${product._id}')">Dettagli</button>
        </div>
      `;

      productList.appendChild(productCard);
    });
  }

  function showDetails(productId) {
    fetch(`${myURL}/${productId}`, {
      headers: {
        Authorization: MioToken,
      },
    })
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
            </div>
          </div>
        `;

        productDetails.style.display = "block";
      })
      .catch((error) =>
        console.error("Errore durante il recupero dei dettagli:", error)
      );
  }

  function fetchAndDisplayProducts() {
    fetch(myURL, {
      headers: {
        Authorization: MioToken,
      },
    })
      .then((response) => response.json())
      .then((products) => displayProducts(products))
      .catch((error) =>
        console.error("Errore durante il recupero dei prodotti:", error)
      );
  }

  function resetForm() {
    productForm.reset();
  }

  fetchAndDisplayProducts();
});

function deleteProduct(productId) {
  fetch(`${myURL}/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: MioToken,
    },
  })
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

function addToCart(productId) {
  console.log(`Prodotto con ID ${productId} aggiunto al carrello`);
}
