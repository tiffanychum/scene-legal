// Auto-scrolling screenshot strip: drifts left on a loop, pauses the moment
// someone drags/touches it, and resumes a couple of seconds after they let
// go. Driven by `transform: translateX(...)` (not `scrollLeft`), because
// scrollLeft-driven animation is notoriously unreliable on iOS Safari —
// transforms are GPU-composited and stay smooth there. The track's image
// set is duplicated in the HTML so the loop point is seamless.
(function () {
  var viewport = document.getElementById("shots");
  var track = document.getElementById("shotsTrack");
  if (!viewport || !track) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SPEED = 34; // px per second of idle drift
  var RESUME_DELAY = 2200; // ms of no interaction before the drift resumes

  var offset = 0; // current position; track sits at translateX(-offset)
  var half = 0; // width of one full (non-duplicated) image set
  var dragging = false;
  var pointerId = null;
  var dragStartX = 0;
  var dragStartOffset = 0;
  var paused = false;
  var resumeTimer = null;
  var lastTs = null;

  function measure() {
    half = track.scrollWidth / 2;
  }

  function apply() {
    track.style.transform = "translateX(" + -offset + "px)";
  }

  function wrap() {
    if (half <= 0) return;
    offset = ((offset % half) + half) % half;
  }

  function scheduleResume() {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () {
      paused = false;
    }, RESUME_DELAY);
  }

  function beginDrag(clientX) {
    dragging = true;
    paused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
    dragStartX = clientX;
    dragStartOffset = offset;
  }

  function moveDrag(clientX) {
    if (!dragging) return;
    offset = dragStartOffset - (clientX - dragStartX);
    wrap();
    apply();
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    scheduleResume();
  }

  viewport.addEventListener("pointerdown", function (e) {
    pointerId = e.pointerId;
    beginDrag(e.clientX);
    if (viewport.setPointerCapture) {
      try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
    }
  });
  viewport.addEventListener("pointermove", function (e) {
    if (dragging && e.pointerId === pointerId) moveDrag(e.clientX);
  });
  ["pointerup", "pointercancel"].forEach(function (evt) {
    viewport.addEventListener(evt, endDrag);
  });
  viewport.addEventListener("mouseenter", function () {
    paused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
  });
  viewport.addEventListener("mouseleave", function () {
    if (dragging) endDrag();
    else scheduleResume();
  });

  viewport.addEventListener("touchstart", function (e) {
    beginDrag(e.touches[0].clientX);
  }, { passive: true });
  viewport.addEventListener("touchmove", function (e) {
    moveDrag(e.touches[0].clientX);
  }, { passive: true });
  viewport.addEventListener("touchend", endDrag, { passive: true });
  viewport.addEventListener("touchcancel", endDrag, { passive: true });

  viewport.addEventListener("wheel", function () {
    paused = true;
    scheduleResume();
  }, { passive: true });

  window.addEventListener("resize", measure);

  function whenImagesReady(cb) {
    var images = track.querySelectorAll("img");
    var remaining = images.length;
    if (remaining === 0) { cb(); return; }
    images.forEach(function (img) {
      if (img.complete) {
        remaining--;
      } else {
        img.addEventListener("load", function () {
          remaining--;
          if (remaining <= 0) cb();
        });
        img.addEventListener("error", function () {
          remaining--;
          if (remaining <= 0) cb();
        });
      }
    });
    if (remaining <= 0) cb();
  }

  whenImagesReady(measure);
  window.addEventListener("load", measure);

  function frame(ts) {
    if (!dragging && !paused && !reduceMotion && half > 0) {
      if (lastTs != null) {
        var dt = (ts - lastTs) / 1000;
        offset += SPEED * dt;
        wrap();
        apply();
      }
    }
    lastTs = ts;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
