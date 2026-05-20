document.addEventListener("DOMContentLoaded", () => {

    const API = "https://vision-mobility-api-production.up.railway.app";

    
    const menuBtn    = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenu  = document.getElementById("closeMenu");

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

    
    const loginModal     = document.getElementById("loginModal");
    const signupModal    = document.getElementById("signupModal");
    const desktopLoginBtn  = document.getElementById("desktopLoginBtn");
    const mobileLoginBtn   = document.getElementById("mobileLoginBtn");
    const closeLoginModal  = document.getElementById("closeLoginModal");
    const closeSignupModal = document.getElementById("closeSignupModal");
    const openSignup       = document.getElementById("openSignup");

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
        if (e.target === loginModal) loginModal.classList.add("hidden");
    });

    signupModal.addEventListener("click", (e) => {
        if (e.target === signupModal) signupModal.classList.add("hidden");
    });

    
    
    function getErrorMessage(data, fallback) {
        if (data.message) return data.message;
        if (data.errors && data.errors.length > 0) return data.errors[0].msg;
        return fallback;
    }

    
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginData = new FormData(loginForm);
        const user = {
            email:    loginData.get("email"),
            password: loginData.get("password")
        };

        const btn = loginForm.querySelector("button");
        btn.textContent = "Logging in...";
        btn.disabled = true;

        try {
            const res  = await fetch(`${API}/api/auth/login`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(user)
            });
            const data = await res.json();

            if (!res.ok) {
                alert(getErrorMessage(data, "Login failed. Please try again."));
                return;
            }

            localStorage.setItem("vm_token", data.token);
            alert("Successfully logged in.");
            loginForm.reset();
            loginModal.classList.add("hidden");

        } catch {
            alert("Network error. Please check your connection and try again.");
        } finally {
            btn.textContent = "Login";
            btn.disabled = false;
        }
    });

    
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const signupData = new FormData(signupForm);
        const newUser = {
            fullname: signupData.get("fullname"),
            email:    signupData.get("email"),
            password: signupData.get("password")
        };

        const btn = signupForm.querySelector("button");
        btn.textContent = "Creating account...";
        btn.disabled = true;

        try {
            const res  = await fetch(`${API}/api/auth/register`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(newUser)
            });
            const data = await res.json();

            if (!res.ok) {
                alert(getErrorMessage(data, "Signup failed. Please try again."));
                return;
            }

            localStorage.setItem("vm_token", data.token);
            alert("Account created successfully. You are now logged in.");
            signupForm.reset();
            signupModal.classList.add("hidden");

        } catch {
            alert("Network error. Please check your connection and try again.");
        } finally {
            btn.textContent = "Create Account";
            btn.disabled = false;
        }
    });

    
    const form       = document.getElementById("bookingForm");
    const messageBox = document.getElementById("formMessage");

    function isValidPhone(value) {
        return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(value.trim());
    }

    function showMessage(text, isSuccess) {
        messageBox.textContent = text;
        messageBox.className = `mb-4 text-center p-4 rounded-xl text-white ${
            isSuccess ? "bg-green-500" : "bg-red-500"
        }`;
        messageBox.classList.remove("hidden");
        
        messageBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        
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

            if (field.name === "phone" && field.value.trim() && !isValidPhone(field.value)) {
                field.classList.add("border-red-500");
                hasError = true;
                if (!firstInvalidField) firstInvalidField = field;
            }
        });

        if (hasError) {
            showMessage("Please fill all required fields correctly.", false);
            firstInvalidField.focus();
            return;
        }

        const formData = new FormData(form);
        const data = {
            serviceType: formData.get("serviceType"),
            date:        formData.get("date"),
            time:        formData.get("time"),
            pickup:      formData.get("pickup"),
            dropoff:     formData.get("dropoff"),
            name:        formData.get("name"),
            phone:       formData.get("phone"),
            notes:       formData.get("notes") || ""
        };

        const button = form.querySelector("button");
        button.textContent = "Submitting...";
        button.disabled = true;

        try {
            
            const headers = { "Content-Type": "application/json" };
            const token = localStorage.getItem("vm_token");
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res    = await fetch(`${API}/api/bookings`, {
                method:  "POST",
                headers,
                body:    JSON.stringify(data)
            });
            const result = await res.json();

            if (!res.ok) {
                showMessage(
                    getErrorMessage(result, "Booking failed. Please try again."),
                    false
                );
                return;
            }

            
            showMessage(
                "Booking submitted successfully! We will contact you shortly to confirm.",
                true
            );
            form.reset();

        } catch {
            showMessage("Network error. Please check your connection and try again.", false);
        } finally {
            button.textContent = "Confirm Booking";
            button.disabled = false;
        }
    });

    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("show");
        });
    });

    document.querySelectorAll(".fade-up").forEach(section => {
        observer.observe(section);
    });

});
