/*======================================================
YMS STORE
ESPACE CLIENT
======================================================*/


document.addEventListener("DOMContentLoaded",()=>{



const client =
JSON.parse(
localStorage.getItem("ymsCurrentClient")
);





if(!client){


window.location.href="login.html";

return;


}







document.getElementById("clientName").textContent =
client.fullname;



document.getElementById("profileName").textContent =
client.fullname;



document.getElementById("profileEmail").textContent =
client.email;



document.getElementById("profilePhone").textContent =
client.phone;



document.getElementById("profileAddress").textContent =
client.address;







const logout =
document.getElementById("logoutBtn");



if(logout){


logout.addEventListener("click",()=>{


localStorage.removeItem(
"ymsCurrentClient"
);



window.location.href="login.html";


});


}



});