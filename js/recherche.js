/*==================================
YMS STORE
RECHERCHE PRODUITS
===================================*/


document.addEventListener("DOMContentLoaded",()=>{



const searchInput =
document.querySelector(".search-box input");



const products =
document.querySelectorAll(".product-card");



if(!searchInput || products.length === 0){

    return;

}







/*==================================
CREATION MESSAGE AUCUN RESULTAT
===================================*/


const message =
document.createElement("div");


message.className =
"no-result";


message.textContent =
"Aucun produit trouvé.";


message.style.display="none";



const grid =
document.querySelector(".products-grid");


if(grid){

    grid.after(message);

}







/*==================================
RECHERCHE LIVE
===================================*/


searchInput.addEventListener(
"input",
()=>{



const value =
searchInput.value
.toLowerCase()
.trim();



let result = 0;





products.forEach(product=>{



const name =
product
.querySelector("h3")
.textContent
.toLowerCase();






if(name.includes(value)){


product.style.display="block";


result++;



}

else{


product.style.display="none";


}



});







if(result===0 && value!==""){


message.style.display="block";


}

else{


message.style.display="none";


}





});







});