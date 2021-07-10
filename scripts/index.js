const main = document.querySelector('.main');
const address = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/teddies/'
    : 'https://melch-so-pekocko.herokuapp.com/api/teddies/';

updateNumberOfItems();
getItems()
    .then(items => {

        container = document.createElement('section');
        container.classList.add("main__cardContainer");
        main.appendChild(container);

        title = document.createElement('h2');
        title.classList.add("main__title");
        title.innerHTML = "Tous nos Nounours";
        container.appendChild(title);


        items.forEach(item => {
            displayItem(item, container);
        });
        setTimeout(() => {
            deleteLoader();
        }, 500);
    })
    .catch(err => {
        errorMessage();
        deleteLoader();
    })

