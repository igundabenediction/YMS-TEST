/* =========================================================
   YMS STORE
   FEMME.JS
   Gestion complète de la page Femme
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

    const categoryFilters = document.querySelectorAll(".category-filter");

    const sortProducts = document.getElementById("sortProducts");

    const productSearch = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");

    const noProducts = document.getElementById("noProducts");

    const openCart = document.getElementById("openCart");
    const closeCart = document.getElementById("closeCart");

    const miniCart = document.getElementById("miniCart");
    const miniCartOverlay = document.getElementById("miniCartOverlay");

    const productModal = document.getElementById("productModal");
    const closeProductModal = document.getElementById(
        "closeProductModal"
    );

    const modalProductImage = document.getElementById(
        "modalProductImage"
    );

    const modalProductCategory = document.getElementById(
        "modalProductCategory"
    );

    const modalProductName = document.getElementById(
        "modalProductName"
    );

    const modalProductRating = document.getElementById(
        "modalProductRating"
    );

    const modalProductPrice = document.getElementById(
        "modalProductPrice"
    );

    const modalAddCart = document.getElementById(
        "modalAddCart"
    );

    const shopToast = document.getElementById("shopToast");

    /* =====================================================
       ETAT
    ===================================================== */

    let activeCategory = "all";
    let searchTerm = "";

    let selectedProduct = null;

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


    function getProductName(card) {

        return (
            card.dataset.name ||
            card.querySelector("h3")?.textContent ||
            ""
        ).trim();

    }


    function getProductPrice(card) {

        return Number(card.dataset.price || 0);

    }


    function getProductCategory(card) {

        return normalizeText(card.dataset.category);

    }


    function showToast(message = "Produit ajouté au panier") {

        if (!shopToast) return;

        const span = shopToast.querySelector("span");

        if (span) {
            span.textContent = message;
        }

        shopToast.classList.add("show");

        clearTimeout(showToast.timeout);

        showToast.timeout = setTimeout(() => {

            shopToast.classList.remove("show");

        }, 2800);

    }


    /* =====================================================
       FILTRAGE DES PRODUITS
    ===================================================== */

    function filterProducts() {

        const normalizedSearch = normalizeText(searchTerm);

        let visibleCount = 0;

        productCards.forEach(card => {

            const category = getProductCategory(card);

            const name = normalizeText(getProductName(card));

            const productCategoryText = normalizeText(
                card.querySelector(".product-category")?.textContent
            );

            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory ||
                (
                    activeCategory === "nouveautes" &&
                    card.dataset.new === "true"
                ) ||
                (
                    activeCategory === "promotions" &&
                    card.dataset.promotion === "true"
                );

            const matchesSearch =
                !normalizedSearch ||
                name.includes(normalizedSearch) ||
                productCategoryText.includes(normalizedSearch);

            const visible =
                matchesCategory &&
                matchesSearch;

            card.style.display = visible
                ? ""
                : "none";

            if (visible) {
                visibleCount++;
            }

        });


        if (noProducts) {

            noProducts.hidden = visibleCount !== 0;

        }

    }


    /* =====================================================
       FILTRES CATEGORIES
    ===================================================== */

    categoryFilters.forEach(button => {

        button.addEventListener("click", () => {

            categoryFilters.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            activeCategory =
                button.dataset.category || "all";

            filterProducts();

        });

    });


    /* =====================================================
       RECHERCHE
    ===================================================== */

    function executeSearch() {

        searchTerm = productSearch
            ? productSearch.value
            : "";

        filterProducts();

    }


    if (productSearch) {

        productSearch.addEventListener(
            "input",
            executeSearch
        );

        productSearch.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {
                    executeSearch();
                }

            }
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

    if (sortProducts && productsGrid) {

        sortProducts.addEventListener("change", () => {

            const value = sortProducts.value;

            const sortedCards = [...productCards];

            if (value === "price-low") {

                sortedCards.sort(
                    (a, b) =>
                        getProductPrice(a) -
                        getProductPrice(b)
                );

            }

            else if (value === "price-high") {

                sortedCards.sort(
                    (a, b) =>
                        getProductPrice(b) -
                        getProductPrice(a)
                );

            }

            else if (value === "name") {

                sortedCards.sort(
                    (a, b) =>
                        getProductName(a)
                            .localeCompare(
                                getProductName(b),
                                "fr"
                            )
                );

            }


            sortedCards.forEach(card => {

                productsGrid.appendChild(card);

            });

            filterProducts();

        });

    }


    /* =====================================================
       FAVORIS
    ===================================================== */

    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.preventDefault();
                event.stopPropagation();

                button.classList.toggle("active");

                const icon =
                    button.querySelector("i");

                if (!icon) return;

                if (button.classList.contains("active")) {

                    icon.classList.remove(
                        "fa-regular"
                    );

                    icon.classList.add(
                        "fa-solid"
                    );

                    showToast(
                        "Produit ajouté aux favoris"
                    );

                } else {

                    icon.classList.remove(
                        "fa-solid"
                    );

                    icon.classList.add(
                        "fa-regular"
                    );

                    showToast(
                        "Produit retiré des favoris"
                    );

                }

            });

        });


    /* =====================================================
       AJOUT AU PANIER
    ===================================================== */

    document
        .querySelectorAll(".add-cart, .quick-cart")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.preventDefault();
                event.stopPropagation();

                const card =
                    button.closest(".product-card");

                if (!card) return;

                addProductToCart(card);

            });

        });


    function addProductToCart(card) {

        const product = {

            id:
                card.dataset.id ||
                normalizeText(getProductName(card))
                    .replace(/\s+/g, "-"),

            name:
                getProductName(card),

            price:
                getProductPrice(card),

            category:
                card.dataset.category || "",

            image:
                card.querySelector("img")?.src || "",

            quantity: 1

        };


        /*
         * Si panier.js possède une fonction globale,
         * on l'utilise automatiquement.
         */

        if (
            typeof window.addToCart === "function"
        ) {

            window.addToCart(product);

        }

        else if (
            typeof window.addProductToCart === "function"
        ) {

            window.addProductToCart(product);

        }

        else {

            /*
             * Fallback localStorage
             */

            let cart = [];

            try {

                cart = JSON.parse(
                    localStorage.getItem(
                        "ymsCart"
                    )
                ) || [];

            } catch (error) {

                cart = [];

            }


            const existing =
                cart.find(item =>
                    item.id === product.id
                );


            if (existing) {

                existing.quantity =
                    Number(existing.quantity || 0) + 1;

            } else {

                cart.push(product);

            }


            localStorage.setItem(
                "ymsCart",
                JSON.stringify(cart)
            );

            updateCartCount(cart);

        }


        showToast(
            `${product.name} ajouté au panier`
        );

    }


    /* =====================================================
       COMPTEUR PANIER
    ===================================================== */

    function updateCartCount(cart = null) {

        const cartCount =
            document.getElementById("cartCount");

        if (!cartCount) return;

        if (!cart) {

            try {

                cart =
                    JSON.parse(
                        localStorage.getItem(
                            "ymsCart"
                        )
                    ) || [];

            } catch (error) {

                cart = [];

            }

        }


        const totalQuantity =
            cart.reduce(
                (total, item) =>
                    total +
                    Number(item.quantity || 1),
                0
            );


        cartCount.textContent =
            totalQuantity;

    }


    /* =====================================================
       MINI PANIER
    ===================================================== */

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

            requestAnimationFrame(() => {

                miniCartOverlay.classList.add(
                    "active"
                );

            });

        }

        document.body.classList.add(
            "cart-open"
        );

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

            miniCartOverlay.classList.remove(
                "active"
            );

            setTimeout(() => {

                miniCartOverlay.hidden = true;

            }, 300);

        }

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
       APERCU PRODUIT
    ===================================================== */

    document
        .querySelectorAll(".view-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const card =
                        button.closest(
                            ".product-card"
                        );

                    if (!card) return;

                    openProductModal(card);

                }
            );

        });


    function openProductModal(card) {

        selectedProduct = card;

        const image =
            card.querySelector("img");

        const category =
            card.querySelector(
                ".product-category"
            );

        const name =
            card.querySelector("h3");

        const rating =
            card.querySelector(".rating");

        const price =
            card.querySelector(".current-price");


        if (modalProductImage && image) {

            modalProductImage.src =
                image.src;

            modalProductImage.alt =
                image.alt || getProductName(card);

        }


        if (modalProductCategory) {

            modalProductCategory.textContent =
                category
                    ? category.textContent.trim()
                    : "Produit";

        }


        if (modalProductName) {

            modalProductName.textContent =
                name
                    ? name.textContent.trim()
                    : "Produit";

        }


        if (modalProductRating) {

            modalProductRating.innerHTML =
                rating
                    ? rating.innerHTML
                    : "★★★★★";

        }


        if (modalProductPrice) {

            modalProductPrice.textContent =
                price
                    ? price.textContent.trim()
                    : `${getProductPrice(card)}$`;

        }


        if (productModal) {

            productModal.hidden = false;

            productModal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "modal-open"
            );

        }

    }


    function closeModal() {

        if (!productModal) return;

        productModal.hidden = true;

        productModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

        selectedProduct = null;

    }


    if (closeProductModal) {

        closeProductModal.addEventListener(
            "click",
            closeModal
        );

    }


    const modalOverlay =
        productModal?.querySelector(
            ".product-modal-overlay"
        );

    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeModal
        );

    }


    if (modalAddCart) {

        modalAddCart.addEventListener(
            "click",
            () => {

                if (!selectedProduct) return;

                addProductToCart(
                    selectedProduct
                );

                closeModal();

            }
        );

    }


    /* =====================================================
       CLAVIER
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeModal();

                closeMiniCart();

            }

        }
    );


    /* =====================================================
       INITIALISATION
    ===================================================== */

    filterProducts();

    updateCartCount();


    /* =====================================================
       EXPOSITION GLOBALE
       Utile pour panier.js ou d'autres scripts.
    ===================================================== */

    window.YMSFemme = {

        filterProducts,
        addProductToCart,
        openMiniCart,
        closeMiniCart,
        openProductModal,
        closeModal

    };

});