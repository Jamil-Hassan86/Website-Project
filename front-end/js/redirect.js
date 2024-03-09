const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch("http://localhost:3000/api/user/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            window.location.href = "../../back-end/routes/home";
        } else {
            alert("User does not exist or email/password is incorrect.")
            console.error("Login failed");
        }
    } catch (error) {
        console.error(error);
    }
});