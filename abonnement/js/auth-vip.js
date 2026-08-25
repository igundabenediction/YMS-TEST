 /*=========================================================
 YMS STORE VIP
 AUTH-VIP.JS
 Protection espace membre
=========================================================*/


const membreVIP = JSON.parse(
localStorage.getItem("ymsVipMember")
);



// Vérification compte VIP actif

if(
!membre ||
membre.status !== "paid"
){

alert(
"Votre abonnement VIP n'est pas actif."
);

window.location.href="../register-vip.html";

}

// Disponible dans tous les scripts

window.membreVIP = membreVIP;