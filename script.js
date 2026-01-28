console.log("script chargé");

if (document.querySelector("#btn-search")) {
  initSearchPage();
}

if (document.querySelector("#btn-purchase")) {
  initCartPage();
}

/* =========================
   HOMEPAGE
========================= */
function initSearchPage() {
  document.querySelector("#btn-search").addEventListener("click", () => {
    const departure = document.querySelector("#departure").value.trim();
    const arrival = document.querySelector("#arrival").value.trim();
    const date = document.querySelector("#date").value;

    fetch("http://localhost:3000/index/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ departure, arrival, date }),
    })
      .then((res) => res.json())
      .then((data) => {
        const contentRight = document.querySelector("#content-right");

        if (!data.result) {
          contentRight.innerHTML = `<p class="state-text">Error</p>`;
          return;
        }

        if (data.trips.length === 0) {
          contentRight.innerHTML = `
            <img class="state-empty-illustration" src="images/notfound.png" alt="">
            <p class="state-text">No trip found.</p>
          `;
          return;
        }

        contentRight.innerHTML = data.trips
          .map(
            (trip) => `
              <div class="trip">
                <div class="trip-text">${trip.departure} &gt; ${trip.arrival}</div>
                <div class="departure-time">
                  ${new Date(trip.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div class="price">${trip.price} €</div>
                <button
                  type="button"
                  class="btn-book"
                  data-id="${trip._id}"
                >
                  Book
                </button>
              </div>
            `,
          )
          .join("");

        initBookButtons();
      })
      .catch(() => {
        document.querySelector("#content-right").innerHTML =
          `<p class="state-text">Server error</p>`;
      });
  });
}

function initBookButtons() {
  document.querySelectorAll(".btn-book").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tripId = btn.dataset.id;

      fetch("http://localhost:3000/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.result) return console.error(data.error);
          window.location.href = "cart.html";
        })
        .catch((err) => console.error("Erreur add cart", err));
    });
  });
}

/* =========================
   CART PAGE
========================= */
function initCartPage() {
  loadCart();

  const btnPurchase = document.querySelector("#btn-purchase");
  if (btnPurchase) {
    btnPurchase.addEventListener("click", () => {
      fetch("http://localhost:3000/cart", { method: "POST" })
        .then(() => {
          window.location.href = "bookings.html";
        })
        .catch((err) => console.error("Error purchase", err));
    });
  }
}

function loadCart() {
  fetch("http://localhost:3000/cart")
    .then((res) => res.json())
    .then((data) => {
      if (!data.result) return console.error(data.error);

      const container = document.querySelector("#trips-container");
      const totalElements = document.querySelector("#total");
      const totalPrice = calculPrice(data.trips);

      if (data.trips.length === 0) {
        container.innerHTML = `<p class="trip-text">Your cart is empty.</p>`;
        totalElements.textContent = `Total : 0€`;

        return;
      }

      container.innerHTML = data.trips
        .map(
          (trip) => `
            <div class="trip">
              <div class="trip-text">${trip.departure} &gt; ${trip.arrival}</div>
              <div class="trip-text">
                ${new Date(trip.date).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div class="trip-text">${trip.price} €</div>
              <button type="button" class="btn-delete button" data-id="${trip._id}">X</button>
            </div>
          `,
        )
        .join("");

      // ===== SLOT TOTAL =====
      // Exemple attendu:
      // const total = computeTotal(data.trips);
      // totalElements.textContent = `Total : ${total} €`;
      totalElements.textContent = `Total : ${totalPrice} €`; // placeholder (ou "Total : ...")
      // ==============================================

      document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", () => {
          fetch(`http://localhost:3000/cart/${btn.dataset.id}`, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((del) => {
              if (!del.result) return console.error(del.error);
              loadCart();
            })
            .catch((err) => console.error("Erreur delete", err));
        });
      });
    })
    .catch((err) => console.error("Erreur chargement cart", err));
}

function calculPrice(tripList) {
  // ! Prends un tableau d'objets en entrée
  total = 0;
  for (let trip of tripList) {
    console.log("price", trip.price);
    total += parseInt(trip.price);
  }
  return total;
}
