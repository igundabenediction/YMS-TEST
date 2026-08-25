/*======================================================
YMS STORE
ORDER DETAIL
======================================================*/


document.addEventListener("DOMContentLoaded",()=>{


/* ===============================
RECUPERATION ID COMMANDE
================================*/


const id =
localStorage.getItem(
"commandeSelectionnee"
);



const box =
document.getElementById(
"orderDetail"
);



if(!box){

console.error(
"Element orderDetail introuvable"
);

return;

}





/* ===============================
RECUPERATION COMMANDES
================================*/


const commandes = JSON.parse(

localStorage.getItem(
"ymsCommandes"
)

) || [];






const commande = commandes.find(

cmd => cmd.id === id

);






if(!commande){


box.innerHTML = `

<div class="order-error">

<h3>
Commande introuvable
</h3>

<p>
Cette commande n'existe plus ou a été supprimée.
</p>

</div>

`;

return;

}







/* ===============================
PRODUITS
================================*/


let produits = "";




if(commande.produits && commande.produits.length > 0){



commande.produits.forEach(produit=>{



produits += `


<div class="detail-product">


<img 
src="${produit.image || 'assets/image/default.png'}"
alt="${produit.nom || 'Produit'}"
>



<div>


<h3>
${produit.nom || "Produit"}
</h3>



<p>

Quantité :
${produit.quantite || 1}

</p>



<p>

Prix :
${produit.prix || 0}$

</p>



</div>



</div>


`;



});



}else{


produits = `

<p>
Aucun produit trouvé.
</p>

`;



}








/* ===============================
AFFICHAGE DETAIL
================================*/


box.innerHTML = `



<div class="order-detail-card">



<div class="order-header">


<h2>
${commande.id}
</h2>


<span class="status">

${commande.statut || "En attente"}

</span>


</div>





<h3>
Produits commandés
</h3>




<div class="order-products">

${produits}

</div>






<hr>






<div class="client-info">


<p>

<strong>Client :</strong>
${commande.clientNom || "-"}

</p>




<p>

<strong>Téléphone :</strong>
${commande.telephone || "-"}

</p>





<p>

<strong>Adresse :</strong>
${commande.adresse || "-"}

</p>




</div>








<div class="payment-info">


<p>

<strong>Paiement :</strong>
${commande.paiement || "-"}

</p>



<h2>

Total :
${Number(commande.total || 0).toFixed(2)}$

</h2>




<p>

Date :
${commande.date || "-"}

</p>



</div>






</div>



`;




});