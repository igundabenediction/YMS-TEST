/* ============================================================
   YMS STORE — PANIER
   Gestion complète du panier avec localStorage
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const CART_KEY = "ymsCart";

    // ---------------------------------------------------------
    // Récupérer le panier
    // ---------------------------------------------------------
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (error) {
            console.error("Erreur panier :", error);
            return [];
        }
    }

    // ---------------------------------------------------------
    // Sauvegarder le panier
    // ---------------------------------------------------------
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    // ---------------------------------------------------------
    // Compter les articles
    // ---------------------------------------------------------
    function updateCartCount() {

        const cart = getCart();

        const total = cart.reduce((sum, item) => {
            return sum + Number(item.quantity || 0);
        }, 0);

        const counters = document.querySelectorAll("#cartCount");

        counters.forEach(counter => {
            counter.textContent = total;
        });
    }

    // ---------------------------------------------------------
    // Ajouter au panier
    // ---------------------------------------------------------
    function addToCart(product) {

        const cart = getCart();

        const existingProduct = cart.find(
            item => item.id === product.id
        );

        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({
                ...product,
                quantity: 1
            });

        }

        saveCart(cart);

        showCartMessage(
            `${product.name} a été ajouté au panier.`
        );
    }

    // ---------------------------------------------------------
    // Supprimer un produit
    // ---------------------------------------------------------
    function removeFromCart(id) {

        let cart = getCart();

        cart = cart.filter(item => item.id !== id);

        saveCart(cart);
    }

    // ---------------------------------------------------------
    // Modifier quantité
    // ---------------------------------------------------------
    function changeQuantity(id, change) {

        const cart = getCart();

        const product = cart.find(item => item.id === id);

        if (!product) return;

        product.quantity += change;

        if (product.quantity <= 0) {
            removeFromCart(id);
            return;
        }

        saveCart(cart);
    }

    // ---------------------------------------------------------
    // Total panier
    // ---------------------------------------------------------
    function getCartTotal() {

        const cart = getCart();

        return cart.reduce((total, item) => {

            return total +
                Number(item.price) *
                Number(item.quantity);

        }, 0);
    }

    // ---------------------------------------------------------
    // Afficher le panier
    // ---------------------------------------------------------
    function renderCart() {

        const cartContainer =
            document.querySelector("#cartItems");

        const totalElement =
            document.querySelector("#cartTotal");

        if (!cartContainer) return;

        const cart = getCart();

        if (cart.length === 0) {

            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-cart-shopping"></i>

                    <h3>Votre panier est vide</h3>

                    <p>
                        Ajoutez des produits pour commencer vos achats.
                    </p>
                </div>
            `;

            if (totalElement) {
                totalElement.textContent = "0$";
            }

            return;
        }

        cartContainer.innerHTML = cart.map(item => {

            const subtotal =
                Number(item.price) *
                Number(item.quantity);

            return `
                <div class="cart-item">

                    <div class="cart-item-image">
                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >
                    </div>

                    <div class="cart-item-info">

                        <h4>${item.name}</h4>

                        <span class="cart-item-price">
                            ${item.price}$
                        </span>

                        <div class="cart-quantity">

                            <button
                                class="quantity-btn"
                                data-action="minus"
                                data-id="${item.id}"
                            >
                                -
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                class="quantity-btn"
                                data-action="plus"
                                data-id="${item.id}"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <div class="cart-item-right">

                        <strong>
                            ${subtotal.toFixed(2)}$
                        </strong>

                        <button
                            class="remove-cart"
                            data-id="${item.id}"
                            title="Supprimer"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>
            `;

        }).join("");

        if (totalElement) {
            totalElement.textContent =
                `${getCartTotal().toFixed(2)}$`;
        }
    }

    // ---------------------------------------------------------
    // Notification
    // ---------------------------------------------------------
    function showCartMessage(message) {

        let notification =
            document.querySelector(".cart-notification");

        if (!notification) {

            notification =
                document.createElement("div");

            notification.className =
                "cart-notification";

            document.body.appendChild(notification);
        }

        notification.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span>${message}</span>
        `;

        notification.classList.add("show");

        setTimeout(() => {

            notification.classList.remove("show");

        }, 2500);
    }

    // ---------------------------------------------------------
    // Détecter les boutons Ajouter au panier
    // ---------------------------------------------------------
    const addButtons =
        document.querySelectorAll(".add-cart");

    addButtons.forEach((button, index) => {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const card =
                button.closest(".product-card");

            if (!card) return;

            const name =
                card.querySelector(".product-info h3")
                    ?.textContent
                    .trim();

            const priceElement =
                card.querySelector(".current-price");

            const imageElement =
                card.querySelector(".product-image img");

            if (!name || !priceElement || !imageElement) {
                console.error(
                    "Produit incomplet :",
                    card
                );
                return;
            }

            const price =
                parseFloat(
                    priceElement.textContent
                        .replace("$", "")
                        .replace(",", ".")
                        .trim()
                );

            const image =
                imageElement.getAttribute("src");

            const product = {

                id: createProductId(
                    name,
                    index
                ),

                name: name,

                price: price,

                image: image

            };

            addToCart(product);

        });

    });

    // ---------------------------------------------------------
    // ID produit
    // ---------------------------------------------------------
    function createProductId(name, index) {

        return (
            name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
            + "-" +
            index
        );
    }

    // ---------------------------------------------------------
    // Bouton panier
    // ---------------------------------------------------------
    const openCart =
        document.querySelector("#openCart");

    if (openCart) {

        openCart.addEventListener("click", event => {

            event.preventDefault();

            openCartPanel();

        });

    }

    // ---------------------------------------------------------
    // Ouvrir le panier
    // ---------------------------------------------------------
    function openCartPanel() {

        const cartPanel =
            document.querySelector("#cartPanel");

        if (!cartPanel) {
            console.warn(
                "Le panneau #cartPanel n'existe pas encore."
            );
            return;
        }

        cartPanel.classList.add("active");

        renderCart();
    }

    // ---------------------------------------------------------
    // Fermer le panier
    // ---------------------------------------------------------
    document.addEventListener("click", event => {

        const closeButton =
            event.target.closest("#closeCart");

        if (closeButton) {

            const panel =
                document.querySelector("#cartPanel");

            if (panel) {
                panel.classList.remove("active");
            }

        }

    });

    // ---------------------------------------------------------
    // Actions quantité / suppression
    // ---------------------------------------------------------
    document.addEventListener("click", event => {

        const quantityButton =
            event.target.closest(".quantity-btn");

        if (quantityButton) {

            const id =
                quantityButton.dataset.id;

            const action =
                quantityButton.dataset.action;

            changeQuantity(
                id,
                action === "plus" ? 1 : -1
            );

            return;
        }

        const removeButton =
            event.target.closest(".remove-cart");

        if (removeButton) {

            const id =
                removeButton.dataset.id;

            removeFromCart(id);

        }

    });

    // ---------------------------------------------------------
    // Initialisation
    // ---------------------------------------------------------
    updateCartCount();
    renderCart();

});