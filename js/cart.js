```javascript
/*======================================================
YMS STORE
OUVERTURE MINI PANIER
======================================================*/


document.addEventListener("DOMContentLoaded",()=>{



const cartButton =
document.getElementById("openCart");


const miniCart =
document.querySelector(".mini-cart");


const overlay =
document.querySelector(".mini-cart-overlay");



const closeCart =
document.querySelector(".close-cart");





function ouvrirPanier(){


miniCart.classList.add("active");

overlay.classList.add("active");


}



function fermerPanier(){


miniCart.classList.remove("active");

overlay.classList.remove("active");


}





if(cartButton){


cartButton.addEventListener(
"click",
(e)=>{


e.preventDefault();


ouvrirPanier();


}

);


}





if(closeCart){


closeCart.addEventListener(
"click",
fermerPanier
);


}




if(overlay){


overlay.addEventListener(
"click",
fermerPanier
);


}




mettreAJourCompteur();



});







function mettreAJourCompteur(){



const panier =
JSON.parse(

localStorage.getItem("ymsPanier")

) || [];



let total = 0;



panier.forEach(item=>{


total += item.quantite;


});



const compteur =
document.getElementById("cartCount");



if(compteur){


compteur.innerText = total;


}


}
```
