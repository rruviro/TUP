function navigateWithFade(url) {
    document.body.classList.add('fade-out'); // Trigger fade-out effect
    setTimeout(() => {
      window.location.href = url; // Navigate to the new page
    }, 0); // Match the delay with the animation duration (1 second here)
  }
  
  // Trigger fade-in on page load
  window.addEventListener('load', () => {
    document.body.classList.add('fade-in');
  });