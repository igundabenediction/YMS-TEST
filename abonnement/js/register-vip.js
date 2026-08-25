/*=========================================================*
YMS STORE VIP
REGISTER VIP JS
Création compte membre avec photo
=========================================================*/


console.log("REGISTER VIP JS CHARGE");


// ==============================
// ELEMENTS
// ==============================

const photoInput = document.getElementById("photo");
const previewPhoto = document.getElementById("previewPhoto");
const vipForm = document.getElementById("vipRegisterForm");




// ==============================
// APERCU PHOTO
// ==============================

if(photoInput){

photoInput.addEventListener("change", function(){

    const file = this.files[0];

    if(file && previewPhoto){

        previewPhoto.src = URL.createObjectURL(file);

    }

});

}





// ==============================
// CREATION COMPTE VIP
// ==============================


if(vipForm){


vipForm.addEventListener("submit", function(e){


e.preventDefault();


console.log("Formulaire envoyé");



const name =
document.getElementById("name").value.trim();


const phone =
document.getElementById("phone").value.trim();



const address =
document.getElementById("address").value.trim();



const plan =
document.getElementById("plan").value;



const photoFile =
photoInput.files[0];





if(
name === "" ||
phone === "" ||
address === "" ||
plan === "" ||
!photoFile
){


alert(
"Veuillez remplir tous les champs et ajouter une photo."
);


return;


}





const reader = new FileReader();





reader.onload = function(e){



const membre = {


id:
"VIP-"+Date.now(),



name:name,


phone:phone,


address:address,


plan:plan,



photo:e.target.result,



status:"pending",



date:
new Date().toLocaleDateString(),



created:
new Date().toLocaleString()


};





localStorage.setItem(

"ymsVipMember",

JSON.stringify(membre)

);





console.log(
"Compte enregistré :",
membre
);





alert(
"Compte VIP créé avec succès. Redirection vers paiement..."
);





window.location.href =
"pages/paiement.html";



};





reader.readAsDataURL(photoFile);



});



}

else{


console.error(
"Formulaire vipRegisterForm introuvable"
);


}