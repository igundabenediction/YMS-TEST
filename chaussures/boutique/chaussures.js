/* =========================================================
   YMS STORE
   CHAUSSURES.JS
   Gestion complète de la page Chaussures
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       ÉLÉMENTS PRINCIPAUX
    ===================================================== */

    const productsGrid = document.getElementById("productsGrid");
    const products = Array.from(
        document.querySelectorAll(".product-card")
    );

    const noProducts = document.getElementById("noProducts");

    const searchInput = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");

    const sortSelect = document.getElementById("sortProducts");

    const categoryButtons = document.querySelectorAll(
        ".category-filter"
    );

    const cartCount = document.getElementById("cartCount");

    const openCart = document.getElementById("openCart");
    const closeCart = document.getElementById("closeCart");

    const miniCart = document.getElementById("miniCart");
    const miniCartOverlay = document.getElementById(
        "miniCartOverlay"
    );

    const miniCartProducts = document.getElementById(
        "miniCartProducts"
    );

    const cartTotal = document.getElementById("cartTotal");

    const checkoutWhatsapp = document.getElementById(
        "checkoutWhatsapp"
    );

    const shopToast = document.getElementById("shopToast");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let currentCategory = "all";
    let currentSearch = "";

    let cart = [];

    try {

        const savedCart = localStorage.getItem(
            "ymsCart"
        );

        if (savedCart) {
            cart = JSON.parse(savedCart);
        }

    } catch (error) {

        console.warn(
            "Impossible de charger le panier.",
            error
        );

        cart = [];
    }


    /* =====================================================
       SAUVEGARDE PANIER
    ===================================================== */

    function saveCart() {

        localStorage.setItem(
            "ymsCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       MISE À JOUR COMPTEUR PANIER
    ===================================================== */

    function updateCartCount() {

        if (!cartCount) return;

        const totalQuantity = cart.reduce(
            (total, product) =>
                total + Number(product.quantity || 1),
            0
        );

        cartCount.textContent = totalQuantity;

        cartCount.classList.remove("cart-bump");

        void cartCount.offsetWidth;

        cartCount.classList.add("cart-bump");
    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message = "Produit ajouté au panier") {

        if (!shopToast) return;

        const text = shopToast.querySelector("span");

        if (text) {
            text.textContent = message;
        }

        shopToast.classList.add("show");

        clearTimeout(
            shopToast.hideTimer
        );

        shopToast.hideTimer = setTimeout(() => {

            shopToast.classList.remove("show");

        }, 2500);
    }


    /* =====================================================
       EXTRACTION PRODUIT
    ===================================================== */

    function getProductData(card) {

        if (!card) return null;

        const image = card.querySelector(
            ".product-image img"
        );

        const nameElement = card.querySelector(
            "h3"
        );

        const categoryElement = card.querySelector(
            ".product-category"
        );

        const priceElement = card.querySelector(
            ".current-price"
        );

        const ratingElement = card.querySelector(
            ".rating"
        );

        return {

            id:
                card.dataset.id ||
                card.dataset.name
                    ?.toLowerCase()
                    .replace(/[^a-z0-9]+/gi, "-"),

            name:
                card.dataset.name ||
                nameElement?.textContent.trim() ||
                "Produit",

            category:
                card.dataset.category ||
                "chaussures",

            price:
                Number(card.dataset.price) ||
                parseFloat(
                    priceElement?.textContent
                        .replace(",", ".")
                        .replace(/[^\d.]/g, "")
                ) ||
                0,

            image:
                image?.getAttribute("src") || "",

            rating:
                ratingElement?.textContent.trim() ||
                "★★★★★",

            newProduct:
                card.dataset.new === "true",

            promotion:
                card.dataset.promotion === "true"
        };
    }


    /* =====================================================
       AJOUT PANIER
    ===================================================== */

    function addToCart(product) {

        if (!product) return;

        const existing = cart.find(
            item => item.id === product.id
        );

        if (existing) {

            existing.quantity =
                Number(existing.quantity || 1) + 1;

        } else {

            cart.push({
                ...product,
                quantity: 1
            });

        }

        saveCart();

        updateCartCount();

        renderCart();

        showToast(
            `${product.name} ajouté au panier`
        );
    }


    /* =====================================================
       SUPPRESSION PRODUIT PANIER
    ===================================================== */

    function removeFromCart(productId) {

        cart = cart.filter(
            item => item.id !== productId
        );

        saveCart();

        updateCartCount();

        renderCart();
    }


    /* =====================================================
       MODIFICATION QUANTITÉ
    ===================================================== */

    function changeQuantity(
        productId,
        change
    ) {

        const product = cart.find(
            item => item.id === productId
        );

        if (!product) return;

        product.quantity =
            Number(product.quantity || 1) +
            Number(change);

        if (product.quantity <= 0) {

            removeFromCart(productId);

            return;
        }

        saveCart();

        updateCartCount();

        renderCart();
    }


    /* =====================================================
       TOTAL PANIER
    ===================================================== */

    function calculateCartTotal() {

        return cart.reduce(
            (total, product) => {

                return total +
                    (
                        Number(product.price) *
                        Number(product.quantity || 1)
                    );

            },
            0
        );
    }


    /* =====================================================
       AFFICHAGE PANIER
    ===================================================== */

    function renderCart() {

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

        } else {

            miniCartProducts.innerHTML =
                cart.map(product => {

                    const quantity =
                        Number(product.quantity || 1);

                    const subtotal =
                        Number(product.price) *
                        quantity;

                    return `
                        <div
                            class="mini-cart-item"
                            data-id="${product.id}"
                        >

                            <div class="mini-cart-item-image">

                                <img
                                    src="${product.image}"
                                    alt="${product.name}"
                                >

                            </div>

                            <div class="mini-cart-item-info">

                                <h4>
                                    ${product.name}
                                </h4>

                                <span>
                                    ${product.price}$
                                </span>

                                <div class="quantity-controls">

                                    <button
                                        type="button"
                                        class="quantity-minus"
                                        data-id="${product.id}"
                                    >
                                        −
                                    </button>

                                    <strong>
                                        ${quantity}
                                    </strong>

                                    <button
                                        type="button"
                                        class="quantity-plus"
                                        data-id="${product.id}"
                                    >
                                        +
                                    </button>

                                </div>

                                <small>
                                    Sous-total :
                                    ${subtotal.toFixed(2)}$
                                </small>

                            </div>

                            <button
                                type="button"
                                class="remove-cart-item"
                                data-id="${product.id}"
                                aria-label="Supprimer"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </div>
                    `;

                }).join("");
        }

        const total =
            calculateCartTotal();

        if (cartTotal) {

            cartTotal.textContent =
                `${total.toFixed(2)}$`;
        }

        updateWhatsappLink();
    }


    /* =====================================================
       COMMANDE WHATSAPP
    ===================================================== */

    function updateWhatsappLink() {

        if (!checkoutWhatsapp) return;

        if (!cart.length) {

            checkoutWhatsapp.href = "#";

            return;
        }

        let message =
            "Bonjour YMS STORE,%0A%0A" +
            "Je souhaite commander :%0A";

        cart.forEach(product => {

            message +=
                `- ${product.name} x${product.quantity} : ` +
                `${(
                    product.price *
                    product.quantity
                ).toFixed(2)}$%0A`;

        });

        message +=
            `%0ATotal : ${calculateCartTotal().toFixed(2)}$`;

        const phone =
            "243971917222";

        checkoutWhatsapp.href =
            `https://wa.me/${phone}?text=${message}`;
    }


    /* =====================================================
       OUVRIR PANIER
    ===================================================== */

    function openMiniCart() {

        if (!miniCart) return;

        miniCart.classList.add("active");

        miniCart.setAttribute(
            "aria-hidden",
            "false"
        );

        if (miniCartOverlay) {

            miniCartOverlay.hidden = false;

            setTimeout(() => {

                miniCartOverlay.classList.add(
                    "active"
                );

            }, 10);
        }

        document.body.classList.add(
            "cart-open"
        );
    }


    /* =====================================================
       FERMER PANIER
    ===================================================== */

    function closeMiniCart() {

        if (!miniCart) return;

        miniCart.classList.remove(
            "active"
        );

        miniCart.setAttribute(
            "aria-hidden",
            "true"
        );

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


    /* =====================================================
       FILTRAGE PRODUITS
    ===================================================== */

    function filterProducts() {

        const search =
            currentSearch
                .trim()
                .toLowerCase();

        let visibleCount = 0;

        products.forEach(card => {

            const data =
                getProductData(card);

            if (!data) return;

            const name =
                data.name.toLowerCase();

            const category =
                data.category.toLowerCase();

            const categoryMatch =
                currentCategory === "all" ||
                category === currentCategory;

            const searchMatch =
                !search ||
                name.includes(search) ||
                category.includes(search);

            const show =
                categoryMatch &&
                searchMatch;

            card.style.display =
                show ? "" : "none";

            if (show) {
                visibleCount++;
            }

        });

        if (noProducts) {

            noProducts.hidden =
                visibleCount !== 0;
        }
    }


    /* =====================================================
       TRI PRODUITS
    ===================================================== */

    function sortProducts() {

        if (!productsGrid) return;

        const sorted =
            [...products];

        const value =
            sortSelect?.value || "default";

        if (value === "price-low") {

            sorted.sort(
                (a, b) =>
                    Number(a.dataset.price || 0) -
                    Number(b.dataset.price || 0)
            );

        }

        else if (value === "price-high") {

            sorted.sort(
                (a, b) =>
                    Number(b.dataset.price || 0) -
                    Number(a.dataset.price || 0)
            );

        }

        else if (value === "name") {

            sorted.sort(
                (a, b) =>
                    (
                        a.dataset.name || ""
                    ).localeCompare(
                        b.dataset.name || "",
                        "fr"
                    )
            );
        }

        sorted.forEach(card => {

            productsGrid.appendChild(card);

        });

        filterProducts();
    }


    /* =====================================================
       CATÉGORIES
    ===================================================== */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );

                button.classList.add(
                    "active"
                );

                currentCategory =
                    button.dataset.category ||
                    "all";

                filterProducts();
            }
        );
    });


    /* =====================================================
       RECHERCHE
    ===================================================== */

    function performSearch() {

        currentSearch =
            searchInput?.value || "";

        filterProducts();
    }


    searchInput?.addEventListener(
        "input",
        performSearch
    );

    searchButton?.addEventListener(
        "click",
        performSearch
    );


    /* =====================================================
       TRI
    ===================================================== */

    sortSelect?.addEventListener(
        "change",
        sortProducts
    );


    /* =====================================================
       ACTIONS PRODUITS
    ===================================================== */

    products.forEach(card => {

        const product =
            getProductData(card);

        if (!product) return;


        /* AJOUT PANIER */

        const addButton =
            card.querySelector(
                ".add-cart"
            );

        addButton?.addEventListener(
            "click",
            () => {

                addToCart(product);

            }
        );


        /* PANIER RAPIDE */

        const quickCart =
            card.querySelector(
                ".quick-cart"
            );

        quickCart?.addEventListener(
            "click",
            () => {

                addToCart(product);

            }
        );


        /* FAVORIS */

        const favorite =
            card.querySelector(
                ".favorite-btn"
            );

        favorite?.addEventListener(
            "click",
            () => {

                favorite.classList.toggle(
                    "active"
                );

                const icon =
                    favorite.querySelector(
                        "i"
                    );

                if (icon) {

                    icon.classList.toggle(
                        "fa-regular"
                    );

                    icon.classList.toggle(
                        "fa-solid"
                    );
                }

                showToast(
                    favorite.classList.contains(
                        "active"
                    )
                        ? "Ajouté aux favoris"
                        : "Retiré des favoris"
                );
            }
        );


        /* APERÇU */

        const viewButton =
            card.querySelector(
                ".view-btn"
            );

        viewButton?.addEventListener(
            "click",
            () => {

                openProductModal(
                    product
                );

            }
        );

    });


    /* =====================================================
       PANIER — ÉVÉNEMENTS
    ===================================================== */

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
       PANIER — BOUTONS DYNAMIQUES
    ===================================================== */

    miniCartProducts?.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button"
                );

            if (!button) return;

            const id =
                button.dataset.id;

            if (!id) return;

            if (
                button.classList.contains(
                    "quantity-minus"
                )
            ) {

                changeQuantity(
                    id,
                    -1
                );

            }

            else if (
                button.classList.contains(
                    "quantity-plus"
                )
            ) {

                changeQuantity(
                    id,
                    1
                );

            }

            else if (
                button.classList.contains(
                    "remove-cart-item"
                )
            ) {

                removeFromCart(id);

            }

        }
    );


    /* =====================================================
       MODAL PRODUIT
    ===================================================== */

    const productModal =
        document.getElementById(
            "productModal"
        );

    const closeProductModal =
        document.getElementById(
            "closeProductModal"
        );

    const modalOverlay =
        productModal?.querySelector(
            ".product-modal-overlay"
        );

    const modalImage =
        document.getElementById(
            "modalProductImage"
        );

    const modalCategory =
        document.getElementById(
            "modalProductCategory"
        );

    const modalName =
        document.getElementById(
            "modalProductName"
        );

    const modalRating =
        document.getElementById(
            "modalProductRating"
        );

    const modalPrice =
        document.getElementById(
            "modalProductPrice"
        );

    const modalAddCart =
        document.getElementById(
            "modalAddCart"
        );

    let modalProduct = null;


    function openProductModal(product) {

        if (!productModal) return;

        modalProduct = product;

        if (modalImage) {

            modalImage.src =
                product.image;

            modalImage.alt =
                product.name;
        }

        if (modalCategory) {

            modalCategory.textContent =
                product.category;
        }

        if (modalName) {

            modalName.textContent =
                product.name;
        }

        if (modalRating) {

            modalRating.textContent =
                product.rating;
        }

        if (modalPrice) {

            modalPrice.textContent =
                `${product.price}$`;
        }

        productModal.hidden = false;

        productModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeProductModalFunction() {

        if (!productModal) return;

        productModal.hidden = true;

        productModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

        modalProduct = null;
    }


    closeProductModal?.addEventListener(
        "click",
        closeProductModalFunction
    );

    modalOverlay?.addEventListener(
        "click",
        closeProductModalFunction
    );


    modalAddCart?.addEventListener(
        "click",
        () => {

            if (!modalProduct) return;

            addToCart(
                modalProduct
            );

            closeProductModalFunction();

        }
    );


    /* =====================================================
       TOUCHE ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;

            closeMiniCart();

            closeProductModalFunction();

        }
    );


    /* =====================================================
       INITIALISATION
    ===================================================== */

    updateCartCount();

    renderCart();

    filterProducts();

});