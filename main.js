import './src/index.scss'
import { searchRecipes, getRecipe, truncate } from './src/utils'


function renderSidebar(title, image_url, publisher, id) {
    let items_template = document.getElementById("resultItems").content;
    let clone = document.importNode(items_template, true);

    clone.querySelector(".result__item--name ").textContent = truncate(title);
    clone.querySelector("li").setAttribute('data-id', id);
    clone.querySelector(".result__item--figure ").src = image_url;
    clone.querySelector(".result__item--company ").textContent = publisher;

    return clone;
}


function renderIngredients(quantity = '', unit = '', description) {
    let ingredients_template = document.getElementById("tmpl-recipe__ingredients--list").content;
    console.log(ingredients_template)
    let clone = document.importNode(ingredients_template, true);

    clone.querySelector(".recipe__quantity ").innerHTML = quantity ? quantity : '';
    clone.querySelector(".recipe__unit ").textContent = unit;
    clone.querySelector(".recipe__description ").textContent = description;

    return clone;
}

function renderContent(id, title, image_url, publisher, ingredients, source_url, servings, cooking_time) {

    console.log("title recipe: ", title)

    let content = document.getElementById("content").content;
    let clone = document.importNode(content, true);

    clone.querySelector(".recipe__name").textContent = title;
    //clone.querySelector("li a").setAttribute('data-id', id);
    clone.querySelector(".recipe__figure ").src = image_url;
    clone.querySelector(".recipe__publisher ").textContent = publisher;
    clone.querySelector(".recipe__btn ").href = source_url;
    clone.querySelector(".recipe__info-data-people--value ").textContent = servings;
    clone.querySelector(".recipe__info-data-minutes--value ").textContent = cooking_time;


    const ingredientsList = clone.querySelector(".recipe__ingredients--list");
    console.log(ingredientsList)
    ingredients.forEach(ingredient => {
        //ingredientsList.appendChild("<p>Ciao</p>")
        console.log(ingredient.quantity, ingredient.unit, ingredient.description)
        ingredientsList.appendChild(renderIngredients(ingredient.quantity, ingredient.unit, ingredient.description));
    })



    /*  const ingredientsList = document.querySelector(".recipe__ingredients--list");
     ingredients.forEach(ingredient => {
         console.log(ingredient.quantity, ingredient.unit, ingredient.description)
         renderIngredients(ingredient.quantity, ingredient.unit, ingredient.description)
     });
     ingredientsList.appendChild(
         //renderIngredients(ingredient.quantity, ingredient.unit, ingredient.description)
     ); */


    return clone;
}

async function getSearchValue(e) {
    e.preventDefault();
    let v = document.getElementById('search-value').value;
    console.info("search", v)

    let res = await searchRecipes(v);
    console.log("data json search:", res)

    document.getElementById("nothing").classList.add("hidden");
    document.getElementById("res").classList.remove("hidden");

    if ('content' in document.createElement('template')) {
        const results = document.querySelector("#results");
        res.data.recipes.forEach(recipe => {
            results.appendChild(renderSidebar(recipe.title, recipe.image_url, recipe.publisher, recipe.id));
            document.querySelector(`#results li[data-id='${recipe.id}']`).addEventListener("click", getContent);
        })

        //document.querySelector("#results li").addEventListener("click", getContent);
        return;
    } else {
        console.error("template feature not supported!.");
        alert("template feature not supported!.");
    }

    //const text = res.data.recipes.map(x => { }).join("");
    //resultside.innerHTML = text
}
search.addEventListener("submit", getSearchValue);

async function getContent(event) {
    event.preventDefault()

    let id = event.currentTarget.getAttribute('data-id')
    console.log("id clicked: ", id)

    let res = await getRecipe(id);
    console.log("data json single recipe: ", res)

    if ('content' in document.createElement('template')) {
        const content = document.querySelector("#contentItem");

        //Remove all child node before append new child node
        content.innerHTML = '';
        //Append child on template render function with passing params
        content.appendChild(renderContent(res.data.recipe.id, res.data.recipe.title, res.data.recipe.image_url, res.data.recipe.publisher, res.data.recipe.ingredients, res.data.recipe.source_url, res.data.recipe.servings, res.data.recipe.cooking_time));
    } else {
        console.error("template feature not supported!.");
        alert("template feature not supported!.");
    }

    //const text = res.data.recipes.map(x => { }).join("");
    //resultside.innerHTML = text
}




