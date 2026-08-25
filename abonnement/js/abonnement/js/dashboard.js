/*=========================================================*
 YMS STORE VIP
 DASHBOARD JS
 ESPACE ABONNE PREMIUM
=========================================================*/


document.addEventListener(
"DOMContentLoaded",
function(){


const membre = JSON.parse(
localStorage.getItem("ymsVipMember")
);



// ===============================
// VERIFICATION ACCES VIP
// ===============================

if(
!membre ||
membre.status !== "paid"
){

alert(
"Accès réservé aux membres VIP actifs."
);

window.location.href="register-vip.html";

return;

}



// ===============================
// PROFIL MEMBRE
// ===============================


const setText = (id,value)=>{

const element =
document.getElementById(id);

if(element){
element.textContent=value;
}

};




setText(
"welcomeName",
membre.name
);



setText(
"memberName",
membre.name
);



setText(
"memberPhone",
membre.phone || "Non renseigné"
);



setText(
"memberDate",
membre.date || membre.created
);



setText(
"memberStatus",
"ACTIF"
);





// EMAIL SI DISPONIBLE

setText(
"memberEmail",
membre.email || "Non renseigné"
);




// PHOTO

const memberPhoto =
document.getElementById("memberPhoto");


if(memberPhoto && membre.photo){

memberPhoto.src =
membre.photo;

}
// ===============================
// NIVEAU VIP
// ===============================


let niveau="";
let avantages="";
let points=0;
let progression=0;



switch(membre.plan){


case "silver":

niveau="VIP SILVER";

points=100;

progression=35;


avantages=`

✔ Réduction membre

<br>
✔ Promotions exclusives

<br>
✔ Accès offres VIP

`;

break;





case "gold":

niveau="VIP GOLD";

points=500;

progression=70;


avantages=`

✔ Réduction premium

<br>
✔ Produits exclusifs

<br>
✔ Réunions VIP

<br>
✔ Support Premium

`;

break;






case "platinum":

niveau="VIP PLATINUM";

points=1000;

progression=100;


avantages=`

✔ Tous les avantages Gold

<br>
✔ Cadeaux Platinum

<br>
✔ Priorité commandes

<br>
✔ Support VIP direct

`;

break;



default:

niveau="VIP";

}



setText(
"vipLevel",
niveau
);



setText(
"currentLevel",
niveau
);







// ===============================
// AVANTAGES
// ===============================


const advantages =
document.getElementById(
"advantages"
);


if(advantages){

advantages.innerHTML =
avantages;

}






// ===============================
// STATISTIQUES
// ===============================



const commandes =
JSON.parse(
localStorage.getItem("vipOrders")
) || [];



const paiements =
JSON.parse(
localStorage.getItem("vipPayments")
) || [];





setText(
"totalOrders",
commandes.length
);



setText(
"totalPayments",
(paiements.length*10)+"$"
);



setText(
"vipPoints",
points
);



setText(
"vipBenefits",
niveau.includes("PLATINUM")
?
"Premium"
:
"Actifs"
);







// ===============================
// BARRE PROGRESSION VIP
// ===============================


const progress =
document.getElementById(
"vipProgress"
);



if(progress){

progress.style.width =
progression+"%";

}







// ===============================
// NOTIFICATIONS
// ===============================


const notification =
document.getElementById(
"notificationList"
);



if(notification){


notification.innerHTML = `

<div class="notification-item">

<i class="fa-solid fa-check"></i>

Votre abonnement ${niveau} est actif.

</div>


<div class="notification-item">

<i class="fa-solid fa-crown"></i>

Bienvenue dans le Club VIP YMS STORE.

</div>

`;

}







// ===============================
// DECONNEXION
// ===============================


const logout =
document.getElementById(
"logout"
);



if(logout){


logout.onclick=function(e){

e.preventDefault();


const confirmLogout =
confirm(
"Voulez-vous vraiment vous déconnecter ?"
);


if(confirmLogout){


localStorage.removeItem(
"ymsVipMember"
);


window.location.href =
"index.html";


}


};


}



});