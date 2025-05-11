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

    document.querySelectorAll(".view-recipe-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const recipeId = e.target.closest("article").id;
        const recipe = savedRecipes.find((r) => r.id === recipeId);

        if (recipe) {
          const modalContent = document.getElementById("recipe-modal");
          modalContent.innerHTML = `
                <div class="modal-header">
              <img
              src="${recipe.image}/medium"
              alt="${recipe.name}"
              />
              <h3>${recipe.name}</h3>
            </div>

            <div class="modal-body">
              <div class="modal-ingredients">
              <h4>Ingredientes</h4>
              <ul class="ingredients-list">
                  ${recipe.ingredients}
              </ul>
            </div>

              ${
                recipe.instructions
                  ? `<div class="modal-instructions">
                      <h4>Instrucciones</h4>
                      <p>${recipe.instructions}</p>
                    </div>`
                  : ""
              }

              <button class="btn-primary delete-recipe">Eliminar de favoritos</button>
            </div>
            `;
        }

        const modal = document.querySelector(".modal");
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";

        document
          .querySelector(".delete-recipe")
          .addEventListener("click", () => {
            const updatedRecipes = savedRecipes.filter(
              (r) => r.id !== recipeId
            );

            localStorage.setItem(
              "savedRecipes",
              JSON.stringify(updatedRecipes)
            );

            modal.classList.add("hidden");
            document.body.style.overflow = "auto";
            drinkCard.remove();

            if (updatedRecipes.length === 0) {
              const emptyMessage = document.createElement("p");
              emptyMessage.textContent = "No tienes recetas guardadas.";
              favoritesContainer.appendChild(emptyMessage);
            }

            alert("Receta eliminada de favoritos!");
            window.location.reload();
          });
      });
    });
  });
});
