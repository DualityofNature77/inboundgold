(function () {
  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) {
    var sign = n < 0 ? "−" : "";
    return sign + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
  };

  // Mobile menu
  var btn = document.querySelector(".menu-btn"), nav = $("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  var yr = $("yr"); if (yr) yr.textContent = new Date().getFullYear();

  // Decision-cost calculator
  if ($("calc")) {
    var trustWords = ["None", "Very low", "Low", "Low", "Moderate", "Moderate", "Noticeable", "High", "High", "Severe", "Severe"];
    var num = function (id) { var v = parseFloat($(id).value); return isNaN(v) || v < 0 ? 0 : v; };
    var calc = function () {
      var cash = num("c-cash"), hours = num("c-hours"), rate = num("c-rate"),
          alt = num("c-alt"), trust = num("c-social"), ret = num("c-ret");
      var hoursVal = hours * rate;
      var implicit = hoursVal + alt;
      var social = (trust / 10) * 0.5 * (cash + hoursVal);
      var total = cash + implicit + social;
      var net = ret - total;

      $("o-hours").textContent = hours;
      $("o-rate").textContent = money(rate);
      $("o-social").textContent = trustWords[trust] || "";
      $("r-title").textContent = $("c-name").value || "Your decision";
      $("r-exp").textContent = money(cash);
      $("r-imp").textContent = money(implicit);
      $("r-soc").textContent = money(social);
      $("r-total").textContent = money(total);
      $("r-ret").textContent = money(ret);
      $("r-net").innerHTML = "<strong>" + money(net) + "</strong>";
      $("r-net").style.color = net >= 0 ? "var(--teal)" : "#A23B2A";

      var mult = cash > 0 ? (total / cash) : 0;
      var verdict;
      if (ret === 0) verdict = "Add an expected return to see whether this decision pays for its true cost.";
      else if (net > total * 0.25) verdict = "Strong call. It clears its full cost with room to spare.";
      else if (net >= 0) verdict = "Thin margin. It covers its true cost, but barely — pressure-test your return estimate.";
      else verdict = "Under water. Once hidden costs are counted, your next-best option wins.";
      if (mult >= 1.5) verdict += " The real price is " + mult.toFixed(1) + "× the invoice.";
      $("r-verdict").textContent = verdict;
    };
    $("calc").addEventListener("input", calc);
    calc();
  }

  // Credits checker
  var checks = $("checks");
  if (checks) {
    var update = function () {
      var boxes = checks.querySelectorAll("input:checked"), sum = 0, notes = [];
      boxes.forEach(function (b) {
        sum += parseFloat(b.getAttribute("data-v")) || 0;
        if (b.getAttribute("data-note")) notes.push(b.getAttribute("data-note"));
      });
      var f = $("found");
      if (!boxes.length) { f.textContent = "Tick what you use to see the published credit ceiling."; return; }
      var html = sum > 0 ? "Up to <strong>" + money(sum) + "</strong> in published credits" : "No cash credits selected";
      if (notes.length) html += (sum > 0 ? ", plus " : " — but ") + "startup discounts on " + notes.join(" and ");
      html += '. <a href="#get-audit">See what you actually qualify for →</a>';
      f.innerHTML = html;
    };
    checks.addEventListener("change", update);
  }
})();
