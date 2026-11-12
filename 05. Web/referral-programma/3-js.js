/* BetaalBuddy · Referral-programma
   Oxygen Builder > Code Block > tab "JavaScript"
   Geen libraries nodig. Werkt ook als Oxygen de JS vóór of ná de HTML laadt. */
(function () {
  function init() {
    var root = document.getElementById('bbr');
    if (!root || root.dataset.bbrReady) return;
    root.dataset.bbrReady = '1';
    root.classList.add('bbr-js');

    /* 1. Fade-in bij scrollen */
    var items = root.querySelectorAll('.bbr-reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }

    /* 2. Rekentool */
    var calc = document.getElementById('bbr-calc');
    var range = document.getElementById('bbr-range');
    var count = document.getElementById('bbr-count');
    var total = document.getElementById('bbr-total');
    if (calc && range && count && total) {
      var reward = parseFloat(String(calc.dataset.reward || '0').replace(',', '.')) || 0;
      var unit = (calc.dataset.unit || 'euro').trim();
      var max = parseInt(calc.dataset.max, 10) || 10;
      range.max = max;
      var euro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: reward % 1 ? 2 : 0 });

      var update = function () {
        var n = parseInt(range.value, 10);
        count.textContent = n;
        range.style.setProperty('--bbr-fill', ((n - range.min) / (range.max - range.min)) * 100 + '%');
        if (!reward) { total.textContent = '€ ✏️'; return; }
        var sum = n * reward;
        total.textContent = unit === 'euro' ? euro.format(sum) : sum + ' ' + unit;
      };
      range.addEventListener('input', update);
      update();
    }

    /* 3. Delen: kopiëren, WhatsApp en mail */
    var share = document.getElementById('bbr-share');
    var msgEl = document.getElementById('bbr-msg');
    if (share && msgEl) {
      var url = share.dataset.url || window.location.origin;
      var text = msgEl.textContent.trim() + ' ' + url;
      var wa = document.getElementById('bbr-wa');
      var mail = document.getElementById('bbr-mail');
      if (wa) wa.href = 'https://wa.me/?text=' + encodeURIComponent(text);
      if (mail) mail.href = 'mailto:?subject=' + encodeURIComponent('Tip: BetaalBuddy') + '&body=' + encodeURIComponent(text);

      var btn = document.getElementById('bbr-copy');
      var label = btn && btn.querySelector('.bbr-copy__label');
      var done = function () {
        if (!btn) return;
        btn.classList.add('is-copied');
        if (label) label.textContent = 'gekopieerd!';
        setTimeout(function () { btn.classList.remove('is-copied'); if (label) label.textContent = 'kopieer bericht'; }, 2200);
      };
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      };
      if (btn) btn.addEventListener('click', function () {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else { fallback(); }
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
