document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('bookingForm');
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            serviceType: formData.get("serviceType"),
            date: formData.get("date"),
            time: formData.get("time"),
            pickup: formData.get("pickup"),
            dropoff: formData.get("dropoff"),
            name: formData.get("name"),
            phone: formData.get("phone"),
            notes: formData.get("notes"),
        };
        if(
        !data.date ||
        !data.time ||
        !data.pickup ||
        !data.dropoff ||
        !data.name ||
        !data.phone 
        ){
            alert("Please fill all required fields.");
            return;
        }
        const button = form.querySelector("button");
        button.textContent="Submitting...";
        button.disabled=true;

        setTimeout(()=>{
         console.log(data);
        
            alert("Booking submitted successfully!");
            form.reset();

            button.textContent="Confirm Booking";
            button.disabled=false;
        }, 2000);
    });

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const authButtons = document.getElementById("authButtons");
    if (menuBtn && mobileMenu && authButtons) {
        menuBtn.addEventListener("click", function (e) {
            e.preventDefault(); 
            e.stopPropagation();

            mobileMenu.classList.toggle("hidden");
            authButtons.classList.toggle("hidden");
        });
    }

    document.querySelectorAll("#mobileMenu a").forEach(link => {
        link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        });
    });    
});
