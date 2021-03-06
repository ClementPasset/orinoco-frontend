/** Supprime le loader de la page d'accueil */
const deleteLoader = () => {
    let loader = document.querySelector('.loader');
    loader.remove();
};

/**
 * Appelle l'API en GET et retourne une promesse avec les données
 * 
 * @returns { Promise }
 */
const getItems = () => {
    return new Promise((resolve, reject) => {
        fetch(address)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    });
};

/**
 * Supprime l'élément passé en paramètre du panier
 * 
 * @param {Object} item 
 */
const deleteFromCart = (item) => {
    let { _id, color } = item;
    let cart = getCart();
    for (let i in cart) {
        if (_id === cart[i]._id && color === cart[i].color) {
            cart.splice(i, 1);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayTable();
    displayForm();
    updateNumberOfItems();
};

/**
 * Valide les données du formulaire et envoie la requête POST
 * 
 * @param {Object} e 
 */
let formValidation = (e) => {
    e.preventDefault();
    let cart = getCart();

    let error = document.querySelector('.formError');
    if (error !== null) {
        error.remove();
    }

    let errMsg = {};

    let contact = {
        firstName: document.querySelector('.contactForm__input[name="firstName"]').value,
        lastName: document.querySelector('.contactForm__input[name="lastName"]').value,
        address: document.querySelector('.contactForm__input[name="address"]').value,
        city: document.querySelector('.contactForm__input[name="city"]').value,
        email: document.querySelector('.contactForm__input[name="mail"]').value
    }

    if (contact.firstName === "") {
        errMsg.firstName = "Votre prénom n'est pas renseigné.";
    } else if (!/^[a-zA-Zà-ö]+(-?[a-zA-Zà-ö])*$/.test(contact.firstName)) {
        errMsg.firstName = "Vérifiez votre prénom. Il ne doit pas contenir de chiffres ou de caractères spéciaux";
    }
    if (contact.lastName === "") {
        errMsg.lastName = "Votre nom n'est pas renseigné.";
    } else if (!/^[a-zA-Zà-ö]+(-?[a-zA-Zà-ö])*$/.test(contact.lastName)) {
        errMsg.lastName = "Vérifiez votre nom. Il ne doit pas contenir de chiffres ou de caractères spéciaux";
    }
    if (contact.address === "") {
        errMsg.address = "Votre adresse n'est pas renseignée.";
    }
    if (contact.city === "") {
        errMsg.city = "Votre ville n'est pas renseignée.";
    }
    if (contact.email === "") {
        errMsg.email = "Votre adresse email n'est pas renseignée.";
    } else if (!/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/.test(contact.email)) {
        errMsg.email = "L'adresse mail renseignée n'est pas valide.";
    }

    if (Object.keys(errMsg).length === 0) {
        jsonBody = {
            contact,
            products: cart.map(item => item._id)
        };

        fetch(addressAPI, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonBody)
        })
            .then(res => res.json())
            .then(data => {
                data = {
                    ...data,
                    price: price
                }
                localStorage.setItem('order', JSON.stringify(data));
                window.location.href = "./order.html";
            })
    } else {
        let form = document.querySelector('.contactForm');

        error = document.createElement('section');
        error.classList.add('formError');
        for (msg in errMsg) {
            error.innerHTML += `<p class="formError__text">${errMsg[msg]}</p>`;
        }
        main.insertBefore(error, form);
    }
};

/** Affichage du formulaire */
let displayForm = () => {
    let form = document.createElement('form');
    form.classList.add('contactForm');
    main.appendChild(form);

    let firstNameLabel = document.createElement('label');
    firstNameLabel.setAttribute('for', 'firstName');
    firstNameLabel.innerHTML = 'Votre prénom : ';
    firstNameLabel.classList.add('contactForm__label');
    let firstNameInput = document.createElement('input');
    firstNameInput.setAttribute('id', 'firstName');
    firstNameInput.setAttribute('placeholder', 'Jean');
    firstNameInput.setAttribute('name', 'firstName');
    firstNameInput.setAttribute('type', 'text');
    firstNameInput.setAttribute('required', true);
    firstNameInput.classList.add('contactForm__input');
    form.appendChild(firstNameLabel);
    form.appendChild(firstNameInput);

    let lastNameLabel = document.createElement('label');
    lastNameLabel.setAttribute('for', 'lastName');
    lastNameLabel.innerHTML = 'Votre nom : ';
    lastNameLabel.classList.add('contactForm__label');
    let lastNameInput = document.createElement('input');
    lastNameInput.setAttribute('id', 'lastName');
    lastNameInput.setAttribute('placeholder', 'DUPONT');
    lastNameInput.setAttribute('name', 'lastName');
    lastNameInput.setAttribute('type', 'text');
    lastNameInput.setAttribute('required', true);
    lastNameInput.classList.add('contactForm__input');
    lastNameInput.addEventListener('input', e => {
        lastNameInput.value = e.target.value.toUpperCase();
    })
    form.appendChild(lastNameLabel);
    form.appendChild(lastNameInput);

    let addressLabel = document.createElement('label');
    addressLabel.setAttribute('for', 'address');
    addressLabel.innerHTML = 'Votre adresse : ';
    addressLabel.classList.add('contactForm__label');
    let addressInput = document.createElement('input');
    addressInput.setAttribute('id', 'address');
    addressInput.setAttribute('placeholder', '2 place Sathonay');
    addressInput.setAttribute('name', 'address');
    addressInput.setAttribute('type', 'text');
    addressInput.setAttribute('required', true);
    addressInput.classList.add('contactForm__input');
    form.appendChild(addressLabel);
    form.appendChild(addressInput);

    let cityLabel = document.createElement('label');
    cityLabel.setAttribute('for', 'city');
    cityLabel.innerHTML = 'Votre ville : ';
    cityLabel.classList.add('contactForm__label');
    let cityInput = document.createElement('input');
    cityInput.setAttribute('id', 'city');
    cityInput.setAttribute('placeholder', 'Lyon');
    cityInput.setAttribute('name', 'city');
    cityInput.setAttribute('type', 'text');
    cityInput.setAttribute('required', true);
    cityInput.classList.add('contactForm__input');
    form.appendChild(cityLabel);
    form.appendChild(cityInput);

    let mailLabel = document.createElement('label');
    mailLabel.setAttribute('for', 'mail');
    mailLabel.innerHTML = 'Votre email : ';
    mailLabel.classList.add('contactForm__label');
    let mailInput = document.createElement('input');
    mailInput.setAttribute('id', 'mail');
    mailInput.setAttribute('placeholder', 'jean.dupont@gmail.com');
    mailInput.setAttribute('name', 'mail');
    mailInput.setAttribute('type', 'email');
    mailInput.setAttribute('required', true);
    mailInput.classList.add('contactForm__input');
    form.appendChild(mailLabel);
    form.appendChild(mailInput);

    let button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.innerHTML = 'Valider la commande'
    button.classList.add('contactForm__button');
    button.addEventListener('click', e => {
        formValidation(e);
    });
    form.appendChild(button);
};

/** Affichage du tableau récapitulatif du panier */
let displayTable = () => {
    price = 0;
    main.innerHTML = '';
    cart = getCart();
    let table = document.createElement('table');
    table.classList.add('cartTable');
    let thead = document.createElement('tr');
    thead.classList.add('cartTable__head')
    main.appendChild(table);
    table.appendChild(thead);
    let entetes = ['Nom', 'Couleur', 'Quantité', 'Prix unitaire', 'Total', '<i class="fas fa-trash"></i>'];
    entetes.forEach(col => {
        let newTh = document.createElement('th');
        newTh.innerHTML = col;
        thead.appendChild(newTh);
    });
    thead.lastChild.classList.add('cartTable__emptyCart');
    thead.lastChild.addEventListener('click', emptyCart);
    cart.forEach(item => {
        newRow = document.createElement('tr');
        newRow.classList.add('cartTable__row')
        table.appendChild(newRow);
        price += item.price * item.quantity;
        [`<a href="product.html?id=${item._id}">${item.name}</a>`, item.color, item.quantity, (item.price / 100).toFixed(2).replace('.', ',') + ' €', (item.quantity * item.price / 100).toFixed(2).replace('.', ',') + ' €', '<i class="fas fa-trash"></i>'].forEach(elt => {
            let newCell = document.createElement('td');
            newCell.innerHTML = elt;
            newRow.appendChild(newCell);
        });
        newRow.lastChild.addEventListener('click', (e) => deleteFromCart(item));
    });

    let lastRow = document.createElement('tr');
    lastRow.classList.add('cartTable__footer');
    table.appendChild(lastRow);
    let caption = document.createElement('td');
    caption.innerHTML = "PRIX TOTAL";
    caption.setAttribute('colspan', 3);
    let totalPrice = document.createElement('td');
    totalPrice.innerHTML = (price / 100).toFixed(2).replace('.', ',') + ' €';
    totalPrice.setAttribute('colspan', 3);
    lastRow.appendChild(caption);
    lastRow.appendChild(totalPrice);
};

/** Vide le panier puis recharge la page */
const emptyCart = () => {
    localStorage.removeItem('cart');
    location.reload();
};

/**
 * Retourne le nombre d'articles dans le panier
 * 
 * @returns {Number}
 */
const getNumberOfItems = () => {
    let quantity = 0;
    let cart = getCart();
    if (Object.keys(cart).length !== 0) {
        cart.forEach(elt => {
            quantity += elt.quantity;
        });
    }
    return quantity;
};

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
 * Affiche l'élément passé en paramètre dans le conteneur passé en paramètre
 * 
 * @param {*} item 
 * @param {*} container 
 */
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

/**
 * Récupère le contenu du panier
 * 
 * @returns {Object}
 */
const getCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart'));
    return cart === null ? [] : cart;
}

/** Affiche un message d'erreur sur la page */
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

/** Récupère l'id de l'objet dans les searchParams */
const getId = () => searchParams.get('id');

/**
 * Récupère l'élément dont l'id est passé en paramètre via l'API
 * 
 * @param {Number} id 
 * @returns {Promise}
 */
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

/**
 * Affiche un message de succès sur l'écran
 * 
 * @param {String} text 
 */
const successMessage = (text) => {
    msg = document.createElement('div');
    msg.classList.add('alert', 'alert--success');
    msg.innerHTML = text ? text : 'Opération réalisée avec succès.';
    main.appendChild(msg);
    setTimeout(() => {
        msg.remove()
    }, 2300);
}

/**
 * Met à jour le prix affiché sur la page
 * 
 * @param {Number} quantity 
 */
const updatePrice = (quantity) => {
    let span = document.querySelector('.product__priceText');
    span.innerHTML = (quantity * price / 100).toFixed(2).replace('.', ',');
};

/**
 * Ajoute un élément dans le panier (localStorage)
 * 
 * @param {Object} item 
 */
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

/**
 * Affiche l'élément passé en paramètre dans le conteneur passé en paramètre pour la page produit
 * 
 * @param {Object} item 
 * @param {Object} container 
 */
const displayOneItem = (item, container) => {

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