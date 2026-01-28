console.log("script chargé");
// bouton search
document.querySelector("#btn-search").addEventListener("click", () => {
  const departure = document.querySelector("#departure").value;
  const arrival = document.querySelector("#arrival").value;
  const date = document.querySelector("#date").value;

  // garde-fou simple
  if (!departure || !arrival || !date) return;

  // construction de l’URL avec query params
  const params = new URLSearchParams({ departure, arrival, date });
  const url = `http://localhost:3000/index?${params.toString()}`;

  fetch(url)
    .then((res) => res.json())
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
        <ul>
          ${data.trips
            .map(
              (trip) => `
                <li>
                  <strong>${trip.departure}</strong>
                  →
                  <strong>${trip.arrival}</strong><br>
                  ${new Date(trip.date).toLocaleDateString()}
                </li>
              `,
            )
            .join("")}
        </ul>
      `;
    })
    .catch(() => {
      document.querySelector("#content-right").innerHTML =
        `<p class="state-text">Server error</p>`;
    });
});
