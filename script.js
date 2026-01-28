console.log("script chargé");
// bouton search
document.querySelector("#btn-search").addEventListener("click", () => {
  const departure = document.querySelector("#departure").value.trim();
  const arrival = document.querySelector("#arrival").value.trim();
  const date = document.querySelector("#date").value;

  // construction de l’URL avec query params
  const params = new URLSearchParams({ departure, arrival, date });
  const url = `http://localhost:3000/index?${params.toString()}`;

  fetch(url)
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
            ${new Date(trip.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
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
