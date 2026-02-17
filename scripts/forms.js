
const form = document.getElementById("contactForm");
const status = document.getElementById("form-status");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitButton = form.querySelector("button");
    submitButton.disabled = true;
    submitButton.innerText = "Sending...";

    const formData = new FormData();
    formData.append("entry.1446339706", document.getElementById("name").value);
    formData.append("entry.717147309", document.getElementById("email").value);
    formData.append("entry.1147416863", document.getElementById("message").value);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSd_mM9hxMy2uTKpQNRi4mHURk34Vsf5NX0DL9ciwwedXlb6sg/formResponse", {
        method: "POST",
        mode: "no-cors",
        body: formData
    })
    .then(() => {
        status.style.color = "green";
        status.innerText = "Message sent successfully!";
        form.reset();
    })
    .catch(() => {
        status.style.color = "red";
        status.innerText = "Something went wrong. Try again.";
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.innerText = "Send Message";
    });
});

