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

    const desktopLoginBtn =
        document.getElementById("desktopLoginBtn");

    const mobileLoginBtn =
        document.getElementById("mobileLoginBtn");

    const closeLoginModal =
        document.getElementById("closeLoginModal");

    const closeSignupModal =
        document.getElementById("closeSignupModal");

    const openSignup =
        document.getElementById("openSignup");

    function openLoginModal() {

        loginModal.classList.remove("hidden");

        mobileMenu.classList.add("hidden");

        menuBtn.classList.remove("hidden");

    }

    desktopLoginBtn.addEventListener("click", openLoginModal);

    mobileLoginBtn.addEventListener("click", openLoginModal);

    closeLoginModal.addEventListener("click", () => {

        loginModal.classList.add("hidden");

    });

    openSignup.addEventListener("click", () => {

        loginModal.classList.add("hidden");

        signupModal.classList.remove("hidden");

    });

    closeSignupModal.addEventListener("click", () => {

        signupModal.classList.add("hidden");

    });

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const loginData = new FormData(loginForm);

        const user = {

            email: loginData.get("email"),

            password: loginData.get("password")

        };

        console.log(user);

        alert("Login system ready for backend integration.");

        loginForm.reset();

        loginModal.classList.add("hidden");

    });

    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const signupData = new FormData(signupForm);

        const newUser = {

            fullname: signupData.get("fullname"),

            email: signupData.get("email"),

            password: signupData.get("password")

        };

        console.log(newUser);

        alert("Signup system ready for backend integration.");

        signupForm.reset();

        signupModal.classList.add("hidden");

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
