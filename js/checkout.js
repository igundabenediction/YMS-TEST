/*======================================================
YMS STORE
CHECKOUT SYSTEM
======================================================*/


document.addEventListener("DOMContentLoaded",()=>{


/* ===============================
RECUPERATION CLIENT
================================*/


const client = JSON.parse(
localStorage.getItem("ymsSession")
);



if(!client){

window.location.href="login.html";

return;

}



/* ===============================
ELEMENTS HTML
================================*/


const nomBox = document.getElementById("checkoutNom");
const phoneBox = document.getElementById("checkoutPhone");
const adresseBox = document.getElementById("checkoutAdresse");

const productsBox = document.getElementById("checkoutProducts");
const totalBox = document.getElementById("checkoutTotal");

const confirmBtn = document.getElementById("confirmOrder");





/* ===============================
AFFICHAGE CLIENT
================================*/


if(nomBox)
nomBox.textContent = client.nom || "Client";


if(phoneBox)
phoneBox.textContent = client.telephone || "-";


if(adresseBox)
adresseBox.textContent = client.adresse || "-";






/* ===============================
RECUPERATION PANIER
================================*/


const panier = JSON.parse(

localStorage.getItem("ymsPanier")

) || [];



let total = 0;



if(productsBox){

productsBox.innerHTML="";


if(panier.length===0){

productsBox.innerHTML=`

<p class="empty-cart">
Votre panier est vide.
</p>

`;

}



panier.forEach(produit=>{


const prix = Number(produit.prix) || 0;

const quantite = Number(produit.quantite) || 1;


total += prix * quantite;



productsBox.innerHTML += `


<div class="checkout-product">


<img src="${produit.image || 'assets/image/default.png'}"
alt="${produit.nom}">


<div>

<h4>
${produit.nom}
</h4>


<p>
${quantite} x ${prix}$
</p>


</div>


</div>


`;



});


}



if(totalBox){

totalBox.textContent =
total.toFixed(2)+"$";

}








/* ===============================
VALIDATION COMMANDE
================================*/


if(confirmBtn){



confirmBtn.addEventListener("click",()=>{





if(panier.length===0){

alert("Votre panier est vide");

return;

}







const paiementInput =
document.querySelector(
"input[name='paiement']:checked"
);




if(!paiementInput){

alert("Veuillez choisir un moyen de paiement");

return;

}





const commande = {



id:
"CMD-"+Date.now(),



clientId:
client.id || "CLIENT-"+Date.now(),



clientNom:
client.nom || "",



telephone:
client.telephone || "",



adresse:
client.adresse || "",



produits:
panier,



total:
total,



paiement:
paiementInput.value,



date:
new Date().toLocaleString(),



statut:
"En attente"



};






let commandes = JSON.parse(

localStorage.getItem("ymsCommandes")

) || [];






commandes.push(commande);






localStorage.setItem(

"ymsCommandes",

JSON.stringify(commandes)

);







localStorage.removeItem(

"ymsPanier"

);






alert(
"Votre commande a été envoyée avec succès."
);






window.location.href="commandes.html";





});



}



});