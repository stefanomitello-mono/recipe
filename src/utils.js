
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


export const dectofraction = (decimal) => {
    let gcd = function (a, b) {
        if (b < 0.0000001) return a;                // Since there is a limited precision we need to limit the value.

        return gcd(b, Math.floor(a % b));           // Discard any fractions due to limitations in precision.
    };

    let fraction = decimal;
    let len = fraction.toString().length - 2;

    let denominator = Math.pow(10, len);
    let numerator = fraction * denominator;

    let divisor = gcd(numerator, denominator);    // Should be 5

    numerator /= divisor;                         // Should be 687
    denominator /= divisor;                       // Should be 2000

    return Math.floor(numerator) + '/' + Math.floor(denominator);
}