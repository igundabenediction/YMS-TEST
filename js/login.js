/*======================================================
YMS STORE
CLIENT LOGIN
======================================================*/


document.addEventListener("DOMContentLoaded",()=>{


const loginForm =
document.getElementById("loginForm");



if(loginForm){


loginForm.addEventListener("submit",(e)=>{


e.preventDefault();



const email =
document.getElementById("loginEmail").value.trim();



const password =
document.getElementById("loginPassword").value;



const message =
document.getElementById("loginMessage");





let clients =
JSON.parse(localStorage.getItem("ymsClients")) || [];





const client =
clients.find(

user =>

user.email === email &&
user.password === password

);







if(client){



localStorage.setItem(

"ymsCurrentClient",

JSON.stringify(client)

);




message.style.color="green";

message.textContent=
"Connexion réussie...";




setTimeout(()=>{


window.location.href="account.html";


},1000);





}else{



message.style.color="red";


message.textContent=
"Email ou mot de passe incorrect.";



}



});



}



});