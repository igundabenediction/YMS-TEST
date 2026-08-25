/*==================================
YMS STORE
APPLICATION PRINCIPALE
===================================*/


document.addEventListener("DOMContentLoaded",()=>{



/*==================================
MENU MOBILE
===================================*/
// HEADER SHADOW AU SCROLL

const header = document.querySelector(".main-header");


window.addEventListener("scroll",()=>{

    if(window.scrollY > 50){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});

const mobileBtn = document.querySelector(".mobile-menu");

const navMenu = document.querySelector(".nav-menu");



if(mobileBtn){


mobileBtn.addEventListener("click",()=>{


    navMenu.classList.toggle("active");


    mobileBtn.classList.toggle("open");


});


}







/*==================================
FERMETURE MENU AU CLIC
===================================*/


document.querySelectorAll(".nav-menu a")
.forEach(link=>{


link.addEventListener("click",()=>{


    navMenu.classList.remove("active");


});


});


/*==================================
ANIMATION SCROLL
===================================*/


const animatedElements =
document.querySelectorAll(
".product-card, .service-card, .category-card, .why-card"
);



const observer = new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.classList.add("fade-up");


}


});


},
{
threshold:0.15
}
);





animatedElements.forEach(element=>{


observer.observe(element);


});


/*==================================
ANNEE AUTOMATIQUE FOOTER
===================================*/


const year =
document.querySelector(".copyright");



if(year){


year.innerHTML =
`
<p>
© ${new Date().getFullYear()} YMS STORE - Tous droits réservés.
</p>
`;


}


});
const products =
document.querySelectorAll(".product-card");


products.forEach(product=>{


product.addEventListener("mouseenter",()=>{

    product.style.zIndex="5";

});


product.addEventListener("mouseleave",()=>{

    product.style.zIndex="1";

});


});