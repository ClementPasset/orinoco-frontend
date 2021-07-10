const main = document.querySelector('.main');
const addressAPI = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/teddies/order'
    : 'https://melch-so-pekocko.herokuapp.com/api/teddies/order';
let price;

updateNumberOfItems();

if (getNumberOfItems() === 0) {
    errorTitle = document.createElement('h2');
    errorTitle.innerHTML = 'Votre panier est vide';
    errorTitle.classList.add('errorTitle');
    errorText = document.createElement('p');
    errorText.innerHTML = "Vous n'avez aucun objet dans votre panier.<br> Continuez vos achats et revenez ici pour valider la commande.";
    errorText.classList.add('errorText');
    main.appendChild(errorTitle);
    main.appendChild(errorText);
} else {
    displayTable();
    displayForm();
}