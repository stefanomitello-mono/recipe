import './src/index.scss'
import { searchRecipes, getRecipe, truncate, dectofraction, toLocalStorage, fromLocalStorage, paginator } from './src/utils'


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
    clone.querySelector(".recipe__id").setAttribute('data-id', id);
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

    clone.querySelector('.recipe__id').addEventListener("click", setBookmark);

    //get all ingredients list
    /* const matches = clone.querySelectorAll(".recipe__quantity");
    console.log("node recpie qty: ", matches[0].innerHTML, " at index: ", matches[0].getAttribute('data-index')) */

    return clone;
}

function setSearchVisible() {

    const mediaQuery = window.matchMedia('(max-width: 768px)')
    // Check if the media query is true
    if (mediaQuery.matches) {
        //&& (event.target == "searchBtnm") recipe__btn-next
        // console.log(event.target)

        /* if (event.target.id == "searchBtnm") {

        } */

        search.classList.remove('hidden')
        search.style.cssText += "position: absolute; top: 10%; left: 50%; transform: translateX(-50%);  z-index: 99; "


        searchBtnm.addEventListener("click", function () { //search.classList.add('hidden')
            document.querySelector('#search').classList.contains('hidden') ? document.querySelector('#search').classList.remove("hidden") : document.querySelector('#search').classList.add("hidden");

        });


        getSearchValue
    }
}

async function getSearchValue(event) {
    event.preventDefault();
    console.info("----------------------")

    let s;
    let page = 1;

    switch (event.target.id) {
        case "recipe__btn-next":
            s = document.querySelector('#recipe__btn-next').getAttribute('data-query');
            page = Number(document.querySelector('#recipe__btn-next').getAttribute('data-page'));

            console.log("page next from target:", page)
            break
        case "recipe__btn-prev":
            s = document.querySelector('#recipe__btn-prev').getAttribute('data-query');
            page = Number(document.querySelector('#recipe__btn-prev').getAttribute('data-page'));

            console.log("page prev from target:", page)
            break
        default:
            s = document.getElementById('search-value').value
            break;
    }

    //s = document.querySelector('.recipe__btn-next').getAttribute('data-query');
    console.info("search", s)

    let res = await searchRecipes(s);
    console.log("json paginated: ", paginator(res.data.recipes, page))

    res = paginator(res.data.recipes, page)

    if (!document.getElementById("nothing").classList.contains('hidden')) { document.getElementById("nothing").classList.add("hidden"); }

    if (document.getElementById("res").classList.contains('hidden')) { document.getElementById("res").classList.remove("hidden"); }

    if (res.total <= 0) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" id="currentIllo" data-name="Layer 1" width="728" height="754.88525" viewBox="0 0 728 754.88525" class="notfound p-4 w-[33%] h-auto mx-auto injected-svg DownloadModal__ImageFile-sc-p17csy-5 iIfSkb grid_media" xmlns:xlink="http://www.w3.org/1999/xlink"><rect x="514.67011" y="302.6311" width="33" height="524" transform="translate(-458.65432 311.24592) rotate(-33.25976)" fill="#e6e6e6"></rect><path d="M335.58256,171.60615l63.84438,97.34271a8.5,8.5,0,0,1-14.21528,9.32341L311.81484,166.36508a60.62682,60.62682,0,0,0-29.14936,4.78729L362.63446,293.08a8.5,8.5,0,0,1-14.21528,9.3234l-79.969-121.92766A60.62685,60.62685,0,0,0,252.44516,205.304L325.842,317.2112a8.5,8.5,0,0,1-14.21528,9.3234l-63.84438-97.3427c-1.6398,27.14157,7.20944,59.3114,26.60329,88.881,36.04421,54.95614,94.83957,80.109,131.32307,56.18052s36.8396-87.87721.79539-142.83336C387.11022,201.85046,361.13005,180.91634,335.58256,171.60615Z" transform="translate(-236 -72.55738)" fill="#e6e6e6"></path><rect x="256" y="204" width="33" height="524" fill="#e6e6e6"></rect><ellipse cx="272" cy="119" rx="79" ry="119" fill="#e6e6e6"></ellipse><ellipse cx="272" cy="119" rx="65" ry="97.91139" fill="#ccc"></ellipse><ellipse cx="364" cy="734" rx="364" ry="20.88525" fill="#e6e6e6"></ellipse><path d="M815.26782,806.25045a1162.796,1162.796,0,0,0-412.53564,0A15.04906,15.04906,0,0,1,385,791.45826V604.55738H833V791.45826A15.04906,15.04906,0,0,1,815.26782,806.25045Z" transform="translate(-236 -72.55738)" fill="#6c63ff"></path><path d="M792,466.55738a92.85808,92.85808,0,0,0-30.39526,5.0863,179.055,179.055,0,0,0-324.4441-1.63928,93.00486,93.00486,0,1,0,12.16987,174.74988,179.02647,179.02647,0,0,0,300.7481-2.16382A93.00664,93.00664,0,1,0,792,466.55738Z" transform="translate(-236 -72.55738)" fill="#6c63ff"></path><path d="M421,546.55738h-2A178.40222,178.40222,0,0,1,436.24707,469.572l1.80762.85644A176.41047,176.41047,0,0,0,421,546.55738Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><path d="M779,546.55738h-2a176.52632,176.52632,0,0,0-16.29395-74.501l1.81641-.83789A178.51046,178.51046,0,0,1,779,546.55738Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><path d="M385.24121,691.52808l-.48242-1.94141c.56445-.13964,57.40332-14.09961,140.70019-21.02636,76.88086-6.39258,192.68653-7.93457,307.78516,21.02734l-.48828,1.93945C717.93945,662.63746,602.38672,664.17261,525.667,670.55054,442.519,677.46167,385.8042,691.38843,385.24121,691.52808Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><path d="M385.24121,718.52808l-.48242-1.94141c.56445-.13964,57.40332-14.09961,140.70019-21.02636,76.88086-6.39258,192.68653-7.93457,307.78516,21.02734l-.48828,1.93945C717.93945,689.63746,602.38672,691.17456,525.667,697.55054,442.519,704.46167,385.8042,718.38843,385.24121,718.52808Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><path d="M385.24121,745.52808l-.48242-1.94141c.56445-.13964,57.40332-14.09961,140.70019-21.02636,76.88086-6.39258,192.68653-7.93457,307.78516,21.02734l-.48828,1.93945C717.93945,716.63746,602.38672,718.17456,525.667,724.55054,442.519,731.46167,385.8042,745.38843,385.24121,745.52808Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><path d="M753.26693,598.71334,729.03658,590.475l23.26113-118.72871-15.992-1.45382c-15.594,11.96435-36.35984,16.65481-62.99891,13.08438l42.64542,64.45274-21.745,15.34942-69.368-83.20523A20.866,20.866,0,0,1,620,466.61227v0a20.866,20.866,0,0,1,15.0905-20.05076L709.16769,425.224l86.74466,9.69214c13.11467,19.99417,13.62744,33.89954-6.33645,37.911Z" transform="translate(-236 -72.55738)" fill="#2f2e41"></path><path d="M728.46691,644.90106h0a15.95869,15.95869,0,0,1-13.86555-21.711l12.046-30.97551c6.11869-11.59112,14.5164-10.14011,24.43261,0l4.84611,14.21526a9.17534,9.17534,0,0,1-.53485,7.176L743.64973,636.306A15.95871,15.95871,0,0,1,728.46691,644.90106Z" transform="translate(-236 -72.55738)" fill="#2f2e41"></path><path d="M697.15218,604.33834h0a15.95869,15.95869,0,0,1-13.86555-21.711l12.046-30.97551c6.11869-11.59113,14.51641-10.14012,24.43261,0l4.84611,14.21525a9.17537,9.17537,0,0,1-.53485,7.176L712.335,595.74331A15.9587,15.9587,0,0,1,697.15218,604.33834Z" transform="translate(-236 -72.55738)" fill="#2f2e41"></path><circle cx="476.55994" cy="212.13062" r="27.13799" fill="#ffb9b9"></circle><polygon points="518.721 250.415 481.406 269.799 473.652 234.907 499.336 218.915 518.721 250.415" fill="#ffb9b9"></polygon><path d="M799.7892,439.76224c-37.23393-11.24605-71.01788-17.07317-95.46758-8.23832,8.42738-23.70818-7.12737-59.91146-24.23035-96.9214,7.37949-9.64677,19.14576-13.38347,32.46867-15.02282,14.5769,10.5844,24.74122,3.79091,32.46867-12.59978,16.85358-.67652,33.095,5.29186,48.94531,15.50743C781.58355,362.17339,783.814,401.25293,799.7892,439.76224Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><path d="M703.837,437.33921c-5.87952,3.4656-11.3058,9.30325-16.47664,16.47664-8.73817-5.349-16.42816-11.439-22.48592-18.68294a40.01122,40.01122,0,0,1-7.33032-37.42892l16.56053-53.82173a23.60967,23.60967,0,0,1,7.67755-11.38054l2.18592-1.776,21.80731,41.19159-21.80731,40.707C686.73356,420.03892,694.88267,428.6031,703.837,437.33921Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><path d="M711.343,478.37478h0a14.00455,14.00455,0,0,1-19.66674-10.71872L688.072,442.98155l12.59979-6.7845,15.9909,20.93355A14.00455,14.00455,0,0,1,711.343,478.37478Z" transform="translate(-236 -72.55738)" fill="#ffb9b9"></path><path d="M739.94024,283.50047l-4.63369.13763-12.853-18.20724c-16.46951,1.70257-29.96494,8.858-41.38524,19.81828l-1.15795-7.71966a29.10153,29.10153,0,0,1,22.90286-32.81892h.00006a29.10153,29.10153,0,0,1,34.57213,23.6573Z" transform="translate(-236 -72.55738)" fill="#2f2e41"></path><path d="M687.82806,453.82563v0a14.00456,14.00456,0,0,1,10.71872-19.66675l24.67452-3.60414,6.7845,12.59978L709.07224,459.1454A14.00455,14.00455,0,0,1,687.82806,453.82563Z" transform="translate(-236 -72.55738)" fill="#ffb9b9"></path><path d="M804.49034,431.38118c-23.4754,1.82279-49.10633,9.14326-75.93837,19.527a37.12074,37.12074,0,0,0-8.23832-21.80731c24.37008-6.41874,46.48406-13.95144,60.09127-25.68417L772.1666,341.387l17.93046-20.35349,3.09274,1.6136a20.65228,20.65228,0,0,1,10.4691,13.14326c7.57071,29.449,10.93351,57.66486,8.62195,84.21782A10.47079,10.47079,0,0,1,804.49034,431.38118Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><path d="M331.88594,800.6692q-32.74851,20.483-65.49722-.01716a4.441,4.441,0,0,1-2.10125-4.0963l6.81241-88.56136h55.10049l7.78288,88.5302A4.44,4.44,0,0,1,331.88594,800.6692Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><ellipse cx="62.39599" cy="636.43883" rx="27.80438" ry="10.01827" fill="#3f3d56"></ellipse><path d="M320.18941,705.61437q-21.73251,15.28772-42.07674,0V689.58514h42.07674Z" transform="translate(-236 -72.55738)" fill="#6c63ff"></path><ellipse cx="63.15104" cy="617.02776" rx="21.03837" ry="8.01462" fill="#6c63ff"></ellipse><ellipse cx="64.15287" cy="616.02594" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="73.61397" cy="616.02594" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="68.88342" cy="618.39121" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="49.96121" cy="618.39121" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="54.69176" cy="616.02594" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="59.42232" cy="619.57385" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><path d="M936.88594,800.6692q-32.74851,20.483-65.49722-.01716a4.441,4.441,0,0,1-2.10125-4.0963l6.81241-88.56136h55.10049l7.78288,88.5302A4.44,4.44,0,0,1,936.88594,800.6692Z" transform="translate(-236 -72.55738)" fill="#3f3d56"></path><ellipse cx="667.39599" cy="636.43883" rx="27.80438" ry="10.01827" fill="#3f3d56"></ellipse><path d="M925.18941,705.61437q-21.73251,15.28772-42.07674,0V689.58514h42.07674Z" transform="translate(-236 -72.55738)" fill="#6c63ff"></path><ellipse cx="668.15104" cy="617.02776" rx="21.03837" ry="8.01462" fill="#6c63ff"></ellipse><ellipse cx="669.15287" cy="616.02594" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="678.61397" cy="616.02594" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="673.88342" cy="618.39121" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="654.96121" cy="618.39121" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="659.69176" cy="616.02594" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse><ellipse cx="664.42232" cy="619.57385" rx="2.00365" ry="1.00183" fill="#e6e6e6"></ellipse></svg>`;
        //document.getElementById("res").innerHTML = svg + "<p class='m-auto' style='margin: auto;'>Nessun risultato :(</p>"
        //document.getElementById("res").insertAdjacentHTML('beforeend', svg);
    } else {
        document.getElementById("nothing").classList.add("hidden");
        document.getElementById("res").classList.remove("hidden");
        if ('content' in document.createElement('template')) {
            const results = document.querySelector("#results");
            results.innerHTML = ''
            res.data.forEach(recipe => {
                results.appendChild(renderSidebar(recipe.title, recipe.image_url, recipe.publisher, recipe.id));
                document.querySelector(`#results li[data-id='${recipe.id}']`).addEventListener("click", getContent);
            })

            console.log("prev page data:", document.querySelector('#recipe__btn-prev').getAttribute('data-page'))
            console.log("prev page from api:", res.pre_page)

            console.log("next page data:", document.querySelector('#recipe__btn-next').getAttribute('data-page'))
            console.log("next page from api:", res.next_page)

            //pagination

            if (res.pre_page) {
                document.querySelector('.recipe__btn.prev').classList.remove("hidden")
            }

            if (!res.next_page) {
                document.querySelector('.recipe__btn.next').classList.add("hidden")
            }


            document.querySelector('#recipe__btn-prev').setAttribute('data-query', s)
            document.querySelector('#recipe__btn-prev').setAttribute('data-page', res.pre_page)
            document.querySelector('#recipe__btn-next').setAttribute('data-page', res.next_page)
            document.querySelector('#recipe__btn-next').setAttribute('data-query', s)

            //document.querySelector("#results li").addEventListener("click", getContent);
            return;
        } else {
            console.error("template feature not supported!.");
            alert("template feature not supported!.");
        }
    }


    //const text = res.data.recipes.map(x => { }).join("");
    //resultside.innerHTML = text
}
search.addEventListener("submit", getSearchValue);
//document.querySelector('.recipe__btn-next').addEventListener("click", function (event) { getSearchValue(event, document.getElementById('search-value').value) });
document.querySelector('.recipe__btn').addEventListener("click", getSearchValue);
searchBtnm.addEventListener("click", setSearchVisible);

async function getContent(event) {
    event.preventDefault()

    let id = event.currentTarget.getAttribute('data-id')

    let res = await getRecipe(id);

    document.getElementById("nothing").classList.add("hidden");
    document.getElementById("res").classList.remove("hidden");

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

async function setBookmark(e) {
    e.preventDefault();

    let id = e.currentTarget.getAttribute('data-id')
    e.currentTarget.querySelector(`svg > use`).setAttribute("href", "/src/assets/icons.svg#icon-bookmark-fill");
    let res = await getRecipe(id);

    const obj = { id: res.data.recipe.id, title: res.data.recipe.title, image_url: res.data.recipe.image_url, publisher: res.data.recipe.publisher };

    toLocalStorage('data', obj)



}

function bookmarkSidebar() {
    document.querySelector('#bookmark').classList.contains('hidden') ? document.querySelector('#bookmark').classList.remove("hidden") : document.querySelector('#bookmark').classList.add("hidden")

    if (!bookmark.classList.contains('hidden')) {
        const bookmarks = fromLocalStorage('data')

        if (bookmarks) {

            const bookmarkItem = document.querySelector("#bookmarkItem");

            bookmarkItem.innerHTML = ''
            bookmarks.forEach(bookmark => {
                bookmarkItem.appendChild(renderSidebar(bookmark.title, bookmark.image_url, bookmark.publisher, bookmark.id));
                document.querySelector(`#bookmarkItem li[data-id='${bookmark.id}']`).addEventListener("click", getContent);
            })
        } else {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" id="currentIllo" data-name="Layer 1" width="655.04715" height="473.4057" viewBox="0 0 655.04715 473.4057" class="w-full h-full	p-4 mx-auto injected-svg DownloadModal__ImageFile-sc-p17csy-5 iIfSkb grid_media" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M787.31056,255.89377c-1.65466-12.13655-3.72987-25.16694-12.28987-33.92808a28.78566,28.78566,0,0,0-41.59054.43047c-6.23108,6.64735-8.98285,15.98128-9.23469,25.089s1.77661,18.11434,4.02681,26.94334a83.04327,83.04327,0,0,0,34.65826-6.82181,55.84219,55.84219,0,0,1,8.30984-3.26239c2.88751-.73493,4.94581,1.11445,7.63182,2.404l1.47445-2.82319c1.207,2.24618,4.94435,1.58037,6.3-.57936C787.95205,261.18611,787.65511,258.42024,787.31056,255.89377Z" transform="translate(-272.47643 -213.29715)" fill="#2f2e41"></path><path d="M737.57332,307.13788l3.44812-17.61353L715.1681,278.3319l-46.21928-22.143a10.27075,10.27075,0,1,0-7.44548,11.5L705.511,294.84741Z" transform="translate(-272.47643 -213.29715)" fill="#ffb8b8"></path><path d="M720.21831,304.15781l18.725-19.1418.37023.11261c.23288.07053,23.49781,7.16307,38.32927,14.37044a12.63351,12.63351,0,0,1,6.96921,8.03865,13.2503,13.2503,0,0,1-4.15554,13.92014,14.17281,14.17281,0,0,1-15.15882,2.41334Z" transform="translate(-272.47643 -213.29715)" fill="#6c63ff"></path><polygon points="447.684 175.017 500.338 189.087 510.971 139.346 462.642 124.387 447.684 175.017" fill="#ffb8b8"></polygon><path d="M778.708,374.81334l-51.4362-11.82883L717.42211,339.112a18.26275,18.26275,0,0,1,6.58613-18.61415l18.79293-15.86613,10.07455-12.86951-1.09686-6.82015a5.9078,5.9078,0,0,1,3.93786-6.4325l13.42683-4.815a6.2481,6.2481,0,0,1,7.88115,3.27734l1.42276,3.29287s6.07151,2.85713,9.4948,4.46428a13.74125,13.74125,0,0,1,7.43067,8.41824,69.65979,69.65979,0,0,1-3.9496,51.1518Z" transform="translate(-272.47643 -213.29715)" fill="#6c63ff"></path><path d="M321.26739,628.22726l-24.86987-6.655a83.06563,83.06563,0,0,1-1.23506-39.94776c10.85,21.44784,39.98979,25.4917,57.25227,42.21709A49.96443,49.96443,0,0,1,367.073,664.59315l5.95764,17.2599a83.72444,83.72444,0,0,1-62.45381-31.84171,80.8743,80.8743,0,0,1-10.28587-17.488C310.69751,630.99881,321.26739,628.22726,321.26739,628.22726Z" transform="translate(-272.47643 -213.29715)" fill="#f2f2f2"></path><path d="M630.24665,686.70285H386.48931a24.668,24.668,0,0,1-24.63995-24.64012V339.30027a24.668,24.668,0,0,1,24.64-24.64012H630.24665a24.668,24.668,0,0,1,24.64013,24.64012V662.06273A24.668,24.668,0,0,1,630.24665,686.70285Z" transform="translate(-272.47643 -213.29715)" fill="#e6e6e6"></path><path d="M537.21155,666.72452h-133.588a22.46122,22.46122,0,0,1-22.43542-22.436V357.0741a22.46075,22.46075,0,0,1,22.43542-22.43541h209.4887a22.46075,22.46075,0,0,1,22.43542,22.43541V568.38842A98.44763,98.44763,0,0,1,537.21155,666.72452Z" transform="translate(-272.47643 -213.29715)" fill="#fff"></path><path d="M592.21441,389.77863H424.52152a5.469,5.469,0,1,1-.01368-10.938H592.21441a5.469,5.469,0,0,1,.01368,10.938Z" transform="translate(-272.47643 -213.29715)" fill="#6c63ff"></path><path d="M592.21441,411.38946H424.52152a5.46929,5.46929,0,0,1,0-10.93858H592.21441a5.46929,5.46929,0,0,1,0,10.93858Z" transform="translate(-272.47643 -213.29715)" fill="#6c63ff"></path><path d="M497.21233,433.00029H424.52149a5.46929,5.46929,0,1,1,0-10.93858h72.69084a5.46929,5.46929,0,0,1,0,10.93858Z" transform="translate(-272.47643 -213.29715)" fill="#6c63ff"></path><path d="M592.21441,478.26142H424.52152a5.469,5.469,0,1,1-.01368-10.938H592.21441a5.469,5.469,0,0,1,.01368,10.938Z" transform="translate(-272.47643 -213.29715)" fill="#e4e4e4"></path><path d="M592.21441,499.87225H424.52152a5.46929,5.46929,0,0,1,0-10.93858H592.21441a5.46929,5.46929,0,0,1,0,10.93858Z" transform="translate(-272.47643 -213.29715)" fill="#e4e4e4"></path><path d="M497.21233,521.483H424.52149a5.46929,5.46929,0,1,1,0-10.93858h72.69084a5.46929,5.46929,0,1,1,0,10.93858Z" transform="translate(-272.47643 -213.29715)" fill="#e4e4e4"></path><path d="M592.21441,566.74414H424.52152a5.469,5.469,0,1,1-.01368-10.938H592.21441a5.469,5.469,0,0,1,.01368,10.938Z" transform="translate(-272.47643 -213.29715)" fill="#e4e4e4"></path><path d="M592.21441,588.355H424.52152a5.46929,5.46929,0,0,1,0-10.93858H592.21441a5.46929,5.46929,0,0,1,0,10.93858Z" transform="translate(-272.47643 -213.29715)" fill="#e4e4e4"></path><path d="M497.21233,609.9658H424.52149a5.4693,5.4693,0,0,1,0-10.93858h72.69084a5.4693,5.4693,0,0,1,0,10.93858Z" transform="translate(-272.47643 -213.29715)" fill="#e4e4e4"></path><circle cx="370.37338" cy="107.64026" r="71.09969" fill="#6c63ff"></circle><path d="M642.84977,382.18768A71.09,71.09,0,0,1,571.945,316.09274c-.11525,1.65523-.19489,3.32029-.19489,5.00488a71.09968,71.09968,0,0,0,142.19935,0c0-1.68459-.07964-3.34965-.19489-5.00488A71.09005,71.09005,0,0,1,642.84977,382.18768Z" transform="translate(-272.47643 -213.29715)" fill="#231f20" opacity="0.16"></path><path d="M642.85,355.6823a8.91461,8.91461,0,0,1-8.9043-8.9043V295.257a8.90406,8.90406,0,1,1,17.80811,0v51.521A8.9142,8.9142,0,0,1,642.85,355.6823Z" transform="translate(-272.47643 -213.29715)" fill="#fff"></path><path d="M608.185,321.01775a8.91461,8.91461,0,0,1,8.90429-8.9043h51.521a8.90406,8.90406,0,1,1,0,17.80811h-51.521A8.91419,8.91419,0,0,1,608.185,321.01775Z" transform="translate(-272.47643 -213.29715)" fill="#fff"></path><path d="M749.73026,336.12525l-15.12956-9.65517-19.87785,19.9634-37.52231,34.90863a10.27075,10.27075,0,1,0,7.97721,11.13774L726.55817,361.465Z" transform="translate(-272.47643 -213.29715)" fill="#ffb8b8"></path><path d="M740.60549,351.18538,729.6448,326.75426l.24-.30343c.151-.19052,15.2663-19.24629,27.40134-30.41072a12.63381,12.63381,0,0,1,10.03145-3.54358,13.25745,13.25745,0,0,1,11.43348,8.9617,14.1712,14.1712,0,0,1-3.30149,14.98926Z" transform="translate(-272.47643 -213.29715)" fill="#6c63ff"></path><circle cx="478.03159" cy="33.80024" r="23.78567" fill="#ffb8b8"></circle><polygon points="441.077 456.369 431.244 456.369 426.564 418.442 441.077 418.442 441.077 456.369" fill="#ffb8b8"></polygon><path d="M718.74308,686.70285h-7.05162l-1.25869-6.65757-3.22367,6.65757H688.50652a4.20417,4.20417,0,0,1-2.389-7.66381l14.93533-10.31487V661.9936l15.70936.93763Z" transform="translate(-272.47643 -213.29715)" fill="#2f2e41"></path><polygon points="564.317 448.015 555.181 451.652 536.806 418.145 550.29 412.777 564.317 448.015" fill="#ffb8b8"></polygon><path d="M847.91639,675.22176l-6.55162,2.608-3.63169-5.72-.53284,7.37776-17.37645,6.917a4.20417,4.20417,0,0,1-5.054-6.23686l10.06143-15.10722-2.48926-6.25334,14.94226-4.93885Z" transform="translate(-272.47643 -213.29715)" fill="#2f2e41"></path><path d="M717.34637,652.24291H697.00672l5.62123-95.55913-4.10943-64.77159.00864-.05188L713.85358,399.013a39.21218,39.21218,0,0,1,9.39572-19.69433l.18658-.21025,51.29147,12.66779,5.15705,11.759c17.60912,10.47337,23.17029,69.53271,23.39874,72.04843l7.45523,73.62394,18.23624,90.2337-12.84255,6.91459-.2148-.42778-40.54277-80.61954-25.6041-85.0184-16.39677,76.51829Z" transform="translate(-272.47643 -213.29715)" fill="#2f2e41"></path><path d="M779.96517,248.21676c-.84171-5.52877-1.7208-11.10385-3.69814-16.30974s-5.16459-10.082-9.73665-13.03107c-7.23909-4.66912-16.61147-3.76861-24.72769-1.08281-6.27661,2.07709-12.40368,5.23408-16.82988,10.30946-4.42645,5.07543-6.91245,12.31749-5.26594,18.95377q12.98639-3.06819,25.97253-6.13643l-.94771.66968A20.91064,20.91064,0,0,1,755.89151,256.134a21.66552,21.66552,0,0,1-4.57058,17.99384q8.85671-3.14187,17.71341-6.28364c3.64451-1.29283,7.54507-2.78248,9.70615-6.09858C781.24617,257.90093,780.664,252.805,779.96517,248.21676Z" transform="translate(-272.47643 -213.29715)" fill="#2f2e41"></path><path id="fd990326-c176-439f-9263-07fe4201e145-39" data-name="Path 2960" d="M273.72343,686.47368h652.5532a1.247,1.247,0,0,0,0-2.494H273.72343a1.247,1.247,0,0,0,0,2.494Z" transform="translate(-272.47643 -213.29715)" fill="#ccc"></path></svg>`;
            bookmarkItem.innerHTML = svg + "<br><p class='text-center'>Aggiungi una ricetta tra i preferiti!</p>"
        }

    }
}
bookmarkBtn.addEventListener("click", bookmarkSidebar);
bookmarkBtnm.addEventListener("click", bookmarkSidebar);
