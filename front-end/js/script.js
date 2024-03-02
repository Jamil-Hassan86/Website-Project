var dropdownOpen = false;

function toggleDropdown() {
    var dropdownContent = document.getElementById("myDropdown");
    if (!dropdownOpen) {
        dropdownContent.style.display = "block";
    } else {
        dropdownContent.style.display = "none";
    }
    dropdownOpen = !dropdownOpen;
}
