function validateForm(event) {
  // Get form fields
  const services = document.getElementById("services");
  const teams = document.getElementById("teams");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const dateAndTime = document.getElementById("dateAndTime");

  // Validation conditions
  if (services.value === "") {
    alert("Please select a service.");
    services.focus();
    return false;
  }

  if (teams.value === "") {
    alert("Please choose a doctor.");
    teams.focus();
    return false;
  }

  if (name.value.trim() === "") {
    alert("Please enter your name.");
    name.focus();
    return false;
  }

  if (!validateEmail(email.value)) {
    alert("Please enter a valid email address.");
    email.focus();
    return false;
  }

  if (phone.value.trim() === "" || phone.value.length < 10) {
    alert("Please enter a valid phone number (at least 10 digits).");
    phone.focus();
    return false;
  }

  if (dateAndTime.value === "") {
    alert("Please select a date and time.");
    dateAndTime.focus();
    return false;
  }

  // If all checks pass, allow the form to be submitted
  return true;
}

// Helper function to validate email
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
