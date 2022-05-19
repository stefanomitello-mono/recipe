
const apiUrl = 'https://forkify-api.herokuapp.com/api/v2/recipes'
const apiKey = '8d488d17-fae0-474f-a48f-b7eab7d8c578'

export async function searchRecipes(search) {
    try {
        let res = await fetch(`${apiUrl}?search=${search}&key=${apiKey}`);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}


export async function getRecipe(id) {
    let data = await fetch(`${apiUrl}/${id}`)
        .then((response) => response.json())
        .then(json => { return json })
        .catch(err => { console.error(err) });

    return data;
}


export const truncate = (input) => input.length > 10 ? `${input.substring(0, 10)}...` : input;

