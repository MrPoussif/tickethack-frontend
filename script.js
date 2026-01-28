console.log("script chargé");
// bouton search
document.querySelector("#btn-search").addEventListener("click", () => {
  const departure = document.querySelector("#departure").value.trim();
  const arrival = document.querySelector("#arrival").value.trim();
  const date = document.querySelector("#date").value;

  // construction de l’URL avec query params
  fetch("http://localhost:3000/index/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departure, arrival, date }),
  })
    .then((response) => response.json())
    .then((data) => {
      const contentRight = document.querySelector("#content-right");

      // erreur back
      if (!data.result) {
        contentRight.innerHTML = `<p class="state-text">Error</p>`;
        return;
      }

      // aucun résultat
      if (data.trips.length === 0) {
        contentRight.innerHTML = `
          <img class="state-empty-illustration" src="images/notfound.png" alt="">
          <p class="state-text">No trip found.</p>
        `;
        return;
      }

      // affichage des résultats
      contentRight.innerHTML = `
  ${data.trips
    .map(
      (trip) => `
        <div class="trip">
          <div class="trip-text">
            ${trip.departure} &gt; ${trip.arrival}
          </div>

          <div class="departure-time">

          </div>

          <div class="price">
            ${trip.price} €
          </div>

          <button type="button" class="btn-delete">X</button>
        </div>
      `,
    )
    .join("")}
`;
    })
    .catch(() => {
      document.querySelector("#content-right").innerHTML =
        `<p class="state-text">Server error</p>`;
    });
});
