/*=========================================================*
YMS STORE VIP
PROFIL JS
=========================================================*/

const membre = JSON.parse(localStorage.getItem("ymsVipMember"));

if (!membre) {
    window.location.href = "../register-vip.html";
}

// Vérification abonnement
if (membre.status !== "paid") {
    alert("Votre abonnement VIP n'est pas encore actif.");
    window.location.href = "paiement.html";
}

// =======================
// AFFICHAGE PROFIL
// =======================

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "-";
}

function setImage(id, value, fallback) {
    const el = document.getElementById(id);
    if (el) {
        el.src = value || fallback;
    }
}

setImage(
    "profilePhoto",
    membre.photo,
    "../assets/image/default-user.png"
);

setText("profileName", membre.name);
setText("profilePhone", membre.phone);
setText("profileAddress", membre.address);
setText("profilePlan", membre.plan.toUpperCase());
setText("profileId", membre.id);
setText("profileDate", membre.date);
setText("profileCreated", membre.created);
setText("profilePaymentDate", membre.paymentDate || "Aucun paiement");
setText("profileTransaction", membre.transaction || "Non disponible");

const status = document.getElementById("profileStatus");

if (status) {

    status.textContent =
        membre.status === "paid"
            ? "ACTIF"
            : "EN ATTENTE";

    status.classList.add(
        membre.status === "paid"
            ? "status-active"
            : "status-pending"
    );

}

// =======================
// COULEUR SELON LE PLAN
// =======================

const badge = document.getElementById("planBadge");

if (badge) {

    badge.textContent =
        membre.plan.toUpperCase();

    badge.classList.add(membre.plan);

}

// =======================
// HISTORIQUE DES PAIEMENTS
// =======================

const paymentContainer =
document.getElementById("paymentHistory");

if (paymentContainer) {

    const paiements =
        JSON.parse(localStorage.getItem("ymsPaiements")) || [];

    const mesPaiements =
        paiements.filter(p => p.client === membre.name);

    if (mesPaiements.length === 0) {

        paymentContainer.innerHTML = `
            <p class="empty">
                Aucun paiement enregistré.
            </p>
        `;

    } else {

        paymentContainer.innerHTML = "";

        mesPaiements.forEach(p => {

            paymentContainer.innerHTML += `

            <div class="payment-item">

                <div>

                    <strong>${p.montant}$</strong>

                    <small>${p.date}</small>

                </div>

                <div>

                    <span>${p.methode}</span>

                </div>

                <div>

                    <span class="paid">
                        ${p.statut}
                    </span>

                </div>

            </div>

            `;

        });

    }

}

// =======================
// MODIFIER PROFIL
// =======================

const editBtn =
document.getElementById("editProfile");

if(editBtn){

editBtn.onclick = ()=>{

const phone =
prompt(
"Nouveau numéro",
membre.phone
);

if(phone){

membre.phone = phone;

localStorage.setItem(
"ymsVipMember",
JSON.stringify(membre)
);

location.reload();

}

};

}

// =======================
// TELECHARGER CARTE
// =======================

const downloadBtn =
document.getElementById("downloadCard");

if(downloadBtn){

downloadBtn.onclick = ()=>{

alert(
"La génération de la carte VIP sera ajoutée dans la prochaine étape."
);

};

}

// =======================
// RETOUR
// =======================

const back =
document.getElementById("backDashboard");

if(back){

back.onclick = ()=>{

window.location.href =
"../dashboard.html";

};

}

// =======================
// DECONNEXION
// =======================

const logout =
document.getElementById("logout");

if(logout){

logout.onclick = ()=>{

localStorage.removeItem("ymsVipMember");

window.location.href =
"../index.html";

};

}