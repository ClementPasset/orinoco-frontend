const main = document.querySelector('.main');

/** Met à jour le nombre d'articles du panier dans le menu de navigation */
const updateNumberOfItems = () => {
    let htmlNumber = document.querySelector('#items-in-cart');
    let quantity = 0;
    let cart = getCart();
    if (Object.keys(cart).length !== 0) {
        cart.forEach(elt => {
            quantity += elt.quantity;
        });
    }
    htmlNumber.innerHTML = quantity;
};

/**
 * Renvoie le contenu du panier
 * 
 * @returns {Object}
 */
const getCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart'));
    return cart === null ? [] : cart;
}


updateNumberOfItems();
let cart = getCart();
let order = JSON.parse(localStorage.getItem('order'));

if (cart !== [] && order !== null) {
    let { firstName } = order.contact;
    let { orderId, price } = order;
    main.innerHTML = `
    <section class="order">
        <h2>Merci ${firstName} pour votre commande !</h2>
        <p>Pour rappel, le montant total de votre commande est de ${(price / 100).toFixed(2).replace('.', ',')} €</p>
        <p>Ci-dessous, votre numéro de commande. Veuillez conserver ce numéro pour toute demande relative à votre commande.</p>
        <p class="order__Id">${orderId}</p>
    </section>
        `;
    localStorage.clear();
    updateNumberOfItems();
}