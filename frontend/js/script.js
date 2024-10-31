// JavaScript to handle fade-out and navigate to home.html
window.addEventListener('load', () => {
    const splash = document.getElementById('splash');

    // Start fade-out animation after 3 seconds
    setTimeout(() => {
        splash.classList.add('hidden'); // Apply fade-out effect

        // Navigate to home.html after animation completes
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500); // Match the CSS transition duration (1.5s)
    }, 3000); // Show splash for 3 seconds
});
