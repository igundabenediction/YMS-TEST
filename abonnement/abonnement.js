/*=========================================================
 YMS STORE VIP
 DASHBOARD.JS
=========================================================*/


const membre = JSON.parse(
localStorage.getItem("ymsVipMember")
);



// ==============================
// VERIFICATION MEMBRE VIP
// ==============================

if(
!membre ||
membre.status !== "paid"
){

alert(
"Accès réservé aux membres VIP actifs."
);

window.location.href="register-vip.html";

}



// ==============================
// PROFIL MEMBRE
// ==============================


const welcomeName =
document.getElementById("welcomeName");

if(welcomeName)
welcomeName.textContent =
membre.name;



const memberName =
document.getElementById("memberName");

if(memberName)
memberName.textContent =
membre.name;




const memberPhoto =
document.getElementById("memberPhoto");

if(memberPhoto){

memberPhoto.src =
membre.photo ||
"../assets/image/default-user.png";

}




const memberPhone =
document.getElementById("memberPhone");

if(memberPhone)
memberPhone.textContent =
membre.phone || "Non renseigné";




const memberDate =
document.getElementById("memberDate");

if(memberDate)
memberDate.textContent =
membre.date || "Aujourd'hui";






// ==============================
// NIVEAU VIP
// ==============================


const vipLevel =
document.getElementById("vipLevel");


if(vipLevel)

vipLevel.textContent =
membre.plan.toUpperCase()+" MEMBER";





// ==============================
// STATUT
// ==============================


const memberStatus =
document.getElementById("memberStatus");


if(memberStatus)

memberStatus.textContent =
"ACTIF";







// ==============================
// AVANTAGES VIP
// ==============================


const advantages =
document.getElementById("advantages");



if(advantages){


if(membre.plan==="silver"){


advantages.innerHTML = `

✔ Réduction 1$ <br>
✔ Promotions VIP

`;



}



else if(membre.plan==="gold"){


advantages.innerHTML = `

✔ Réduction 2$ <br>
✔ Produits exclusifs <br>
✔ Réunions VIP <br>
✔ Support Premium

`;



}



else{


advantages.innerHTML = `

✔ Tous les avantages Gold <br>
✔ Cadeaux Platinum <br>
✔ Accès prioritaire

`;



}



}






// ==============================
// DECONNEXION
// ==============================


const logout =
document.getElementById("logout");



if(logout){


logout.onclick=function(){


localStorage.removeItem(
"ymsVipMember"
);


window.location.href="index.html";


};


}