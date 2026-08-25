 /*==================================
 YMS STORE
 SYSTEME FAVORIS
 ===================================*/


document.addEventListener("DOMContentLoaded",()=>{



let favoris = 
JSON.parse(localStorage.getItem("ymsFavoris")) || [];





/*==================================
BOUTONS FAVORIS
===================================*/


const favoriteButtons =
document.querySelectorAll(
".product-actions .fa-heart"
);






favoriteButtons.forEach(icon=>{



const button =
icon.closest("a");




button.addEventListener("click",(e)=>{


e.preventDefault();




const card =
button.closest(".product-card");



if(!card) return;





const product = {


name:
card.querySelector("h3").textContent,


price:
card.querySelector(".current-price").textContent,


image:
card.querySelector("img").src



};







const exist =
favoris.find(
(item)=>
item.name === product.name
);







if(exist){



favoris =
favoris.filter(
(item)=>
item.name !== product.name
);



icon.classList.remove("active");



showFavoriteMessage(
"Retiré des favoris"
);



}

else{



favoris.push(product);


icon.classList.add("active");



showFavoriteMessage(
"Ajouté aux favoris"
);



}







localStorage.setItem(
"ymsFavoris",
JSON.stringify(favoris)
);





});



});










/*==================================
CHARGER FAVORIS EXISTANTS
===================================*/


favoriteButtons.forEach(icon=>{


const card =
icon.closest(".product-card");


if(!card) return;




const name =
card.querySelector("h3").textContent;





const saved =
favoris.find(
(item)=>
item.name === name
);





if(saved){

icon.classList.add("active");

}


});










/*==================================
NOTIFICATION
===================================*/


function showFavoriteMessage(text){



const box =
document.createElement("div");



box.className =
"cart-notification";



box.innerHTML =

`
<i class="fa-solid fa-heart"></i>
${text}
`;





document.body.appendChild(box);




setTimeout(()=>{


box.classList.add("show");


},100);





setTimeout(()=>{


box.remove();


},2500);



}




});