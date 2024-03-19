const reviewForm = document.getElementById("feedback-form");

const buttons = document.querySelectorAll(".ratings button");
var lastButton = null;
buttons.forEach(button => {
    button.addEventListener('click', () => {
    const value = button.value;
    console.log(value);
    lastButton = value;
    buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
   });    
});

reviewForm.addEventListener("enter", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name");
    const content = document.getElementById("content");
    
});