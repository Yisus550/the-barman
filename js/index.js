const ingredientSelect = document.getElementById("ingredient");
const categorySelect = document.getElementById("category");
const submitBtn = document.getElementById("submit-btn");
const modal = document.querySelector(".modal");

const apiURL = "https://www.thecocktaildb.com/api/json/v1/1";

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${apiURL}/list.php?i=list`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((res) => {
      const ingredients = res.drinks;
      ingredients.forEach((ingredient) => {
        const option = document.createElement("option");

        option.value = ingredient.strIngredient1;
        option.textContent = ingredient.strIngredient1;
        ingredientSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  fetch(`${apiURL}/list.php?c=list`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((res) => {
      const categories = res.drinks;
      categories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category.strCategory;
        option.textContent = category.strCategory;
        categorySelect.appendChild(option);
      });
    });
});

// Add a global event listener for drink recipes
document.addEventListener("DOMContentLoaded", () => {
  const drinkList = document.getElementById("drinkList");

  drinkList.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-recipe-btn")) {
      const idDrink = e.target.closest(".recipe-card").id;

      fetch(`${apiURL}/lookup.php?i=${idDrink}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((res) => {
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
          ingredients = ingredients.replace(/undefined/g, "");

          recipeModal.innerHTML = `
            <div class="modal-header">
              <img
              src="${drink.strDrinkThumb}/medium"
              alt="${drink.strDrink}"
              />
              <h3>${drink.strDrink}</h3>
            </div>

            <div class="modal-body">
              <div class="modal-ingredients">
              <h4>Ingredientes</h4>
              <ul class="ingredients-list">
                  ${ingredients}
              </ul>
            </div>

              ${
                instructions
                  ? `<div class="modal-instructions">
                      <h4>Instrucciones</h4>
                      <p>${instructions}</p>
                    </div>`
                  : ""
              }

              <button class="btn-primary save-recipe">Guardar receta</button>
            </div>
          `;

          document
            .querySelector(".save-recipe")
            .addEventListener("click", () => {
              const savedRecipes =
                JSON.parse(localStorage.getItem("savedRecipes")) || [];

              if (savedRecipes.some((recipe) => recipe.id === drink.idDrink)) {
                alert("Esta receta ya está guardada.");
                return;
              }

              const recipeToSave = {
                id: drink.idDrink,
                name: drink.strDrink,
                image: drink.strDrinkThumb,
                category: drink.strCategory,
                ingredient: drink.str,
                instructions: drink.strInstructionsES ?? drink.strInstructions,
              };

              savedRecipes.push(recipeToSave);
              localStorage.setItem(
                "savedRecipes",
                JSON.stringify(savedRecipes)
              );
              alert("Receta guardada!");
            });

          recipeModal.classList.remove("hidden");
          modal.classList.remove("hidden");
          document.body.style.overflow = "hidden";
        });
    }
  });
});

submitBtn.addEventListener("click", (e) => {
  const selectedIngredient = ingredientSelect.value;
  const selectedCategory = categorySelect.value;

  e.preventDefault();

  fetch(`${apiURL}/filter.php?c=${selectedCategory}&i=${selectedIngredient}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((res) => {
      const drinks = res.drinks;
      const drinkList = document.getElementById("drinkList");
      drinkList.innerHTML = "";

      drinks.forEach((drink) => {
        const drinkCard = document.createElement("article");

        drinkCard.id = drink.idDrink;
        drinkCard.className = "recipe-card";
        drinkCard.innerHTML = `
        <div class="recipe-card-image">
              <img
                src="${drink.strDrinkThumb}"
                alt="${drink.strDrink}"
              />
              <h3>${drink.strDrink}</h3>
            </div>
            <div class="recipe-card-content">
              <div class="recipe-card-cta">
                <button class="btn-primary view-recipe-btn">Ver Receta</button>
              </div>
            </div>
      `;
        drinkList.appendChild(drinkCard);
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});

modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});
