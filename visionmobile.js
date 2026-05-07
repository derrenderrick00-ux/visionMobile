document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('bookingForm');
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const fields= form.querySelectorAll("input, select");
        let isValid = true;
        fields.forEach(field => {
            field.classList.remove("border-red-500");
            if(field.hasAttribute("required")&& !field.value.trim()){
                field.classList.add("border-red-500");
                isValid = false
            }
        });
        if(!isValid){
            alert('Please fill all required fields correctly');
            form.querySelector(".border-red-500").focus();
            return;
        }
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
        const messageBox= document.getElementById("formMessage");
        function showMessage(text, type="success"){
            messageBox.textContet=text;
            messageBox.className = 'p-3 rounded-lg text-white ${type=== "success" ? "bg-green-500" : "bg-red-500"}';
            messageBox.classList.remove("hidden");
        } 
        setTimeout(()=>{
         console.log(data);
        
            showMessage("Booking submitted successfully!");
            form.reset();

            button.textContent="Confirm Booking";
            button.disabled=false;
        }, 2000);
    });

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const authButtons = document.getElementById("authButtons");
    const closeMenu = document.getElementById("closeMenu");
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("hidden");
    });
    closeMenu.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
    });
    

    document.querySelectorAll("#mobileMenu a").forEach(link => {
        link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        });
    }); 
    const phoneNumber = "254726908190";

    const message = `Booking Request:
    Name: ${data.name}
    Phone: ${data.phone}
    Service: ${data.serviceType}
    Date: ${data.date}
    Time: ${data.time}
    Pickup: ${data.pickup}
    Dropoff: ${data.dropoff}
    Notes: ${data.notes}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
});

