const favoritesContainer = document.getElementById("favorites-container");

const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

document.addEventListener("DOMContentLoaded", () => {
  if (savedRecipes.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No tienes recetas guardadas.";
    favoritesContainer.appendChild(emptyMessage);
    return;
  }

  const drinkList = document.getElementById("favorites-container");
  drinkList.innerHTML = "";

  savedRecipes.forEach((drink) => {
    const drinkCard = document.createElement("article");

    drinkCard.id = drink.id;
    drinkCard.className = "recipe-card";
    drinkCard.innerHTML = `
        <div class="recipe-card-image">
              <img
                src="${drink.image}"
                alt="${drink.name}"
              />
              <h3>${drink.name}</h3>
            </div>
            <div class="recipe-card-content">
              <div class="recipe-card-cta">
                <button class="btn-primary view-recipe-btn">Ver Receta</button>
              </div>
            </div>
      `;
    drinkList.appendChild(drinkCard);
  });
});
