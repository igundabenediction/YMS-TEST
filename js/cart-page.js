/*==================================
YMS STORE
CART PAGE SYSTEM
===================================*/


document.addEventListener("DOMContentLoaded",()=>{



const container =
document.getElementById(
"cartContainer"
);



const subtotal =
document.getElementById(
"subtotal"
);



const total =
document.getElementById(
"total"
);





let panier =
JSON.parse(
localStorage.getItem("ymsPanier")
) || [];









function afficherPanier(){



container.innerHTML="";



let somme = 0;





if(panier.length===0){



container.innerHTML=

`

<div class="empty-cart">

<h2>
Votre panier est vide
</h2>


<a href="shop.html">
Continuer les achats
</a>


</div>

`;



subtotal.textContent="0$";

total.textContent="0$";


return;


}







panier.forEach((produit,index)=>{





let prix = 
parseFloat(
produit.price.replace("$","")
);



let quantite =
parseInt(
produit.quantity || 1
);



somme += prix * quantite;








container.innerHTML +=

`

<div class="cart-box">



<img src="${produit.image}">



<div class="cart-details">


<h3>

${produit.name}

</h3>



<p class="price">

${produit.price}

</p>





<label>

Quantité :

<input 
class="qty-input"
data-id="${index}"
type="number"
min="1"
value="${quantite}">

</label>





<p>

Taille :
${produit.size}

</p>





<a class="delete-cart"
data-id="${index}">

<i class="fa-solid fa-trash"></i>

Supprimer

</a>



</div>



</div>

`;



});





subtotal.textContent =
somme+"$";



total.textContent =
somme+"$";






activerActions();



}









/*==================================
SUPPRESSION
===================================*/


function activerActions(){



document.querySelectorAll(
".delete-cart"
)
.forEach(btn=>{


btn.onclick=()=>{



let id =
btn.dataset.id;



panier.splice(
id,
1
);



sauvegarder();



};



});







document.querySelectorAll(
".qty-input"
)
.forEach(input=>{


input.onchange=()=>{



let id =
input.dataset.id;



panier[id].quantity =
input.value;



sauvegarder();



};



});



}










function sauvegarder(){



localStorage.setItem(
"ymsPanier",
JSON.stringify(panier)
);



afficherPanier();



}







afficherPanier();





});