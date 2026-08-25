
/* =========================================================
   YMS STORE — NOUVEAUTÉS
   Fichier : nouveautes/nouveautes.js
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURATION
   ========================================================= */

const NOUVEAUTES_CONFIG = {
    whatsapp: "243972215398",
    currency: "$",
    storageCart: "ymsCart",
    storageFavorites: "ymsFavorites"
};

/* =========================================================
   VARIABLES
   ========================================================= */

let products = [];
let filteredProducts = [];

let currentProduct = null;


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeProducts();

    initializeSearch();

    initializeSort();

    initializeCartButtons();

    initializeFavorites();

    initializeProductModal();

    initializeMobileMenu();

    updateCartCount();

    renderCart();

});


/* =========================================================
   RÉCUPÉRER LES PRODUITS
   ========================================================= */

function initializeProducts() {

    products = Array.from(
        document.querySelectorAll(".product-card")
    );

    filteredProducts = [...products];

}


/* =========================================================
   RECHERCHE
   ========================================================= */

function initializeSearch() {

    const searchInput =
        document.getElementById("productSearch");

    const searchButton =
        document.getElementById("searchButton");

    if (!searchInput) return;


    function performSearch() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        products.forEach(product => {

            const name =
                product.dataset.name?.toLowerCase() || "";

            const category =
                product.dataset.category?.toLowerCase() || "";

            const text =
                product.textContent.toLowerCase();

            const match =
                !query ||
                name.includes(query) ||
                category.includes(query) ||
                text.includes(query);

            product.dataset.searchMatch =
                match ? "true" : "false";

        });

        applyFilters();

    }


    searchInput.addEventListener(
        "input",
        performSearch
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                performSearch();
            }

        }
    );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            performSearch
        );

    }

}


/* =========================================================
   TRI DES PRODUITS
   ========================================================= */

function initializeSort() {

    const sortSelect =
        document.getElementById("sortProducts");

    if (!sortSelect) return;


    sortSelect.addEventListener(
        "change",
        () => {

            const value =
                sortSelect.value;

            const grid =
                document.getElementById("productsGrid");

            if (!grid) return;


            const sorted =
                [...products].sort(
                    (a, b) => {

                        const priceA =
                            parseFloat(
                                a.dataset.price || 0
                            );

                        const priceB =
                            parseFloat(
                                b.dataset.price || 0
                            );

                        const nameA =
                            a.dataset.name || "";

                        const nameB =
                            b.dataset.name || "";


                        if (value === "price-low") {
                            return priceA - priceB;
                        }


                        if (value === "price-high") {
                            return priceB - priceA;
                        }


                        if (value === "name") {
                            return nameA.localeCompare(
                                nameB,
                                "fr"
                            );
                        }


                        return 0;

                    }
                );


            sorted.forEach(product => {
                grid.appendChild(product);
            });


            products =
                Array.from(
                    grid.querySelectorAll(".product-card")
                );

            applyFilters();

        }
    );

}


/* =========================================================
   FILTRAGE
   ========================================================= */

function applyFilters() {

    const activeCategory =
        document.querySelector(
            ".category-filter.active"
        )?.dataset.category || "all";


    let visibleCount = 0;


    products.forEach(product => {

        const category =
            product.dataset.category || "";

        const isNew =
            product.dataset.new === "true";

        const isPromotion =
            product.dataset.promotion === "true";

        const searchMatch =
            product.dataset.searchMatch !== "false";


        let categoryMatch = true;


        if (activeCategory === "nouveautes") {

            categoryMatch = isNew;

        } else if (activeCategory === "promotions") {

            categoryMatch = isPromotion;

        } else if (activeCategory !== "all") {

            categoryMatch =
                category === activeCategory;

        }


        const visible =
            categoryMatch && searchMatch;


        product.style.display =
            visible ? "" : "none";


        if (visible) {
            visibleCount++;
        }

    });


    updateNoProducts(visibleCount);

}


/* =========================================================
   CATÉGORIES
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".category-filter"
            );

        if (!button) return;


        document
            .querySelectorAll(
                ".category-filter"
            )
            .forEach(item => {
                item.classList.remove("active");
            });


        button.classList.add("active");

        applyFilters();

    }
);


/* =========================================================
   MESSAGE AUCUN PRODUIT
   ========================================================= */

function updateNoProducts(count) {

    const noProducts =
        document.getElementById("noProducts");

    if (!noProducts) return;


    noProducts.hidden =
        count !== 0;

}


/* =========================================================
   PANIER
   ========================================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(
                NOUVEAUTES_CONFIG.storageCart
            )
        ) || [];

    } catch (error) {

        console.error(
            "Erreur panier :",
            error
        );

        return [];

    }

}


function saveCart(cart) {

    localStorage.setItem(
        NOUVEAUTES_CONFIG.storageCart,
        JSON.stringify(cart)
    );

}


function addToCart(product) {

    if (!product) return;


    const cart =
        getCart();


    const name =
        product.dataset.name ||
        product.querySelector("h3")?.textContent.trim() ||
        "Produit";


    const price =
        parseFloat(
            product.dataset.price || 0
        );


    const image =
        product.querySelector("img")?.getAttribute("src") ||
        "";


    const category =
        product.dataset.category || "";


    const existing =
        cart.find(
            item => item.name === name
        );


    if (existing) {

        existing.quantity =
            (existing.quantity || 1) + 1;

    } else {

        cart.push({

            id:
                Date.now() +
                Math.random()
                    .toString(16)
                    .slice(2),

            name,
            price,
            image,
            category,
            quantity: 1

        });

    }


    saveCart(cart);

    updateCartCount();

    renderCart();

    showToast(
        `${name} ajouté au panier`
    );

}


/* =========================================================
   BOUTONS AJOUT PANIER
   ========================================================= */

function initializeCartButtons() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".add-cart, .quick-cart"
                );

            if (!button) return;


            const product =
                button.closest(
                    ".product-card"
                );

            if (!product) return;


            addToCart(product);

        }
    );

}


/* =========================================================
   COMPTEUR PANIER
   ========================================================= */

function updateCartCount() {

    const countElement =
        document.getElementById("cartCount");

    if (!countElement) return;


    const cart =
        getCart();


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (Number(item.quantity) || 1),
            0
        );


    countElement.textContent =
        total;

}


/* =========================================================
   AFFICHAGE PANIER
   ========================================================= */

function renderCart() {

    const container =
        document.getElementById(
            "miniCartProducts"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!container) return;


    const cart =
        getCart();


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <p>
                    Votre panier est vide.
                </p>

            </div>

        `;


        if (totalElement) {
            totalElement.textContent =
                "0$";
        }

        updateWhatsappLink();

        return;

    }


    container.innerHTML =
        cart.map(
            item => `

                <div
                    class="mini-cart-item"
                    data-id="${item.id}"
                >

                    <img
                        src="${item.image}"
                        alt="${escapeHtml(item.name)}"
                    >

                    <div class="mini-cart-item-info">

                        <h4>
                            ${escapeHtml(item.name)}
                        </h4>

                        <span>
                            ${formatPrice(item.price)}
                        </span>

                        <div class="cart-quantity">

                            <button
                                type="button"
                                class="cart-minus"
                                data-id="${item.id}"
                            >
                                −
                            </button>

                            <strong>
                                ${item.quantity}
                            </strong>

                            <button
                                type="button"
                                class="cart-plus"
                                data-id="${item.id}"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        type="button"
                        class="cart-remove"
                        data-id="${item.id}"
                        aria-label="Supprimer"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            `
        ).join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }


    updateWhatsappLink();

}


/* =========================================================
   ACTIONS PANIER
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const plus =
            event.target.closest(
                ".cart-plus"
            );

        const minus =
            event.target.closest(
                ".cart-minus"
            );

        const remove =
            event.target.closest(
                ".cart-remove"
            );


        if (plus) {

            changeQuantity(
                plus.dataset.id,
                1
            );

        }


        if (minus) {

            changeQuantity(
                minus.dataset.id,
                -1
            );

        }


        if (remove) {

            removeFromCart(
                remove.dataset.id
            );

        }

    }
);


/* =========================================================
   MODIFIER QUANTITÉ
   ========================================================= */

function changeQuantity(id, change) {

    const cart =
        getCart();


    const item =
        cart.find(
            product =>
                String(product.id) ===
                String(id)
        );


    if (!item) return;


    item.quantity =
        Number(item.quantity || 1) +
        change;


    if (item.quantity <= 0) {

        const index =
            cart.indexOf(item);

        cart.splice(index, 1);

    }


    saveCart(cart);

    updateCartCount();

    renderCart();

}


/* =========================================================
   SUPPRIMER DU PANIER
   ========================================================= */

function removeFromCart(id) {

    let cart =
        getCart();


    cart =
        cart.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveCart(cart);

    updateCartCount();

    renderCart();

    showToast(
        "Produit retiré du panier"
    );

}


/* =========================================================
   OUVRIR / FERMER PANIER
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const openButton =
            event.target.closest(
                "#openCart"
            );

        if (openButton) {
            openCart();
        }


        const closeButton =
            event.target.closest(
                "#closeCart"
            );

        if (closeButton) {
            closeCart();
        }


        const overlay =
            event.target.closest(
                "#miniCartOverlay"
            );

        if (overlay) {
            closeCart();
        }

    }
);


function openCart() {

    const cart =
        document.getElementById(
            "miniCart"
        );

    const overlay =
        document.getElementById(
            "miniCartOverlay"
        );


    if (!cart) return;


    cart.classList.add("open");

    cart.setAttribute(
        "aria-hidden",
        "false"
    );


    if (overlay) {

        overlay.hidden = false;

        requestAnimationFrame(() => {
            overlay.classList.add("active");
        });

    }


    document.body.classList.add(
        "cart-open"
    );

}


function closeCart() {

    const cart =
        document.getElementById(
            "miniCart"
        );

    const overlay =
        document.getElementById(
            "miniCartOverlay"
        );


    if (cart) {

        cart.classList.remove("open");

        cart.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

        setTimeout(() => {

            overlay.hidden = true;

        }, 250);

    }


    document.body.classList.remove(
        "cart-open"
    );

}


/* =========================================================
   WHATSAPP
   ========================================================= */

function updateWhatsappLink() {

    const button =
        document.getElementById(
            "checkoutWhatsapp"
        );

    if (!button) return;


    const cart =
        getCart();


    if (!cart.length) {

        button.href =
            `https://wa.me/${NOUVEAUTES_CONFIG.whatsapp}`;

        return;

    }


    const lines =
        cart.map(
            item =>
                `• ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const message =
        `Bonjour YMS STORE,%0A%0A` +
        `Je souhaite commander :%0A` +
        lines.join("%0A") +
        `%0A%0ATotal : ${formatPrice(total)}` +
        `%0A%0AMerci.`;


    button.href =
        `https://wa.me/${NOUVEAUTES_CONFIG.whatsapp}?text=${message}`;

}


/* =========================================================
   FAVORIS
   ========================================================= */

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                NOUVEAUTES_CONFIG.storageFavorites
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveFavorites(favorites) {

    localStorage.setItem(
        NOUVEAUTES_CONFIG.storageFavorites,
        JSON.stringify(favorites)
    );

}


function initializeFavorites() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".favorite-btn"
                );

            if (!button) return;


            const product =
                button.closest(
                    ".product-card"
                );

            if (!product) return;


            const name =
                product.dataset.name;


            let favorites =
                getFavorites();


            const exists =
                favorites.includes(name);


            if (exists) {

                favorites =
                    favorites.filter(
                        item =>
                            item !== name
                    );

                button.classList.remove(
                    "active"
                );


                const icon =
                    button.querySelector("i");

                if (icon) {

                    icon.className =
                        "fa-regular fa-heart";

                }


                showToast(
                    "Retiré des favoris"
                );

            } else {

                favorites.push(name);

                button.classList.add(
                    "active"
                );


                const icon =
                    button.querySelector("i");

                if (icon) {

                    icon.className =
                        "fa-solid fa-heart";

                }


                showToast(
                    "Ajouté aux favoris"
                );

            }


            saveFavorites(favorites);

        }
    );

}


/* =========================================================
   APERÇU PRODUIT
   ========================================================= */

function initializeProductModal() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".view-btn"
                );

            if (!button) return;


            const product =
                button.closest(
                    ".product-card"
                );

            if (!product) return;


            openProductModal(product);

        }
    );


    const closeButton =
        document.getElementById(
            "closeProductModal"
        );


    const overlay =
        document.querySelector(
            ".product-modal-overlay"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeProductModal
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeProductModal
        );

    }


    const modalAddCart =
        document.getElementById(
            "modalAddCart"
        );


    if (modalAddCart) {

        modalAddCart.addEventListener(
            "click",
            () => {

                if (!currentProduct) return;

                addToCart(
                    currentProduct
                );

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeProductModal();

            }

        }
    );

}


/* =========================================================
   OUVRIR MODAL
   ========================================================= */

function openProductModal(product) {

    currentProduct =
        product;


    const modal =
        document.getElementById(
            "productModal"
        );


    const image =
        document.getElementById(
            "modalProductImage"
        );


    const name =
        document.getElementById(
            "modalProductName"
        );


    const category =
        document.getElementById(
            "modalProductCategory"
        );


    const price =
        document.getElementById(
            "modalProductPrice"
        );


    const rating =
        document.getElementById(
            "modalProductRating"
        );


    if (!modal) return;


    const productImage =
        product.querySelector(
            ".product-image img"
        );


    const productName =
        product.dataset.name ||
        product.querySelector(
            "h3"
        )?.textContent.trim();


    const productCategory =
        product.querySelector(
            ".product-category"
        )?.textContent.trim() ||
        "Nouveauté";


    const productPrice =
        product.querySelector(
            ".current-price"
        )?.textContent.trim() ||
        formatPrice(
            product.dataset.price
        );


    const productRating =
        product.querySelector(
            ".rating"
        )?.innerHTML ||
        "★★★★★";


    if (image && productImage) {

        image.src =
            productImage.src;

        image.alt =
            productName;

    }


    if (name) {

        name.textContent =
            productName;

    }


    if (category) {

        category.textContent =
            productCategory;

    }


    if (price) {

        price.textContent =
            productPrice;

    }


    if (rating) {

        rating.innerHTML =
            productRating;

    }


    modal.hidden = false;

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    requestAnimationFrame(() => {

        modal.classList.add("active");

    });


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   FERMER MODAL
   ========================================================= */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    setTimeout(() => {

        modal.hidden = true;

    }, 250);


    document.body.classList.remove(
        "modal-open"
    );


    currentProduct =
        null;

}


/* =========================================================
   MENU MOBILE
   ========================================================= */

function initializeMobileMenu() {

    const button =
        document.querySelector(
            ".mobile-menu"
        );

    const navigation =
        document.getElementById(
            "mainNavigation"
        );


    if (!button || !navigation) return;


    button.addEventListener(
        "click",
        () => {

            const isOpen =
                navigation.classList.toggle(
                    "open"
                );


            button.setAttribute(
                "aria-expanded",
                isOpen
            );


            const icon =
                button.querySelector(
                    "i"
                );


            if (icon) {

                icon.className =
                    isOpen
                        ? "fa-solid fa-xmark"
                        : "fa-solid fa-bars";

            }

        }
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "shopToast"
        );


    if (!toast) return;


    const text =
        toast.querySelector(
            "span"
        );


    if (text) {

        text.textContent =
            message;

    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   FORMAT PRIX
   ========================================================= */

function formatPrice(value) {

    const number =
        Number(value) || 0;


    return (
        Number.isInteger(number)
            ? number
            : number.toFixed(2)
    ) +
    NOUVEAUTES_CONFIG.currency;

}


/* =========================================================
   SÉCURITÉ HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIALISATION DES ÉTATS
   ========================================================= */

function restoreFavoriteStates() {

    const favorites =
        getFavorites();


    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach(product => {

            const name =
                product.dataset.name;


            if (
                favorites.includes(name)
            ) {

                const button =
                    product.querySelector(
                        ".favorite-btn"
                    );


                if (button) {

                    button.classList.add(
                        "active"
                    );


                    const icon =
                        button.querySelector(
                            "i"
                        );


                    if (icon) {

                        icon.className =
                            "fa-solid fa-heart";

                    }

                }

            }

        });

}


/* =========================================================
   LANCEMENT
   ========================================================= */

restoreFavoriteStates();

applyFilters();

