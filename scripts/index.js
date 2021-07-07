const main = document.querySelector('.main');
const address = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/teddies/'
    : 'https://melch-so-pekocko.herokuapp.com/api/teddies/';

//Supprime le loader sur la page index
const deleteLoader = () => {
    let loader = document.querySelector('.loader');
    loader.remove();
};

//Récupère les éléments en appelant l'API et retourne une Promise
const getItems = () => {
    return new Promise((resolve, reject) => {
        fetch(address)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    });
};

//Met à jour le nombre d'articles du panier (dans la menu de navigation)
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

//Affiche une élément dans le container passé en paramètre
const displayItem = (item, container) => {
    newCard = document.createElement('article');
    newCard.classList.add('card');

    newImg = document.createElement('img');
    newImg.classList.add('card__img');
    newImg.setAttribute('src', item.imageUrl);
    newImg.setAttribute('alt', 'Photo de ' + item.name);
    newCard.appendChild(newImg);

    newTitle = document.createElement('h3');
    newTitle.classList.add('card__title');
    newTitle.innerHTML = item.name + ' - ' + (item.price / 100).toFixed(2).replace('.', ',') + ' €';
    newCard.appendChild(newTitle);

    newDescription = document.createElement('p');
    newDescription.classList.add('card__description');
    newDescription.innerHTML = item.description;
    newCard.appendChild(newDescription);

    newLink = document.createElement('a');
    newLink.setAttribute('href', 'product.html?id=' + item._id);
    newCard.appendChild(newLink);

    newButton = document.createElement('button');
    newButton.classList.add('button');
    newButton.innerHTML = 'Voir +';
    newLink.appendChild(newButton);

    container.appendChild(newCard);
};

//Renvoi le contenu du panier
const getCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart'));
    return cart === null ? [] : cart;
}

//Affichage d'un message d'erreur sur la page
const errorMessage = () => {
    errorTitle = document.createElement('h2');
    errorTitle.innerHTML = 'Une erreur est survenue.';
    errorTitle.classList.add('errorTitle');
    errorText = document.createElement('p');
    errorText.innerHTML = 'Il y a eu un problème de communication avec le serveur.<br>Merci de réessayer plus tard.';
    errorText.classList.add('errorText');
    main.appendChild(errorTitle);
    main.appendChild(errorText);
};


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

