/* Circuit Sessions app only (iOS and Android). Injected by the native shell; the website itself is unchanged.
   In the app the session payment is pay what you want entry for that session (Apple 3.1.3(e) / Play: real world service),
   monthly support is not offered in the app, and account deletion is reachable from every page. */
(function () {
  if (!/(^|\.)circuitsessions\.com$/.test(location.hostname) || window.__csApp) return;
  window.__csApp = 1;
  var DELETE_URL = "https://keepclimbing.app/api/v2/forms.php?f=fd8cb5e1a45c2e8e";
  var MAP = [
    ["Sign up for the next CIRCUIT SESSIONS in a minute. An encouraged donation keeps the sessions going, and you can add it at the end of the sign up form, one time or monthly.", "Sign up for the next CIRCUIT SESSIONS in a minute. Pay what you want entry comes at the end of the sign up form."],
    ["$10 is the encouraged donation. Give any amount, once or monthly. Your gift saves your spot and keeps Detroit’s open mic going.", "$10 is the suggested entry. Pay what you want for this session. It saves your spot and keeps Detroit’s open mic going."],
    ["Donations keep these sessions going. Add yours with your sign up, or leave the card blank. Your slot is saved either way.", "Pay what you want entry keeps these sessions going. Add it with your sign up, or leave the card blank. Your slot is saved either way."],
    ["Secure, encrypted checkout right here on circuitsessions.com. Monthly gifts can be cancelled anytime", "Secure, encrypted checkout right here on circuitsessions.com."],
    ["Your spot is saved. Add your donation to RSVP and keep the music going.", "Your spot is saved. Add your pay what you want entry to RSVP."],
    ["Your donation for this session is in.", "Your entry for this session is paid."],
    ["Or clear the card fields to sign up without donating.", "Or clear the card fields to sign up without paying."],
    ["Slot saved. Sending your donation", "Slot saved. Sending your payment"],
    ["The donation did not go through.", "The payment did not go through."],
    ["The donation is still processing.", "The payment is still processing."],
    ["gift is in and your spot is saved.", "entry is paid and your spot is saved."],
    ["Artists · Encouraged donation", "Artists · Pay what you want entry"],
    ["$10 donation encouraged.", "$10 suggested entry. Pay what you want."],
    ["RSVPs, donations and profile", "RSVPs, payments and profile"],
    ["My RSVPs & Donations", "My RSVPs & Payments"],
    ["Donation & RSVP", "Entry & RSVP"],
    ["Encouraged donation", "Pay what you want entry"],
    ["encouraged donation", "pay what you want entry"],
    ["Donate & RSVP", "Pay & RSVP"],
    ["Your gift", "Your entry"],
    [" + donate $", " + entry $"]
  ];
  function fixText(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, s, t;
    while ((n = w.nextNode())) {
      s = n.nodeValue; if (!s || s.length < 4) continue; t = s;
      for (var i = 0; i < MAP.length; i++) if (t.indexOf(MAP[i][0]) > -1) t = t.split(MAP[i][0]).join(MAP[i][1]);
      if (t !== s) n.nodeValue = t;
    }
    var attrs = root.querySelectorAll ? root.querySelectorAll("[aria-label],[data-givetxt],[data-givebtn],[placeholder]") : [];
    for (var j = 0; j < attrs.length; j++) ["aria-label", "data-givetxt", "data-givebtn", "placeholder"].forEach(function (a) {
      var v = attrs[j].getAttribute(a); if (!v) return; var x = v;
      for (var i = 0; i < MAP.length; i++) if (x.indexOf(MAP[i][0]) > -1) x = x.split(MAP[i][0]).join(MAP[i][1]);
      if (x !== v) attrs[j].setAttribute(a, x);
    });
  }
  function noMonthly() {
    var b = document.querySelectorAll('[data-f="monthly"],[data-freq="monthly"],[value="monthly"]');
    for (var i = 0; i < b.length; i++) {
      var g = b[i].closest('[role="group"]') || b[i].parentElement;
      if (g && !g.__cs) { g.__cs = 1; g.style.display = "none"; }
      b[i].style.display = "none";
    }
    var once = document.querySelectorAll('[data-f="once"]');
    for (var k = 0; k < once.length; k++) if (once[k].getAttribute("aria-pressed") === "false") once[k].click();
  }
  function footerLink() {
    if (document.querySelector("[data-cs-delete]")) return;
    var host = document.querySelector("footer") || document.querySelector(".kb-foot,.kb-footer");
    if (!host) return;
    var a = document.createElement("a");
    a.href = DELETE_URL; a.textContent = "Delete my account"; a.setAttribute("data-cs-delete", "1");
    a.style.cssText = "display:block;margin:14px auto 6px;text-align:center;font-size:13px;opacity:.8;color:inherit;text-decoration:underline";
    host.appendChild(a);
  }
  var busy = 0;
  function run() { if (busy) return; busy = 1; try { fixText(document.body); noMonthly(); footerLink(); } catch (e) {} busy = 0; }
  var t = null;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(run, 60); }).observe(document, { childList: true, subtree: true, characterData: true });
  if (document.readyState !== "loading") run(); else document.addEventListener("DOMContentLoaded", run);
})();
