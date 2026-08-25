
/* ============================================================
   YMS STORE — ACCESSOIRES
   accessoires/accessoires.js
   Gestion : filtres, recherche, tri, panier, favoris,
   aperçu produit et notifications
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       ÉLÉMENTS
    ======================================================== */

    const productsGrid = document.getElementById("productsGrid");
    const noProducts = document.getElementById("noProducts");

    const searchInput = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");

    const sortProducts = document.getElementById("sortProducts");

    const categoryFilters = document.querySelectorAll(".category-filter");

    const openCart = document.getElementById("openCart");
    const closeCart = document.getElementById("closeCart");
    const miniCart = document.getElementById("miniCart");
    const miniCartOverlay = document.getElementById("miniCartOverlay");

    const cartCount = document.getElementById("cartCount");
    const miniCartProducts = document.getElementById("miniCartProducts");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutWhatsapp = document.getElementById("checkoutWhatsapp");

    const productModal = document.getElementById("productModal");
    const closeProductModal = document.getElementById("closeProductModal");
    const modalProductImage = document.getElementById("modalProductImage");
    const modalProductCategory = document.getElementById("modalProductCategory");
    const modalProductName = document.getElementById("modalProductName");
    const modalProductRating = document.getElementById("modalProductRating");
    const modalProductPrice = document.getElementById("modalProductPrice");
    const modalAddCart = document.getElementById("modalAddCart");

    const shopToast = document.getElementById("shopToast");

    const mobileMenu = document.querySelector(".mobile-menu");
    const navigation = document.getElementById("mainNavigation");


    /* ========================================================
       DONNÉES
    ======================================================== */

    let currentCategory = "all";
    let currentSearch = "";

    let cart = JSON.parse(
        localStorage.getItem("ymsCart")
    ) || [];

    let favorites = JSON.parse(
        localStorage.getItem("ymsFavorites")
    ) || [];

    let selectedProduct = null;


    /* ========================================================
       PRODUITS
    ======================================================== */

    const getProducts = () => {

        if (!productsGrid) {
            return [];
        }

        return Array.from(
            productsGrid.querySelectorAll(".product-card")
        );
    };


    /* ========================================================
       NORMALISATION TEXTE
    ======================================================== */

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    }


    /* ========================================================
       TOAST
    ======================================================== */

    function showToast(message = "Produit ajouté au panier") {

        if (!shopToast) return;

        const text = shopToast.querySelector("span");

        if (text) {
            text.textContent = message;
        }

        shopToast.classList.add("show");

        clearTimeout(window.ymsToastTimer);

        window.ymsToastTimer = setTimeout(() => {
            shopToast.classList.remove("show");
        }, 2500);
    }


    /* ========================================================
       PANIER — SAUVEGARDE
    ======================================================== */

    function saveCart() {

        localStorage.setItem(
            "ymsCart",
            JSON.stringify(cart)
        );

    }


    /* ========================================================
       FAVORIS — SAUVEGARDE
    ======================================================== */

    function saveFavorites() {

        localStorage.setItem(
            "ymsFavorites",
            JSON.stringify(favorites)
        );

    }


    /* ========================================================
       CRÉATION ID PRODUIT
    ======================================================== */

    function createProductId(product) {

        const name = product.dataset.name || "produit";

        return normalizeText(name)
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

    }


    /* ========================================================
       RÉCUPÉRER LES INFORMATIONS PRODUIT
    ======================================================== */

    function getProductData(product) {

        if (!product) return null;

        const imageElement =
            product.querySelector(".product-image img");

        const categoryElement =
            product.querySelector(".product-category");

        const nameElement =
            product.querySelector(".product-info h3");

        const priceElement =
            product.querySelector(".current-price");

        const ratingElement =
            product.querySelector(".rating");

        return {

            id: createProductId(product),

            name:
                product.dataset.name ||
                nameElement?.textContent.trim() ||
                "Produit",

            category:
                product.dataset.category ||
                categoryElement?.textContent.trim() ||
                "Accessoires",

            price:
                Number(product.dataset.price || 0),

            priceText:
                priceElement?.textContent.trim() ||
                `${product.dataset.price || 0}$`,

            image:
                imageElement?.getAttribute("src") ||
                "",

            rating:
                ratingElement?.textContent.trim() ||
                "★★★★★",

            newProduct:
                product.dataset.new === "true",

            promotion:
                product.dataset.promotion === "true"

        };

    }


    /* ========================================================
       FILTRAGE DES PRODUITS
    ======================================================== */

    function filterProducts() {

        const products = getProducts();

        let visibleCount = 0;

        products.forEach(product => {

            const category =
                product.dataset.category || "";

            const name =
                product.dataset.name || "";

            const matchesCategory =
                currentCategory === "all" ||
                category === currentCategory;

            const matchesSearch =
                !currentSearch ||
                normalizeText(name).includes(
                    normalizeText(currentSearch)
                );

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


    /* ========================================================
       TRI DES PRODUITS
    ======================================================== */

    function sortProductCards() {

        if (!productsGrid || !sortProducts) return;

        const products = getProducts();

        const sortValue =
            sortProducts.value;

        products.sort((a, b) => {

            const priceA =
                Number(a.dataset.price || 0);

            const priceB =
                Number(b.dataset.price || 0);

            const nameA =
                normalizeText(a.dataset.name);

            const nameB =
                normalizeText(b.dataset.name);


            if (sortValue === "price-low") {
                return priceA - priceB;
            }


            if (sortValue === "price-high") {
                return priceB - priceA;
            }


            if (sortValue === "name") {
                return nameA.localeCompare(nameB);
            }


            return 0;

        });


        products.forEach(product => {

            productsGrid.appendChild(product);

        });

        filterProducts();

    }


    /* ========================================================
       FILTRES CATÉGORIES
    ======================================================== */

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


    /* ========================================================
       RECHERCHE
    ======================================================== */

    function performSearch() {

        currentSearch =
            searchInput?.value.trim() || "";

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


    /* ========================================================
       TRI
    ======================================================== */

    if (sortProducts) {

        sortProducts.addEventListener(
            "change",
            sortProductCards
        );

    }


    /* ========================================================
       PANIER — AJOUT
    ======================================================== */

    function addToCart(product, quantity = 1) {

        const data =
            getProductData(product);

        if (!data) return;

        const existing =
            cart.find(item => item.id === data.id);


        if (existing) {

            existing.quantity += quantity;

        } else {

            cart.push({

                id: data.id,

                name: data.name,

                category: data.category,

                price: data.price,

                image: data.image,

                quantity: quantity

            });

        }


        saveCart();

        updateCartUI();

        showToast(
            `${data.name} ajouté au panier`
        );

    }


    /* ========================================================
       PANIER — SUPPRIMER
    ======================================================== */

    function removeFromCart(id) {

        cart =
            cart.filter(item => item.id !== id);

        saveCart();

        updateCartUI();

    }


    /* ========================================================
       PANIER — QUANTITÉ
    ======================================================== */

    function changeQuantity(id, change) {

        const item =
            cart.find(product => product.id === id);

        if (!item) return;

        item.quantity += change;


        if (item.quantity <= 0) {

            removeFromCart(id);

            return;

        }


        saveCart();

        updateCartUI();

    }


    /* ========================================================
       PANIER — INTERFACE
    ======================================================== */

    function updateCartUI() {

        if (cartCount) {

            const totalQuantity =
                cart.reduce(
                    (total, item) =>
                        total + item.quantity,
                    0
                );

            cartCount.textContent =
                totalQuantity;

        }


        if (!miniCartProducts) return;


        if (cart.length === 0) {

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
                cart.map(item => `

                    <div
                        class="mini-cart-item"
                        data-id="${item.id}"
                    >

                        <div class="mini-cart-item-image">

                            <img
                                src="${item.image}"
                                alt="${item.name}"
                            >

                        </div>


                        <div class="mini-cart-item-info">

                            <h4>
                                ${item.name}
                            </h4>

                            <strong>
                                ${item.price}$
                            </strong>


                            <div class="quantity-controls">

                                <button
                                    type="button"
                                    class="quantity-minus"
                                    data-id="${item.id}"
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    type="button"
                                    class="quantity-plus"
                                    data-id="${item.id}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <button
                            type="button"
                            class="remove-cart-item"
                            data-id="${item.id}"
                            aria-label="Supprimer"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                `).join("");

        }


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    (item.price * item.quantity),
                0
            );


        if (cartTotal) {

            cartTotal.textContent =
                `${total.toFixed(2)}$`;

        }


        updateWhatsAppLink();

    }


    /* ========================================================
       ÉVÉNEMENTS PANIER
    ======================================================== */

    if (miniCartProducts) {

        miniCartProducts.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest("button");

                if (!button) return;

                const id =
                    button.dataset.id;

                if (!id) return;


                if (
                    button.classList.contains(
                        "quantity-minus"
                    )
                ) {

                    changeQuantity(id, -1);

                }


                if (
                    button.classList.contains(
                        "quantity-plus"
                    )
                ) {

                    changeQuantity(id, 1);

                }


                if (
                    button.classList.contains(
                        "remove-cart-item"
                    )
                ) {

                    removeFromCart(id);

                    showToast(
                        "Produit retiré du panier"
                    );

                }

            }
        );

    }


    /* ========================================================
       OUVRIR PANIER
    ======================================================== */

    function openMiniCart() {

        if (!miniCart) return;

        miniCart.classList.add("active");

        miniCart.setAttribute(
            "aria-hidden",
            "false"
        );


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


    /* ========================================================
       FERMER PANIER
    ======================================================== */

    function closeMiniCart() {

        if (!miniCart) return;

        miniCart.classList.remove("active");

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


    if (openCart) {

        openCart.addEventListener(
            "click",
            openMiniCart
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


    /* ========================================================
       FAVORIS
    ======================================================== */

    function updateFavoriteButton(button, id) {

        const icon =
            button.querySelector("i");

        const isFavorite =
            favorites.includes(id);


        button.classList.toggle(
            "active",
            isFavorite
        );


        if (icon) {

            icon.className =
                isFavorite
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart";

        }

    }


    function toggleFavorite(product) {

        const data =
            getProductData(product);

        if (!data) return;

        const index =
            favorites.indexOf(data.id);


        if (index === -1) {

            favorites.push(data.id);

            showToast(
                "Produit ajouté aux favoris"
            );

        } else {

            favorites.splice(index, 1);

            showToast(
                "Produit retiré des favoris"
            );

        }


        saveFavorites();

        updateAllFavoriteButtons();

    }


    function updateAllFavoriteButtons() {

        getProducts().forEach(product => {

            const id =
                createProductId(product);

            const button =
                product.querySelector(
                    ".favorite-btn"
                );

            if (button) {

                updateFavoriteButton(
                    button,
                    id
                );

            }

        });

    }


    /* ========================================================
       BOUTONS PRODUITS
    ======================================================== */

    getProducts().forEach(product => {

        const addButton =
            product.querySelector(".add-cart");

        const quickCart =
            product.querySelector(".quick-cart");

        const favoriteButton =
            product.querySelector(".favorite-btn");

        const viewButton =
            product.querySelector(".view-btn");


        if (addButton) {

            addButton.addEventListener(
                "click",
                () => addToCart(product)
            );

        }


        if (quickCart) {

            quickCart.addEventListener(
                "click",
                () => addToCart(product)
            );

        }


        if (favoriteButton) {

            favoriteButton.addEventListener(
                "click",
                () => toggleFavorite(product)
            );

        }


        if (viewButton) {

            viewButton.addEventListener(
                "click",
                () => openProductModal(product)
            );

        }

    });


    /* ========================================================
       MODAL PRODUIT
    ======================================================== */

    function openProductModal(product) {

        const data =
            getProductData(product);

        if (!data || !productModal) return;

        selectedProduct = product;


        if (modalProductImage) {

            modalProductImage.src =
                data.image;

            modalProductImage.alt =
                data.name;

        }


        if (modalProductCategory) {

            modalProductCategory.textContent =
                data.category;

        }


        if (modalProductName) {

            modalProductName.textContent =
                data.name;

        }


        if (modalProductRating) {

            modalProductRating.textContent =
                data.rating;

        }


        if (modalProductPrice) {

            modalProductPrice.textContent =
                data.priceText;

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


    function closeModal() {

        if (!productModal) return;

        productModal.classList.remove(
            "active"
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

        selectedProduct = null;

    }


    if (closeProductModal) {

        closeProductModal.addEventListener(
            "click",
            closeModal
        );

    }


    if (productModal) {

        const overlay =
            productModal.querySelector(
                ".product-modal-overlay"
            );

        if (overlay) {

            overlay.addEventListener(
                "click",
                closeModal
            );

        }

    }


    if (modalAddCart) {

        modalAddCart.addEventListener(
            "click",
            () => {

                if (!selectedProduct) return;

                addToCart(
                    selectedProduct
                );

                closeModal();

            }
        );

    }


    /* ========================================================
       ESCAPE
    ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeMiniCart();
            closeModal();

        }
    );


    /* ========================================================
       WHATSAPP
    ======================================================== */

    function updateWhatsAppLink() {

        if (!checkoutWhatsapp) return;

        const phone =
            "243971917222";


        if (cart.length === 0) {

            checkoutWhatsapp.href =
                `https://wa.me/${phone}?text=${encodeURIComponent(
                    "Bonjour YMS STORE, je souhaite passer une commande."
                )}`;

            return;

        }


        let message =
            "Bonjour YMS STORE 👋\n\n";

        message +=
            "Je souhaite commander les produits suivants :\n\n";


        cart.forEach((item, index) => {

            message +=
                `${index + 1}. ${item.name} x${item.quantity} — ${(
                    item.price * item.quantity
                ).toFixed(2)}$\n`;

        });


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    item.price * item.quantity,
                0
            );


        message +=
            `\nTotal : ${total.toFixed(2)}$`;

        message +=
            "\n\nMerci de me confirmer la disponibilité et les modalités de livraison.";


        checkoutWhatsapp.href =
            `https://wa.me/${phone}?text=${encodeURIComponent(
                message
            )}`;

    }


    /* ========================================================
       MENU MOBILE
    ======================================================== */

    if (mobileMenu && navigation) {

        mobileMenu.addEventListener(
            "click",
            () => {

                const expanded =
                    mobileMenu.getAttribute(
                        "aria-expanded"
                    ) === "true";

                mobileMenu.setAttribute(
                    "aria-expanded",
                    String(!expanded)
                );

                navigation.classList.toggle(
                    "active"
                );

            }
        );

    }


    /* ========================================================
       INITIALISATION
    ======================================================== */

    updateCartUI();

    updateAllFavoriteButtons();

    filterProducts();

});

