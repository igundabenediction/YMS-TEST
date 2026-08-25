/*=========================================================*
YMS STORE VIP
PAIEMENT JS
=========================================================*/


const membre =
JSON.parse(
localStorage.getItem("ymsVipMember")
);



if(!membre){

window.location.href="../register-vip.html";

}



// ================================
// AFFICHAGE PROFIL
// ================================

const memberInfo =
document.getElementById("memberInfo");


if(memberInfo){

memberInfo.innerHTML = `

<div class="member-card">

<h3>
<i class="fa-solid fa-user"></i>
${membre.name}
</h3>


<p>
Formule :
<strong>
${membre.plan.toUpperCase()}
</strong>
</p>


<p>
Montant abonnement :
<strong>
${
membre.plan==="silver"
?"5"
:
membre.plan==="gold"
?"10"
:"20"
}
$ / mois
</strong>
</p>


</div>

`;

}



// ================================
// LISTE PAIEMENTS
// ================================


let paiements =
JSON.parse(
localStorage.getItem("ymsPaiements")
) || [];




// ================================
// CREATION PAIEMENT
// ================================


function makePayment(){



const montant =
document.getElementById("paymentAmount").value;



const methode =
document.getElementById("paymentMethod").value;



const preuve =
document.getElementById("paymentProof").value;



if(
!montant ||
!methode ||
!preuve
){

alert(
"Veuillez remplir toutes les informations du paiement."
);

return;

}



const paiement = {


id:
"PAY"+Date.now(),


client:
membre.name,


telephone:
membre.phone,


montant:
montant,


methode:
methode,


preuve:
preuve,


date:
new Date().toLocaleString(),


statut:
"Validé"


};



paiements.push(paiement);



localStorage.setItem(
"ymsPaiements",
JSON.stringify(paiements)
);



// activation VIP

membre.status="paid";


membre.transaction=preuve;


membre.paymentMethod=methode;


membre.paymentDate=
new Date().toLocaleString();



localStorage.setItem(
"ymsVipMember",
JSON.stringify(membre)
);



alert(
"Paiement enregistré. Votre compte VIP est activé."
);



window.location.href="../dashboard.html";



}



// ================================
// AFFICHAGE HISTORIQUE
// ================================


function afficherPaiements(){


const liste =
document.getElementById("paymentList");



if(!liste)return;



const mesPaiements =
paiements.filter(
p=>p.client===membre.name
);



if(mesPaiements.length===0){

liste.innerHTML=
"<p>Aucun paiement enregistré.</p>";

return;

}



liste.innerHTML="";



mesPaiements.forEach(p=>{


liste.innerHTML += `

<div class="payment-item">


<strong>
${p.methode}
</strong>


<p>
Montant : ${p.montant}$
</p>


<p>
Date : ${p.date}
</p>


<span>
${p.statut}
</span>


</div>


`;


});


}



afficherPaiements();




// ================================
// DECONNEXION
// ================================


const logout =
document.getElementById("logout");


if(logout){

logout.onclick=function(){


localStorage.removeItem(
"ymsVipMember"
);


window.location.href="../index.html";


};


}