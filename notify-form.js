// Waitlist form: posts to a hidden iframe pointed at the Google Form's
// formResponse endpoint, so the page never navigates away. Cross-origin
// POSTs to a hidden iframe can't be read back by JS, so — same as the
// well-established pattern for embedding Google Forms this way — we
// optimistically show a success message shortly after submit.
(function () {
  var form = document.getElementById("notifyForm");
  var note = document.getElementById("notifyNote");
  var email = document.getElementById("notifyEmail");
  if (!form || !note || !email) return;

  var defaultNote = note.textContent;
  var submitted = false;

  form.addEventListener("submit", function () {
    if (submitted) return;
    submitted = true;

    var button = form.querySelector("button[type=submit]");
    if (button) {
      button.disabled = true;
      button.textContent = "Joining…";
    }

    setTimeout(function () {
      note.textContent = "You're on the list — we'll email you the moment Scène is live.";
      note.classList.add("success");
      email.value = "";
      email.disabled = true;
      if (button) button.textContent = "Added";
    }, 900);
  });
})();
