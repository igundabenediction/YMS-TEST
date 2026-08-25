/*======================================================
YMS STORE
CLIENT ORDERS
======================================================*/


document.addEventListener("DOMContentLoaded",()=>{


/* ===============================
SESSION CLIENT
================================*/


const client =
JSON.parse(

localStorage.getItem(
"ymsSession"
)

);





if(!client){


window.location.href="../login.html";

return;


}







/* ===============================
ZONE AFFICHAGE
================================*/


const box =
document.getElementById(
"ordersList"
);




if(!box){

console.error(
"ordersList introuvable"
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







/* ===============================
COMMANDES DU CLIENT
================================*/


const mesCommandes = commandes.filter(cmd=>{


return String(cmd.clientId)
===
String(client.id);


});







/* ===============================
AUCUNE COMMANDE
================================*/


if(mesCommandes.length === 0){



box.innerHTML = `


<div class="empty-orders">


<h3>
Aucune commande trouvée
</h3>



<p>
Vos prochaines commandes apparaîtront ici.
</p>


</div>


`;


return;


}







/* ===============================
AFFICHAGE
================================*/


box.innerHTML="";



mesCommandes.reverse()
.forEach(cmd=>{





box.innerHTML += `



<div class="order-card">





<div class="order-header">



<h3>
${cmd.id}
</h3>




<span class="status">

${cmd.statut || "En attente"}

</span>



</div>








<div class="order-info">



<p>

Date :
${cmd.date || "-"}

</p>





<p>

Paiement :
${cmd.paiement || "-"}

</p>





<p>

Total :

<strong>

${cmd.total || 0}$

</strong>


</p>





</div>








<button 
class="view-order"
data-id="${cmd.id}"
>


Voir détails


</button>





</div>



`;



});









/* ===============================
BOUTONS DETAILS
================================*/


document.querySelectorAll(
".view-order"
)
.forEach(button=>{


button.addEventListener(
"click",
()=>{


const id =
button.dataset.id;



localStorage.setItem(

"commandeSelectionnee",

id

);



window.location.href =
"commande-detail.html";



});


});




});