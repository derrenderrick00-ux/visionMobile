document.addEventListener("DOMContentLoaded", () => {

    
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenu = document.getElementById("closeMenu");

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("hidden");
        menuBtn.classList.add("hidden");
    });

    closeMenu.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuBtn.classList.remove("hidden");
    });

    document.querySelectorAll("#mobileMenu a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            menuBtn.classList.remove("hidden");
        });
    });

    
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");
    const desktopLoginBtn = document.getElementById("desktopLoginBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const closeLoginModal = document.getElementById("closeLoginModal");
    const closeSignupModal = document.getElementById("closeSignupModal");
    const openSignup = document.getElementById("openSignup");

    function openLoginModal() {
        loginModal.classList.remove("hidden");
        mobileMenu.classList.add("hidden");
        menuBtn.classList.remove("hidden");
    }

    desktopLoginBtn.addEventListener("click", openLoginModal);
    mobileLoginBtn.addEventListener("click", openLoginModal);

    closeLoginModal.addEventListener("click", (e) => {
        e.stopPropagation();
        loginModal.classList.add("hidden");
    });

    openSignup.addEventListener("click", () => {
        loginModal.classList.add("hidden");
        signupModal.classList.remove("hidden");
    });

    closeSignupModal.addEventListener("click", (e) => {
        e.stopPropagation();
        signupModal.classList.add("hidden");
    });

    
    loginModal.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add("hidden");
        }
    });

    signupModal.addEventListener("click", (e) => {
        if (e.target === signupModal) {
            signupModal.classList.add("hidden");
        }
    });

    
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginData = new FormData(loginForm);
        const user = {
            email: loginData.get("email"),
            password: loginData.get("password")
        };

        // TODO: Replace with real API call when backend is ready
        // const res = await fetch("/api/auth/login", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(user)
        // });
        // const data = await res.json();
        // if (!res.ok) { alert(data.message); return; }
        // localStorage.setItem("token", data.token);

        console.log("Login payload:", user);
        alert("Successfully logged in");
        loginForm.reset();
        loginModal.classList.add("hidden");
    });

    // ─── Signup Form ───────────────────────────────────────────────
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const signupData = new FormData(signupForm);
        const newUser = {
            fullname: signupData.get("fullname"),
            email: signupData.get("email"),
            password: signupData.get("password")
        };

        // TODO: Replace with real API call when backend is ready
        // const res = await fetch("/api/auth/register", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(newUser)
        // });
        // const data = await res.json();
        // if (!res.ok) { alert(data.message); return; }

        console.log("Signup payload:", newUser);
        alert("Account successfully created.");
        signupForm.reset();
        signupModal.classList.add("hidden");
    });

    
    const form = document.getElementById("bookingForm");
    const messageBox = document.getElementById("formMessage");

    
    function isValidPhone(value) {
        return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(value.trim());
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // FIX: include textarea in validation loop
        const fields = form.querySelectorAll("input, select, textarea");
        let firstInvalidField = null;
        let hasError = false;

        fields.forEach(field => {
            field.classList.remove("border-red-500");

            if (field.hasAttribute("required") && !field.value.trim()) {
                field.classList.add("border-red-500");
                hasError = true;
                if (!firstInvalidField) firstInvalidField = field;
            }

            // FIX: validate phone format specifically
            if (field.name === "phone" && field.value.trim() && !isValidPhone(field.value)) {
                field.classList.add("border-red-500");
                hasError = true;
                if (!firstInvalidField) firstInvalidField = field;
            }
        });

        if (hasError) {
            messageBox.textContent = "Please fill all required fields correctly.";
            messageBox.className = "mb-4 text-center p-4 rounded-xl text-white bg-red-500";
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

        // TODO: Swap this block out for the real API call when backend is ready
        // try {
        //     const res = await fetch("/api/bookings", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(data)
        //     });
        //     const result = await res.json();
        //     if (!res.ok) throw new Error(result.message);
        // } catch (err) {
        //     messageBox.textContent = "Booking failed. Please try again.";
        //     messageBox.className = "mb-4 text-center p-4 rounded-xl text-white bg-red-500";
        //     messageBox.classList.remove("hidden");
        //     button.textContent = "Confirm Booking";
        //     button.disabled = false;
        //     return;
        // }

        setTimeout(() => {
            messageBox.textContent = "Booking submitted successfully!";
            messageBox.className = "mb-4 text-center p-4 rounded-xl text-white bg-green-500";
            messageBox.classList.remove("hidden");

            const phoneNumber = "16785982974";
            const message =
                `Booking Request:\n\nName: ${data.name}\nPhone: ${data.phone}\nService: ${data.serviceType}\nDate: ${data.date}\nTime: ${data.time}\nPickup: ${data.pickup}\nDropoff: ${data.dropoff}\nNotes: ${data.notes}`;
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");

            form.reset();
            button.textContent = "Confirm Booking";
            button.disabled = false;
        }, 1500);
    });

    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    });

    document.querySelectorAll(".fade-up").forEach(section => {
        observer.observe(section);
    });

});
