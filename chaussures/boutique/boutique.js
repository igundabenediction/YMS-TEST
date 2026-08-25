/* =========================================================
   YMS STORE
   BOUTIQUE.JS
   Gestion de la boutique et des produits
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       ÉLÉMENTS DOM
    ===================================================== */

    const productsGrid = document.getElementById("productsGrid");
    const productSearch = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");
    const sortProducts = document.getElementById("sortProducts");
    const categoryFilters = document.querySelectorAll(".category-filter");
    const noProducts = document.getElementById("noProducts");

    const productModal = document.getElementById("productModal");
    const productModalOverlay = productModal
        ? productModal.querySelector(".product-modal-overlay")
        : null;

    const closeProductModal = document.getElementById("closeProductModal");

    const modalProductImage = document.getElementById("modalProductImage");
    const modalProductCategory = document.getElementById("modalProductCategory");
    const modalProductName = document.getElementById("modalProductName");
    const modalProductRating = document.getElementById("modalProductRating");
    const modalProductPrice = document.getElementById("modalProductPrice");
    const modalAddCart = document.getElementById("modalAddCart");

    const shopToast = document.getElementById("shopToast");

    let currentCategory = "all";
    let currentSearch = "";
    let currentProduct = null;


    /* =====================================================
       RÉCUPÉRER LES PRODUITS
    ===================================================== */

    function getProducts() {

        if (!productsGrid) {
            return [];
        }

        return Array.from(
            productsGrid.querySelectorAll(".product-card")
        );
    }


    /* =====================================================
       NORMALISER LE TEXTE
    ===================================================== */

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }


    /* =====================================================
       PRIX
    ===================================================== */

    function getProductPrice(product) {

        return Number(
            product.dataset.price || 0
        );

    }


    /* =====================================================
       NOM
    ===================================================== */

    function getProductName(product) {

        return product.dataset.name ||
            product.querySelector("h3")?.textContent.trim() ||
            "";

    }


    /* =====================================================
       CATÉGORIE
    ===================================================== */

    function getProductCategory(product) {

        return normalizeText(
            product.dataset.category || ""
        );

    }


    /* =====================================================
       RECHERCHE
    ===================================================== */

    function searchProducts() {

        currentSearch = normalizeText(
            productSearch ? productSearch.value : ""
        );

        filterAndSortProducts();

    }


    /* =====================================================
       FILTRAGE
    ===================================================== */

    function productMatches(product) {

        const category = getProductCategory(product);
        const name = normalizeText(getProductName(product));

        const categoryName =
            normalizeText(
                product.querySelector(".product-category")?.textContent
            );

        const searchableText =
            `${name} ${category} ${categoryName}`;

        /* -----------------------------
           CATÉGORIE
        ----------------------------- */

        let categoryMatch = true;

        if (currentCategory !== "all") {

            if (currentCategory === "nouveautes") {

                categoryMatch =
                    product.dataset.new === "true";

            } else if (currentCategory === "promotions") {

                categoryMatch =
                    product.dataset.promotion === "true";

            } else {

                categoryMatch =
                    category === currentCategory;

            }

        }


        /* -----------------------------
           RECHERCHE
        ----------------------------- */

        const searchMatch =
            currentSearch === "" ||
            searchableText.includes(currentSearch);


        return categoryMatch && searchMatch;

    }


    /* =====================================================
       FILTRER + TRIER
    ===================================================== */

    function filterAndSortProducts() {

        const products = getProducts();

        if (!products.length) {
            return;
        }

        const visibleProducts = products.filter(
            productMatches
        );


        /* =================================================
           TRI
        ================================================= */

        const sortValue =
            sortProducts?.value || "default";


        visibleProducts.sort((a, b) => {

            switch (sortValue) {

                case "price-low":

                    return (
                        getProductPrice(a) -
                        getProductPrice(b)
                    );


                case "price-high":

                    return (
                        getProductPrice(b) -
                        getProductPrice(a)
                    );


                case "name":

                    return getProductName(a)
                        .localeCompare(
                            getProductName(b),
                            "fr",
                            {
                                sensitivity: "base"
                            }
                        );


                default:

                    return 0;

            }

        });


        /* =================================================
           AFFICHAGE
        ================================================= */

        products.forEach(product => {

            product.style.display = "none";

        });


        visibleProducts.forEach((product, index) => {

            product.style.display = "";

            product.style.animation = "none";

            void product.offsetWidth;

            product.style.animation =
                "productFadeIn .35s ease";

        });


        /* =================================================
           MESSAGE AUCUN PRODUIT
        ================================================= */

        if (noProducts) {

            noProducts.hidden =
                visibleProducts.length !== 0;

        }

    }


    /* =====================================================
       FILTRE CATÉGORIE
    ===================================================== */

    categoryFilters.forEach(button => {

        button.addEventListener("click", () => {

            categoryFilters.forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");


            currentCategory =
                button.dataset.category || "all";


            filterAndSortProducts();


            /* ---------------------------------------------
               MOBILE : REMONTER VERS LES PRODUITS
            --------------------------------------------- */

            if (window.innerWidth <= 768) {

                setTimeout(() => {

                    productsGrid?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 100);

            }

        });

    });


    /* =====================================================
       TRI
    ===================================================== */

    if (sortProducts) {

        sortProducts.addEventListener(
            "change",
            filterAndSortProducts
        );

    }


    /* =====================================================
       RECHERCHE
    ===================================================== */

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            searchProducts
        );


        productSearch.addEventListener(
            "search",
            searchProducts
        );


        productSearch.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    searchProducts();

                }

            }
        );

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchProducts
        );

    }


    /* =====================================================
       FAVORIS
    ===================================================== */

    function getFavorites() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "ymsFavorites"
                )
            ) || [];

        } catch {

            return [];

        }

    }


    function saveFavorites(favorites) {

        localStorage.setItem(
            "ymsFavorites",
            JSON.stringify(favorites)
        );

    }


    function getFavoriteId(product) {

        return (
            product.dataset.name ||
            product.querySelector("h3")?.textContent.trim()
        );

    }


    function updateFavoriteButtons() {

        const favorites = getFavorites();

        getProducts().forEach(product => {

            const button =
                product.querySelector(".favorite-btn");

            if (!button) {
                return;
            }

            const icon =
                button.querySelector("i");

            const id =
                getFavoriteId(product);

            const active =
                favorites.includes(id);


            button.classList.toggle(
                "active",
                active
            );


            if (icon) {

                icon.className = active
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart";

            }

            button.setAttribute(
                "aria-label",
                active
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
            );

        });

    }


    function toggleFavorite(product) {

        const id =
            getFavoriteId(product);

        if (!id) {
            return;
        }

        let favorites =
            getFavorites();

        const exists =
            favorites.includes(id);


        if (exists) {

            favorites =
                favorites.filter(
                    item => item !== id
                );

            showToast(
                "Produit retiré des favoris",
                "heart"
            );

        } else {

            favorites.push(id);

            showToast(
                "Produit ajouté aux favoris",
                "heart"
            );

        }


        saveFavorites(favorites);

        updateFavoriteButtons();

    }


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer = null;


    function showToast(
        message = "Produit ajouté au panier",
        icon = "check"
    ) {

        if (!shopToast) {
            return;
        }

        const iconElement =
            shopToast.querySelector("i");

        const textElement =
            shopToast.querySelector("span");


        if (iconElement) {

            iconElement.className =
                `fa-solid fa-${icon}`;

        }


        if (textElement) {

            textElement.textContent =
                message;

        }


        shopToast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer = setTimeout(() => {

            shopToast.classList.remove("show");

        }, 2800);

    }


    /* =====================================================
       AJOUT PANIER
    ===================================================== */

    function addProductToCart(product) {

        if (!product) {
            return;
        }


        const name =
            getProductName(product);

        const price =
            getProductPrice(product);


        const image =
            product.querySelector("img")?.src || "";


        /* ---------------------------------------------
           Si panier.js expose une fonction
        --------------------------------------------- */

        if (
            typeof window.addToCart === "function"
        ) {

            window.addToCart({
                name,
                price,
                image,
                quantity: 1
            });

        }


        /* ---------------------------------------------
           Sinon sauvegarde locale compatible
        --------------------------------------------- */

        else {

            try {

                const cart =
                    JSON.parse(
                        localStorage.getItem(
                            "ymsCart"
                        )
                    ) || [];


                const existing =
                    cart.find(
                        item => item.name === name
                    );


                if (existing) {

                    existing.quantity =
                        Number(existing.quantity || 0) + 1;

                } else {

                    cart.push({
                        name,
                        price,
                        image,
                        quantity: 1
                    });

                }


                localStorage.setItem(
                    "ymsCart",
                    JSON.stringify(cart)
                );


                window.dispatchEvent(
                    new CustomEvent(
                        "ymsCartUpdated",
                        {
                            detail: cart
                        }
                    )
                );

            } catch (error) {

                console.error(
                    "Erreur panier :",
                    error
                );

            }

        }


        showToast(
            `${name} ajouté au panier`,
            "check"
        );

    }


    /* =====================================================
       APERÇU PRODUIT
    ===================================================== */

    function openProductModal(product) {

        if (!productModal) {
            return;
        }


        currentProduct = product;


        const image =
            product.querySelector("img");

        const category =
            product.querySelector(
                ".product-category"
            );

        const name =
            getProductName(product);

        const rating =
            product.querySelector(
                ".rating"
            );

        const price =
            product.querySelector(
                ".current-price"
            );


        if (modalProductImage) {

            modalProductImage.src =
                image?.src || "";

            modalProductImage.alt =
                name;

        }


        if (modalProductCategory) {

            modalProductCategory.textContent =
                category?.textContent.trim() ||
                "Produit";

        }


        if (modalProductName) {

            modalProductName.textContent =
                name;

        }


        if (modalProductRating) {

            modalProductRating.innerHTML =
                rating?.innerHTML ||
                "★★★★★";

        }


        if (modalProductPrice) {

            modalProductPrice.textContent =
                price?.textContent.trim() ||
                `${getProductPrice(product)}$`;

        }


        productModal.hidden = false;

        productModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );


        requestAnimationFrame(() => {

            productModal.classList.add(
                "show"
            );

        });

    }


    /* =====================================================
       FERMER MODAL
    ===================================================== */

    function closeModal() {

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


        document.body.classList.remove(
            "modal-open"
        );


        setTimeout(() => {

            productModal.hidden = true;

        }, 250);


        currentProduct = null;

    }


    /* =====================================================
       ACTIONS PRODUITS
    ===================================================== */

    getProducts().forEach(product => {


        /* ---------------------------------------------
           FAVORIS
        --------------------------------------------- */

        const favoriteButton =
            product.querySelector(
                ".favorite-btn"
            );


        favoriteButton?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                toggleFavorite(product);

            }
        );


        /* ---------------------------------------------
           APERÇU
        --------------------------------------------- */

        const viewButton =
            product.querySelector(
                ".view-btn"
            );


        viewButton?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                openProductModal(product);

            }
        );


        /* ---------------------------------------------
           AJOUT RAPIDE
        --------------------------------------------- */

        const quickCart =
            product.querySelector(
                ".quick-cart"
            );


        quickCart?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                addProductToCart(product);

            }
        );


        /* ---------------------------------------------
           BOUTON AJOUTER AU PANIER
        --------------------------------------------- */

        const addCart =
            product.querySelector(
                ".add-cart"
            );


        addCart?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                addProductToCart(product);

            }
        );


        /* ---------------------------------------------
           CLIQUER SUR L'IMAGE
        --------------------------------------------- */

        product
            .querySelector(".product-image")
            ?.addEventListener(
                "dblclick",
                () => {

                    openProductModal(product);

                }
            );

    });


    /* =====================================================
       MODAL
    ===================================================== */

    closeProductModal?.addEventListener(
        "click",
        closeModal
    );


    productModalOverlay?.addEventListener(
        "click",
        closeModal
    );


    productModal?.querySelector(
        ".product-modal-content"
    )?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    modalAddCart?.addEventListener(
        "click",
        () => {

            if (currentProduct) {

                addProductToCart(
                    currentProduct
                );

                closeModal();

            }

        }
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                productModal &&
                !productModal.hidden
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       INITIALISATION
    ===================================================== */

    updateFavoriteButtons();

    filterAndSortProducts();


    /* =====================================================
       ANIMATION CSS AUTOMATIQUE
       seulement si elle n'existe pas déjà
    ===================================================== */

    if (
        !document.getElementById(
            "yms-product-animation"
        )
    ) {

        const style =
            document.createElement("style");

        style.id =
            "yms-product-animation";

        style.textContent = `
            @keyframes productFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(12px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            body.modal-open {
                overflow: hidden;
            }

            .shop-toast {
                pointer-events: none;
            }

            .product-modal[hidden],
            .mini-cart-overlay[hidden] {
                display: none !important;
            }
        `;

        document.head.appendChild(style);

    }


    /* =====================================================
       SYNCHRONISATION PANIER
    ===================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key === "ymsCart" ||
                event.key === "panierYMS"
            ) {

                if (
                    typeof window.updateCartUI ===
                    "function"
                ) {

                    window.updateCartUI();

                }

            }

        }
    );


    console.log(
        "YMS STORE — Boutique initialisée avec succès."
    );

});