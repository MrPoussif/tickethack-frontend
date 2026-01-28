console.log("script chargé");

// bouton search
document.querySelector("#btn-search").addEventListener("click", () => {
  const departure = document.querySelector("#departure").value.trim();
  const arrival = document.querySelector("#arrival").value.trim();
  const date = document.querySelector("#date").value;

  fetch("http://localhost:3000/index/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departure, arrival, date }),
  })
    .then((response) => response.json())
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

      contentRight.innerHTML = `
        ${data.trips
          .map(
            (trip) => `
              <div class="trip">
                <div class="trip-text">
                  ${trip.departure} &gt; ${trip.arrival}
                </div>

                <div class="departure-time">
                  ${new Date(trip.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>

                <div class="price">
                  ${trip.price} €
                </div>

                <button type="button" class="btn-book" data-id="${trip._id}">Book</button>
              </div>
            `,
          )
          .join("")}
      `;

      resetEventListener();
    })
    .catch(() => {
      document.querySelector("#content-right").innerHTML =
        `<p class="state-text">Server error</p>`;
    });
});

function resetEventListener() {
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
        .catch((err) => console.error("Erreur fetch add cart", err));
    });
  });
}
