/*=========================================================
 YMS STORE VIP
 COMMANDES.JS
=========================================================*/


document.addEventListener(
"DOMContentLoaded",
()=>{

afficherCommandes();

});


function createOrder(){


const membre =
JSON.parse(
localStorage.getItem("ymsVipMember")
);



if(!membre){

alert("Session VIP inexistante");
return;

}



const produit =
document.getElementById("productName").value;



const prix =
document.getElementById("productPrice").value;



if(!produit || !prix){

alert(
"Veuillez remplir tous les champs"
);

return;

}




let commandes =
JSON.parse(
localStorage.getItem("ymsCommandes")
)
||
[];




let commande={

id:Date.now(),

client:membre.name,

produit:produit,

prix:prix,

statut:"En attente",

date:new Date().toLocaleString()

};



commandes.unshift(commande);



localStorage.setItem(
"ymsCommandes",
JSON.stringify(commandes)
);



alert(
"Commande envoyée avec succès"
);



document.getElementById(
"productName"
).value="";


document.getElementById(
"productPrice"
).value="";



afficherCommandes();


}





function afficherCommandes(){



const list =
document.getElementById(
"orderList"
);



if(!list)
return;




const membre =
JSON.parse(
localStorage.getItem("ymsVipMember")
);



let commandes =
JSON.parse(
localStorage.getItem("ymsCommandes")
)
||
[];




let mesCommandes =
commandes.filter(
c=>c.client===membre.name
);



if(mesCommandes.length===0){

list.innerHTML=
`
<p>
Aucune commande enregistrée.
</p>
`;

return;

}



list.innerHTML="";



mesCommandes.forEach(cmd=>{


list.innerHTML +=

`

<div class="admin-member">

<h3>
${cmd.produit}
</h3>

<p>
Prix : ${cmd.prix} $
</p>

<p>
Statut : ${cmd.statut}
</p>

<small>
${cmd.date}
</small>


</div>

`;



});



}