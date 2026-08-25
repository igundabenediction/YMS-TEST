document
.getElementById("vipRegisterForm")
.addEventListener("submit", function(e){


e.preventDefault();



const name =
document.getElementById("name").value;



const phone =
document.getElementById("phone").value;



const address =
document.getElementById("address").value;



const plan =
document.getElementById("plan").value;






const membre = {


name:name,


phone:phone,


address:address,


plan:plan,


status:"pending",


date:new Date().toLocaleDateString(),


createdAt:new Date().toISOString()



};






localStorage.setItem(
"ymsVipMember",
JSON.stringify(membre)
);







alert(
"Compte créé. Procédez maintenant au paiement."
);





window.location.href =
"pages/paiement.html";



});