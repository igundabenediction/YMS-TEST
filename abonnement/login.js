/*=========================================================
 YMS STORE VIP
 LOGIN.JS
=========================================================*/


document
.getElementById("loginForm")
.addEventListener("submit",(e)=>{


e.preventDefault();



let user=
document.getElementById("loginUser").value;



let password=
document.getElementById("loginPassword").value;





/*
Compte test VIP
à remplacer plus tard par Firebase Auth
*/


let membre={


nom:"Client VIP YMS",


telephone:user,


adresse:"Non renseignée",


vip:true,


photo:"../assets/image/default-user.png"


};





if(user && password){



localStorage.setItem(

"ymsMembreConnecte",

JSON.stringify(membre)

);



localStorage.setItem(

"ymsSession",

"active"

);





alert(
"Connexion réussie Bienvenue chez YMS STORE VIP"
);



window.location.href="dashboard.html";



}



});