/* =========================================================
   YMS STORE
   CHAUSSURES.JS
   Gestion de la page Chaussures
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const productsGrid = document.getElementById("productsGrid");
    const productCards = Array.from(
        document.querySelectorAll(".product-card")
    );

    const categoryButtons = document.querySelectorAll(
        ".category-filter"
    );

    const sortSelect = document.getElementById("sortProducts");

    const searchInput = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");

    const noProducts = document.getElementById("noProducts");

    const cartCount = document.getElementById("cartCount");

    const miniCart = document.getElementById("miniCart");
    const miniCartOverlay = document.getElementById("miniCartOverlay");
    const openCart = document.getElementById("openCart");
    const closeCart = document.getElementById("closeCart");

    const miniCartProducts =
        document.getElementById("miniCartProducts");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutWhatsapp =
        document.getElementById("checkoutWhatsapp");

    const productModal =
        document.getElementById("productModal");

    const closeProductModal =
        document.getElementById("closeProductModal");

    const modalProductImage =
        document.getElementById("modalProductImage");

    const modalProductCategory =
        document.getElementById("modalProductCategory");

    const modalProductName =
        document.getElementById("modalProductName");

    const modalProductRating =
        document.getElementById("modalProductRating");

    const modalProductPrice =
        document.getElementById("modalProductPrice");

    const modalAddCart =
        document.getElementById("modalAddCart");

    const shopToast =
        document.getElementById("shopToast");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let currentCategory = "all";
    let currentSearch = "";
    let currentProduct = null;

    let cart = [];

    try {

        const savedCart =
            localStorage.getItem("ymsCart");

        if (savedCart) {
            cart = JSON.parse(savedCart);

            if (!Array.isArray(cart)) {
                cart = [];
            }
        }

    } catch (error) {

        console.warn(
            "Impossible de récupérer le panier.",
            error
        );

        cart = [];
    }


    /* =====================================================
       UTILITAIRES
    ===================================================== */

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    }


    function getProductData(card) {

        if (!card) {
            return null;
        }

        const image =
            card.querySelector(".product-image img");

        const name =
            card.dataset.name ||
            card.querySelector("h3")?.textContent.trim() ||
            "Produit";

        const category =
            card.dataset.category ||
            card.querySelector(".product-category")
                ?.textContent.trim() ||
            "chaussures";

        const price =
            parseFloat(card.dataset.price || "0");

        const rating =
            card.querySelector(".rating")
                ?.textContent.trim() ||
            "★★★★★";

        return {

            id:
                card.dataset.id ||
                normalizeText(name)
                    .replace(/\s+/g, "-"),

            name,

            category,

            price,

            image:
                image?.src || "",

            rating,

            newProduct:
                card.dataset.new === "true",

            promotion:
                card.dataset.promotion === "true"

        };
    }


    function saveCart() {

        try {

            localStorage.setItem(
                "ymsCart",
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "Erreur lors de la sauvegarde du panier :",
                error
            );
        }
    }


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    function showToast(message = "Produit ajouté au panier") {

        if (!shopToast) {
            return;
        }

        const span =
            shopToast.querySelector("span");

        if (span) {
            span.textContent = message;
        }

        shopToast.classList.add("show");

        clearTimeout(
            showToast.timeout
        );

        showToast.timeout =
            setTimeout(() => {

                shopToast.classList.remove("show");

            }, 2800);
    }


    /* =====================================================
       PANIER
    ===================================================== */

    function getCartQuantity() {

        return cart.reduce(
            (total, product) =>
                total + Number(product.quantity || 0),
            0
        );
    }


    function getCartTotal() {

        return cart.reduce(
            (total, product) =>
                total +
                (
                    Number(product.price || 0) *
                    Number(product.quantity || 0)
                ),
            0
        );
    }


    function updateCartCount() {

        const quantity =
            getCartQuantity();

        if (cartCount) {

            cartCount.textContent =
                quantity;

            cartCount.classList.toggle(
                "has-items",
                quantity > 0
            );
        }

        if (cartTotal) {

            cartTotal.textContent =
                `${getCartTotal().toFixed(2)}$`;
        }

        saveCart();
    }


    function addToCart(product) {

        if (!product) {
            return;
        }

        const existing =
            cart.find(
                item => item.id === product.id
            );

        if (existing) {

            existing.quantity =
                Number(existing.quantity || 0) + 1;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: product.price,

                image: product.image,

                category: product.category,

                quantity: 1

            });
        }

        updateCartCount();

        renderCart();

        showToast(
            `${product.name} ajouté au panier`
        );
    }


    function removeFromCart(productId) {

        cart =
            cart.filter(
                product =>
                    product.id !== productId
            );

        updateCartCount();

        renderCart();
    }


    function changeQuantity(productId, change) {

        const product =
            cart.find(
                item =>
                    item.id === productId
            );

        if (!product) {
            return;
        }

        product.quantity =
            Number(product.quantity || 0) +
            change;

        if (product.quantity <= 0) {

            removeFromCart(productId);

            return;
        }

        updateCartCount();

        renderCart();
    }


    /* =====================================================
       AFFICHAGE PANIER
    ===================================================== */

    function renderCart() {

        if (!miniCartProducts) {
            return;
        }

        if (!cart.length) {

            miniCartProducts.innerHTML = `

                <div class="empty-cart">

                    <i class="fa-solid fa-cart-shopping"></i>

                    <p>
                        Votre panier est vide.
                    </p>

                </div>

            `;

            updateCheckoutLink();

            return;
        }


        miniCartProducts.innerHTML =
            cart.map(product => `

                <div
                    class="mini-cart-item"
                    data-id="${escapeHTML(product.id)}"
                >

                    <div class="mini-cart-item-image">

                        <img
                            src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.name)}"
                        >

                    </div>


                    <div class="mini-cart-item-info">

                        <h4>
                            ${escapeHTML(product.name)}
                        </h4>

                        <span class="mini-cart-item-price">
                            ${Number(product.price).toFixed(2)}$
                        </span>


                        <div class="mini-cart-quantity">

                            <button
                                type="button"
                                class="quantity-minus"
                                data-id="${escapeHTML(product.id)}"
                                aria-label="Diminuer"
                            >
                                −
                            </button>

                            <span>
                                ${product.quantity}
                            </span>

                            <button
                                type="button"
                                class="quantity-plus"
                                data-id="${escapeHTML(product.id)}"
                                aria-label="Augmenter"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="remove-cart-item"
                        data-id="${escapeHTML(product.id)}"
                        aria-label="Supprimer"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            `).join("");


        updateCheckoutLink();
    }


    function updateCheckoutLink() {

        if (!checkoutWhatsapp) {
            return;
        }

        const phone =
            "243971917222";

        if (!cart.length) {

            checkoutWhatsapp.href =
                `https://wa.me/${phone}`;

            return;
        }


        let message =
            "Bonjour YMS STORE,%0A%0A" +
            "Je souhaite commander :%0A%0A";


        cart.forEach((product, index) => {

            message +=
                `${index + 1}. ` +
                `${product.name} ` +
                `x${product.quantity} ` +
                `- ${(
                    product.price *
                    product.quantity
                ).toFixed(2)}$%0A`;

        });


        message +=
            `%0ATotal : ${getCartTotal().toFixed(2)}$` +
            `%0A%0AMerci.`;


        checkoutWhatsapp.href =
            `https://wa.me/${phone}?text=${message}`;
    }


    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       OUVERTURE / FERMETURE PANIER
    ===================================================== */

    function openMiniCart() {

        if (!miniCart) {
            return;
        }

        miniCart.classList.add("open");

        if (miniCartOverlay) {

            miniCartOverlay.hidden = false;

            miniCartOverlay.classList.add(
                "show"
            );
        }

        miniCart.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "cart-open"
        );
    }


    function closeMiniCart() {

        if (!miniCart) {
            return;
        }

        miniCart.classList.remove("open");

        if (miniCartOverlay) {

            miniCartOverlay.classList.remove(
                "show"
            );

            setTimeout(() => {

                if (
                    !miniCartOverlay.classList.contains(
                        "show"
                    )
                ) {

                    miniCartOverlay.hidden = true;
                }

            }, 300);
        }

        miniCart.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "cart-open"
        );
    }


    if (openCart) {

        openCart.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openMiniCart();
            }
        );
    }


    if (closeCart) {

        closeCart.addEventListener(
            "click",
            closeMiniCart
        );
    }


    if (miniCartOverlay) {

        miniCartOverlay.addEventListener(
            "click",
            closeMiniCart
        );
    }


    /* =====================================================
       EVENEMENTS PANIER
    ===================================================== */

    if (miniCartProducts) {

        miniCartProducts.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest("button");

                if (!button) {
                    return;
                }

                const productId =
                    button.dataset.id;

                if (!productId) {
                    return;
                }


                if (
                    button.classList.contains(
                        "quantity-plus"
                    )
                ) {

                    changeQuantity(
                        productId,
                        1
                    );
                }


                if (
                    button.classList.contains(
                        "quantity-minus"
                    )
                ) {

                    changeQuantity(
                        productId,
                        -1
                    );
                }


                if (
                    button.classList.contains(
                        "remove-cart-item"
                    )
                ) {

                    removeFromCart(
                        productId
                    );
                }

            }
        );
    }


    /* =====================================================
       FILTRAGE DES PRODUITS
    ===================================================== */

    function filterProducts() {

        const search =
            normalizeText(currentSearch);

        let visibleProducts = [];


        productCards.forEach(card => {

            const category =
                normalizeText(
                    card.dataset.category
                );

            const name =
                normalizeText(
                    card.dataset.name ||
                    card.querySelector("h3")
                        ?.textContent
                );


            let categoryMatch =
                currentCategory === "all";


            if (!categoryMatch) {

                if (
                    currentCategory ===
                    "nouveautes"
                ) {

                    categoryMatch =
                        card.dataset.new ===
                        "true";

                } else if (
                    currentCategory ===
                    "promotions"
                ) {

                    categoryMatch =
                        card.dataset.promotion ===
                        "true";

                } else {

                    categoryMatch =
                        category ===
                        normalizeText(
                            currentCategory
                        );
                }
            }


            const searchMatch =
                !search ||
                name.includes(search) ||
                category.includes(search);


            const visible =
                categoryMatch &&
                searchMatch;


            card.style.display =
                visible ? "" : "none";


            if (visible) {

                visibleProducts.push(card);
            }

        });


        if (noProducts) {

            noProducts.hidden =
                visibleProducts.length === 0;
        }
    }


    /* =====================================================
       CATEGORIES
    ===================================================== */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentCategory =
                    button.dataset.category ||
                    "all";


                categoryButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                filterProducts();
            }
        );
    });


    /* =====================================================
       RECHERCHE
    ===================================================== */

    function executeSearch() {

        currentSearch =
            searchInput?.value.trim() ||
            "";

        filterProducts();
    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            executeSearch
        );
    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            executeSearch
        );
    }


    /* =====================================================
       TRI
    ===================================================== */

    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            () => {

                const value =
                    sortSelect.value;


                const sorted =
                    [...productCards];


                if (
                    value ===
                    "price-low"
                ) {

                    sorted.sort(
                        (a, b) =>
                            Number(
                                a.dataset.price
                            ) -
                            Number(
                                b.dataset.price
                            )
                    );
                }


                if (
                    value ===
                    "price-high"
                ) {

                    sorted.sort(
                        (a, b) =>
                            Number(
                                b.dataset.price
                            ) -
                            Number(
                                a.dataset.price
                            )
                    );
                }


                if (
                    value ===
                    "name"
                ) {

                    sorted.sort(
                        (a, b) =>
                            String(
                                a.dataset.name
                            ).localeCompare(
                                String(
                                    b.dataset.name
                                ),
                                "fr"
                            )
                    );
                }


                if (productsGrid) {

                    sorted.forEach(
                        card =>
                            productsGrid.appendChild(
                                card
                            )
                    );
                }


                filterProducts();
            }
        );
    }


    /* =====================================================
       AJOUT AU PANIER
    ===================================================== */

    productCards.forEach(card => {

        const addButton =
            card.querySelector(
                ".add-cart"
            );

        const quickButton =
            card.querySelector(
                ".quick-cart"
            );


        const product =
            getProductData(card);


        if (addButton) {

            addButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    addToCart(product);
                }
            );
        }


        if (quickButton) {

            quickButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    addToCart(product);
                }
            );
        }
    });


    /* =====================================================
       FAVORIS
    ===================================================== */

    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const icon =
                        button.querySelector("i");

                    const card =
                        button.closest(
                            ".product-card"
                        );

                    const product =
                        getProductData(card);

                    if (!product) {
                        return;
                    }


                    let favorites = [];

                    try {

                        favorites =
                            JSON.parse(
                                localStorage.getItem(
                                    "ymsFavorites"
                                )
                            ) || [];

                    } catch {

                        favorites = [];
                    }


                    const index =
                        favorites.indexOf(
                            product.id
                        );


                    if (index === -1) {

                        favorites.push(
                            product.id
                        );

                        button.classList.add(
                            "active"
                        );

                        if (icon) {

                            icon.classList.remove(
                                "fa-regular"
                            );

                            icon.classList.add(
                                "fa-solid"
                            );
                        }

                        showToast(
                            "Produit ajouté aux favoris"
                        );

                    } else {

                        favorites.splice(
                            index,
                            1
                        );

                        button.classList.remove(
                            "active"
                        );

                        if (icon) {

                            icon.classList.remove(
                                "fa-solid"
                            );

                            icon.classList.add(
                                "fa-regular"
                            );
                        }

                        showToast(
                            "Produit retiré des favoris"
                        );
                    }


                    localStorage.setItem(
                        "ymsFavorites",
                        JSON.stringify(
                            favorites
                        )
                    );
                }
            );
        });


    /* =====================================================
       MODAL APERCU RAPIDE
    ===================================================== */

    function openProductModal(product) {

        if (
            !productModal ||
            !product
        ) {
            return;
        }

        currentProduct =
            product;


        if (modalProductImage) {

            modalProductImage.src =
                product.image;

            modalProductImage.alt =
                product.name;
        }


        if (modalProductCategory) {

            modalProductCategory.textContent =
                product.category;
        }


        if (modalProductName) {

            modalProductName.textContent =
                product.name;
        }


        if (modalProductRating) {

            modalProductRating.textContent =
                product.rating;
        }


        if (modalProductPrice) {

            modalProductPrice.textContent =
                `${product.price.toFixed(2)}$`;
        }


        productModal.hidden = false;

        productModal.classList.add(
            "show"
        );

        productModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeProductModalWindow() {

        if (!productModal) {
            return;
        }

        productModal.classList.remove(
            "show"
        );

        productModal.setAttribute(
            "aria-hidden",
            "true"
        );

        setTimeout(() => {

            productModal.hidden = true;

        }, 250);

        document.body.classList.remove(
            "modal-open"
        );

        currentProduct = null;
    }


    document
        .querySelectorAll(".view-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const card =
                        button.closest(
                            ".product-card"
                        );

                    const product =
                        getProductData(card);

                    openProductModal(
                        product
                    );
                }
            );
        });


    if (closeProductModal) {

        closeProductModal.addEventListener(
            "click",
            closeProductModalWindow
        );
    }


    const modalOverlay =
        productModal?.querySelector(
            ".product-modal-overlay"
        );


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeProductModalWindow
        );
    }


    if (modalAddCart) {

        modalAddCart.addEventListener(
            "click",
            () => {

                if (!currentProduct) {
                    return;
                }

                addToCart(
                    currentProduct
                );

                closeProductModalWindow();

                openMiniCart();
            }
        );
    }


    /* =====================================================
       CLAVIER
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMiniCart();

                closeProductModalWindow();
            }
        }
    );


    /* =====================================================
       INITIALISATION FAVORIS
    ===================================================== */

    function loadFavorites() {

        let favorites = [];

        try {

            favorites =
                JSON.parse(
                    localStorage.getItem(
                        "ymsFavorites"
                    )
                ) || [];

        } catch {

            favorites = [];
        }


        document
            .querySelectorAll(
                ".product-card"
            )
            .forEach(card => {

                const product =
                    getProductData(card);

                const button =
                    card.querySelector(
                        ".favorite-btn"
                    );

                const icon =
                    button?.querySelector("i");


                if (
                    product &&
                    favorites.includes(
                        product.id
                    )
                ) {

                    button?.classList.add(
                        "active"
                    );

                    icon?.classList.remove(
                        "fa-regular"
                    );

                    icon?.classList.add(
                        "fa-solid"
                    );
                }
            });
    }


    /* =====================================================
       INITIALISATION
    ===================================================== */

    updateCartCount();

    renderCart();

    loadFavorites();

    filterProducts();

});