/* =========================================================
   YMS STORE
   SYSTEME GLOBAL :
   - FRANÇAIS
   - ENGLISH
   - KISWAHILI
   - YMS AI
   - TRADUCTION COMPLETE
   - LOCALSTORAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const languageToggle =
        document.getElementById("languageToggle");

    const languageMenu =
        document.getElementById("languageMenu");

    const currentLanguage =
        document.getElementById("currentLanguage");

    const aiButton =
        document.getElementById("ymsAiButton");

    const aiChat =
        document.getElementById("ymsAiChat");

    const closeAi =
        document.getElementById("closeYmsAi");

    const aiForm =
        document.getElementById("ymsAiForm");

    const aiInput =
        document.getElementById("ymsAiInput");

    const aiMessages =
        document.getElementById("ymsAiMessages");


    /* =====================================================
       TRADUCTIONS
    ===================================================== */

    const translations = {

        /* =================================================
           FRANÇAIS
        ================================================= */

        fr: {

            language: "FR",

            search: "Rechercher un produit...",

            home: "Accueil",
            shop: "Boutique",
            men: "Homme",
            women: "Femme",
            shoes: "Chaussures",
            bags: "Sacs",
            accessories: "Accessoires",
            watches: "Montres",
            new: "Nouveautés",
            promotions: "Promotions",
            contact: "Contact",
            cart: "Panier",

            discover: "Découvrir",
            buy: "Acheter maintenant",
            add: "Ajouter au panier",

            category: "Catégories",
            allProducts: "Tous les produits",
            collection: "COLLECTION 2026",
            allOurProducts: "Tous nos produits",
            findProduct:
                "Trouvez facilement votre prochain article préféré.",

            sortBy: "Trier par",
            relevance: "Pertinence",
            priceLow: "Prix croissant",
            priceHigh: "Prix décroissant",
            nameAZ: "Nom A-Z",

            menFashion: "Mode Homme",
            womenFashion: "Mode Femme",

            noProduct: "Aucun produit trouvé",
            noProductText:
                "Essayez une autre catégorie ou recherchez un autre produit.",

            newProduct: "Nouveau",

            quickView: "Voir le produit",
            favorite: "Ajouter aux favoris",
            quickCart: "Ajouter rapidement au panier",

            yourCart: "Votre panier",
            emptyCart: "Votre panier est vide.",
            total: "Total",
            orderWhatsapp: "Commander sur WhatsApp",
            finalizeOrder: "Finaliser la commande",

            close: "Fermer",
            product: "Produit",

            addedCart: "Produit ajouté au panier",

            deliveryTop:
                "Livraison rapide partout en RDC",

            securePayment:
                "Paiement sécurisé",

            newsletter:
                "Recevez nos nouveautés",

            /* IA */

            aiButton: "YMS AI",

            aiSubtitle:
                "Assistant YMS STORE",

            aiWelcome: `
                Bonjour 👋
                <br><br>
                Je suis <strong>YMS AI</strong>,
                votre assistant virtuel.
                <br><br>
                Je peux vous aider à trouver un produit,
                comprendre une promotion, consulter les
                informations de livraison ou vous orienter
                vers le service approprié.
            `,

            aiProducts: "Produits",
            aiPayment: "Paiement",
            aiDelivery: "Livraison",
            aiContact: "Contact",

            aiPlaceholder:
                "Écrivez votre message...",

            aiSend: "Envoyer",

            aiThinking:
                "Je réfléchis...",

            /* Produits */

            sneakers: "Sneakers Premium",
            premiumBag: "Sac Premium Femme",
            menJacket: "Veste Homme Premium",
            luxuryWatch: "Montre Luxe",
            elegantDress: "Robe Élégance",
            premiumAccessory: "Accessoire Premium",

            categoryShoes: "Chaussures",
            categoryBags: "Sacs",
            categoryMen: "Homme",
            categoryWomen: "Femme",
            categoryWatches: "Montres",
            categoryAccessories: "Accessoires"

        },


        /* =================================================
           ENGLISH
        ================================================= */

        en: {

            language: "EN",

            search: "Search for a product...",

            home: "Home",
            shop: "Shop",
            men: "Men",
            women: "Women",
            shoes: "Shoes",
            bags: "Bags",
            accessories: "Accessories",
            watches: "Watches",
            new: "New Arrivals",
            promotions: "Promotions",
            contact: "Contact",
            cart: "Cart",

            discover: "Discover",
            buy: "Shop now",
            add: "Add to cart",

            category: "Categories",
            allProducts: "All products",
            collection: "COLLECTION 2026",
            allOurProducts: "All our products",
            findProduct:
                "Easily find your next favorite item.",

            sortBy: "Sort by",
            relevance: "Relevance",
            priceLow: "Price: Low to High",
            priceHigh: "Price: High to Low",
            nameAZ: "Name A-Z",

            menFashion: "Men's Fashion",
            womenFashion: "Women's Fashion",

            noProduct: "No product found",
            noProductText:
                "Try another category or search for another product.",

            newProduct: "New",

            quickView: "View product",
            favorite: "Add to favorites",
            quickCart: "Quickly add to cart",

            yourCart: "Your cart",
            emptyCart: "Your cart is empty.",
            total: "Total",
            orderWhatsapp: "Order on WhatsApp",
            finalizeOrder: "Checkout",

            close: "Close",
            product: "Product",

            addedCart: "Product added to cart",

            deliveryTop:
                "Fast delivery throughout the DRC",

            securePayment:
                "Secure payment",

            newsletter:
                "Get our latest news",

            /* AI */

            aiButton: "YMS AI",

            aiSubtitle:
                "YMS STORE Assistant",

            aiWelcome: `
                Hello 👋
                <br><br>
                I am <strong>YMS AI</strong>,
                your virtual assistant.
                <br><br>
                I can help you find a product,
                understand a promotion, check delivery
                information or direct you to the appropriate
                service.
            `,

            aiProducts: "Products",
            aiPayment: "Payment",
            aiDelivery: "Delivery",
            aiContact: "Contact",

            aiPlaceholder:
                "Write your message...",

            aiSend: "Send",

            aiThinking:
                "I'm thinking...",

            /* Products */

            sneakers: "Premium Sneakers",
            premiumBag: "Premium Women's Bag",
            menJacket: "Premium Men's Jacket",
            luxuryWatch: "Luxury Watch",
            elegantDress: "Elegant Dress",
            premiumAccessory: "Premium Accessory",

            categoryShoes: "Shoes",
            categoryBags: "Bags",
            categoryMen: "Men",
            categoryWomen: "Women",
            categoryWatches: "Watches",
            categoryAccessories: "Accessories"

        },


        /* =================================================
           KISWAHILI
        ================================================= */

        sw: {

            language: "SW",

            search: "Tafuta bidhaa...",

            home: "Mwanzo",
            shop: "Duka",
            men: "Wanaume",
            women: "Wanawake",
            shoes: "Viatu",
            bags: "Mifuko",
            accessories: "Vifaa",
            watches: "Saa",
            new: "Bidhaa Mpya",
            promotions: "Matangazo",
            contact: "Wasiliana",
            cart: "Kikapu",

            discover: "Gundua",
            buy: "Nunua sasa",
            add: "Ongeza kwenye kikapu",

            category: "Aina",
            allProducts: "Bidhaa zote",
            collection: "MKUSANYIKO 2026",
            allOurProducts: "Bidhaa zetu zote",
            findProduct:
                "Pata kwa urahisi bidhaa yako unayoipenda.",

            sortBy: "Panga kwa",
            relevance: "Umuhimu",
            priceLow: "Bei ndogo hadi kubwa",
            priceHigh: "Bei kubwa hadi ndogo",
            nameAZ: "Jina A-Z",

            menFashion: "Mitindo ya Wanaume",
            womenFashion: "Mitindo ya Wanawake",

            noProduct: "Hakuna bidhaa iliyopatikana",
            noProductText:
                "Jaribu aina nyingine au tafuta bidhaa nyingine.",

            newProduct: "Mpya",

            quickView: "Tazama bidhaa",
            favorite: "Ongeza kwenye vipendwa",
            quickCart: "Ongeza haraka kwenye kikapu",

            yourCart: "Kikapu chako",
            emptyCart: "Kikapu chako kiko tupu.",
            total: "Jumla",
            orderWhatsapp: "Agiza kupitia WhatsApp",
            finalizeOrder: "Maliza agizo",

            close: "Funga",
            product: "Bidhaa",

            addedCart: "Bidhaa imeongezwa kwenye kikapu",

            deliveryTop:
                "Usafirishaji wa haraka kote DRC",

            securePayment:
                "Malipo salama",

            newsletter:
                "Pokea habari zetu mpya",

            /* AI */

            aiButton: "YMS AI",

            aiSubtitle:
                "Msaidizi wa YMS STORE",

            aiWelcome: `
                Habari 👋
                <br><br>
                Mimi ni <strong>YMS AI</strong>,
                msaidizi wako wa mtandaoni.
                <br><br>
                Ninaweza kukusaidia kupata bidhaa,
                kuelewa ofa, kupata taarifa kuhusu
                usafirishaji au kukuunganisha na huduma
                inayofaa.
            `,

            aiProducts: "Bidhaa",
            aiPayment: "Malipo",
            aiDelivery: "Usafirishaji",
            aiContact: "Mawasiliano",

            aiPlaceholder:
                "Andika ujumbe wako...",

            aiSend: "Tuma",

            aiThinking:
                "Nafikiria...",

            /* Products */

            sneakers: "Viatu vya Sneakers vya Ubora",
            premiumBag: "Mkoba wa Wanawake wa Ubora",
            menJacket: "Jaketi la Wanaume la Ubora",
            luxuryWatch: "Saa ya Kifahari",
            elegantDress: "Nguo ya Kifahari",
            premiumAccessory: "Kifaa cha Ubora",

            categoryShoes: "Viatu",
            categoryBags: "Mifuko",
            categoryMen: "Wanaume",
            categoryWomen: "Wanawake",
            categoryWatches: "Saa",
            categoryAccessories: "Vifaa"

        }

    };


    /* =====================================================
       LANGUE ACTIVE
    ===================================================== */

    let currentLang =
        localStorage.getItem("ymsLanguage") || "fr";

    if (!translations[currentLang]) {
        currentLang = "fr";
    }


    /* =====================================================
       TRADUCTION PAR DATA-I18N
    ===================================================== */

    function translateElements(language) {

        const t = translations[language];

        if (!t) return;


        /* TEXTES */

        document
            .querySelectorAll("[data-i18n]")
            .forEach(element => {

                const key =
                    element.dataset.i18n;

                if (t[key] !== undefined) {

                    element.innerHTML =
                        t[key];

                }

            });


        /* PLACEHOLDERS */

        document
            .querySelectorAll("[data-i18n-placeholder]")
            .forEach(element => {

                const key =
                    element.dataset.i18nPlaceholder;

                if (t[key] !== undefined) {

                    element.placeholder =
                        t[key];

                }

            });


        /* ARIA LABEL */

        document
            .querySelectorAll("[data-i18n-aria]")
            .forEach(element => {

                const key =
                    element.dataset.i18nAria;

                if (t[key] !== undefined) {

                    element.setAttribute(
                        "aria-label",
                        t[key]
                    );

                }

            });


        /* TITLE */

        document
            .querySelectorAll("[data-i18n-title]")
            .forEach(element => {

                const key =
                    element.dataset.i18nTitle;

                if (t[key] !== undefined) {

                    element.title =
                        t[key];

                }

            });


        /* SELECT OPTIONS */

        document
            .querySelectorAll("option[data-i18n]")
            .forEach(option => {

                const key =
                    option.dataset.i18n;

                if (t[key] !== undefined) {

                    option.textContent =
                        t[key];

                }

            });


        /* LANGUE */

        if (currentLanguage) {

            currentLanguage.textContent =
                t.language;

        }


        /* TITLE PAGE */

        document.documentElement.lang =
            language;


        /* AI */

        updateAI(language);

    }


    /* =====================================================
       COMPATIBILITE AVEC LES ELEMENTS EXISTANTS
    ===================================================== */

    function translateExistingPage(language) {

        const t = translations[language];

        if (!t) return;


        /* Recherche */

        const search =
            document.getElementById("productSearch");

        if (search) {

            search.placeholder =
                t.search;

        }


        /* Navigation */

        const navMap = {

            "Accueil": t.home,
            "Home": t.home,
            "Mwanzo": t.home,

            "Boutique": t.shop,
            "Shop": t.shop,
            "Duka": t.shop,

            "Homme": t.men,
            "Men": t.men,
            "Wanaume": t.men,

            "Femme": t.women,
            "Women": t.women,
            "Wanawake": t.women,

            "Chaussures": t.shoes,
            "Shoes": t.shoes,
            "Viatu": t.shoes,

            "Sacs": t.bags,
            "Bags": t.bags,
            "Mifuko": t.bags,

            "Accessoires": t.accessories,
            "Accessories": t.accessories,
            "Vifaa": t.accessories,

            "Montres": t.watches,
            "Watches": t.watches,
            "Saa": t.watches,

            "Nouveautés": t.new,
            "New Arrivals": t.new,
            "Bidhaa Mpya": t.new,

            "Promotions": t.promotions,
            "Matangazo": t.promotions,

            "Contact": t.contact,
            "Wasiliana": t.contact
        };


        document
            .querySelectorAll(".nav-menu a")
            .forEach(link => {

                const cleanText =
                    link.textContent.trim();

                if (navMap[cleanText]) {

                    link.textContent =
                        navMap[cleanText];

                }

            });


        /* Top bar */

        document
            .querySelectorAll(".top-left span")
            .forEach(span => {

                const text =
                    span.textContent.toLowerCase();

                const icon =
                    span.querySelector("i");

                if (!icon) return;

                if (
                    text.includes("livraison") ||
                    text.includes("delivery") ||
                    text.includes("usafirishaji")
                ) {

                    span.innerHTML =
                        `<i class="fa-solid fa-truck-fast"></i>
                         ${t.deliveryTop}`;

                }

                else if (
                    text.includes("paiement") ||
                    text.includes("payment") ||
                    text.includes("malipo")
                ) {

                    span.innerHTML =
                        `<i class="fa-solid fa-shield-halved"></i>
                         ${t.securePayment}`;

                }

            });


        /* Boutons panier */

        document
            .querySelectorAll(".add-cart")
            .forEach(button => {

                const icon =
                    button.querySelector("i");

                if (icon) {

                    button.innerHTML =
                        `<i class="${icon.className}"></i> ${t.add}`;

                }
                else {

                    button.textContent =
                        t.add;

                }

            });


        /* Acheter */

        document
            .querySelectorAll(".primary-btn")
            .forEach(button => {

                const icon =
                    button.querySelector("i");

                if (icon) {

                    button.innerHTML =
                        `${t.buy} <i class="${icon.className}"></i>`;

                }
                else {

                    button.textContent =
                        t.buy;

                }

            });


        /* Découvrir */

        document
            .querySelectorAll(".outline-btn")
            .forEach(button => {

                const icon =
                    button.querySelector("i");

                if (icon) {

                    button.innerHTML =
                        `${t.discover} <i class="${icon.className}"></i>`;

                }
                else {

                    button.textContent =
                        t.discover;

                }

            });


        /* Boutons favoris */

        document
            .querySelectorAll(".favorite-btn")
            .forEach(button => {

                button.setAttribute(
                    "aria-label",
                    t.favorite
                );

                button.title =
                    t.favorite;

            });


        /* Boutons aperçu */

        document
            .querySelectorAll(".view-btn")
            .forEach(button => {

                button.setAttribute(
                    "aria-label",
                    t.quickView
                );

                button.title =
                    t.quickView;

            });


        /* Boutons panier rapide */

        document
            .querySelectorAll(".quick-cart")
            .forEach(button => {

                button.setAttribute(
                    "aria-label",
                    t.quickCart
                );

                button.title =
                    t.quickCart;

            });


        /* Catégories */

        document
            .querySelectorAll(".product-category")
            .forEach(category => {

                const text =
                    category.textContent.trim();

                const map = {

                    "Chaussures": t.categoryShoes,
                    "Shoes": t.categoryShoes,
                    "Viatu": t.categoryShoes,

                    "Sacs": t.categoryBags,
                    "Bags": t.categoryBags,
                    "Mifuko": t.categoryBags,

                    "Homme": t.categoryMen,
                    "Men": t.categoryMen,
                    "Wanaume": t.categoryMen,

                    "Femme": t.categoryWomen,
                    "Women": t.categoryWomen,
                    "Wanawake": t.categoryWomen,

                    "Montres": t.categoryWatches,
                    "Watches": t.categoryWatches,
                    "Saa": t.categoryWatches,

                    "Accessoires": t.categoryAccessories,
                    "Accessories": t.categoryAccessories,
                    "Vifaa": t.categoryAccessories
                };

                if (map[text]) {

                    category.textContent =
                        map[text];

                }

            });


        /* Produits */

        const productMap = {

            "Sneakers Premium": t.sneakers,
            "Premium Sneakers": t.sneakers,

            "Sac Premium Femme": t.premiumBag,
            "Premium Women's Bag": t.premiumBag,

            "Veste Homme Premium": t.menJacket,
            "Premium Men's Jacket": t.menJacket,

            "Montre Luxe": t.luxuryWatch,
            "Luxury Watch": t.luxuryWatch,

            "Robe Élégance": t.elegantDress,
            "Elegant Dress": t.elegantDress,

            "Accessoire Premium": t.premiumAccessory,
            "Premium Accessory": t.premiumAccessory
        };


        document
            .querySelectorAll(".product-info h3")
            .forEach(title => {

                const original =
                    title.textContent.trim();

                if (productMap[original]) {

                    title.textContent =
                        productMap[original];

                }

            });

    }


    /* =====================================================
       AI
    ===================================================== */

    function updateAI(language) {

        const t =
            translations[language];

        if (!t) return;


        const subtitle =
            document.getElementById("aiSubtitle");

        if (subtitle) {

            subtitle.textContent =
                t.aiSubtitle;

        }


        const welcome =
            document.getElementById("aiWelcome");

        if (welcome) {

            welcome.innerHTML =
                t.aiWelcome;

        }


        const input =
            document.getElementById("ymsAiInput");

        if (input) {

            input.placeholder =
                t.aiPlaceholder;

        }


        const send =
            document.getElementById("ymsAiSend");

        if (send) {

            send.title =
                t.aiSend;

            send.setAttribute(
                "aria-label",
                t.aiSend
            );

        }


        const suggestions = {

            aiProducts: t.aiProducts,
            aiPayment: t.aiPayment,
            aiDelivery: t.aiDelivery,
            aiContact: t.aiContact

        };


        Object.entries(suggestions)
            .forEach(([key, value]) => {

                document
                    .querySelectorAll(
                        `[data-i18n="${key}"]`
                    )
                    .forEach(element => {

                        element.textContent =
                            value;

                    });

            });

    }


    /* =====================================================
       CHANGEMENT DE LANGUE
    ===================================================== */

    function changeLanguage(language) {

        if (!translations[language]) {

            language = "fr";

        }

        currentLang =
            language;

        localStorage.setItem(
            "ymsLanguage",
            language
        );


        translateElements(
            language
        );


        translateExistingPage(
            language
        );


        updateAI(
            language
        );

    }


    /* =====================================================
       MENU LANGUE
    ===================================================== */

    if (languageToggle && languageMenu) {

        languageToggle.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                languageMenu.classList.toggle(
                    "active"
                );

            }
        );


        document
            .querySelectorAll(
                "#languageMenu [data-lang]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        changeLanguage(
                            button.dataset.lang
                        );

                        languageMenu.classList.remove(
                            "active"
                        );

                    }
                );

            });


        document.addEventListener(
            "click",
            () => {

                languageMenu.classList.remove(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       OUVRIR IA
    ===================================================== */

    if (aiButton && aiChat) {

        aiButton.addEventListener(
            "click",
            () => {

                aiChat.classList.toggle(
                    "active"
                );


                if (
                    aiChat.classList.contains(
                        "active"
                    )
                ) {

                    setTimeout(
                        () => {

                            if (aiInput) {

                                aiInput.focus();

                            }

                        },
                        200
                    );

                }

            }
        );

    }


    /* =====================================================
       FERMER IA
    ===================================================== */

    if (closeAi && aiChat) {

        closeAi.addEventListener(
            "click",
            () => {

                aiChat.classList.remove(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       QUESTIONS RAPIDES
    ===================================================== */

    document
        .querySelectorAll(
            ".yms-ai-suggestions [data-question]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const type =
                        button.dataset.question;

                    const questions = {

                        fr: {

                            products:
                                "Quels sont vos produits ?",

                            payment:
                                "Quels sont vos moyens de paiement ?",

                            delivery:
                                "Comment fonctionne la livraison ?",

                            contact:
                                "Comment contacter YMS STORE ?"

                        },

                        en: {

                            products:
                                "What products do you sell?",

                            payment:
                                "What payment methods do you accept?",

                            delivery:
                                "How does delivery work?",

                            contact:
                                "How can I contact YMS STORE?"

                        },

                        sw: {

                            products:
                                "Mnauza bidhaa gani?",

                            payment:
                                "Mnatumia njia gani za malipo?",

                            delivery:
                                "Usafirishaji unafanyaje kazi?",

                            contact:
                                "Ninawezaje kuwasiliana na YMS STORE?"

                        }

                    };


                    const question =
                        questions[currentLang]?.[type];

                    if (question) {

                        sendUserMessage(
                            question
                        );

                    }

                }
            );

        });


    /* =====================================================
       FORMULAIRE IA
    ===================================================== */

    if (aiForm && aiInput) {

        aiForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const message =
                    aiInput.value.trim();


                if (!message) return;


                sendUserMessage(
                    message
                );


                aiInput.value = "";

            }
        );

    }


    /* =====================================================
       ENVOYER MESSAGE
    ===================================================== */

    function sendUserMessage(message) {

        addMessage(
            message,
            "user"
        );


        const thinkingTexts = {

            fr: "Je réfléchis...",

            en: "I'm thinking...",

            sw: "Nafikiria..."

        };


        addMessage(
            thinkingTexts[currentLang],
            "ai",
            true
        );


        setTimeout(
            () => {

                removeThinking();


                const response =
                    generateAIResponse(
                        message,
                        currentLang
                    );


                addMessage(
                    response,
                    "ai"
                );

            },
            600
        );

    }


    /* =====================================================
       REPONSE IA
    ===================================================== */

    function generateAIResponse(
        message,
        language
    ) {

        const text =
            message
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );


        /* PRODUITS */

        if (
            text.includes("produit") ||
            text.includes("article") ||
            text.includes("acheter") ||
            text.includes("product") ||
            text.includes("products") ||
            text.includes("buy") ||
            text.includes("bidhaa") ||
            text.includes("nunua")
        ) {

            if (language === "en") {

                return `
                    🛍️ <strong>YMS STORE</strong> offers
                    premium clothing, shoes, bags,
                    watches and accessories.

                    <br><br>

                    Visit our shop to discover
                    all available products.
                `;

            }


            if (language === "sw") {

                return `
                    🛍️ <strong>YMS STORE</strong> inatoa
                    nguo, viatu, mifuko, saa na vifaa
                    vya ubora wa juu.

                    <br><br>

                    Tembelea duka letu kuona
                    bidhaa zote zinazopatikana.
                `;

            }


            return `
                🛍️ <strong>YMS STORE</strong> propose
                des vêtements, chaussures, sacs,
                montres et accessoires premium.

                <br><br>

                Consultez notre boutique pour découvrir
                tous les produits disponibles.
            `;

        }


        /* PAIEMENT */

        if (
            text.includes("paiement") ||
            text.includes("payment") ||
            text.includes("malipo") ||
            text.includes("mpesa") ||
            text.includes("m-pesa") ||
            text.includes("airtel")
        ) {

            if (language === "en") {

                return `
                    💳 We offer several payment options,
                    including mobile payments and bank cards.

                    <br><br>

                    For transaction assistance,
                    please contact our customer service.
                `;

            }


            if (language === "sw") {

                return `
                    💳 Tunatoa njia mbalimbali za malipo,
                    ikiwa ni pamoja na malipo ya simu
                    na kadi za benki.

                    <br><br>

                    Kwa msaada kuhusu muamala,
                    wasiliana na huduma kwa wateja.
                `;

            }


            return `
                💳 Nous proposons plusieurs solutions
                de paiement, notamment les paiements
                mobiles et les cartes bancaires.

                <br><br>

                Pour toute assistance concernant une
                transaction, contactez notre service client.
            `;

        }


        /* LIVRAISON */

        if (
            text.includes("livraison") ||
            text.includes("livrer") ||
            text.includes("delivery") ||
            text.includes("deliver") ||
            text.includes("usafirishaji") ||
            text.includes("kusafirisha")
        ) {

            if (language === "en") {

                return `
                    🚚 <strong>YMS STORE</strong> provides
                    delivery in several regions of the
                    Democratic Republic of Congo.

                    <br><br>

                    Contact our team for delivery details.
                `;

            }


            if (language === "sw") {

                return `
                    🚚 <strong>YMS STORE</strong> inafanya
                    usafirishaji katika maeneo mbalimbali
                    ya Jamhuri ya Kidemokrasia ya Kongo.

                    <br><br>

                    Wasiliana na timu yetu kwa maelezo
                    zaidi kuhusu usafirishaji.
                `;

            }


            return `
                🚚 <strong>YMS STORE</strong> assure la
                livraison dans plusieurs régions de la RDC.

                <br><br>

                Pour connaître les détails d'une livraison,
                contactez notre équipe.
            `;

        }


        /* CONTACT */

        if (
            text.includes("contact") ||
            text.includes("whatsapp") ||
            text.includes("telephone") ||
            text.includes("phone") ||
            text.includes("téléphone") ||
            text.includes("wasiliana") ||
            text.includes("simu")
        ) {

            if (language === "en") {

                return `
                    📞 You can contact
                    <strong>YMS STORE</strong>:

                    <br><br>

                    WhatsApp:
                    <strong>+243 971 917 222</strong>

                    <br>

                    Phone:
                    <strong>+243 972 215 398</strong>

                    <br><br>

                    📧 contact@ymsstore.com
                `;

            }


            if (language === "sw") {

                return `
                    📞 Unaweza kuwasiliana na
                    <strong>YMS STORE</strong>:

                    <br><br>

                    WhatsApp:
                    <strong>+243 971 917 222</strong>

                    <br>

                    Simu:
                    <strong>+243 972 215 398</strong>

                    <br><br>

                    📧 contact@ymsstore.com
                `;

            }


            return `
                📞 Vous pouvez contacter
                <strong>YMS STORE</strong>:

                <br><br>

                WhatsApp:
                <strong>+243 971 917 222</strong>

                <br>

                Téléphone:
                <strong>+243 972 215 398</strong>

                <br><br>

                📧 contact@ymsstore.com
            `;

        }


        /* SALUTATION */

        if (
            text.includes("bonjour") ||
            text.includes("salut") ||
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("habari")
        ) {

            if (language === "en") {

                return `
                    Hello 👋

                    <br><br>

                    Welcome to
                    <strong>YMS STORE</strong>.

                    <br><br>

                    How can I help you today?
                `;

            }


            if (language === "sw") {

                return `
                    Habari 👋

                    <br><br>

                    Karibu kwenye
                    <strong>YMS STORE</strong>.

                    <br><br>

                    Ninawezaje kukusaidia leo?
                `;

            }


            return `
                Bonjour 👋

                <br><br>

                Bienvenue chez
                <strong>YMS STORE</strong>.

                <br><br>

                Comment puis-je vous aider aujourd'hui ?
            `;

        }


        /* REPONSE PAR DEFAUT */

        if (language === "en") {

            return `
                🤖 Thank you for your message.

                <br><br>

                I can help you with:

                <br>
                • 🛍️ Products
                <br>
                • 💳 Payments
                <br>
                • 🚚 Delivery
                <br>
                • 📞 Contact

                <br><br>

                Please ask me your question.
            `;

        }


        if (language === "sw") {

            return `
                🤖 Asante kwa ujumbe wako.

                <br><br>

                Ninaweza kukusaidia kuhusu:

                <br>
                • 🛍️ Bidhaa
                <br>
                • 💳 Malipo
                <br>
                • 🚚 Usafirishaji
                <br>
                • 📞 Mawasiliano

                <br><br>

                Uliza swali lako.
            `;

        }


        return `
            🤖 Merci pour votre message.

            <br><br>

            Je peux vous aider concernant:

            <br>
            • 🛍️ Produits
            <br>
            • 💳 Paiements
            <br>
            • 🚚 Livraison
            <br>
            • 📞 Contact

            <br><br>

            Posez-moi votre question.
        `;

    }


    /* =====================================================
       AJOUTER MESSAGE
    ===================================================== */

    function addMessage(
        message,
        type,
        thinking = false
    ) {

        if (!aiMessages) return;


        const wrapper =
            document.createElement("div");


        wrapper.className =
            type === "user"
                ? "user-message"
                : "ai-message";


        if (thinking) {

            wrapper.classList.add(
                "ai-thinking-message"
            );

        }


        if (type === "ai") {

            wrapper.innerHTML = `

                <div class="message-avatar">

                    <i class="fa-solid fa-robot"></i>

                </div>

                <div class="message-content">

                    ${message}

                </div>

            `;

        }
        else {

            wrapper.innerHTML = `

                <div class="message-content">

                    ${escapeHTML(message)}

                </div>

            `;

        }


        aiMessages.appendChild(
            wrapper
        );


        aiMessages.scrollTop =
            aiMessages.scrollHeight;

    }


    /* =====================================================
       SUPPRIMER "JE REFLECHIS"
    ===================================================== */

    function removeThinking() {

        const thinking =
            document.querySelector(
                ".ai-thinking-message"
            );

        if (thinking) {

            thinking.remove();

        }

    }


    /* =====================================================
       SECURITE HTML
    ===================================================== */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }


    /* =====================================================
       INITIALISATION
    ===================================================== */

    changeLanguage(
        currentLang
    );


    console.log(
        "YMS STORE : système multilingue + YMS AI chargé."
    );

});