/* =========================================================
   YMS STORE
   MODULE : SACS
   FICHIER : sacs/sacs.js
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const productsGrid = document.getElementById("productsGrid");
    const products = productsGrid
        ? Array.from(productsGrid.querySelectorAll(".product-card"))
        : [];

    const noProducts = document.getElementById("noProducts");

    const searchInput = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");

    const sortSelect = document.getElementById("sortProducts");

    const categoryButtons = document.querySelectorAll(".category-filter");

    const cartCount = document.getElementById("cartCount");

    const openCart = document.getElementById("openCart");
    const closeCart = document.getElementById("closeCart");

    const miniCart = document.getElementById("miniCart");
    const miniCartOverlay = document.getElementById("miniCartOverlay");

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

    const modalProductName =
        document.getElementById("modalProductName");

    const modalProductCategory =
        document.getElementById("modalProductCategory");

    const modalProductPrice =
        document.getElementById("modalProductPrice");

    const modalProductRating =
        document.getElementById("modalProductRating");

    const modalAddCart =
        document.getElementById("modalAddCart");

    const toast =
        document.getElementById("shopToast");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    const navigation =
        document.getElementById("mainNavigation");


    /* =====================================================
       ETAT
    ===================================================== */

    let currentCategory = "all";
    let currentSearch = "";
    let currentProduct = null;

    const WHATSAPP_NUMBER = "243971917222";

    const STORAGE_FAVORITES = "ymsFavorites";


    /* =====================================================
       UTILITAIRES
    ===================================================== */

    function normalizeText(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }


    function getProductData(product) {

        if (!product) return null;

        const imageElement =
            product.querySelector(".product-image img");

        const nameElement =
            product.querySelector(".product-info h3");

        const categoryElement =
            product.querySelector(".product-category");

        const priceElement =
            product.querySelector(".current-price");

        const ratingElement =
            product.querySelector(".rating");

        const oldPriceElement =
            product.querySelector(".old-price");

        return {

            element: product,

            name:
                nameElement
                    ? nameElement.textContent.trim()
                    : "Produit",

            category:
                categoryElement
                    ? categoryElement.textContent.trim()
                    : "Sacs",

            categorySlug:
                product.dataset.category || "sacs",

            price:
                Number(product.dataset.price || 0),

            image:
                imageElement
                    ? imageElement.getAttribute("src")
                    : "",

            alt:
                imageElement
                    ? imageElement.getAttribute("alt")
                    : "",

            rating:
                ratingElement
                    ? ratingElement.textContent.trim()
                    : "★★★★★",

            oldPrice:
                oldPriceElement
                    ? oldPriceElement.textContent.trim()
                    : "",

            isNew:
                product.dataset.new === "true",

            promotion:
                product.dataset.promotion === "true"

        };

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message = "Produit ajouté au panier") {

        if (!toast) return;

        const text = toast.querySelector("span");

        if (text) {
            text.textContent = message;
        }

        toast.classList.add("show");

        clearTimeout(window.ymsToastTimer);

        window.ymsToastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }


    /* =====================================================
       FILTRAGE
    ===================================================== */

    function filterProducts() {

        const search =
            normalizeText(currentSearch);

        let visibleCount = 0;

        products.forEach(product => {

            const data = getProductData(product);

            if (!data) return;

            const productName =
                normalizeText(data.name);

            const productCategory =
                normalizeText(data.category);

            const categorySlug =
                normalizeText(data.categorySlug);


            let matchesCategory = true;
            let matchesSearch = true;


            /* -----------------------------
               CATEGORIE
            ----------------------------- */

            if (currentCategory !== "all") {

                if (currentCategory === "nouveautes") {

                    matchesCategory = data.isNew;

                } else if (currentCategory === "promotions") {

                    matchesCategory = data.promotion;

                } else {

                    matchesCategory =
                        categorySlug ===
                        normalizeText(currentCategory);

                }

            }


            /* -----------------------------
               RECHERCHE
            ----------------------------- */

            if (search !== "") {

                matchesSearch =
                    productName.includes(search) ||
                    productCategory.includes(search);

            }


            const visible =
                matchesCategory &&
                matchesSearch;


            product.style.display =
                visible ? "" : "none";


            if (visible) {
                visibleCount++;
            }

        });


        if (noProducts) {

            noProducts.hidden =
                visibleCount !== 0;

        }

    }


    /* =====================================================
       CATEGORIES
    ===================================================== */

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            currentCategory =
                button.dataset.category || "all";


            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });


            button.classList.add("active");


            filterProducts();

        });

    });


    /* =====================================================
       RECHERCHE
    ===================================================== */

    function performSearch() {

        currentSearch =
            searchInput
                ? searchInput.value
                : "";

        filterProducts();

    }


    if (searchInput) {

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

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            performSearch
        );

    }


    /* =====================================================
       TRI
    ===================================================== */

    if (sortSelect) {

        sortSelect.addEventListener("change", () => {

            const value =
                sortSelect.value;


            const sorted =
                [...products].sort((a, b) => {

                    const productA =
                        getProductData(a);

                    const productB =
                        getProductData(b);


                    if (value === "price-low") {

                        return productA.price -
                               productB.price;

                    }


                    if (value === "price-high") {

                        return productB.price -
                               productA.price;

                    }


                    if (value === "name") {

                        return productA.name
                            .localeCompare(
                                productB.name,
                                "fr"
                            );

                    }


                    return 0;

                });


            sorted.forEach(product => {
                productsGrid.appendChild(product);
            });


            filterProducts();

        });

    }


    /* =====================================================
       FAVORIS
    ===================================================== */

    function getFavorites() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    STORAGE_FAVORITES
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function saveFavorites(favorites) {

        localStorage.setItem(
            STORAGE_FAVORITES,
            JSON.stringify(favorites)
        );

    }


    function toggleFavorite(product) {

        const data =
            getProductData(product);

        if (!data) return;


        let favorites =
            getFavorites();


        const index =
            favorites.indexOf(data.name);


        const button =
            product.querySelector(".favorite-btn");


        const icon =
            button
                ? button.querySelector("i")
                : null;


        if (index === -1) {

            favorites.push(data.name);

            button?.classList.add("active");

            if (icon) {
                icon.className =
                    "fa-solid fa-heart";
            }

            showToast("Produit ajouté aux favoris");

        } else {

            favorites.splice(index, 1);

            button?.classList.remove("active");

            if (icon) {
                icon.className =
                    "fa-regular fa-heart";
            }

            showToast("Produit retiré des favoris");

        }


        saveFavorites(favorites);

    }


    function restoreFavorites() {

        const favorites =
            getFavorites();


        products.forEach(product => {

            const data =
                getProductData(product);

            if (!data) return;


            const button =
                product.querySelector(".favorite-btn");

            const icon =
                button
                    ? button.querySelector("i")
                    : null;


            if (
                favorites.includes(data.name)
            ) {

                button?.classList.add("active");

                if (icon) {
                    icon.className =
                        "fa-solid fa-heart";
                }

            }

        });

    }


    /* =====================================================
       PANIER
    ===================================================== */

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem("ymsCart")
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            "ymsCart",
            JSON.stringify(cart)
        );

    }


    function addToCart(product) {

        const data =
            getProductData(product);

        if (!data) return;


        let cart =
            getCart();


        const existing =
            cart.find(
                item =>
                    item.name === data.name
            );


        if (existing) {

            existing.quantity =
                Number(existing.quantity || 1) + 1;

        } else {

            cart.push({

                name: data.name,

                category: data.category,

                price: data.price,

                image: data.image,

                quantity: 1

            });

        }


        saveCart(cart);

        updateCart();


        showToast(
            `${data.name} ajouté au panier`
        );

    }


    function updateCart() {

        const cart =
            getCart();


        const quantity =
            cart.reduce(
                (total, item) =>
                    total +
                    Number(item.quantity || 1),
                0
            );


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    Number(item.price || 0) *
                    Number(item.quantity || 1),
                0
            );


        if (cartCount) {
            cartCount.textContent =
                quantity;
        }


        if (cartTotal) {
            cartTotal.textContent =
                `${total}$`;
        }


        renderMiniCart(cart);

    }


    /* =====================================================
       MINI PANIER
    ===================================================== */

    function renderMiniCart(cart) {

        if (!miniCartProducts) return;


        if (!cart.length) {

            miniCartProducts.innerHTML = `

                <div class="empty-cart">

                    <i class="fa-solid fa-cart-shopping"></i>

                    <p>
                        Votre panier est vide.
                    </p>

                </div>

            `;

            return;

        }


        miniCartProducts.innerHTML =
            cart.map((item, index) => `

                <div class="mini-cart-item">

                    <div class="mini-cart-item-image">

                        <img
                            src="${item.image || ""}"
                            alt="${item.name}"
                        >

                    </div>


                    <div class="mini-cart-item-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <span>
                            ${item.price}$ ×
                            ${item.quantity}
                        </span>

                    </div>


                    <button
                        type="button"
                        class="remove-cart-item"
                        data-index="${index}"
                        aria-label="Supprimer ${item.name}"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            `).join("");


        miniCartProducts
            .querySelectorAll(".remove-cart-item")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        removeCartItem(index);

                    }
                );

            });

    }


    function removeCartItem(index) {

        const cart =
            getCart();

        if (
            index < 0 ||
            index >= cart.length
        ) {
            return;
        }


        cart.splice(index, 1);

        saveCart(cart);

        updateCart();

        showToast(
            "Produit retiré du panier"
        );

    }


    function openMiniCart() {

        if (miniCart) {

            miniCart.classList.add("active");

            miniCart.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        if (miniCartOverlay) {

            miniCartOverlay.hidden = false;

            miniCartOverlay.classList.add("active");

        }

        document.body.classList.add("cart-open");

    }


    function closeMiniCart() {

        if (miniCart) {

            miniCart.classList.remove("active");

            miniCart.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        if (miniCartOverlay) {

            miniCartOverlay.classList.remove("active");

            setTimeout(() => {

                if (
                    !miniCartOverlay.classList.contains(
                        "active"
                    )
                ) {
                    miniCartOverlay.hidden = true;
                }

            }, 250);

        }

        document.body.classList.remove("cart-open");

    }


    openCart?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openMiniCart();

        }
    );


    closeCart?.addEventListener(
        "click",
        closeMiniCart
    );


    miniCartOverlay?.addEventListener(
        "click",
        closeMiniCart
    );


    /* =====================================================
       APERCU PRODUIT
    ===================================================== */

    function openProductModal(product) {

        const data =
            getProductData(product);

        if (!data || !productModal) return;


        currentProduct =
            product;


        if (modalProductImage) {

            modalProductImage.src =
                data.image;

            modalProductImage.alt =
                data.name;

        }


        if (modalProductName) {

            modalProductName.textContent =
                data.name;

        }


        if (modalProductCategory) {

            modalProductCategory.textContent =
                data.category;

        }


        if (modalProductPrice) {

            modalProductPrice.textContent =
                `${data.price}$`;

        }


        if (modalProductRating) {

            modalProductRating.textContent =
                data.rating;

        }


        productModal.hidden = false;

        productModal.classList.add("active");

        productModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );

    }


    function closeProductModalWindow() {

        if (!productModal) return;


        productModal.classList.remove(
            "active"
        );


        productModal.setAttribute(
            "aria-hidden",
            "true"
        );


        setTimeout(() => {

            if (
                !productModal.classList.contains(
                    "active"
                )
            ) {
                productModal.hidden = true;
            }

        }, 250);


        document.body.classList.remove(
            "modal-open"
        );


        currentProduct = null;

    }


    closeProductModal?.addEventListener(
        "click",
        closeProductModalWindow
    );


    productModal
        ?.querySelector(".product-modal-overlay")
        ?.addEventListener(
            "click",
            closeProductModalWindow
        );


    modalAddCart?.addEventListener(
        "click",
        () => {

            if (!currentProduct) return;

            addToCart(currentProduct);

            closeProductModalWindow();

        }
    );


    /* =====================================================
       ACTIONS DES PRODUITS
    ===================================================== */

    products.forEach(product => {

        const favoriteButton =
            product.querySelector(
                ".favorite-btn"
            );


        const viewButton =
            product.querySelector(
                ".view-btn"
            );


        const quickCart =
            product.querySelector(
                ".quick-cart"
            );


        const addCart =
            product.querySelector(
                ".add-cart"
            );


        favoriteButton?.addEventListener(
            "click",
            () => toggleFavorite(product)
        );


        viewButton?.addEventListener(
            "click",
            () => openProductModal(product)
        );


        quickCart?.addEventListener(
            "click",
            () => addToCart(product)
        );


        addCart?.addEventListener(
            "click",
            () => addToCart(product)
        );

    });


    /* =====================================================
       WHATSAPP
    ===================================================== */

    function updateWhatsAppLink() {

        if (!checkoutWhatsapp) return;


        const cart =
            getCart();


        if (!cart.length) {

            checkoutWhatsapp.href = "#";

            return;

        }


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    Number(item.price || 0) *
                    Number(item.quantity || 1),
                0
            );


        let message =
            "Bonjour YMS STORE,%0A%0A";

        message +=
            "Je souhaite commander :%0A%0A";


        cart.forEach(item => {

            message +=
                `• ${item.name} — ` +
                `${item.quantity} × ` +
                `${item.price}$%0A`;

        });


        message +=
            `%0ATotal : ${total}$%0A%0A`;

        message +=
            "Merci de me confirmer la disponibilité.";


        checkoutWhatsapp.href =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    mobileMenu?.addEventListener(
        "click",
        () => {

            const isOpen =
                navigation?.classList.toggle(
                    "active"
                );


            mobileMenu.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );


            const icon =
                mobileMenu.querySelector("i");


            if (icon) {

                icon.className =
                    isOpen
                        ? "fa-solid fa-xmark"
                        : "fa-solid fa-bars";

            }

        }
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            closeMiniCart();

            closeProductModalWindow();

        }
    );


    /* =====================================================
       INITIALISATION
    ===================================================== */

    restoreFavorites();

    updateCart();

    updateWhatsAppLink();

    filterProducts();


    /* Mise à jour du lien WhatsApp
       après chaque modification du panier */

    const originalSaveCart =
        saveCart;

});