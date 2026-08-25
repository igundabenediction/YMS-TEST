/* ============================================================
   YMS STORE
   ESPACE CLIENT VIP
   client.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       CONFIGURATION
    ======================================================== */

    const STORAGE = {

        member: "ymsVipMember",

        user: "ymsUser",

        profile: "vipProfile",

        orders: "ymsOrders",

        payments: "ymsPayments",

        vipPoints: "vipPoints",

        vipBenefits: "vipBenefits",

        notifications: "vipNotifications"

    };


    const DEFAULT_PHOTO =
        "assets/image/default-user.png";


    /* ========================================================
       OUTILS LOCALSTORAGE
    ======================================================== */

    function getStorage(key, defaultValue = null) {

        try {

            const data =
                localStorage.getItem(key);

            if (data === null) {

                return defaultValue;

            }


            try {

                return JSON.parse(data);

            } catch {

                return data;

            }

        } catch (error) {

            console.warn(
                "YMS CLIENT - Erreur localStorage :",
                key,
                error
            );

            return defaultValue;

        }

    }


    function setStorage(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch (error) {

            console.warn(
                "YMS CLIENT - Impossible d'enregistrer :",
                key,
                error
            );

        }

    }


    function removeStorage(key) {

        try {

            localStorage.removeItem(key);

        } catch (error) {

            console.warn(
                "YMS CLIENT - Impossible de supprimer :",
                key,
                error
            );

        }

    }


    /* ========================================================
       OUTILS
    ======================================================== */

    function setText(id, value) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value ?? "";

        }

    }


    function getNumber(value, fallback = 0) {

        const number =
            Number(value);


        return Number.isFinite(number)
            ? number
            : fallback;

    }


    function formatMoney(value) {

        const amount =
            getNumber(value);


        return amount.toLocaleString(
            "fr-FR",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        ) + "$";

    }


    /* ========================================================
       MEMBRE CONNECTÉ
       ======================================================== */

    function getMember() {

        let member =
            getStorage(
                STORAGE.member,
                null
            );


        if (
            member &&
            typeof member === "object"
        ) {

            return member;

        }


        member =
            getStorage(
                STORAGE.profile,
                null
            );


        if (
            member &&
            typeof member === "object"
        ) {

            return member;

        }


        member =
            getStorage(
                STORAGE.user,
                null
            );


        if (
            member &&
            typeof member === "object"
        ) {

            return member;

        }


        /*
         * Profil de secours
         */

        return {

            name: "Membre VIP",

            prenom: "Membre",

            nom: "VIP",

            phone: "Non renseigné",

            telephone: "Non renseigné",

            email: "Non renseigné",

            photo: DEFAULT_PHOTO,

            dateInscription:
                new Date().toLocaleDateString("fr-FR"),

            status: "Actif",

            vipLevel: "VIP GOLD"

        };

    }


    /* ========================================================
       NOM COMPLET
       ======================================================== */

    function getFullName(member) {

        if (!member) {

            return "Membre VIP";

        }


        const directName =
            member.name ||
            member.fullName ||
            member.displayName;


        if (directName) {

            return String(
                directName
            ).trim();

        }


        const firstName =
            member.prenom ||
            member.firstname ||
            member.firstName ||
            "";


        const lastName =
            member.nom ||
            member.lastname ||
            member.lastName ||
            "";


        const fullName =
            `${firstName} ${lastName}`
                .trim();


        return fullName ||
            "Membre VIP";

    }


    /* ========================================================
       PROFIL
       ======================================================== */

    function loadProfile() {

        const member =
            getMember();


        const fullName =
            getFullName(member);


        /* NOM */

        setText(
            "welcomeName",
            fullName
        );


        setText(
            "memberName",
            fullName
        );


        /* TÉLÉPHONE */

        setText(
            "memberPhone",

            member.phone ||
            member.telephone ||
            member.tel ||
            "Non renseigné"

        );


        /* EMAIL */

        setText(
            "memberEmail",

            member.email ||
            member.mail ||
            "Non renseigné"

        );


        /* DATE */

        let registrationDate =

            member.dateInscription ||
            member.createdAt ||
            member.created_at ||
            member.date ||
            "Non renseignée";


        /*
         * Si createdAt est une date ISO
         */

        if (
            typeof registrationDate ===
            "string" &&
            registrationDate.includes("T")
        ) {

            const date =
                new Date(registrationDate);


            if (
                !Number.isNaN(
                    date.getTime()
                )
            ) {

                registrationDate =
                    date.toLocaleDateString(
                        "fr-FR"
                    );

            }

        }


        setText(
            "memberDate",
            registrationDate
        );


        /* STATUT */

        setText(
            "memberStatus",

            member.status ||
            member.statut ||
            "Actif"

        );


        /* NIVEAU VIP */

        const level =

            member.vipLevel ||
            member.level ||
            member.vip ||
            "VIP GOLD";


        setText(
            "vipLevel",
            level
        );


        setText(
            "currentLevel",
            level
        );


        /* PHOTO */

        const photo =

            member.photo ||
            member.photoURL ||
            member.avatar ||
            member.image ||
            DEFAULT_PHOTO;


        const photoElement =
            document.getElementById(
                "memberPhoto"
            );


        if (photoElement) {

            photoElement.src =
                photo;


            photoElement.onerror =
                function () {

                    this.onerror = null;

                    this.src =
                        DEFAULT_PHOTO;

                };

        }

    }


    /* ========================================================
       COMMANDES
       ======================================================== */

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
                getStorage(
                    key,
                    null
                );


            if (Array.isArray(data)) {

                return data;

            }

        }


        return [];

    }


    function updateOrders() {

        const orders =
            getOrders();


        setText(
            "totalOrders",
            orders.length
        );


        return orders;

    }


    /* ========================================================
       PAIEMENTS
       ======================================================== */

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
                getStorage(
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

        if (!payment) {

            return 0;

        }


        return getNumber(

            payment.amount ??
            payment.montant ??
            payment.price ??
            payment.prix ??
            payment.total ??
            payment.value ??
            0

        );

    }


    function updatePayments() {

        const payments =
            getPayments();


        let total = 0;


        payments.forEach(
            payment => {

                const status =

                    String(
                        payment.status ||
                        payment.statut ||
                        ""
                    )
                    .toLowerCase()
                    .trim();


                /*
                 * Ignorer les transactions
                 * refusées ou annulées.
                 */

                if (

                    status === "refused" ||
                    status === "refusé" ||
                    status === "rejected" ||
                    status === "cancelled" ||
                    status === "annulé" ||
                    status === "failed" ||
                    status === "échoué"

                ) {

                    return;

                }


                total +=
                    getPaymentAmount(
                        payment
                    );

            }
        );


        setText(
            "totalPayments",
            formatMoney(total)
        );


        return total;

    }


    /* ========================================================
       POINTS VIP
       ======================================================== */

    function getVipPoints() {

        let points =
            getStorage(
                STORAGE.vipPoints,
                0
            );


        if (
            typeof points ===
            "object" &&
            points !== null
        ) {

            points =

                points.total ??
                points.points ??
                points.value ??
                0;

        }


        if (
            points === null ||
            points === "" ||
            points === 0
        ) {

            const alternatives = [

                "pointsVIP",

                "pointsVip",

                "ymsVipPoints"

            ];


            for (
                const key of alternatives
            ) {

                const value =
                    localStorage.getItem(
                        key
                    );


                if (
                    value !== null
                ) {

                    points =
                        getNumber(
                            value,
                            0
                        );

                    break;

                }

            }

        }


        return getNumber(
            points,
            0
        );

    }


    function updateVipPoints() {

        const points =
            getVipPoints();


        setText(
            "vipPoints",
            points
        );


        return points;

    }


    /* ========================================================
       AVANTAGES VIP
       ======================================================== */

    function getVipBenefits() {

        let benefits =
            getStorage(
                STORAGE.vipBenefits,
                0
            );


        if (
            typeof benefits ===
            "object" &&
            benefits !== null
        ) {

            benefits =

                benefits.total ??
                benefits.count ??
                benefits.value ??
                0;

        }


        if (
            benefits === null ||
            benefits === "" ||
            benefits === 0
        ) {

            const alternatives = [

                "avantagesVIP",

                "benefitsVIP",

                "ymsVipBenefits"

            ];


            for (
                const key of alternatives
            ) {

                const value =
                    localStorage.getItem(
                        key
                    );


                if (
                    value !== null
                ) {

                    benefits =
                        getNumber(
                            value,
                            0
                        );

                    break;

                }

            }

        }


        return getNumber(
            benefits,
            0
        );

    }


    function updateVipBenefits() {

        const benefits =
            getVipBenefits();


        setText(
            "vipBenefits",
            benefits
        );


        return benefits;

    }


    /* ========================================================
       CALCUL VIP
       ======================================================== */

    function calculateVipLevel(
        orders,
        payments,
        points
    ) {

        const orderProgress =
            Math.min(
                orders / 10,
                1
            );


        const paymentProgress =
            Math.min(
                payments / 500,
                1
            );


        const pointProgress =
            Math.min(
                points / 1000,
                1
            );


        let progress =

            (
                orderProgress * 0.30 +
                paymentProgress * 0.40 +
                pointProgress * 0.30
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


        let level =
            "VIP SILVER";


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


        setText(
            "vipLevel",
            level
        );


        setText(
            "currentLevel",
            level
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


        return {

            progress,
            level

        };

    }


    /* ========================================================
       NOTIFICATIONS
       ======================================================== */

    function getNotifications() {

        let notifications =
            getStorage(
                STORAGE.notifications,
                []
            );


        if (
            !Array.isArray(
                notifications
            )
        ) {

            notifications = [];

        }


        return notifications;

    }


    function saveNotifications(
        notifications
    ) {

        setStorage(
            STORAGE.notifications,
            notifications
        );

    }


    function createDefaultNotification() {

        return {

            id:
                "welcome-vip",

            type:
                "success",

            message:
                "Votre espace VIP est actif.",

            date:
                new Date().toISOString()

        };

    }


    function generateNotifications(
        orders,
        payments
    ) {

        let notifications =
            getNotifications();


        if (
            notifications.length === 0
        ) {

            notifications.push(
                createDefaultNotification()
            );

        }


        /*
         * Notification commandes
         */

        if (orders > 0) {

            const exists =
                notifications.some(
                    notification =>
                        notification.id ===
                        "client-orders-summary"
                );


            if (!exists) {

                notifications.push({

                    id:
                        "client-orders-summary",

                    type:
                        "order",

                    message:
                        `${orders} commande(s) enregistrée(s).`,

                    date:
                        new Date().toISOString()

                });

            }

        }


        /*
         * Notification paiements
         */

        if (payments > 0) {

            const exists =
                notifications.some(
                    notification =>
                        notification.id ===
                        "client-payments-summary"
                );


            if (!exists) {

                notifications.push({

                    id:
                        "client-payments-summary",

                    type:
                        "payment",

                    message:
                        `Total de vos paiements : ${formatMoney(payments)}.`,

                    date:
                        new Date().toISOString()

                });

            }

        }


        /*
         * Maximum 30 notifications
         */

        notifications =
            notifications.slice(-30);


        saveNotifications(
            notifications
        );

        return notifications;

    }


    function displayNotifications() {

        const container =
            document.getElementById(
                "notificationList"
            );


        if (!container) {

            return;

        }


        const notifications =
            getNotifications();


        if (
            notifications.length === 0
        ) {

            container.innerHTML = `

                <div class="notification">

                    <i class="fa-solid fa-circle-info"></i>

                    <span>
                        Aucune notification pour le moment.
                    </span>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        notifications
            .slice()
            .reverse()
            .slice(0, 5)
            .forEach(
                notification => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "notification";


                    let icon =
                        "fa-circle-check";


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


                        case "warning":

                            icon =
                                "fa-triangle-exclamation";

                            break;

                    }


                    const iconElement =
                        document.createElement(
                            "i"
                        );


                    iconElement.className =
                        `fa-solid ${icon}`;


                    const textElement =
                        document.createElement(
                            "span"
                        );


                    textElement.textContent =
                        notification.message ||
                        "Nouvelle notification";


                    item.appendChild(
                        iconElement
                    );


                    item.appendChild(
                        textElement
                    );


                    container.appendChild(
                        item
                    );

                }
            );

    }


    /* ========================================================
       DÉCONNEXION
       ======================================================== */

    function logout() {

        /*
         * Confirmation
         */

        const confirmed =
            window.confirm(
                "Voulez-vous vraiment vous déconnecter de votre espace VIP ?"
            );


        if (!confirmed) {

            return;

        }


        /*
         * Clés liées à la session
         *
         * IMPORTANT :
         * Nous ne supprimons PAS les commandes,
         * paiements, points ou notifications.
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


        /*
         * Nettoyage des éventuelles
         * clés d'authentification.
         */

        const authKeys = [

            "ymsLoggedIn",

            "ymsAuthenticated",

            "vipAuthenticated",

            "isVipLoggedIn",

            "currentVipUser",

            "loggedUser",

            "currentUser"

        ];


        authKeys.forEach(
            key => {

                removeStorage(key);

            }
        );


        /*
         * Événement pour les autres scripts
         */

        window.dispatchEvent(
            new CustomEvent(
                "ymsLogout"
            )
        );


        /*
         * Redirection vers la page
         * de connexion VIP.
         *
         * Si ta page de connexion
         * porte un autre nom,
         * nous le modifierons ensuite.
         */

        window.location.href =
            "abonnement.html";

    }


    /* ========================================================
       ÉVÉNEMENT DÉCONNEXION
       ======================================================== */

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


    /* ========================================================
       ACTUALISATION DU DASHBOARD
       ======================================================== */

    function refreshClient() {

        loadProfile();


        const orders =
            updateOrders();


        const payments =
            updatePayments();


        const points =
            updateVipPoints();


        updateVipBenefits();


        calculateVipLevel(

            orders.length,

            payments,

            points

        );


        generateNotifications(

            orders.length,

            payments

        );


        displayNotifications();

    }


    /* ========================================================
       INITIALISATION
       ======================================================== */

    refreshClient();


    /* ========================================================
       ACTUALISATION AUTOMATIQUE
       ======================================================== */

    const refreshInterval =
        setInterval(
            refreshClient,
            5000
        );


    /* ========================================================
       LOCALSTORAGE
       ======================================================== */

    window.addEventListener(
        "storage",
        function () {

            refreshClient();

        }
    );


    /* ========================================================
       ÉVÉNEMENT PERSONNALISÉ
       ======================================================== */

    window.addEventListener(
        "ymsClientUpdate",
        function () {

            refreshClient();

        }
    );


    /* ========================================================
       API PUBLIQUE
       ======================================================== */

    window.YMSClient = {

        refresh:
            refreshClient,

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


    /* ========================================================
       NETTOYAGE
       ======================================================== */

    window.addEventListener(
        "beforeunload",
        function () {

            clearInterval(
                refreshInterval
            );

        }
    );

});