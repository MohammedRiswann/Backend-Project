function validateSignup(request, response, next) {
  const { email, password } = request.body;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validMail = emailPattern.test(email);

  const Passpattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const validPassword = Passpattern.test(password);

  if (validPassword && validMail) {
    next();
  } else {
    response.redirect("/user/sign");
  }
}

module.exports = validateSignup;
