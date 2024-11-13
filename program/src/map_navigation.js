document.getElementById("hide").addEventListener("click", function() {
    // Hide sidebar and its content
    document.getElementById("sidebar-right").classList.add("hidden");
    document.querySelector(".sidebar-content-right").classList.add("hidden");

    // Show the "show" button and hide the "hide" button
    document.getElementById("show").style.display = "inline"; // Show the "show" button
    this.style.display = "none"; // Hide the "hide" button
    
    // Show the additional buttons when content is hidden
    document.getElementById("uunknown").style.display = "inline"; // Show "uunknown" button
    document.getElementById("lhome").style.display = "inline"; // Show "lhome" button
});

document.getElementById("show").addEventListener("click", function() {
    // Show sidebar and its content
    document.getElementById("sidebar-right").classList.remove("hidden");
    document.querySelector(".sidebar-content-right").classList.remove("hidden");

    // Hide the "show" button and show the "hide" button
    this.style.display = "none"; // Hide the "show" button
    document.getElementById("hide").style.display = "inline"; // Show the "hide" button

    // Hide the additional buttons when content is showing
    document.getElementById("uunknown").style.display = "none"; // Hide "uunknown" button
    document.getElementById("lhome").style.display = "none"; // Hide "lhome" button
});

// Initial setup: Hide the "show" button if the sidebar is visible
if (!document.querySelector(".sidebar-content-right").classList.contains("hidden")) {
    document.getElementById("show").style.display = "none"; // Hide "show" button if content is already showing
    document.getElementById("hide").style.display = "inline"; // Show "hide" button
    
    // Hide additional buttons if content is visible
    document.getElementById("uunknown").style.display = "none"; // Hide "uunknown" button
    document.getElementById("lhome").style.display = "none"; // Hide "lhome" button
} else {
    document.getElementById("show").style.display = "inline"; // Show "show" button
    document.getElementById("hide").style.display = "none"; // Hide "hide" button
    document.getElementById("uunknown").style.display = "inline"; // Show "uunknown" button
    document.getElementById("lhome").style.display = "inline"; // Show "lhome" button
}
