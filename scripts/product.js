const main = document.querySelector('.main');
const address = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/teddies/'
    : 'https://melch-so-pekocko.herokuapp.com/api/teddies/';
const searchParams = new URL(document.URL).searchParams;
let price;
let cart;

updateNumberOfItems();
getItem(getId())
    .then(item => {
        container = document.createElement('section');
        container.classList.add("product");
        main.appendChild(container);
        displayOneItem(item, container);
    })
    .catch(err => {
        errorMessage(err);
    })
