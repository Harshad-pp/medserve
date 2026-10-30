(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var ok = function (f) { return f && f.value && f.status === "verified"; };

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text) e.textContent = text;
    return e;
  }

  /* ---------- WhatsApp ---------- */
  var waEnabled = S.whatsapp.status === "verified" && /^\d{10,15}$/.test(S.whatsapp.number);
  var waMessages = {
    default: "Hello, I would like to enquire about an appointment at " + S.clinic.name + ". Please share the available consultation timings.",
    doctor: "Hello, I would like to know the doctor consultation timings at " + S.clinic.name + ".",
    lab: "Hello, I would like to enquire about lab tests at " + S.clinic.name + "."
  };
  function waLink(key, extra) {
    var msg = waMessages[key] || waMessages.default;
    if (extra) msg = "Hello, I would like to enquire about " + extra + " at " + S.clinic.name + ".";
    return "https://wa.me/" + S.whatsapp.number + "?text=" + encodeURIComponent(msg);
  }
  var fallbackTel = "tel:" + S.phones[0].tel;
  function bindWa() {
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    if (waEnabled) {
      a.href = waLink(a.getAttribute("data-wa-msg"), a.getAttribute("data-wa-extra"));
      a.hidden = false;
    } else if (a.classList.contains("wa-float") || a.hasAttribute("data-wa-icon")) {
      a.hidden = true; // keep icon buttons off until owner confirms the number
    } else {
      a.href = fallbackTel;
      a.removeAttribute("target");
      a.textContent = "Call " + S.phones[0].display;
      a.classList.remove("btn-wa");
      a.classList.add("btn-primary");
    }
  });
  }

  /* ---------- Content ---------- */
  /* ---------- Slider ---------- */
  var track = $("slides"), dotsBox = $("dots"), cur = 0, timer = null;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  S.slides.forEach(function (s, i) {
    var slide = el("div", { "class": "slide", role: "group", "aria-roledescription": "slide", "aria-label": (i + 1) + " of " + S.slides.length });
    slide.appendChild(el("img", { src: s.img, alt: "", width: "1600", height: "700" }));
    var wrap = el("div", { "class": "container" });
    var cap = el("div", { "class": "cap" });
    cap.appendChild(el(i === 0 ? "h1" : "h2", {}, s.quote));
    cap.appendChild(el("p", {}, s.sub));
    var row = el("div", { "class": "btn-row" });
    row.appendChild(el("a", { "class": "btn btn-primary", href: "#appointment" }, "Book appointment"));
    var w = el("a", { "class": "btn btn-wa", "data-wa": "", "data-wa-msg": "default", href: "#contact", target: "_blank", rel: "noopener" }, "Chat on WhatsApp");
    row.appendChild(w);
    cap.appendChild(row); wrap.appendChild(cap); slide.appendChild(wrap); track.appendChild(slide);
    var d = el("button", { type: "button", role: "tab", "aria-label": "Go to slide " + (i + 1), "aria-selected": "false" });
    d.addEventListener("click", function () { go(i); restart(); });
    dotsBox.appendChild(d);
  });
  function go(n) {
    cur = (n + S.slides.length) % S.slides.length;
    track.style.transform = "translateX(-" + (cur * 100) + "%)";
    Array.prototype.forEach.call(dotsBox.children, function (d, i) { d.setAttribute("aria-selected", String(i === cur)); });
    Array.prototype.forEach.call(track.children, function (sl, i) { sl.setAttribute("aria-hidden", String(i !== cur)); });
  }
  function restart() { stop(); if (!reduce) timer = setInterval(function () { go(cur + 1); }, 3000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  $("prevSlide").addEventListener("click", function () { go(cur - 1); restart(); });
  $("nextSlide").addEventListener("click", function () { go(cur + 1); restart(); });
  var sl = document.getElementById("top");
  sl.addEventListener("mouseenter", stop); sl.addEventListener("mouseleave", restart);
  sl.addEventListener("focusin", stop); sl.addEventListener("focusout", restart);
  go(0); restart();

  var grid = $("serviceGrid");
  S.services.forEach(function (s) {
    var c = el("article", { "class": "card" });
    c.appendChild(el("img", { "class": "card-img", src: "assets/services/" + s.id + ".svg", alt: "", width: "400", height: "240", loading: "lazy" }));
    var body = el("div", { "class": "card-body" });
    body.appendChild(el("h3", {}, s.title));
    body.appendChild(el("p", {}, s.text));
    var link = el("a", { "class": "btn btn-outline btn-sm", href: "#appointment", "data-svc": s.title }, "Enquire");
    link.addEventListener("click", function () { $("service").value = s.title; });
    body.appendChild(link);
    c.appendChild(body);
    grid.appendChild(c);
  });

  /* ---------- Specialities ---------- */
  var SVGNS = "http://www.w3.org/2000/svg";
  // Line icons on a 24x24 grid; each entry is a list of SVG shapes [tag, attrs].
  var ICONS = {
    stethoscope: [["path", { d: "M5 3v6a5 5 0 0 0 10 0V3M4 3h2M14 3h2M10 14v1.5a4.5 4.5 0 0 0 9 0V13" }], ["circle", { cx: 19, cy: 11, r: 2 }]],
    kit: [["rect", { x: 3, y: 7, width: 18, height: 13, rx: 2 }], ["path", { d: "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M12 11v5M9.5 13.5h5" }]],
    scalpel: [["path", { d: "M20 4c-5 0-10 4-12 9l3 3c5-2 9-7 9-12zM8 13l-4.5 7.5M3 22h7" }]],
    lungs: [["path", { d: "M9 4v7c0 4-1 7-4 8-2 .5-3-1-3-3 0-4 2-9 4-12 1-1.5 3-1.5 3 0zM15 4v7c0 4 1 7 4 8 2 .5 3-1 3-3 0-4-2-9-4-12-1-1.5-3-1.5-3 0zM12 3v7M12 10l-3 2M12 10l3 2" }]],
    mind: [["path", { d: "M8 21v-3c-2-1-4-3-4-7a8 8 0 0 1 16 0c0 2-1 3-2 4v3a2 2 0 0 1-2 2H8z" }], ["path", { d: "M9 9.5a2 2 0 0 1 3-1 2 2 0 0 1 3 1.5c1 .5 1 2-.5 2.5M12 8.5v6" }]],
    bone: [["g", { transform: "rotate(-45 12 12)" }, [["path", { d: "M7.7 10h8.6M7.7 14h8.6" }], ["circle", { cx: 5.5, cy: 9.5, r: 2.2 }], ["circle", { cx: 5.5, cy: 14.5, r: 2.2 }], ["circle", { cx: 18.5, cy: 9.5, r: 2.2 }], ["circle", { cx: 18.5, cy: 14.5, r: 2.2 }]]]],
    drop: [["path", { d: "M12 3c3.5 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11zM12 12v5M9.5 14.5h5" }]],
    ribbon: [["path", { d: "M12 15C9 12.5 7 10.5 7 7.5a3.5 3.5 0 0 1 5-3.2 3.5 3.5 0 0 1 5 3.2c0 3-2 5-5 7.5zM10.5 16.5 8 21M13.5 16.5 16 21" }]],
    skin: [["path", { d: "M3 8c3-2 6-2 9 0s6 2 9 0M3 13c3-2 6-2 9 0s6 2 9 0M3 18c3-2 6-2 9 0s6 2 9 0" }]],
    child: [["circle", { cx: 12, cy: 13, r: 8 }], ["path", { d: "M12 5c0-1.5 1.5-2 2.5-1M9 12.5h.01M15 12.5h.01M9 16c1.7 1.5 4.3 1.5 6 0" }]]
  };
  function drawShapes(parent, shapes) {
    shapes.forEach(function (sh) {
      var n = document.createElementNS(SVGNS, sh[0]);
      Object.keys(sh[1]).forEach(function (k) { n.setAttribute(k, sh[1][k]); });
      if (sh[2]) drawShapes(n, sh[2]);
      parent.appendChild(n);
    });
  }
  function icon(key) {
    var svg = document.createElementNS(SVGNS, "svg");
    ["width:40", "height:40", "viewBox:0 0 24 24", "fill:none", "stroke:currentColor", "stroke-width:1.5", "stroke-linecap:round", "stroke-linejoin:round", "aria-hidden:true"].forEach(function (kv) {
      var p = kv.split(":"); svg.setAttribute(p[0], p[1]);
    });
    drawShapes(svg, ICONS[key] || ICONS.kit);
    return svg;
  }

  var specList = $("specList");
  S.specialities.forEach(function (s, i) {
    var a = el("a", { "class": "dept", href: "#appointment" });
    a.style.setProperty("--i", i);
    var ic = el("span", { "class": "dept-icon" });
    ic.appendChild(icon(s.icon));
    var tx = el("span", { "class": "dept-text" });
    tx.appendChild(el("strong", {}, s.name));
    tx.appendChild(el("span", { "class": "dept-go" }, "Enquire →"));
    a.appendChild(ic); a.appendChild(tx);
    a.addEventListener("click", function () { $("service").value = s.name + " (specialist)"; });
    specList.appendChild(a);
  });
  // Fade the departments in one by one when the section scrolls into view.
  if ("IntersectionObserver" in window) {
    specList.classList.add("anim");
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { specList.classList.add("in"); obs.disconnect(); }
    }, { threshold: 0.15 }).observe(specList);
  }

  var doctors = S.doctors.filter(function (d) { return d.status === "verified" && d.name; });
  if (doctors.length) {
    $("doctors").hidden = false;
    $("navDoctors").hidden = false;
    var dTrack = $("docTrack");
    doctors.forEach(function (d) {
      var c = el("article", { "class": "doc-card" });
      var ph = el("div", { "class": "doc-photo" });
      if (d.photo) {
        ph.appendChild(el("img", { src: d.photo, alt: d.name, loading: "lazy" }));
      } else {
        var initials = d.name.replace(/^Dr\.?\s*/i, "").split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase();
        ph.appendChild(el("span", { "class": "doc-initials", "aria-hidden": "true" }, initials));
      }
      if (d.speciality) ph.appendChild(el("span", { "class": "doc-dept" }, d.speciality));
      c.appendChild(ph);
      var info = el("div", { "class": "doc-info" });
      info.appendChild(el("h3", {}, d.name));
      if (d.qualification) info.appendChild(el("p", {}, d.qualification));
      if (d.days || d.timings) info.appendChild(el("p", { "class": "doc-time" }, [d.days, d.timings].filter(Boolean).join(" · ")));
      c.appendChild(info);
      dTrack.appendChild(c);
    });
    var step = function (dir) {
      var first = dTrack.firstElementChild;
      dTrack.scrollBy({ left: dir * (first.offsetWidth + 20), behavior: reduce ? "auto" : "smooth" });
    };
    $("docPrev").addEventListener("click", function () { step(-1); });
    $("docNext").addEventListener("click", function () { step(1); });
    dTrack.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    });

    var dTimer = null;
    var dStop = function () { if (dTimer) { clearInterval(dTimer); dTimer = null; } };
    var dStart = function () {
      dStop();
      if (reduce) return;
      dTimer = setInterval(function () {
        var atEnd = dTrack.scrollLeft + dTrack.clientWidth >= dTrack.scrollWidth - 4;
        if (atEnd) dTrack.scrollTo({ left: 0, behavior: "smooth" });
        else step(1);
      }, 2000);
    };
    var dSec = $("doctors");
    dSec.addEventListener("mouseenter", dStop); dSec.addEventListener("mouseleave", dStart);
    dSec.addEventListener("focusin", dStop); dSec.addEventListener("focusout", dStart);
    dSec.addEventListener("touchstart", dStop, { passive: true });
    dSec.addEventListener("touchend", function () { setTimeout(dStart, 4000); }, { passive: true });
    dStart();
  }

  var tests = S.labTests.filter(function (t) { return t.name; });
  if (tests.length) {
    var cats = {};
    tests.forEach(function (t) { (cats[t.category || "Tests"] = cats[t.category || "Tests"] || []).push(t); });
    Object.keys(cats).forEach(function (cat) {
      $("labTests").appendChild(el("h3", {}, cat));
      var ul = el("ul", {});
      cats[cat].forEach(function (t) {
        var parts = [t.name];
        if (t.processing) parts.push(t.processing === "onsite" ? "processed on site" : "processed by partner lab");
        if (t.prep) parts.push("preparation: " + t.prep);
        if (t.turnaround) parts.push("report: " + t.turnaround);
        ul.appendChild(el("li", {}, parts.join(" – ")));
      });
      $("labTests").appendChild(ul);
    });
  }

  var faq = $("faqList");
  S.faq.forEach(function (f) {
    var d = el("details", {});
    d.appendChild(el("summary", {}, f.q));
    d.appendChild(el("p", {}, f.a));
    faq.appendChild(d);
  });

  /* ---------- Contact ---------- */
  if (ok(S.clinic.fullAddress)) { $("addrRow").hidden = false; $("addr").textContent = S.clinic.fullAddress.value; }
  var phones = $("phones"), foot = $("footPhones"), top = $("topPhones");
  S.phones.forEach(function (p, i) {
    [phones, foot, top].forEach(function (host) {
      if (i) host.appendChild(document.createTextNode(host === foot ? " " : " · "));
      var a = el("a", { href: "tel:" + p.tel }, p.display);
      host.appendChild(a);
    });
  });
  if (ok(S.email)) {
    $("emailRow").hidden = false;
    $("emailLink").appendChild(el("a", { href: "mailto:" + S.email.value }, S.email.value));
  }
  if (ok(S.hours.summary)) {
    $("hoursRow").hidden = false;
    $("hours").textContent = S.hours.summary.value;
  }
  $("hoursNote").textContent = S.hours.note;
  var mq = encodeURIComponent(S.clinic.mapsQuery);
  $("directions").href = "https://www.google.com/maps/dir/?api=1&destination=" + mq;
  $("mapFrame").src = "https://www.google.com/maps?q=" + mq + "&output=embed";

  /* ---------- Service select ---------- */
  var sel = $("service");
  sel.appendChild(el("option", { value: "No preference" }, "No preference"));
  S.services.forEach(function (s) { sel.appendChild(el("option", { value: s.title }, s.title)); });
  S.specialities.forEach(function (s) { sel.appendChild(el("option", { value: s.name + " (specialist)" }, s.name + " (specialist)")); });

  bindWa();

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("menuBtn"), nav = $("navLinks");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- Form ---------- */
  var form = $("enquiryForm"), status = $("formStatus"), btn = $("submitBtn");
  var lastSent = 0;

  function setErr(id, msg) {
    var field = id === "consent" ? $("consent") : $(id);
    $("err-" + id).textContent = msg || "";
    if (field) field.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function showStatus(kind, text) {
    status.className = "status show " + kind;
    status.textContent = (kind === "ok" ? "✔ " : "⚠ ") + text;
  }
  function validate() {
    var good = true;
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var email = form.email.value.trim();
    setErr("name", name.length < 2 ? "Please enter your name." : ""); if (name.length < 2) good = false;
    var digits = phone.replace(/\D/g, "");
    var phoneBad = !/^[\d\s+()\-]+$/.test(phone) || digits.length < 8 || digits.length > 15;
    setErr("phone", phoneBad ? "Please enter a valid phone number." : ""); if (phoneBad) good = false;
    var emailBad = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setErr("email", emailBad ? "Please enter a valid email address or leave it empty." : ""); if (emailBad) good = false;
    setErr("consent", form.consent.checked ? "" : "Please tick the box to continue."); if (!form.consent.checked) good = false;
    return good;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "status";
    if (form.botcheck.value) return; // honeypot
    if (!validate()) { showStatus("fail", "Please fix the highlighted fields."); return; }
    if (Date.now() - lastSent < 30000) { showStatus("fail", "Please wait a moment before sending another request."); return; }

    var phoneHint = S.phones.map(function (p) { return p.display; }).join(" / ");
    if (!waEnabled) {
      showStatus("fail", "Please call " + phoneHint + " to send your request.");
      return;
    }

    var line = function (label, value) { return "*" + label + ":* " + value; };
    var when = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    var lines = [
      "*NEW " + form.enquiry_type.value.toUpperCase() + "*",
      "_" + S.clinic.name + " website_",
      "------------------------",
      line("Name", form.name.value.trim()),
      line("Phone", form.phone.value.trim()),
      line("Email", form.email.value.trim() || "Not provided"),
      line("Doctor / Service", form.service.value),
      line("Enquiry Type", form.enquiry_type.value),
      line("Preferred Time", form.preferred_time.value.trim() || "Not provided"),
      line("Message", form.message.value.trim() || "-"),
      "------------------------",
      "Submitted: " + when,
      "_Appointment request only, not a confirmed booking._"
    ];
    var url = "https://wa.me/" + S.whatsapp.number + "?text=" + encodeURIComponent(lines.join("\n"));
    lastSent = Date.now();
    var w = window.open(url, "_blank", "noopener");
    if (!w) { window.location.href = url; }
    form.reset();
    showStatus("ok", "WhatsApp is opening with your details. Please press Send in WhatsApp to deliver the request to the clinic.");
  });
})();
