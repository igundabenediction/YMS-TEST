```javascript id="4n8w2v"
/*======================================================
YMS STORE
AUTHENTIFICATION CLIENT
VERSION LOCALSTORAGE
======================================================*/


// CREATION COMPTE CLIENT

const registerForm = document.getElementById("registerForm");


if(registerForm){


registerForm.addEventListener("submit",(e)=>{


e.preventDefault();



const nom = document.getElementById("clientNom").value;

const email = document.getElementById("clientEmail").value;

const phone = document.getElementById("clientPhone").value;

const adresse = document.getElementById("clientAdresse").value;

const password = document.getElementById("clientPassword").value;

const photoInput = document.getElementById("clientPhoto");




let photo = "";



if(photoInput.files.length > 0){


const reader = new FileReader();



reader.onload = function(){


photo = reader.result;



enregistrerClient();



};



reader.readAsDataURL(photoInput.files[0]);



}
else{


enregistrerClient();



}





function enregistrerClient(){



const client = {


id: Date.now(),

nom: nom,

email: email,

telephone: phone,

adresse: adresse,

password: password,

photo: photo,

dateCreation:new Date().toLocaleDateString(),

commandes:[]

};



localStorage.setItem(
"ymsClient",
JSON.stringify(client)
);



alert("Compte créé avec succès !");



window.location.href="profil.html";



}



});



}






// CONNEXION CLIENT


const loginForm = document.getElementById("loginForm");



if(loginForm){


loginForm.addEventListener("submit",(e)=>{


e.preventDefault();



const email =
document.getElementById("loginEmail").value;


const password =
document.getElementById("loginPassword").value;




const client = JSON.parse(

localStorage.getItem("ymsClient")

);




if(!client){


alert("Aucun compte trouvé. Veuillez créer un compte.");

return;


}




if(
client.email === email &&
client.password === password
){



localStorage.setItem(

"ymsSession",

JSON.stringify(client)

);



alert("Connexion réussie");



window.location.href="profil.html";



}

else{


alert("Email ou mot de passe incorrect");


}



});


}
```
