/*==================================
YMS STORE
PRODUCT PAGE SCRIPT
===================================*/


document.addEventListener("DOMContentLoaded",()=>{





/*==================================
CHANGEMENT IMAGE
===================================*/


const mainImage =
document.getElementById(
"mainProductImage"
);



const thumbnails =
document.querySelectorAll(
".thumbs img"
);





thumbnails.forEach(img=>{


img.addEventListener(
"click",
()=>{


mainImage.src = img.src;



thumbnails.forEach(item=>{

item.style.borderColor="transparent";

});



img.style.borderColor="#d4af37";



});


});









/*==================================
CHOIX TAILLE
===================================*/


const sizes =
document.querySelectorAll(
".sizes button"
);





sizes.forEach(size=>{


size.addEventListener(
"click",
()=>{


sizes.forEach(btn=>{

btn.classList.remove("active");

});



size.classList.add("active");



});


});









/*==================================
QUANTITE
===================================*/


const quantity =
document.getElementById(
"quantity"
);



const plus =
document.getElementById(
"plus"
);



const minus =
document.getElementById(
"minus"
);






if(plus){


plus.addEventListener(
"click",
()=>{


quantity.value =
parseInt(quantity.value)+1;



});


}





if(minus){


minus.addEventListener(
"click",
()=>{


if(quantity.value > 1){


quantity.value =
parseInt(quantity.value)-1;


}



});


}










/*==================================
AJOUT PANIER
===================================*/


const addButton =
document.querySelector(
".add-product-cart"
);





if(addButton){



addButton.addEventListener(
"click",
()=>{



let panier =
JSON.parse(
localStorage.getItem("ymsPanier")
) || [];






const product = {


id:Date.now(),


name:
document.querySelector(
".product-info-page h1"
).textContent,



price:
document.querySelector(
".current-price"
).textContent,



image:
mainImage.src,



quantity:
quantity.value,



size:
document.querySelector(
".sizes .active"
)?.textContent || "Standard"



};






panier.push(product);





localStorage.setItem(
"ymsPanier",
JSON.stringify(panier)
);






notification(
"Produit ajouté au panier"
);



});



}









/*==================================
NOTIFICATION
===================================*/


function notification(text){



const box =
document.createElement("div");



box.className =
"cart-notification";



box.innerHTML =

`
<i class="fa-solid fa-check"></i>
${text}
`;





document.body.appendChild(box);





setTimeout(()=>{


box.classList.add("show");


},100);






setTimeout(()=>{


box.remove();


},3000);



}









/*==================================
WHATSAPP COMMANDE
===================================*/


const whatsapp =
document.querySelector(
".whatsapp-order"
);





if(whatsapp){



whatsapp.addEventListener(
"click",
()=>{



const productName =
document.querySelector(
".product-info-page h1"
).textContent;





const message =
`
Bonjour YMS STORE,

Je souhaite commander :

${productName}

Quantité :
${quantity.value}

Merci.
`;






const phone =
"243972000000";





window.open(

"https://wa.me/"
+phone+
"?text="
+
encodeURIComponent(message)

);



});



}




});