// Galaxy backdrop for the marketing page: a scattered field of twinkling
// stars plus a handful of large, softly blurred "nebula" glows that drift
// slowly — same spirit as the app's own cosmic backgrounds (design/diary.html),
// re-tuned to the site's purple/blue "Deep Cosmos" accent colors.
(function () {
  var root = document.getElementById("cosmic-bg");
  if (!root) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) root.classList.add("reduced");

  var STAR_COUNT = 130;
  var frag = document.createDocumentFragment();
  for (var i = 0; i < STAR_COUNT; i++) {
    var s = document.createElement("div");
    s.className = "star";
    var size = Math.random() * 2 + 0.5;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.setProperty("--dur", (Math.random() * 4 + 2.5) + "s");
    s.style.animationDelay = -(Math.random() * 4) + "s";
    frag.appendChild(s);
  }
  root.appendChild(frag);

  var bloom = document.createElement("div");
  bloom.className = "bloom";
  bloom.style.left = "24%";
  bloom.style.top = "-8%";
  bloom.style.width = "420px";
  bloom.style.height = "420px";
  bloom.style.background = "#a06bff";
  root.appendChild(bloom);

  // Sizes are capped relative to viewport width so the glows stay as
  // pockets of color rather than washing out the whole (often narrow,
  // mobile) screen with purple.
  var vw = Math.max(document.documentElement.clientWidth, 320);
  function cap(px) { return Math.min(px, vw * 0.62); }

  var ORBS = [
    { left: "4%",  top: "4%",  size: cap(260), dx: "40px",  dy: "30px",  color: "#a06bff", drift: "24s" },
    { left: "78%", top: "2%",  size: cap(200), dx: "-34px", dy: "40px",  color: "#5b8bff", drift: "29s" },
    { left: "72%", top: "58%", size: cap(280), dx: "-46px", dy: "-36px", color: "#7b5cfa", drift: "33s" },
    { left: "-4%", top: "76%", size: cap(220), dx: "36px",  dy: "-40px", color: "#5b8bff", drift: "27s" }
  ];

  ORBS.forEach(function (o, i) {
    var orb = document.createElement("div");
    orb.className = "glow";
    orb.style.left = o.left;
    orb.style.top = o.top;
    orb.style.width = o.size + "px";
    orb.style.height = o.size + "px";
    orb.style.background = o.color;
    orb.style.setProperty("--dx", o.dx);
    orb.style.setProperty("--dy", o.dy);
    orb.style.setProperty("--drift", o.drift);
    orb.style.animationDelay = -(i * 4) + "s";
    root.appendChild(orb);
  });
})();
