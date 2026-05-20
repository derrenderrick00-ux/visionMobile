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

    const loginModal       = document.getElementById("loginModal");
    const signupModal      = document.getElementById("signupModal");
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

    const myBookingsModal = document.createElement("div");
    myBookingsModal.id = "myBookingsModal";
    myBookingsModal.className = "hidden fixed inset-0 bg-black/50 z-[3000] flex items-start justify-center px-4 py-8 overflow-y-auto";
    myBookingsModal.innerHTML = `
        <div class="bg-white w-full max-w-lg rounded-3xl p-6 relative mt-10">
            <button id="closeMyBookings" class="absolute top-4 right-5 text-3xl text-gray-400 hover:text-gray-600">×</button>
            <h2 class="text-2xl font-bold mb-6 text-teal-600">My Bookings</h2>
            <div id="myBookingsContent"></div>
        </div>
    `;
    document.body.appendChild(myBookingsModal);

    myBookingsModal.addEventListener("click", (e) => {
        if (e.target === myBookingsModal) myBookingsModal.classList.add("hidden");
    });

    document.getElementById("closeMyBookings").addEventListener("click", () => {
        myBookingsModal.classList.add("hidden");
    });

    const STATUS_STYLES = {
        pending:   "bg-yellow-100 text-yellow-700",
        confirmed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700"
    };

    async function openMyBookings() {
        myBookingsModal.classList.remove("hidden");
        const content = document.getElementById("myBookingsContent");
        content.innerHTML = `<p class="text-center text-gray-400 py-8">Loading...</p>`;

        try {
            const token = localStorage.getItem("vm_token");
            const res   = await fetch(`${API}/api/bookings/my`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data  = await res.json();

            if (!res.ok) {
                content.innerHTML = `<p class="text-center text-red-400 py-8">${getErrorMessage(data, "Failed to load bookings.")}</p>`;
                return;
            }

            if (!data.bookings || data.bookings.length === 0) {
                content.innerHTML = `<p class="text-center text-gray-400 py-8">You have no bookings yet.</p>`;
                return;
            }

            content.innerHTML = data.bookings.map(b => {
                const style    = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                const label    = b.status.charAt(0).toUpperCase() + b.status.slice(1);
                const bookedOn = new Date(b.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric"
                });
                return `
                    <div class="border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <p class="font-bold text-gray-800">${b.serviceType}</p>
                                <p class="text-sm text-gray-400">${bookedOn}</p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold ${style}">${label}</span>
                        </div>
                        <div class="text-sm text-gray-600 space-y-1">
                            <p>📅 ${b.date} at ${b.time}</p>
                            <p>🟢 From: ${b.pickup}</p>
                            <p>🔴 To: ${b.dropoff}</p>
                            ${b.notes ? `<p>📝 ${b.notes}</p>` : ""}
                        </div>
                    </div>
                `;
            }).join("");

        } catch {
            content.innerHTML = `<p class="text-center text-red-400 py-8">Network error. Please try again.</p>`;
        }
    }

    function setLoggedInUI(user) {
        const firstName = user.fullname ? user.fullname.split(" ")[0] : "User";

        const existingDesktop = document.getElementById("desktopLoginBtn") || document.getElementById("desktopUserMenu");
        if (existingDesktop) {
            const wrapper = document.createElement("div");
            wrapper.id = "desktopUserMenu";
            wrapper.className = "relative";
            wrapper.innerHTML = `
                <button id="desktopUserBtn" class="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition text-sm font-semibold">
                    <span>Welcome, ${firstName}</span>
                    <span class="text-xs">▾</span>
                </button>
                <div id="desktopDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <button id="desktopMyBookings" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium">My Bookings</button>
                    <button id="desktopLogout" class="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-medium border-t border-gray-100">Logout</button>
                </div>
            `;
            existingDesktop.replaceWith(wrapper);

            document.getElementById("desktopUserBtn").addEventListener("click", (e) => {
                e.stopPropagation();
                document.getElementById("desktopDropdown").classList.toggle("hidden");
            });
            document.getElementById("desktopMyBookings").addEventListener("click", () => {
                document.getElementById("desktopDropdown").classList.add("hidden");
                openMyBookings();
            });
            document.getElementById("desktopLogout").addEventListener("click", logout);
            document.addEventListener("click", () => {
                const dd = document.getElementById("desktopDropdown");
                if (dd) dd.classList.add("hidden");
            });
        }

        const existingMobile = document.getElementById("mobileLoginBtn") || document.getElementById("mobileWelcome");
        if (existingMobile) {
            const welcomeEl = document.createElement("p");
            welcomeEl.id = "mobileWelcome";
            welcomeEl.className = "text-teal-600 font-semibold text-2xl";
            welcomeEl.textContent = `Welcome, ${firstName}`;
            existingMobile.replaceWith(welcomeEl);
        }

        const existingMyBtn = document.getElementById("mobileMyBookingsBtn");
        if (!existingMyBtn) {
            const myBookingsBtn = document.createElement("button");
            myBookingsBtn.id = "mobileMyBookingsBtn";
            myBookingsBtn.className = "text-left text-2xl font-semibold text-gray-700 w-full";
            myBookingsBtn.textContent = "My Bookings";
            myBookingsBtn.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                menuBtn.classList.remove("hidden");
                openMyBookings();
            });

            const logoutBtn = document.createElement("button");
            logoutBtn.id = "mobileLogoutBtn";
            logoutBtn.className = "bg-red-500 text-white py-4 rounded-2xl text-xl w-full";
            logoutBtn.textContent = "Logout";
            logoutBtn.addEventListener("click", logout);

            const mobileMenuInner = mobileMenu.querySelector(".flex.flex-col");
            mobileMenuInner.appendChild(myBookingsBtn);
            mobileMenuInner.appendChild(logoutBtn);
        }
    }

    function setLoggedOutUI() {
        const desktopMenu = document.getElementById("desktopUserMenu");
        if (desktopMenu) {
            const btn = document.createElement("button");
            btn.id = "desktopLoginBtn";
            btn.className = "bg-teal-600 text-white px-5 py-2 rounded-xl hover:bg-teal-700 transition";
            btn.textContent = "Login";
            btn.addEventListener("click", openLoginModal);
            desktopMenu.replaceWith(btn);
        }

        const mobileWelcome = document.getElementById("mobileWelcome");
        if (mobileWelcome) {
            const btn = document.createElement("button");
            btn.id = "mobileLoginBtn";
            btn.className = "bg-teal-600 text-white py-4 rounded-2xl text-xl w-full";
            btn.textContent = "Login";
            btn.addEventListener("click", openLoginModal);
            mobileWelcome.replaceWith(btn);
        }

        const myBtn  = document.getElementById("mobileMyBookingsBtn");
        const logBtn = document.getElementById("mobileLogoutBtn");
        if (myBtn)  myBtn.remove();
        if (logBtn) logBtn.remove();
    }

    function logout() {
        localStorage.removeItem("vm_token");
        setLoggedOutUI();
        mobileMenu.classList.add("hidden");
        menuBtn.classList.remove("hidden");
    }

    async function checkAuthState() {
        const token = localStorage.getItem("vm_token");
        if (!token) return;

        try {
            const res = await fetch(`${API}/api/auth/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                localStorage.removeItem("vm_token");
                return;
            }

            const data = await res.json();
            if (data.user) setLoggedInUI(data.user);
        } catch {
            localStorage.removeItem("vm_token");
        }
    }

    checkAuthState();

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
            loginForm.reset();
            loginModal.classList.add("hidden");
            setLoggedInUI(data.user);

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
            signupForm.reset();
            signupModal.classList.add("hidden");
            setLoggedInUI(data.user);

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
                showMessage(getErrorMessage(result, "Booking failed. Please try again."), false);
                return;
            }

            showMessage("Booking submitted successfully! We will contact you shortly to confirm.", true);
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
