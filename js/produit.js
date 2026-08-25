/* =========================================================
   YMS STORE
   PRODUIT.JS
   Gestion commune des produits
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       UTILITAIRES
    ===================================================== */

    function getProductData(product) {

        if (!product) {
            return null;
        }

        const image =
            product.querySelector("img")?.src || "";

        const name =
            product.dataset.name ||
            product.querySelector("h3")?.textContent.trim() ||
            "Produit";

        const category =
            product.dataset.category ||
            product.querySelector(".product-category")
                ?.textContent.trim() ||
            "Produit";

        const price =
            Number(product.dataset.price || 0);

        const rating =
            product.querySelector(".rating")
                ?.textContent.trim() ||
            "★★★★★";

        const oldPrice =
            product.querySelector(".old-price")
                ?.textContent.trim() ||
            "";

        return {
            id: createProductId(name),
            name,
            category,
            price,
            image,
            rating,
            oldPrice
        };
    }


    /* =====================================================
       ID PRODUIT
    ===================================================== */

    function createProductId(name) {

        return String(name)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

    }


    /* =====================================================
       FAVORIS
    ===================================================== */

    function getFavorites() {

        try {

            return JSON.parse(
                localStorage.getItem("ymsFavorites")
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


    function toggleFavorite(product) {

        const data =
            getProductData(product);

        if (!data) {
            return;
        }

        let favorites =
            getFavorites();

        const index =
            favorites.findIndex(
                item => item.id === data.id
            );


        if (index >= 0) {

            favorites.splice(index, 1);

            updateFavoriteButton(
                product,
                false
            );

            showProductMessage(
                "Produit retiré des favoris"
            );

        } else {

            favorites.push(data);

            updateFavoriteButton(
                product,
                true
            );

            showProductMessage(
                "Produit ajouté aux favoris"
            );

        }


        saveFavorites(favorites);

    }


    function updateFavoriteButton(
        product,
        active
    ) {

        const button =
            product.querySelector(
                ".favorite-btn"
            );

        if (!button) {
            return;
        }

        const icon =
            button.querySelector("i");

        button.classList.toggle(
            "active",
            active
        );


        if (icon) {

            icon.className = active
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";

        }

    }


    function initializeFavorites() {

        const favorites =
            getFavorites();

        document
            .querySelectorAll(".product-card")
            .forEach(product => {

                const data =
                    getProductData(product);

                if (!data) {
                    return;
                }

                const exists =
                    favorites.some(
                        item => item.id === data.id
                    );

                updateFavoriteButton(
                    product,
                    exists
                );

            });

    }


    /* =====================================================
       AJOUT AU PANIER
    ===================================================== */

    function addProduct(product) {

        const data =
            getProductData(product);

        if (!data) {
            return;
        }


        /* ---------------------------------------------
           Utiliser panier.js s'il fournit addToCart()
        --------------------------------------------- */

        if (
            typeof window.addToCart ===
            "function"
        ) {

            window.addToCart(data);

        } else {

            /* -----------------------------------------
               Solution locale de secours
            ----------------------------------------- */

            let cart = [];

            try {

                cart =
                    JSON.parse(
                        localStorage.getItem(
                            "ymsCart"
                        )
                    ) || [];

            } catch {

                cart = [];

            }


            const existing =
                cart.find(
                    item =>
                        item.id === data.id
                );


            if (existing) {

                existing.quantity =
                    Number(
                        existing.quantity || 1
                    ) + 1;

            } else {

                cart.push({
                    ...data,
                    quantity: 1
                });

            }


            localStorage.setItem(
                "ymsCart",
                JSON.stringify(cart)
            );


            window.dispatchEvent(
                new CustomEvent(
                    "ymsCartUpdated"
                )
            );

        }


        showProductMessage(
            `${data.name} ajouté au panier`
        );

    }


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    let messageTimer;


    function showProductMessage(
        message
    ) {

        let notification =
            document.getElementById(
                "productNotification"
            );


        if (!notification) {

            notification =
                document.createElement("div");

            notification.id =
                "productNotification";

            notification.innerHTML = `
                <i class="fa-solid fa-check"></i>
                <span></span>
            `;

            document.body.appendChild(
                notification
            );


            const style =
                document.createElement("style");

            style.textContent = `
                #productNotification {
                    position: fixed;
                    right: 25px;
                    bottom: 25px;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 20px;
                    background: #111;
                    color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,.2);
                    font-size: 14px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: .3s ease;
                }

                #productNotification.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                #productNotification i {
                    color: #d4af37;
                }

                @media (max-width: 600px) {
                    #productNotification {
                        left: 15px;
                        right: 15px;
                        bottom: 15px;
                        justify-content: center;
                    }
                }
            `;

            document.head.appendChild(
                style
            );

        }


        notification.querySelector(
            "span"
        ).textContent = message;


        notification.classList.add(
            "show"
        );


        clearTimeout(messageTimer);


        messageTimer =
            setTimeout(() => {

                notification.classList.remove(
                    "show"
                );

            }, 2500);

    }


    /* =====================================================
       BOUTONS PRODUITS
    ===================================================== */

    document
        .querySelectorAll(".product-card")
        .forEach(product => {

            /* -----------------------------------------
               FAVORIS
            ----------------------------------------- */

            const favorite =
                product.querySelector(
                    ".favorite-btn"
                );

            favorite?.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleFavorite(product);

                }
            );


            /* -----------------------------------------
               AJOUT AU PANIER
            ----------------------------------------- */

            const addCart =
                product.querySelector(
                    ".add-cart"
                );

            addCart?.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    addProduct(product);

                }
            );


            /* -----------------------------------------
               AJOUT RAPIDE
            ----------------------------------------- */

            const quickCart =
                product.querySelector(
                    ".quick-cart"
                );

            quickCart?.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    addProduct(product);

                }
            );

        });


    /* =====================================================
       EXPOSER LES FONCTIONS
       POUR LES AUTRES PAGES
    ===================================================== */

    window.YMSProduct = {

        getData: getProductData,
        addToCart: addProduct,
        toggleFavorite,
        getFavorites,
        createProductId

    };


    /* =====================================================
       INITIALISATION
    ===================================================== */

    initializeFavorites();


    console.log(
        "YMS STORE — produit.js chargé."
    );

});