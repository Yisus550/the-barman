const apiURL = "https://www.thecocktaildb.com/api/json/v1/1";
const favoritesContainer = document.querySelector(".favorites-container");
const modal = document.querySelector(".modal");

// Function to load favorites from localStorage
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("cocktailFavorites")) || [];
  
  if (favorites.length === 0) {
    // Show message if no favorites
    favoritesContainer.innerHTML = `
      <div class="no-favorites">
        <p>No tienes cócteles favoritos guardados.</p>
        <a href="./index.html" class="btn-primary">Descubrir Cócteles</a>
      </div>
    `;
    return;
  }

  // Clear container
  favoritesContainer.innerHTML = "";

  // Load each favorite cocktail
  favorites.forEach(idDrink => {
    fetch(`${apiURL}/lookup.php?i=${idDrink}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(res => {
        const drink = res.drinks[0];
        
        const drinkCard = document.createElement("article");
        drinkCard.id = drink.idDrink;
        drinkCard.className = "recipe-card";
        drinkCard.innerHTML = `
          <div class="recipe-card-image">
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
            <h3>${drink.strDrink}</h3>
          </div>
          <div class="recipe-card-content">
            <div class="recipe-card-cta">
              <button class="btn-primary view-recipe-btn">Ver Receta</button>
              <button class="btn-secondary remove-favorite-btn">Eliminar</button>
            </div>
          </div>
        `;
        
        favoritesContainer.appendChild(drinkCard);
      })
      .catch(error => {
        console.error("Error loading favorite:", error);
      });
  });
}

// Function to display recipe modal
function displayRecipeModal(idDrink) {
  fetch(`${apiURL}/lookup.php?i=${idDrink}`)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then(res => {
      const drink = res.drinks[0];
      const recipeModal = document.getElementById("recipe-modal");
      let instructions = [];
      let ingredients = "";

      instructions = drink.strInstructionsES ?? drink.strInstructions;

      for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];

        if (ingredient && measure) {
          ingredients += `<li>${measure} - ${ingredient}</li>`;
        } else if (ingredient) {
          ingredients += `<li>${ingredient}</li>`;
        }
      }
      ingredients = ingredients.replace(/undefined/g, "");      recipeModal.innerHTML = `
        <div class="modal-header">
          <img src="${drink.strDrinkThumb}/medium" alt="${drink.strDrink}" />
          <h3>${drink.strDrink}</h3>
          <button class="close-modal-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div class="modal-ingredients">
            <h4>Ingredientes</h4>
            <ul class="ingredients-list">
              ${ingredients}
            </ul>
          </div>

          ${instructions
            ? `<div class="modal-instructions">
                <h4>Instrucciones</h4>
                <p>${instructions}</p>
              </div>`
            : ""
          }
        </div>
      `;
      
      recipeModal.classList.remove("hidden");
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
}

// Function to remove a favorite
function removeFavorite(idDrink) {
  let favorites = JSON.parse(localStorage.getItem("cocktailFavorites")) || [];
  favorites = favorites.filter(id => id !== idDrink);
  localStorage.setItem("cocktailFavorites", JSON.stringify(favorites));
  
  // Reload favorites to update UI
  loadFavorites();
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
  
  // Event delegation for recipe view and remove buttons
  favoritesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-recipe-btn")) {
      const idDrink = e.target.closest(".recipe-card").id;
      displayRecipeModal(idDrink);
    }
    
    if (e.target.classList.contains("remove-favorite-btn")) {
      const idDrink = e.target.closest(".recipe-card").id;
      removeFavorite(idDrink);
    }
  });  // Close modal when clicking outside or with close button
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal") || e.target.classList.contains("close-modal-btn")) {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });
  
  // Event delegation for the close button inside modal
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-modal-btn")) {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });
});
