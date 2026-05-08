document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");
    const messageBox = document.getElementById("formMessage");

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const fields = form.querySelectorAll("input, select");
        let firstInvalidField = null;

        fields.forEach(field => {

            field.classList.remove("border-red-500");

            if (field.hasAttribute("required") && !field.value.trim()) {

                field.classList.add("border-red-500");

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }

            }

        });

        if (firstInvalidField) {

            messageBox.textContent = "Please fill all required fields correctly.";

            messageBox.className =
                "mb-4 text-center p-4 rounded-xl text-white bg-red-500";

            messageBox.classList.remove("hidden");

            firstInvalidField.focus();

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
            notes: formData.get("notes")
        };

        const button = form.querySelector("button");

        button.textContent = "Submitting...";
        button.disabled = true;

        setTimeout(() => {

            messageBox.textContent =
                "Booking submitted successfully!";

            messageBox.className =
                "mb-4 text-center p-4 rounded-xl text-white bg-green-500";

            messageBox.classList.remove("hidden");

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

            const url =
                `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            window.open(url, "_blank");

            form.reset();

            button.textContent = "Confirm Booking";
            button.disabled = false;

        }, 1500);

    });

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
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

});
