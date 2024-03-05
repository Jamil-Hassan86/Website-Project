fetch(`http://localhost:3000/beginner/${fitness_plan}`).then(response => response.json()).then(data => {
    if (data === "Beginner") {

    } else if (data === "Intermediate") { 
        // render intermediate page 
    } else if (data === "Pro") { 
        // render pro page 
    } else { 
        // user not found 
    } 
    }).catch(error => { // handle error 
});