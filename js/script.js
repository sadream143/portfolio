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

// ===== Blog: search and category filter =====
// The sidebar sends visitors to blog.html?q=word or blog.html?cat=category-name
(function () {
  var grid = document.querySelector(".blog-grid");
  if (!grid) return;
  var params = new URLSearchParams(window.location.search);
  var q = (params.get("q") || "").trim();
  var cat = (params.get("cat") || "").trim();
  if (!q && !cat) return;

  var catNames = {
    "my-journey": "My Journey",
    "advanced-excel": "Advanced Excel",
    "power-bi": "Power BI",
    "python": "Python",
    "sql": "SQL",
    "data-research": "Data Research"
  };

  var shown = 0;
  grid.querySelectorAll(".post-card").forEach(function (card) {
    var text = (card.querySelector("h3").textContent + " " +
                card.querySelector("p").textContent + " " +
                card.querySelector(".post-tag").textContent).toLowerCase();
    var okQ = !q || text.indexOf(q.toLowerCase()) !== -1;
    var okC = !cat || card.getAttribute("data-cat") === cat;
    var show = okQ && okC;
    card.style.display = show ? "" : "none";
    if (show) shown++;
  });

  var what = q ? '"' + q + '"' : (catNames[cat] || cat);
  var note = document.getElementById("blogNote");
  if (note) {
    note.textContent = shown > 0
      ? "Showing " + shown + (shown === 1 ? " post" : " posts") + " for " + what + ". "
      : "No posts found for " + what + ". ";
    var all = document.createElement("a");
    all.href = "blog.html";
    all.textContent = "Show all posts";
    note.appendChild(all);
  }
})();