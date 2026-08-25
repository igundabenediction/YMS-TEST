/* =========================================================
   YMS STORE
   FEMME.JS
   Gestion complète de la page Femme
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const productsGrid = document.getElementById("productsGrid");
    const products = productsGrid
        ? Array.from(productsGrid.querySelectorAll(".product-card"))
        : [];

    const filters = document.querySelectorAll(".category-filter");
    const sortSelect = document.getElementById("sortProducts");

    const searchInput = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");

    const noProducts = document.getElementById("noProducts");

    const openCart = document.getElementById("openCart");
    const closeCart = document.getElementById("closeCart");

    const miniCart = document.getElementById("miniCart");
    const miniCartOverlay = document.getElementById("miniCartOverlay");

    const miniCartProducts =
        document.getElementById("miniCartProducts");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutWhatsapp =
        document.getElementById("checkoutWhatsapp");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    const navigation =
        document.getElementById("mainNavigation");

    /* =====================================================
       MODAL PRODUIT
    ===================================================== */

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

    /* =====================================================
       TOAST
    ===================================================== */

    const shopToast =
        document.getElementById("shopToast");

    let selectedProduct = null;

    /* =====================================================
       PANIER
    ===================================================== */

    let cart = JSON.parse(
        localStorage.getItem("ymsCart")
    ) || [];

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
       NOTIFICATION
    ===================================================== */

    function showToast(message = "Produit ajouté au panier") {

        if (!shopToast) return;

        const text =
            shopToast.querySelector("span");

        if (text) {
            text.textContent = message;
        }

        shopToast.classList.add("show");

        clearTimeout(window.ymsToastTimer);

        window.ymsToastTimer = setTimeout(() => {

            shopToast.classList.remove("show");

        }, 2500);

    }

    /* =====================================================
       INFORMATIONS PRODUIT
    ===================================================== */

    function getProductData(card) {

        const image =
            card.querySelector(".product-image img");

        const name =
            card.dataset.name ||
            card.querySelector("h3")?.textContent.trim() ||
            "Produit";

        const category =
            card.querySelector(".product-category")
                ?.textContent.trim() ||
            card.dataset.category ||
            "Femme";

        const price =
            parseFloat(card.dataset.price || 0);

        const rating =
            card.querySelector(".rating")
                ?.textContent.trim() ||
            "★★★★★";

        return {

            id: `${name}-${price}`,

            name,

            category,

            price,

            image: image?.src || "",

            rating

        };

    }

    /* =====================================================
       AJOUT AU PANIER
    ===================================================== */

    function addToCart(card) {

        const product =
            getProductData(card);

        const existing =
            cart.find(item => item.id === product.id);

        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({

                ...product,

                quantity: 1

            });

        }

        saveCart();

        updateCart();

        showToast(
            `${product.name} ajouté au panier`
        );

    }

    /* =====================================================
       SUPPRIMER DU PANIER
    ===================================================== */

    function removeFromCart(id) {

        cart =
            cart.filter(item => item.id !== id);

        saveCart();

        updateCart();

    }

    /* =====================================================
       MODIFIER QUANTITE
    ===================================================== */

    function changeQuantity(id, amount) {

        const item =
            cart.find(product => product.id === id);

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {

            removeFromCart(id);

            return;

        }

        saveCart();

        updateCart();

    }

    /* =====================================================
       MISE À JOUR PANIER
    ===================================================== */

    function updateCart() {

        const quantity =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );

        const total =
            cart.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            );

        if (cartCount) {

            cartCount.textContent =
                quantity;

        }

        if (cartTotal) {

            cartTotal.textContent =
                `${total.toFixed(2)}$`;

        }

        renderCart();

        updateWhatsAppLink();

    }

    /* =====================================================
       AFFICHAGE PANIER
    ===================================================== */

    function renderCart() {

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

            return;

        }

        miniCartProducts.innerHTML = cart.map(item => `

            <div
                class="mini-cart-item"
                data-id="${escapeHTML(item.id)}"
            >

                <div class="mini-cart-item-image">

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                    >

                </div>

                <div class="mini-cart-item-info">

                    <h4>
                        ${escapeHTML(item.name)}
                    </h4>

                    <span>
                        ${item.price.toFixed(2)}$
                    </span>

                    <div class="quantity-control">

                        <button
                            type="button"
                            class="quantity-minus"
                            data-id="${escapeHTML(item.id)}"
                        >
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            type="button"
                            class="quantity-plus"
                            data-id="${escapeHTML(item.id)}"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    type="button"
                    class="remove-cart-item"
                    data-id="${escapeHTML(item.id)}"
                    aria-label="Supprimer"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `).join("");

    }

    /* =====================================================
       WHATSAPP
    ===================================================== */

    function updateWhatsAppLink() {

        if (!checkoutWhatsapp) return;

        if (cart.length === 0) {

            checkoutWhatsapp.href = "#";

            return;

        }

        let message =
            "Bonjour YMS STORE,%0A%0A" +
            "Je souhaite commander :%0A";

        let total = 0;

        cart.forEach(item => {

            const subtotal =
                item.price * item.quantity;

            total += subtotal;

            message +=
                `- ${item.name} x${item.quantity} : ${subtotal.toFixed(2)}$%0A`;

        });

        message +=
            `%0ATotal : ${total.toFixed(2)}$`;

        checkoutWhatsapp.href =
            `https://wa.me/243971917222?text=${message}`;

    }

    /* =====================================================
       OUVRIR PANIER
    ===================================================== */

    function openMiniCart() {

        if (!miniCart) return;

        miniCart.classList.add("open");

        miniCart.setAttribute(
            "aria-hidden",
            "false"
        );

        if (miniCartOverlay) {

            miniCartOverlay.hidden = false;

            miniCartOverlay.classList.add("show");

        }

        document.body.classList.add("cart-open");

    }

    /* =====================================================
       FERMER PANIER
    ===================================================== */

    function closeMiniCart() {

        if (!miniCart) return;

        miniCart.classList.remove("open");

        miniCart.setAttribute(
            "aria-hidden",
            "true"
        );

        if (miniCartOverlay) {

            miniCartOverlay.classList.remove("show");

            setTimeout(() => {

                miniCartOverlay.hidden = true;

            }, 250);

        }

        document.body.classList.remove("cart-open");

    }

    /* =====================================================
       FILTRAGE
    ===================================================== */

    function filterProducts(category = "all") {

        let visibleCount = 0;

        products.forEach(card => {

            const cardCategory =
                card.dataset.category || "";

            const matches =
                category === "all" ||
                cardCategory === category;

            if (matches) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });

        if (noProducts) {

            noProducts.hidden =
                visibleCount !== 0;

        }

    }

    /* =====================================================
       RECHERCHE
    ===================================================== */

    function searchProducts() {

        const query =
            searchInput?.value
                .trim()
                .toLowerCase() || "";

        let visibleCount = 0;

        products.forEach(card => {

            const name =
                card.dataset.name
                    ?.toLowerCase() || "";

            const category =
                card.dataset.category
                    ?.toLowerCase() || "";

            const content =
                card.textContent.toLowerCase();

            const match =
                !query ||
                name.includes(query) ||
                category.includes(query) ||
                content.includes(query);

            if (match) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });

        if (noProducts) {

            noProducts.hidden =
                visibleCount !== 0;

        }

    }

    /* =====================================================
       TRI
    ===================================================== */

    function sortProducts(type) {

        if (!productsGrid) return;

        const sorted =
            [...products].sort((a, b) => {

                const priceA =
                    parseFloat(a.dataset.price || 0);

                const priceB =
                    parseFloat(b.dataset.price || 0);

                const nameA =
                    a.dataset.name
                        ?.toLowerCase() || "";

                const nameB =
                    b.dataset.name
                        ?.toLowerCase() || "";

                switch (type) {

                    case "price-low":

                        return priceA - priceB;

                    case "price-high":

                        return priceB - priceA;

                    case "name":

                        return nameA.localeCompare(
                            nameB,
                            "fr"
                        );

                    default:

                        return 0;

                }

            });

        sorted.forEach(card => {

            productsGrid.appendChild(card);

        });

    }

    /* =====================================================
       FAVORIS
    ===================================================== */

    function toggleFavorite(button) {

        const icon =
            button.querySelector("i");

        if (!icon) return;

        const active =
            button.classList.toggle("active");

        if (active) {

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

    }

    /* =====================================================
       MODAL
    ===================================================== */

    function openProductModal(card) {

        if (!productModal) return;

        selectedProduct = card;

        const product =
            getProductData(card);

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

        productModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

    }

    /* =====================================================
       FERMER MODAL
    ===================================================== */

    function closeProductModalBox() {

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

    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }

    /* =====================================================
       ÉVÉNEMENTS PRODUITS
    ===================================================== */

    products.forEach(card => {

        const addButton =
            card.querySelector(".add-cart");

        const quickCart =
            card.querySelector(".quick-cart");

        const favorite =
            card.querySelector(".favorite-btn");

        const viewButton =
            card.querySelector(".view-btn");

        if (addButton) {

            addButton.addEventListener(
                "click",
                () => addToCart(card)
            );

        }

        if (quickCart) {

            quickCart.addEventListener(
                "click",
                () => addToCart(card)
            );

        }

        if (favorite) {

            favorite.addEventListener(
                "click",
                () => toggleFavorite(favorite)
            );

        }

        if (viewButton) {

            viewButton.addEventListener(
                "click",
                () => openProductModal(card)
            );

        }

    });

    /* =====================================================
       FILTRES
    ===================================================== */

    filters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });

                filter.classList.add(
                    "active"
                );

                const category =
                    filter.dataset.category;

                filterProducts(category);

            }
        );

    });

    /* =====================================================
       TRI
    ===================================================== */

    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            event => {

                sortProducts(
                    event.target.value
                );

            }
        );

    }

    /* =====================================================
       RECHERCHE
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchProducts
        );

        searchInput.addEventListener(
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
       PANIER
    ===================================================== */

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
       ACTIONS PANIER
    ===================================================== */

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

                }

            }
        );

    }

    /* =====================================================
       MODAL
    ===================================================== */

    if (closeProductModal) {

        closeProductModal.addEventListener(
            "click",
            closeProductModalBox
        );

    }

    const modalOverlay =
        productModal?.querySelector(
            ".product-modal-overlay"
        );

    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeProductModalBox
        );

    }

    if (modalAddCart) {

        modalAddCart.addEventListener(
            "click",
            () => {

                if (!selectedProduct) return;

                addToCart(selectedProduct);

                closeProductModalBox();

            }
        );

    }

    /* =====================================================
       CLAVIER
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;

            closeMiniCart();

            closeProductModalBox();

        }
    );

    /* =====================================================
       MENU MOBILE
    ===================================================== */

    if (mobileMenu && navigation) {

        mobileMenu.addEventListener(
            "click",
            () => {

                const opened =
                    navigation.classList.toggle(
                        "mobile-open"
                    );

                mobileMenu.setAttribute(
                    "aria-expanded",
                    opened
                );

            }
        );

    }

    /* =====================================================
       FERMER MENU MOBILE APRÈS CLIC
    ===================================================== */

    document
        .querySelectorAll(".nav-menu a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navigation?.classList.remove(
                        "mobile-open"
                    );

                    mobileMenu?.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

    /* =====================================================
       INITIALISATION
    ===================================================== */

    updateCart();

    filterProducts("all");

});