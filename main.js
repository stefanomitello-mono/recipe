import './src/index.scss'
import { searchRecipes, getRecipe, truncate, dectofraction } from './src/utils'


function renderSidebar(title, image_url, publisher, id) {
    let items_template = document.getElementById("resultItems").content;
    let clone = document.importNode(items_template, true);

    clone.querySelector(".result__item--name ").textContent = truncate(title);
    clone.querySelector("li").setAttribute('data-id', id);
    clone.querySelector(".result__item--figure ").src = image_url;
    clone.querySelector(".result__item--company ").textContent = publisher;

    return clone;
}

function renderIngredients(quantity = '', unit = '', description, index = 1) {
    let ingredients_template = document.getElementById("tmpl-recipe__ingredients--list").content;
    let clone = document.importNode(ingredients_template, true);

    clone.querySelector(".recipe__quantity ").innerHTML = quantity ? quantity : ''
    clone.querySelector(".recipe__unit ").textContent = unit;
    clone.querySelector(".recipe__description ").textContent = description;

    clone.querySelector('.recipe__quantity ').setAttribute('data-index', index);
    clone.querySelector('.recipe__quantity ').setAttribute('data-qtybase', quantity / 4);

    return clone;
}

function renderContent(id, title, image_url, publisher, ingredients, source_url, servings, cooking_time) {

    let content = document.getElementById("content").content;
    let clone = document.importNode(content, true);

    clone.querySelector(".recipe__name").textContent = title;
    //clone.querySelector("li a").setAttribute('data-id', id);
    clone.querySelector(".recipe__figure ").src = image_url;
    clone.querySelector(".recipe__publisher ").textContent = publisher;
    clone.querySelector(".recipe__btn ").href = source_url;
    clone.querySelector(".recipe__info-data-people--value ").innerHTML = servings;
    clone.querySelector(".recipe__info-data-people--value ").setAttribute('data-minus', servings - 1)
    clone.querySelector(".recipe__info-data-minutes--value ").textContent = cooking_time;


    //print ingredients list onload
    const ingredientsList = clone.querySelector(".recipe__ingredients--list");
    let indice = 0
    ingredients.forEach(ingredient => {
        ingredientsList.appendChild(renderIngredients(ingredient.quantity, ingredient.unit, ingredient.description, indice));
        indice++
    })

    clone.querySelector('.recipe__info-data-people--btn-minus').addEventListener("click", minus);
    clone.querySelector('.recipe__info-data-people--btn-plus').addEventListener("click", plus);


    //get all ingredients list
    /* const matches = clone.querySelectorAll(".recipe__quantity");
    console.log("node recpie qty: ", matches[0].innerHTML, " at index: ", matches[0].getAttribute('data-index')) */

    return clone;
}

async function getSearchValue(e) {
    e.preventDefault();
    let v = document.getElementById('search-value').value;
    console.info("search", v)

    let res = await searchRecipes(v);

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

    let res = await getRecipe(id);

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


function minus() {
    //clone.querySelector(".recipe__info-data-people--value").innerHTML(clone.querySelector(".recipe__info-data-people--value").value - 1)
    //document.querySelector(".recipe__info-data-people--btn-minus").getAttribute('data-minus')
    let seriving = document.querySelector(".recipe__info-data-people--value").innerHTML
    document.querySelector(".recipe__info-data-people--value").innerHTML = Number(seriving) - 1


    const quantity = document.querySelectorAll(".recipe__quantity");

    console.log(
        "4 persone: ", quantity[0].innerHTML,
        "per 3 persone: ", Number(quantity[0].innerHTML) - Number(quantity[0].getAttribute('data-qtybase')),
        "formula: ", Number(quantity[0].innerHTML) + " - " + Number(quantity[0].getAttribute('data-qtybase')) + "|",
    )

    let indice = 0
    quantity.forEach(qty => {
        updateIngredients(qty.innerHTML = Number(qty.innerHTML) - Number(qty.getAttribute('data-qtybase')), indice);
        indice++
    })


    //console.log("node recpie qty: ", matches[0].innerHTML, " at index: ", matches[0].getAttribute('data-index'))
}

function plus() {
    //clone.querySelector(".recipe__info-data-people--value").innerHTML(clone.querySelector(".recipe__info-data-people--value").value - 1)
    //document.querySelector(".recipe__info-data-people--btn-minus").getAttribute('data-minus')
    let seriving = document.querySelector(".recipe__info-data-people--value").innerHTML
    document.querySelector(".recipe__info-data-people--value").innerHTML = Number(seriving) + 1

    const quantity = document.querySelectorAll(".recipe__quantity");

    console.log(
        "4 persone: ", quantity[0].innerHTML,
        "per 5 persone: ", Number(quantity[0].innerHTML) + Number(quantity[0].getAttribute('data-qtybase')),
        "formula: ", Number(quantity[0].innerHTML) + " + " + Number(quantity[0].getAttribute('data-qtybase')) + "|",
    )

    let indice = 0
    quantity.forEach(qty => {
        let q2 = Number(qty.innerHTML) + Number(qty.getAttribute('data-qtybase'))
        updateIngredients(q2, indice);
        indice++
    })
}

function updateIngredients(quantity = '', index) {
    console.log("qty aggiornato:", quantity)
    document.querySelector(`.recipe__quantity[data-index="${index}"] `).innerHTML = quantity ? quantity : '' //dectofraction(quantity)
    //clone.querySelector('.recipe__quantity ').getAttribute('data-index');

}