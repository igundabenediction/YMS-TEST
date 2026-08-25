/*==================================
YMS STORE
HERO SLIDER
===================================*/


document.addEventListener("DOMContentLoaded",()=>{


const slides = document.querySelectorAll(".hero-slide");

const dots = document.querySelectorAll(".dot");

const nextBtn = document.querySelector(".next-slide");

const prevBtn = document.querySelector(".prev-slide");



let currentSlide = 0;

let timer;






/*==================================
AFFICHER SLIDE
===================================*/


function showSlide(index){


slides.forEach(slide=>{

    slide.classList.remove("active");

});


dots.forEach(dot=>{

    dot.classList.remove("active");

});



slides[index].classList.add("active");


if(dots[index]){

    dots[index].classList.add("active");

}



}







/*==================================
SLIDE SUIVANT
===================================*/


function nextSlide(){


currentSlide++;


if(currentSlide >= slides.length){

    currentSlide = 0;

}


showSlide(currentSlide);


}








/*==================================
SLIDE PRECEDENT
===================================*/


function previousSlide(){


currentSlide--;


if(currentSlide < 0){

    currentSlide = slides.length -1;

}


showSlide(currentSlide);


}








/*==================================
BOUTONS
===================================*/


if(nextBtn){


nextBtn.addEventListener(
"click",
()=>{


nextSlide();


resetTimer();


});



}





if(prevBtn){


prevBtn.addEventListener(
"click",
()=>{


previousSlide();


resetTimer();


});


}









/*==================================
DOTS NAVIGATION
===================================*/


dots.forEach((dot,index)=>{


dot.addEventListener(
"click",
()=>{


currentSlide=index;


showSlide(currentSlide);


resetTimer();


});


});









/*==================================
AUTO PLAY
===================================*/


function startTimer(){


timer=setInterval(()=>{


nextSlide();


},5000);



}




function resetTimer(){


clearInterval(timer);


startTimer();


}






if(slides.length>1){


startTimer();


}




});