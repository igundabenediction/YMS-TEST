/* ==========================================
   YMS STORE
   CONTACT SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");

    const whatsappButton =
        document.getElementById("whatsappContact");

    const status =
        document.getElementById("contactStatus");


    /* ==========================================
       FORMULAIRE
    ========================================== */

    if (form) {

        form.addEventListener("submit", function (event) {

            event.preventDefault();


            const name =
                document.getElementById("contactName").value.trim();

            const phone =
                document.getElementById("contactPhone").value.trim();

            const email =
                document.getElementById("contactEmail").value.trim();

            const subject =
                document.getElementById("contactSubject").value;

            const message =
                document.getElementById("contactMessage").value.trim();


            if (!name || !phone || !email || !subject || !message) {

                status.textContent =
                    "Veuillez remplir tous les champs.";

                status.style.color = "#d00000";

                return;
            }


            /* ==========================================
               OBJET MESSAGE
            ========================================== */

            const contact = {

                id: Date.now(),

                name: name,

                phone: phone,

                email: email,

                subject: subject,

                message: message,

                date: new Date().toLocaleString("fr-FR"),

                status: "Nouveau"

            };


            /* ==========================================
               LOCAL STORAGE
            ========================================== */

            let contacts =
                JSON.parse(
                    localStorage.getItem("ymsContacts")
                ) || [];


            contacts.unshift(contact);


            localStorage.setItem(
                "ymsContacts",
                JSON.stringify(contacts)
            );


            /* ==========================================
               CONFIRMATION
            ========================================== */

            status.textContent =
                "✓ Votre message a été enregistré. Merci pour votre confiance.";

            status.style.color = "#16803c";


            form.reset();


            setTimeout(function () {

                status.textContent = "";

            }, 5000);

        });

    }


    /* ==========================================
       WHATSAPP
    ========================================== */

    if (whatsappButton) {

        whatsappButton.addEventListener("click", function () {

            const name =
                document.getElementById("contactName").value.trim();

            const phone =
                document.getElementById("contactPhone").value.trim();

            const subject =
                document.getElementById("contactSubject").value;

            const message =
                document.getElementById("contactMessage").value.trim();


            if (!name || !phone || !subject || !message) {

                status.textContent =
                    "Veuillez remplir votre nom, téléphone, sujet et message.";

                status.style.color = "#d00000";

                return;
            }


            const whatsappMessage =

`Bonjour YMS STORE,

Je suis ${name}.

Téléphone : ${phone}

Sujet : ${subject}

Message :
${message}

Merci.`;


            const encodedMessage =
                encodeURIComponent(whatsappMessage);


            const whatsappURL =
                `https://wa.me/243972215398?text=${encodedMessage}`;


            window.open(
                whatsappURL,
                "_blank"
            );

        });

    }

});