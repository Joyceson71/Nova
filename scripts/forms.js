
const form = document.getElementById("contactForm");
const status = document.getElementById("form-status");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitButton = form.querySelector("button");
    submitButton.disabled = true;
    submitButton.innerText = "Sending...";

    const formData = new FormData();
    formData.append("entry.631935153", document.getElementById("name").value);
    formData.append("entry.1105716581", document.getElementById("email").value);
    formData.append("entry.1564504641", document.getElementById("message").value);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSdNFSCaSn0BcRc6RtIPilus5_j04soYivcwyUxg81g3-VKPOQ/formResponse", {
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