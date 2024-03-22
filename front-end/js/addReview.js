const reviewForm = document.getElementById("feedback-form");

const buttons = document.querySelectorAll(".ratings button");
var lastButton = null;
buttons.forEach(button => {
    button.addEventListener('click', () => {
    const value = button.value;
    lastButton = value;
    buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
   });    
});

reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = document.getElementById("feedback-box").value;
    const nameElement = document.getElementById("name");
    const name = nameElement.innerText;
    console.log(name);
    const formData = {
        name: name,
        content: content,
        rating: lastButton // Include the selected rating value
    };

    try {
        const response = await fetch('/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
            
        });

        if (response.ok) {
            console.log("Review submitted successfully");
            window.location.href = "/feedback";
        } else {
            console.error("Failed to submit review");
            
        }
    } catch (error) {
        console.error("Error submitting review:", error);
    
    }
    
});