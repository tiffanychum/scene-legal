// Auto-scrolling screenshot strip: drifts left on a loop, pauses the moment
// someone touches/drags/hovers it, and resumes a couple of seconds after
// they let go. The track's image set is duplicated in the HTML so the loop
// point is seamless.
(function () {
  var track = document.getElementById("shots");
  if (!track) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var SPEED = 0.55; // px per frame (~33px/s at 60fps)
  var RESUME_DELAY = 2200; // ms of no interaction before auto-scroll resumes
  var paused = false;
  var resumeTimer = null;
  var halfWidth = 0;

  function measure() {
    halfWidth = track.scrollWidth / 2;
  }

  function pause() {
    paused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
  }

  function scheduleResume() {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () {
      paused = false;
    }, RESUME_DELAY);
  }

  function tick() {
    if (!paused && halfWidth > 0) {
      track.scrollLeft += SPEED;
      if (track.scrollLeft >= halfWidth) {
        track.scrollLeft -= halfWidth;
      }
    }
    requestAnimationFrame(tick);
  }

  ["pointerdown", "touchstart", "wheel"].forEach(function (evt) {
    track.addEventListener(evt, pause, { passive: true });
  });
  ["pointerup", "pointercancel", "touchend", "touchcancel", "mouseleave"].forEach(function (evt) {
    track.addEventListener(evt, scheduleResume, { passive: true });
  });
  track.addEventListener("mouseenter", pause);

  window.addEventListener("resize", measure);

  var images = track.querySelectorAll("img");
  var remaining = images.length;
  if (remaining === 0) {
    measure();
  } else {
    images.forEach(function (img) {
      if (img.complete) {
        remaining--;
      } else {
        img.addEventListener("load", function () {
          remaining--;
          if (remaining <= 0) measure();
        });
      }
    });
    if (remaining <= 0) measure();
  }
  // Fallback in case some 'complete' checks race the loop above.
  window.addEventListener("load", measure);

  requestAnimationFrame(tick);
})();
