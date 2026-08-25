const membre = JSON.parse(localStorage.getItem("ymsVipMember"));

if(membre){

    const photo = document.getElementById("memberPhoto");
    if(photo) photo.src = membre.photo;

    const paymentPhoto = document.getElementById("paymentPhoto");
    if(paymentPhoto) paymentPhoto.src = membre.photo;

    const welcome = document.getElementById("welcomeName");
    if(welcome) welcome.textContent = membre.name;

    const nom = document.getElementById("memberName");
    if(nom) nom.textContent = membre.name;

    const paymentName = document.getElementById("paymentName");
    if(paymentName) paymentName.textContent = membre.name;

    const plan = document.getElementById("paymentPlan");
    if(plan){
        plan.textContent =
        membre.plan.toUpperCase()+" VIP";
    }

}