// Mobile menu: open and close
var menuBtn = document.getElementById("menuBtn");
var menu = document.getElementById("menu");

menuBtn.addEventListener("click", function () {
  var isOpen = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close the menu after tapping a link
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Footer year updates by itself
document.getElementById("year").textContent = new Date().getFullYear();

// If the photo is missing, show a letter instead
var photo = document.getElementById("profilePhoto");
if (photo) {
  photo.addEventListener("error", function () {
    photo.parentNode.classList.add("no-photo");
    photo.parentNode.textContent = "S";
  });
}

// ===== Auto-updating experience =====
// To add a new job later, add one line in the "jobs" list below.
// Months are 1-12. Use end: null for a job that is still running.
(function () {
  var jobs = [
    { start: [2015, 6], end: [2018, 12] },  // Meghna Insurance
    { start: [2019, 4], end: [2022, 1] },   // E-commerce dropshipping
    { start: [2021, 3], end: [2024, 9] },   // Standard Group
    { start: [2022, 2], end: null }         // MuzFlips (current)
  ];
  var muzStart = [2022, 2];

  var now = new Date();
  var nowIndex = now.getFullYear() * 12 + now.getMonth();

  function toIndex(p) { return p[0] * 12 + (p[1] - 1); }

  function yearsMonths(total) {
    var y = Math.floor(total / 12);
    var m = total % 12;
    var text = "";
    if (y > 0) text += y + (y === 1 ? " yr" : " yrs");
    if (m > 0) text += (text ? " " : "") + m + (m === 1 ? " mo" : " mos");
    return text;
  }

  // Merge overlapping periods so the same months are not counted twice
  var periods = jobs.map(function (j) {
    return [toIndex(j.start), j.end ? toIndex(j.end) : nowIndex];
  }).sort(function (a, b) { return a[0] - b[0]; });

  var merged = [];
  periods.forEach(function (p) {
    var last = merged[merged.length - 1];
    if (last && p[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], p[1]);
    } else {
      merged.push([p[0], p[1]]);
    }
  });

  var totalMonths = merged.reduce(function (sum, p) {
    return sum + (p[1] - p[0] + 1);
  }, 0);
  var muzMonths = nowIndex - toIndex(muzStart) + 1;

  var values = {
    "total-plus": Math.floor(totalMonths / 12) + "+",
    "total-text": yearsMonths(totalMonths),
    "muz-plus": Math.floor(muzMonths / 12) + "+",
    "muz-text": yearsMonths(muzMonths)
  };

  document.querySelectorAll("[data-exp]").forEach(function (el) {
    var key = el.getAttribute("data-exp");
    if (values[key]) el.textContent = values[key];
  });
})();