/* ============================================================
   YMS STORE
   ESPACE VIP
   dashboard.js
   Version professionnelle
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =========================================================
       CONFIGURATION
    ========================================================= */

    const STORAGE = {

        member: "ymsVipMember",
        user: "ymsUser",
        profile: "vipProfile",

        orders: "ymsOrders",
        payments: "ymsPayments",

        vipPoints: "vipPoints",
        vipBenefits: "vipBenefits",

        notifications: "vipNotifications",

        /* session */

        loggedIn: "ymsVipLoggedIn"

    };


    const LOGIN_PAGE = "client.html";


    /* =========================================================
       OUTILS
    ========================================================= */

    function readStorage(key, fallback = null) {

        try {

            const value =
                localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            try {

                return JSON.parse(value);

            } catch {

                return value;

            }

        } catch (error) {

            console.error(
                "Erreur localStorage :",
                error
            );

            return fallback;

        }

    }


    function writeStorage(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch (error) {

            console.error(
                "Erreur d'enregistrement :",
                error
            );

        }

    }


    function removeStorage(key) {

        try {

            localStorage.removeItem(key);

        } catch (error) {

            console.error(
                "Erreur suppression :",
                error
            );

        }

    }


    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                value ?? "";

        }

    }


    function number(value) {

        const result =
            Number(value);

        return Number.isFinite(result)
            ? result
            : 0;

    }


    function money(value) {

        return number(value).toLocaleString(
            "fr-FR",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        ) + "$";

    }


    /* =========================================================
       MEMBRE
    ========================================================= */

    function getMember() {

        const member =
            readStorage(
                STORAGE.member,
                null
            );

        if (member && typeof member === "object") {
            return member;
        }


        const profile =
            readStorage(
                STORAGE.profile,
                null
            );

        if (profile && typeof profile === "object") {
            return profile;
        }


        const user =
            readStorage(
                STORAGE.user,
                null
            );

        if (user && typeof user === "object") {
            return user;
        }


        return {

            name: "Membre VIP",

            prenom: "Membre",

            nom: "VIP",

            phone: "Non renseigné",

            telephone: "Non renseigné",

            email: "Non renseigné",

            photo:
                "assets/image/default-user.png",

            dateInscription:
                new Date().toLocaleDateString(
                    "fr-FR"
                ),

            status: "Actif",

            vipLevel: "VIP GOLD"

        };

    }


    /* =========================================================
       PROFIL
    ========================================================= */

    function loadProfile() {

        const member =
            getMember();


        const fullName =
            member.name ||
            member.fullName ||
            `${member.prenom || ""} ${member.nom || ""}`.trim() ||
            "Membre VIP";


        setText(
            "welcomeName",
            fullName
        );


        setText(
            "memberName",
            fullName
        );


        setText(
            "memberPhone",
            member.phone ||
            member.telephone ||
            "Non renseigné"
        );


        setText(
            "memberEmail",
            member.email ||
            "Non renseigné"
        );


        setText(
            "memberDate",
            member.dateInscription ||
            member.createdAt ||
            member.date ||
            "Non renseignée"
        );


        setText(
            "memberStatus",
            member.status ||
            "Actif"
        );


        const level =
            member.vipLevel ||
            member.level ||
            "VIP GOLD";


        setText(
            "vipLevel",
            level
        );


        setText(
            "currentLevel",
            level
        );


        const photo =
            member.photo ||
            member.photoURL ||
            member.avatar ||
            "assets/image/default-user.png";


        const image =
            document.getElementById(
                "memberPhoto"
            );


        if (image) {

            image.src =
                photo;

            image.onerror =
                function () {

                    this.src =
                        "assets/image/default-user.png";

                };

        }

    }


    /* =========================================================
       COMMANDES
    ========================================================= */

    function getOrders() {

        const keys = [

            STORAGE.orders,
            "commandes",
            "orders",
            "ymsCommandes",
            "vipOrders"

        ];


        for (const key of keys) {

            const data =
                readStorage(
                    key,
                    null
                );


            if (Array.isArray(data)) {

                return data;

            }

        }


        return [];

    }


    /* =========================================================
       PAIEMENTS
    ========================================================= */

    function getPayments() {

        const keys = [

            STORAGE.payments,
            "paiements",
            "payments",
            "ymsPaiements",
            "vipPayments"

        ];


        for (const key of keys) {

            const data =
                readStorage(
                    key,
                    null
                );


            if (Array.isArray(data)) {

                return data;

            }

        }


        return [];

    }


    function getPaymentAmount(payment) {

        return number(

            payment.amount ??
            payment.montant ??
            payment.price ??
            payment.prix ??
            payment.total ??
            0

        );

    }


    function calculatePayments() {

        const payments =
            getPayments();


        let total = 0;


        payments.forEach(payment => {

            const status =
                String(
                    payment.status ||
                    payment.statut ||
                    ""
                )
                .toLowerCase();


            const refused = [

                "refused",
                "refusé",
                "cancelled",
                "annulé",
                "failed",
                "rejected"

            ];


            if (refused.includes(status)) {
                return;
            }


            total +=
                getPaymentAmount(payment);

        });


        return total;

    }


    /* =========================================================
       POINTS
    ========================================================= */

    function getVipPoints() {

        let points =
            readStorage(
                STORAGE.vipPoints,
                0
            );


        if (
            typeof points === "object" &&
            points !== null
        ) {

            points =
                points.total ??
                points.points ??
                points.value ??
                0;

        }


        return number(points);

    }


    /* =========================================================
       AVANTAGES
    ========================================================= */

    function getVipBenefits() {

        let benefits =
            readStorage(
                STORAGE.vipBenefits,
                0
            );


        if (
            typeof benefits === "object" &&
            benefits !== null
        ) {

            benefits =
                benefits.total ??
                benefits.count ??
                benefits.value ??
                0;

        }


        return number(benefits);

    }


    /* =========================================================
       PROGRESSION VIP
    ========================================================= */

    function updateVipProgress(
        orders,
        payments,
        points
    ) {

        const orderScore =
            Math.min(
                orders / 10,
                1
            );


        const paymentScore =
            Math.min(
                payments / 500,
                1
            );


        const pointScore =
            Math.min(
                points / 1000,
                1
            );


        let progress =
            (
                orderScore * .30 +
                paymentScore * .40 +
                pointScore * .30
            ) * 100;


        progress =
            Math.round(progress);


        progress =
            Math.max(
                0,
                Math.min(
                    progress,
                    100
                )
            );


        const progressBar =
            document.getElementById(
                "vipProgress"
            );


        if (progressBar) {

            progressBar.style.width =
                `${progress}%`;

            progressBar.setAttribute(
                "aria-valuenow",
                progress
            );

        }


        let level;


        if (progress >= 90) {

            level =
                "VIP DIAMOND";

        }
        else if (progress >= 70) {

            level =
                "VIP PLATINUM";

        }
        else if (progress >= 40) {

            level =
                "VIP GOLD";

        }
        else {

            level =
                "VIP SILVER";

        }


        setText(
            "currentLevel",
            level
        );


        setText(
            "vipLevel",
            level
        );


        return {

            progress,
            level

        };

    }


    /* =========================================================
       CERCLES
    ========================================================= */

    function updateCircle(
        textId,
        percentage
    ) {

        percentage =
            Math.round(
                Math.max(
                    0,
                    Math.min(
                        percentage,
                        100
                    )
                )
            );


        setText(
            textId,
            `${percentage}%`
        );


        const element =
            document.getElementById(
                textId
            );


        if (!element) {
            return;
        }


        const circle =
            element.closest(
                ".circle"
            );


        if (circle) {

            circle.style.setProperty(
                "--progress",
                `${percentage}%`
            );

        }

    }


    function updateCircles(
        orders,
        payments,
        points,
        benefits
    ) {

        updateCircle(
            "circleOrders",
            (orders / 10) * 100
        );


        updateCircle(
            "circlePayments",
            (payments / 500) * 100
        );


        updateCircle(
            "circleLoyalty",
            (points / 1000) * 100
        );


        updateCircle(
            "circleBenefits",
            (benefits / 10) * 100
        );

    }


    /* =========================================================
       NOTIFICATIONS
    ========================================================= */

    function loadNotifications(
        orders,
        payments
    ) {

        const container =
            document.getElementById(
                "notificationList"
            );


        if (!container) {
            return;
        }


        let notifications =
            readStorage(
                STORAGE.notifications,
                []
            );


        if (!Array.isArray(notifications)) {
            notifications = [];
        }


        if (notifications.length === 0) {

            notifications.push({

                id: "welcome",

                type: "success",

                message:
                    "Votre espace VIP est actif.",

                date:
                    new Date().toISOString()

            });

        }


        if (orders > 0) {

            const exists =
                notifications.some(
                    item =>
                        item.id ===
                        "orders-summary"
                );


            if (!exists) {

                notifications.push({

                    id: "orders-summary",

                    type: "order",

                    message:
                        `${orders} commande(s) enregistrée(s).`,

                    date:
                        new Date().toISOString()

                });

            }

        }


        if (payments > 0) {

            const exists =
                notifications.some(
                    item =>
                        item.id ===
                        "payments-summary"
                );


            if (!exists) {

                notifications.push({

                    id: "payments-summary",

                    type: "payment",

                    message:
                        `Total des paiements : ${money(payments)}.`,

                    date:
                        new Date().toISOString()

                });

            }

        }


        notifications =
            notifications.slice(-30);


        writeStorage(
            STORAGE.notifications,
            notifications
        );


        container.innerHTML = "";


        notifications
            .slice()
            .reverse()
            .slice(0, 8)
            .forEach(notification => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "notification-item";


                let icon =
                    "fa-check";


                switch (
                    notification.type
                ) {

                    case "order":
                        icon =
                            "fa-cart-shopping";
                        break;

                    case "payment":
                        icon =
                            "fa-credit-card";
                        break;

                    case "message":
                        icon =
                            "fa-comments";
                        break;

                    case "meeting":
                        icon =
                            "fa-video";
                        break;

                }


                const iconElement =
                    document.createElement(
                        "i"
                    );


                iconElement.className =
                    `fa-solid ${icon}`;


                const text =
                    document.createElement(
                        "span"
                    );


                text.textContent =
                    notification.message ||
                    "Nouvelle notification";


                item.appendChild(
                    iconElement
                );


                item.appendChild(
                    text
                );


                container.appendChild(
                    item
                );

            });

    }


    /* =========================================================
       DASHBOARD
    ========================================================= */

    function refreshDashboard() {

        loadProfile();


        const orders =
            getOrders();


        const orderCount =
            orders.length;


        const paymentTotal =
            calculatePayments();


        const points =
            getVipPoints();


        const benefits =
            getVipBenefits();


        setText(
            "totalOrders",
            orderCount
        );


        setText(
            "totalPayments",
            money(paymentTotal)
        );


        setText(
            "vipPoints",
            points
        );


        setText(
            "vipBenefits",
            benefits
        );


        updateVipProgress(

            orderCount,

            paymentTotal,

            points

        );


        updateCircles(

            orderCount,

            paymentTotal,

            points,

            benefits

        );


        loadNotifications(

            orderCount,

            paymentTotal

        );

    }


    /* =========================================================
       DÉCONNEXION
    ========================================================= */

    function logout() {

        const confirmation =
            confirm(
                "Voulez-vous vraiment vous déconnecter de votre espace VIP ?"
            );


        if (!confirmation) {
            return;
        }


        /*
         * Suppression des données de session.
         */

        removeStorage(
            STORAGE.member
        );


        removeStorage(
            STORAGE.user
        );


        removeStorage(
            STORAGE.profile
        );


        removeStorage(
            STORAGE.loggedIn
        );


        /*
         * Nettoyage éventuel des anciennes clés.
         */

        removeStorage(
            "currentUser"
        );


        removeStorage(
            "vipUser"
        );


        removeStorage(
            "ymsCurrentUser"
        );


        /*
         * Retour vers la page client.
         */

        window.location.href =
            LOGIN_PAGE;

    }


    const logoutButton =
        document.getElementById(
            "logout"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                logout();

            }
        );

    }


    /* =========================================================
       MENU MOBILE
    ========================================================= */

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    const sidebar =
        document.getElementById(
            "memberSidebar"
        );


    if (
        mobileMenu &&
        sidebar
    ) {

        mobileMenu.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );


        document
            .querySelectorAll(
                ".member-nav a"
            )
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        sidebar.classList.remove(
                            "open"
                        );

                    }
                );

            });

    }


    /* =========================================================
       SLIDER
    ========================================================= */

    const slides =
        document.querySelectorAll(
            ".vip-slide"
        );


    const dots =
        document.querySelectorAll(
            ".slider-dot"
        );


    const previous =
        document.getElementById(
            "sliderPrev"
        );


    const next =
        document.getElementById(
            "sliderNext"
        );


    let currentSlide = 0;

    let sliderTimer = null;


    function showSlide(index) {

        if (!slides.length) {
            return;
        }


        if (index >= slides.length) {
            index = 0;
        }


        if (index < 0) {
            index =
                slides.length - 1;
        }


        currentSlide =
            index;


        slides.forEach(
            (slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === currentSlide
                );

            }
        );


        dots.forEach(
            (dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === currentSlide
                );

            }
        );

    }


    function startSlider() {

        clearInterval(
            sliderTimer
        );


        sliderTimer =
            setInterval(
                () => {

                    showSlide(
                        currentSlide + 1
                    );

                },
                6000
            );

    }


    if (next) {

        next.addEventListener(
            "click",
            () => {

                showSlide(
                    currentSlide + 1
                );

                startSlider();

            }
        );

    }


    if (previous) {

        previous.addEventListener(
            "click",
            () => {

                showSlide(
                    currentSlide - 1
                );

                startSlider();

            }
        );

    }


    dots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    showSlide(
                        index
                    );

                    startSlider();

                }
            );

        }
    );


    showSlide(0);

    startSlider();


    /* =========================================================
       INITIALISATION
    ========================================================= */

    refreshDashboard();


    /* =========================================================
       ACTUALISATION
    ========================================================= */

    setInterval(
        refreshDashboard,
        5000
    );


    window.addEventListener(
        "storage",
        () => {

            refreshDashboard();

        }
    );


    window.addEventListener(
        "ymsDashboardUpdate",
        () => {

            refreshDashboard();

        }
    );


    /* =========================================================
       API PUBLIQUE
    ========================================================= */

    window.YMSDashboard = {

        refresh:
            refreshDashboard,

        getMember:
            getMember,

        getOrders:
            getOrders,

        getPayments:
            getPayments,

        getVipPoints:
            getVipPoints,

        getVipBenefits:
            getVipBenefits,

        logout:
            logout

    };

});