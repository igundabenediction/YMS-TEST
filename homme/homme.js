/* =========================================================
   YMS STORE
   HOMME.JS
   Gestion de la page Homme
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ÉLÉMENTS
    ===================================================== */

    const productsGrid = document.getElementById("productsGrid");
    const noProducts = document.getElementById("noProducts");
    const searchInput = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");
    const sortProducts = document.getElementById("sortProducts");

    const categoryFilters = document.querySelectorAll(".category-filter");

    if (!productsGrid) {
        console.warn("YMS STORE : #productsGrid introuvable.");
        return;
    }


    /* =====================================================
       DONNÉES
    ===================================================== */

    let products = Array.from(
        productsGrid.querySelectorAll(".product-card")
    );


    /* =====================================================
       NORMALISATION DU TEXTE
    ===================================================== */

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }


    /* =====================================================
       AFFICHAGE / FILTRAGE
    ===================================================== */

    let currentCategory = "all";
    let currentSearch = "";


    function filterProducts() {

        const search = normalizeText(currentSearch);

        let visibleProducts = products.filter(product => {

            const category =
                normalizeText(product.dataset.category);

            const name =
                normalizeText(product.dataset.name);

            const description =
                normalizeText(
                    product.querySelector(".product-info")?.textContent
                );

            const categoryMatch =
                currentCategory === "all" ||
                category === normalizeText(currentCategory);

            const searchMatch =
                !search ||
                name.includes(search) ||
                category.includes(search) ||
                description.includes(search);

            return categoryMatch && searchMatch;

        });


        sortProductElements(visibleProducts);

        displayProducts(visibleProducts);

    }


    /* =====================================================
       AFFICHER LES PRODUITS
    ===================================================== */

    function displayProducts(visibleProducts) {

        products.forEach(product => {

            product.style.display = "none";

        });


        visibleProducts.forEach((product, index) => {

            product.style.display = "";

            product.style.animationDelay =
                `${index * 0.04}s`;

        });


        if (noProducts) {

            noProducts.style.display =
                visibleProducts.length === 0
                    ? "flex"
                    : "none";

        }

    }


    /* =====================================================
       TRI
    ===================================================== */

    function sortProductElements(productList) {

        const sortValue =
            sortProducts?.value || "default";


        productList.sort((a, b) => {

            const priceA =
                parseFloat(a.dataset.price) || 0;

            const priceB =
                parseFloat(b.dataset.price) || 0;

            const nameA =
                normalizeText(a.dataset.name);

            const nameB =
                normalizeText(b.dataset.name);


            switch (sortValue) {

                case "price-low":
                    return priceA - priceB;

                case "price-high":
                    return priceB - priceA;

                case "name":
                    return nameA.localeCompare(nameB);

                default:
                    return 0;

            }

        });


        productList.forEach(product => {

            productsGrid.appendChild(product);

        });

    }


    /* =====================================================
       CATÉGORIES
    ===================================================== */

    categoryFilters.forEach(button => {

        button.addEventListener("click", () => {

            categoryFilters.forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");


            currentCategory =
                button.dataset.category || "all";


            filterProducts();

        });

    });


    /* =====================================================
       RECHERCHE
    ===================================================== */

    function performSearch() {

        currentSearch =
            searchInput?.value || "";

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

                    event.preventDefault();

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

    if (sortProducts) {

        sortProducts.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =====================================================
       FAVORIS
    ===================================================== */

    const favoriteButtons =
        document.querySelectorAll(".favorite-btn");


    favoriteButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();


            const icon =
                button.querySelector("i");


            button.classList.toggle("active");


            if (icon) {

                if (button.classList.contains("active")) {

                    icon.classList.remove("fa-regular");
                    icon.classList.add("fa-solid");

                } else {

                    icon.classList.remove("fa-solid");
                    icon.classList.add("fa-regular");

                }

            }


            const card =
                button.closest(".product-card");


            const productName =
                card?.dataset.name || "Produit";


            saveFavorite(
                productName,
                button.classList.contains("active")
            );

        });

    });


    /* =====================================================
       FAVORIS LOCALSTORAGE
    ===================================================== */

    function saveFavorite(name, active) {

        let favorites = [];

        try {

            favorites =
                JSON.parse(
                    localStorage.getItem("ymsFavorites")
                ) || [];

        } catch (error) {

            favorites = [];

        }


        if (active) {

            if (!favorites.includes(name)) {

                favorites.push(name);

            }

        } else {

            favorites =
                favorites.filter(
                    item => item !== name
                );

        }


        localStorage.setItem(
            "ymsFavorites",
            JSON.stringify(favorites)
        );

    }


    /* =====================================================
       RESTAURATION DES FAVORIS
    ===================================================== */

    function restoreFavorites() {

        let favorites = [];

        try {

            favorites =
                JSON.parse(
                    localStorage.getItem("ymsFavorites")
                ) || [];

        } catch (error) {

            favorites = [];

        }


        favoriteButtons.forEach(button => {

            const card =
                button.closest(".product-card");

            const name =
                card?.dataset.name;


            if (favorites.includes(name)) {

                button.classList.add("active");


                const icon =
                    button.querySelector("i");


                if (icon) {

                    icon.classList.remove("fa-regular");
                    icon.classList.add("fa-solid");

                }

            }

        });

    }


    /* =====================================================
       AJOUT RAPIDE AU PANIER
       Compatible avec panier.js
    ===================================================== */

    const quickCartButtons =
        document.querySelectorAll(".quick-cart");


    quickCartButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const card =
                button.closest(".product-card");

            addProductToCart(card);

        });

    });


    /* =====================================================
       BOUTONS "AJOUTER AU PANIER"
    ===================================================== */

    const addCartButtons =
        document.querySelectorAll(".add-cart");


    addCartButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const card =
                button.closest(".product-card");

            addProductToCart(card);

        });

    });


    /* =====================================================
       AJOUT PRODUIT
    ===================================================== */

    function addProductToCart(card) {

        if (!card) return;


        const name =
            card.dataset.name ||
            card.querySelector("h3")?.textContent.trim() ||
            "Produit";


        const price =
            parseFloat(card.dataset.price) || 0;


        const image =
            card.querySelector("img")?.src || "";


        const category =
            card.dataset.category || "homme";


        const product = {

            id: generateProductId(name),

            name: name,

            price: price,

            image: image,

            category: category,

            quantity: 1

        };


        /*
         * Si panier.js possède une fonction globale,
         * on l'utilise.
         */

        if (
            typeof window.addToCart === "function"
        ) {

            window.addToCart(product);

            showNotification(
                `${name} ajouté au panier`
            );

            return;

        }


        /*
         * Sinon, stockage local de secours.
         */

        let cart = [];

        try {

            cart =
                JSON.parse(
                    localStorage.getItem("ymsCart")
                ) || [];

        } catch (error) {

            cart = [];

        }


        const existingProduct =
            cart.find(
                item => item.id === product.id
            );


        if (existingProduct) {

            existingProduct.quantity =
                (existingProduct.quantity || 1) + 1;

        } else {

            cart.push(product);

        }


        localStorage.setItem(
            "ymsCart",
            JSON.stringify(cart)
        );


        updateCartCount(cart);

        showNotification(
            `${name} ajouté au panier`
        );

    }


    /* =====================================================
       ID PRODUIT
    ===================================================== */

    function generateProductId(name) {

        return normalizeText(name)
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }


    /* =====================================================
       COMPTEUR PANIER
    ===================================================== */

    function updateCartCount(cart) {

        const cartCount =
            document.getElementById("cartCount");


        if (!cartCount) return;


        const total =
            cart.reduce(
                (sum, item) =>
                    sum + (Number(item.quantity) || 1),
                0
            );


        cartCount.textContent = total;


        cartCount.classList.add("cart-bump");


        setTimeout(() => {

            cartCount.classList.remove(
                "cart-bump"
            );

        }, 350);

    }


    /* =====================================================
       APERÇU RAPIDE
    ===================================================== */

    const viewButtons =
        document.querySelectorAll(".view-btn");


    viewButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();


            const card =
                button.closest(".product-card");


            if (!card) return;


            openProductPreview(card);

        });

    });


    /* =====================================================
       MODAL APERÇU
    ===================================================== */

    function openProductPreview(card) {

        const name =
            card.dataset.name ||
            "Produit";


        const price =
            card.dataset.price ||
            "0";


        const image =
            card.querySelector("img")?.src || "";


        const category =
            card.querySelector(".product-category")
                ?.textContent.trim() ||
            "Homme";


        const rating =
            card.querySelector(".rating")
                ?.textContent.trim() ||
            "★★★★★";


        let modal =
            document.getElementById(
                "productPreviewModal"
            );


        if (!modal) {

            modal =
                document.createElement("div");

            modal.id =
                "productPreviewModal";

            modal.className =
                "product-preview-modal";


            modal.innerHTML = `

                <div class="preview-overlay"></div>

                <div class="preview-content">

                    <button
                        class="preview-close"
                        type="button"
                        aria-label="Fermer"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                    <div class="preview-image">

                        <img
                            class="preview-product-image"
                            src=""
                            alt=""
                        >

                    </div>

                    <div class="preview-details">

                        <span class="preview-category"></span>

                        <h2 class="preview-name"></h2>

                        <div class="preview-rating"></div>

                        <div class="preview-price"></div>

                        <button
                            class="preview-add-cart"
                            type="button"
                        >
                            <i class="fa-solid fa-cart-shopping"></i>
                            Ajouter au panier
                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(modal);


            const closeButton =
                modal.querySelector(
                    ".preview-close"
                );


            const overlay =
                modal.querySelector(
                    ".preview-overlay"
                );


            closeButton.addEventListener(
                "click",
                closeProductPreview
            );


            overlay.addEventListener(
                "click",
                closeProductPreview
            );


            document.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Escape" &&
                        modal.classList.contains("active")
                    ) {

                        closeProductPreview();

                    }

                }
            );

        }


        modal.querySelector(
            ".preview-product-image"
        ).src = image;


        modal.querySelector(
            ".preview-product-image"
        ).alt = name;


        modal.querySelector(
            ".preview-category"
        ).textContent = category;


        modal.querySelector(
            ".preview-name"
        ).textContent = name;


        modal.querySelector(
            ".preview-rating"
        ).textContent = rating;


        modal.querySelector(
            ".preview-price"
        ).textContent = `${price}$`;


        const addButton =
            modal.querySelector(
                ".preview-add-cart"
            );


        /*
         * Remplace le bouton précédent
         * afin d'éviter plusieurs événements.
         */

        addButton.onclick = () => {

            addProductToCart(card);

            closeProductPreview();

        };


        modal.classList.add("active");

        document.body.classList.add(
            "modal-open"
        );

    }


    /* =====================================================
       FERMER APERÇU
    ===================================================== */

    function closeProductPreview() {

        const modal =
            document.getElementById(
                "productPreviewModal"
            );


        if (!modal) return;


        modal.classList.remove("active");

        document.body.classList.remove(
            "modal-open"
        );

    }


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    function showNotification(message) {

        let notification =
            document.getElementById(
                "ymsNotification"
            );


        if (!notification) {

            notification =
                document.createElement("div");

            notification.id =
                "ymsNotification";

            notification.className =
                "yms-notification";


            document.body.appendChild(
                notification
            );

        }


        notification.innerHTML = `

            <i class="fa-solid fa-circle-check"></i>

            <span>${escapeHTML(message)}</span>

        `;


        notification.classList.add("show");


        clearTimeout(
            notification.hideTimer
        );


        notification.hideTimer =
            setTimeout(() => {

                notification.classList.remove(
                    "show"
                );

            }, 2500);

    }


    /* =====================================================
       PROTECTION HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       ANIMATION DES PRODUITS
    ===================================================== */

    function prepareProductAnimation() {

        products.forEach((product, index) => {

            product.style.animationDelay =
                `${index * 0.05}s`;

        });

    }


    /* =====================================================
       INITIALISATION
    ===================================================== */

    restoreFavorites();

    prepareProductAnimation();

    filterProducts();


    console.log(
        "YMS STORE — Homme.js chargé avec succès."
    );

});