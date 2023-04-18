const nutrition_key = "cd8cd546dc2f41d09527b1225934f538";
function onResponse(response) {
    console.log("Richiesta ricevuta");
    return response.json();
}


function onRecipeJson(recipe) {
    console.log(recipe);
    openModal(recipe);

}


function openModal(recipe) {
    const modal = document.querySelector("#modal");
    modal.innerHTML = " ";
    modal.style.top = window.pageYOffset + "px";
    let img = document.createElement("img");
    img.src = recipe.image;
    textRecipe = document.createElement("div");
    let link = document.createElement("a");
    link.textContent = recipe.title;
    link.href = recipe.sourceUrl;
    let like = document.createElement("img");
    like.id="like";
    like.src = "heart-unchecked.png";
    let text = document.createElement("p");
    text.textContent = "Tempo di preparazione: " + recipe.readyInMinutes + " minuti\r\n" + "Persone: " + recipe.servings + "\r\nSenza glutine: " + recipe.glutenFree + "\r\nVegetariano: " + recipe.vegetarian + "\r\nIngredienti:";
    for (let ingredient of recipe.extendedIngredients) {
        text.textContent += "\r\n" + ingredient.name;
    }
    
    modal.appendChild(img);
    textRecipe.appendChild(link);
    textRecipe.appendChild(like);
    textRecipe.appendChild(text);
    modal.appendChild(textRecipe);
    modal.classList.remove("hidden");

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            modal.classList.add("hidden");
            document.body.classList.remove("no-scroll");
        }
    });
}

function clickRecipe(event) {
    event.stopPropagation();
    document.body.classList.add("no-scroll");
    fetch("https://api.spoonacular.com/recipes/" + event.currentTarget.id + "/information?" + "apiKey=" + nutrition_key).then(onResponse).then(onRecipeJson);
}

function onJson(json) {
    console.log(json);
    const section = document.querySelector(".content");
    section.innerHTML = " ";
    for (let food of json.results) {
        let result = document.createElement("div");
        result.id = food.id;
        let food_img = document.createElement("img");
        let food_title = document.createElement("h1");
        food_title.textContent = food.title;
        food_img.src = food.image;
        result.appendChild(food_title);
        result.appendChild(food_img);
        section.appendChild(result);
        result.addEventListener('click', clickRecipe);
    }
}

function search(event) {
    console.log("Ricerca");
    event.stopPropagation();
    event.preventDefault();
    const content = encodeURIComponent(document.querySelector("#search").value);
    fetch("https://api.spoonacular.com/recipes/complexSearch?" + "apiKey=" + nutrition_key + "&query=" + content + "&number=100")
        .then(onResponse)
        .then(onJson);
}
const form = document.querySelector(".navbar form");
form.addEventListener("submit", search);
