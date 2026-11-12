/* Sends audit and nonprofit form requests straight into the InboundGold admin portal (Sales).
   If the portal can't be reached, the form falls back to its normal Formspree delivery,
   so no lead is ever lost. */
(function () {
  var INTAKE = "https://admin.inboundgold.com/api.php?a=intake";
  document.querySelectorAll("form[data-ig-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      if (f.dataset.fallback === "1") return; // second pass: let Formspree handle it
      e.preventDefault();
      var btn = f.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      var data = { form: f.dataset.igForm };
      new FormData(f).forEach(function (v, k) {
        if (k.charAt(0) === "_" || k === "source") return;
        data[k] = k in data ? [].concat(data[k], v) : v;
      });
      fetch(INTAKE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) {
          if (!r.ok) throw new Error("intake " + r.status);
          var p = document.createElement("p");
          p.className = "form-thanks";
          p.setAttribute("role", "status");
          p.style.cssText = "font-size:1.1rem;padding:18px 0";
          p.textContent = "Thanks. We got your request and will reply within one business day.";
          f.replaceWith(p);
        })
        .catch(function () {
          f.dataset.fallback = "1";
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send"; }
          f.submit();
        });
    });
  });
})();
