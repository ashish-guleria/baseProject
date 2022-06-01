var password = document.getElementById("password"),
  confirm_password = document.getElementById("confirmPassword");

document.getElementById("signupLogo").src =
  "https://their-actions-bucket.s3.us-west-2.amazonaws.com/Group+796.png";

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
    alert("Password don't match");
    return false;
  } else {
    confirm_password.setCustomValidity("");
    return true;
  }
}

function validateSignupForm() {
  var form = document.getElementById("signupForm");

  for (var i = 0; i < form.elements.length; i++) {
    if (
      form.elements[i].value === "" &&
      form.elements[i].hasAttribute("required")
    ) {
      alert("There are some required fields!");
      return false;
    }
  }

  if (!validatePassword()) {
    return false;
  }
}

function onSubmit(token) {
  $.ajax({
    url: `http://35.80.115.88:5000/app/user/profile/resetPassword?token=${token}`,
    method: "POST",
    success: function (data) {
      printData(data);
    },
    error: function () {
      alert("error");
    },
  });
}
