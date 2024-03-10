const signupForm = document.getElementById("signup-form");

        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const fitness_plan = document.getElementById("fitness_plan").value;

            try {
                const response = await fetch("http://localhost:3000/api/user/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        fitness_plan
                    })
                });

                if (!response.ok) {
                    throw new Error("Error creating user account.");
                }

                console.log("User account created.");
                const message = await response.text();
                alert(message);
                window.location.href = "/";
            }
             catch (error) {
                console.error(error);
            }
        });