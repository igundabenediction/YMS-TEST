/*======================================================
YMS STORE
ACCOUNT SYSTEM
INSCRIPTION CLIENT
======================================================*/


document.addEventListener("DOMContentLoaded",()=>{


const registerForm = document.getElementById("registerForm");



if(registerForm){



registerForm.addEventListener("submit",(e)=>{


e.preventDefault();



const fullname =
document.getElementById("fullname").value.trim();



const phone =
document.getElementById("phone").value.trim();



const email =
document.getElementById("email").value.trim();



const address =
document.getElementById("address").value.trim();



const password =
document.getElementById("password").value;



const confirmPassword =
document.getElementById("confirmPassword").value;



const message =
document.getElementById("registerMessage");





/* Vérification mot de passe */


if(password !== confirmPassword){


message.style.color="red";

message.textContent =
"Les mots de passe ne correspondent pas.";


return;


}





/* Récupération anciens clients */


let clients =
JSON.parse(localStorage.getItem("ymsClients")) || [];





/* Vérifier email existant */


const existe =
clients.find(
client=>client.email===email
);



if(existe){


message.style.color="red";

message.textContent =
"Un compte existe déjà avec cet email.";


return;


}







/* Création client */


const nouveauClient = {


id:Date.now(),


fullname:fullname,


phone:phone,


email:email,


address:address,


password:password,


date:new Date().toLocaleDateString(),


status:"Actif"


};






clients.push(nouveauClient);





localStorage.setItem(

"ymsClients",

JSON.stringify(clients)

);






/* Session client */


localStorage.setItem(

"ymsCurrentClient",

JSON.stringify(nouveauClient)

);






message.style.color="green";


message.textContent =
"Compte créé avec succès !";






setTimeout(()=>{


window.location.href="account.html";


},1500);





});



}



});