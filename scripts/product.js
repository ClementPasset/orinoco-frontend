const main = document.querySelector('.main');
const address = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/teddies/'
    : 'https://melch-so-pekocko.herokuapp.com/api/teddies/';
const searchParams = new URL(document.URL).searchParams;
let price;
let cart;

//Récupère l'id dans les paramètres get de l'URL
const getId = () => searchParams.get('id');

//Récupère un item via l'API en passant l'Id récupéré
const getItem = (id) => {
    return new Promise((resolve, reject) => {
        fetch(address + id)
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data).length === 0) throw "L'id du produit n'est pas dans notre base de données.";
                resolve(data);
            })
            .catch(err => reject(err))
    });
}

//affichage d'un message de succès pour l'ajout au panier
const successMessage = (text) => {
    msg = document.createElement('div');
    msg.classList.add('alert', 'alert--success');
    msg.innerHTML = text ? text : 'Opération réalisée avec succès.';
    main.appendChild(msg);
    setTimeout(() => {
        msg.remove()
    }, 2300);
}

//Affichage d'un message d'erreur
const errorMessage = (err) => {
    errorTitle = document.createElement('h2');
    errorTitle.innerHTML = 'Une erreur est survenue.';
    errorTitle.classList.add('errorTitle');
    errorText = document.createElement('p');
    errorText.innerHTML = err ? err : 'Il y a eu un problème de communication avec le serveur.<br>Merci de réessayer plus tard.';
    errorText.classList.add('errorText');
    main.appendChild(errorTitle);
    main.appendChild(errorText);
};

//Met à jour le prix affiché sur la page
const updatePrice = (quantity) => {
    let span = document.querySelector('.product__priceText');
    span.innerHTML = (quantity * price / 100).toFixed(2).replace('.', ',');
};

//Affiche les éléments passés en paramètre dans le conteneur fourni en second paramètre
const displayItem = (item, container) => {

    newImg = document.createElement('img');
    newImg.classList.add('product__img');
    newImg.setAttribute('src', item.imageUrl);
    newImg.setAttribute('alt', 'Photo de ' + item.name);
    container.appendChild(newImg);

    newTitle = document.createElement('h2');
    newTitle.classList.add('product__title');
    newTitle.innerHTML = item.name;
    container.appendChild(newTitle);

    newDescription = document.createElement('p');
    newDescription.classList.add('product__description');
    newDescription.innerHTML = item.description;
    container.appendChild(newDescription);

    newSelect = document.createElement('select');
    newSelect.classList.add('product__options');
    newSelect.id = 'productOption';
    container.appendChild(newSelect);

    item.colors.forEach(color => {
        newOption = document.createElement('option');
        newOption.innerHTML = color;
        newSelect.appendChild(newOption);
    });

    qtSelect = document.createElement('select');
    qtSelect.classList.add('product__quantity')
    qtSelect.id = 'quantity';
    container.appendChild(qtSelect);
    qtLabel = document.createElement('label');
    qtLabel.setAttribute('for', 'quantity');
    qtLabel.classList.add('product__quantityLabel');
    qtLabel.innerHTML = 'Quantité : ';
    qtSelect.addEventListener('change', e => {
        updatePrice(e.target.value);
    })
    container.appendChild(qtLabel);

    for (let i = 1; i <= 10; i++) {
        newOpt = document.createElement('option');
        newOpt.setAttribute('value', i);
        newOpt.innerHTML = i;
        qtSelect.appendChild(newOpt);
    }

    price = item.price;
    newPrice = document.createElement('p');
    newPrice.classList.add('product__price');
    newPrice.innerHTML = 'Prix total : <span class="product__priceText">' + (item.price / 100).toFixed(2).replace('.', ',') + '</span> €';
    container.appendChild(newPrice);

    newButton = document.createElement('button');
    newButton.classList.add('button', 'product__btn');
    newButton.innerHTML = 'Ajouter au panier<i class="fas fa-shopping-cart"></i>';
    container.appendChild(newButton);

    newButton.addEventListener('click', e => {
        addToCart(item);
    })
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

//Ajout d'un objet au panier (localStorage)
const addToCart = (item) => {
    let cart = getCart();
    let quantityInput = document.querySelector('#quantity');
    let optionInput = document.querySelector('#productOption');
    let newItem = {
        _id: item._id,
        name: item.name,
        color: productOption.value,
        quantity: parseInt(quantityInput.value),
        price: item.price
    }

    /*Si le panier est vide on ajoute l'objet, sinon on vérifie si l'objet (avec l'option) est déjà dans le panier et
    on augmente juste la quantité si c'est le cas sinon on l'ajoute*/
    if (Object.keys(cart).length === 0) {
        cart.push(newItem);
    } else {
        itemFound = false;
        cart.forEach(elt => {
            if (elt._id === newItem._id && elt.color === newItem.color) {
                elt.quantity += parseInt(newItem.quantity);
                itemFound = true;
            }
        })
        if (!itemFound) {
            cart.push(newItem);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateNumberOfItems();
    successMessage("Le produit a bien été ajouté au panier");
};

//Récupération des éléments déjà dans le panier
const getCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart'));
    return cart === null ? [] : cart;
}


updateNumberOfItems();
getItem(getId())
    .then(item => {
        container = document.createElement('section');
        container.classList.add("product");
        main.appendChild(container);
        displayItem(item, container);
    })
    .catch(err => {
        errorMessage(err);
    })
