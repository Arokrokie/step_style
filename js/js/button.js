// function welcomeUser() {
//   alert("Welcome to our network");
// }
  // document.getElementById("signin-btn").addEventListener("click", function () {

  //   let firstName = document.getElementById("fname").value.trim();

  //   if (firstName === "") {
  //     firstName = "Friend";
  //   }

  //   let message = `Welcome to our network, ${firstName} 😊`;

  //   document.getElementById("toastMessage").innerText = message;

  //   let toast = new bootstrap.Toast(document.getElementById("welcomeToast"));
  //   toast.show();
// });

const form = document.getElementById("signInForm");
const toastEl = document.getElementById("welcomeToast");
const toastMsg = document.getElementById("toastMessage");
const toast = new bootstrap.Toast(toastEl, { delay: 2000 });

form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop real page reload

  let firstName = document.getElementById("fname").value.trim();
  if (firstName === "") firstName = "Friend";

  toastMsg.innerText = `Welcome to our network, ${firstName} 😊`;
  toast.show();

  // Refresh form fields after sign-in
  form.reset();

  // Send user back to home page after sign-in
  setTimeout(() => {
    window.location.href = "/html/index.html";
  }, 1600);
});


