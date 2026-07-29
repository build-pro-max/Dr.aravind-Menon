/* =============================================================
   Meridian Health Clinic — site behaviour
   Vanilla JS, no dependencies, no build step.
   ============================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------- scroll reveal */
  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-in');
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

    function scan() {
      var pending = document.querySelectorAll('.reveal:not(.is-in)');
      for (var i = 0; i < pending.length; i++) {
        if (pending[i].getBoundingClientRect().top < window.innerHeight) {
          pending[i].classList.add('is-in');
        } else {
          io.observe(pending[i]);
        }
      }
    }

    scan();

    var raf = 0;
    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; scan(); });
    }, { passive: true });
  }

  /* ---------------------------------------------- mobile drawer */
  function initDrawer() {
    var drawer = document.querySelector('[data-drawer]');
    var openBtn = document.querySelector('[data-drawer-open]');
    var closeBtn = document.querySelector('[data-drawer-close]');
    if (!drawer || !openBtn) return;

    function open() {
      drawer.setAttribute('data-open', 'true');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }

    function close() {
      drawer.setAttribute('data-open', 'false');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);

    drawer.addEventListener('click', function (ev) {
      if (ev.target === drawer) close();
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && drawer.getAttribute('data-open') === 'true') {
        close();
        openBtn.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 920) close();
    });
  }

  /* ---------------------------------------------- page transitions */
  function initTransitions() {
    if (reduceMotion) return;

    document.addEventListener('click', function (ev) {
      if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;

      var link = ev.target.closest ? ev.target.closest('a[href]') : null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (/^(https?:)?\/\//i.test(href) || /^(mailto|tel):/i.test(href)) return;
      if (!/\.html(\?[^#]*)?(#.*)?$/i.test(href)) return;

      var hashAt = href.indexOf('#');
      var path = hashAt > -1 ? href.slice(0, hashAt) : href;
      var hash = hashAt > -1 ? href.slice(hashAt) : '';
      var here = window.location.pathname.split('/').pop() || 'index.html';

      /* same page, just an anchor — scroll instead of reloading */
      if (hash && (path === '' || path === here)) {
        var target = document.querySelector(hash);
        if (target) {
          ev.preventDefault();
          document.body.style.overflow = '';
          var drawer = document.querySelector('[data-drawer]');
          if (drawer) drawer.setAttribute('data-open', 'false');
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - 88,
            behavior: 'smooth'
          });
          if (history.replaceState) history.replaceState(null, '', hash);
        }
        return;
      }

      ev.preventDefault();
      document.body.style.overflow = '';
      document.body.classList.add('is-leaving');
      setTimeout(function () { window.location.href = href; }, 120);
    });

    window.addEventListener('pageshow', function () {
      document.body.classList.remove('is-leaving');
      document.body.style.overflow = '';
    });
  }

  /* ---------------------------------------------- journal filters */
  function initFilters() {
    var buttons = document.querySelectorAll('[data-filter]');
    if (!buttons.length) return;

    var items = document.querySelectorAll('[data-category]');
    var empty = document.querySelector('[data-empty]');

    function apply(value) {
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-filter') === value));
      }
      var shown = 0;
      for (var j = 0; j < items.length; j++) {
        var match = value === 'all' || items[j].getAttribute('data-category') === value;
        items[j].hidden = !match;
        if (match) shown++;
      }
      if (empty) empty.classList.toggle('is-shown', shown === 0);
    }

    for (var k = 0; k < buttons.length; k++) {
      buttons[k].addEventListener('click', function () {
        apply(this.getAttribute('data-filter'));
      });
    }

    apply('all');
  }

  /* ---------------------------------------------- appointment form */
  function initForm() {
    var form = document.querySelector('[data-appointment-form]');
    if (!form) return;

    var success = document.querySelector('[data-appointment-success]');
    var errorBox = form.querySelector('[data-form-error]');
    var successLine = success ? success.querySelector('[data-success-line]') : null;
    var resetBtn = success ? success.querySelector('[data-appointment-reset]') : null;

    var required = [
      { id: 'name', label: 'your name' },
      { id: 'phone', label: 'a phone number' },
      { id: 'date', label: 'a preferred date' },
      { id: 'reason', label: 'a reason for the visit' }
    ];

    function field(id) { return form.querySelector('#field-' + id); }
    function value(id) {
      var el = field(id);
      return el ? String(el.value || '').trim() : '';
    }
    function mark(id, invalid) {
      var el = field(id);
      if (el) el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }

    /* no past dates */
    var dateEl = field('date');
    if (dateEl) {
      var today = new Date();
      dateEl.min = today.toISOString().slice(0, 10);
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var missing = required.filter(function (r) { return !value(r.id); });
      required.forEach(function (r) {
        mark(r.id, missing.indexOf(r) > -1);
      });

      if (missing.length) {
        if (errorBox) {
          errorBox.textContent = missing.length === 1
            ? 'Please add ' + missing[0].label + ' so the desk can confirm your slot.'
            : 'Please complete the highlighted fields.';
          errorBox.hidden = false;
        }
        var first = field(missing[0].id);
        if (first) first.focus();
        return;
      }

      if (errorBox) errorBox.hidden = true;

      var name = value('name');
      var phone = value('phone');
      var when = '';
      var raw = value('date');
      if (raw) {
        var parsed = new Date(raw + 'T00:00:00');
        if (!isNaN(parsed.getTime())) {
          when = ' for ' + parsed.toLocaleDateString('en-GB', {
            weekday: 'long', day: 'numeric', month: 'long'
          });
        }
      }

      if (successLine) {
        successLine.textContent = 'Thank you, ' + name.split(' ')[0] + '. Your request' + when +
          ' has been noted \u2014 the front desk will call ' + phone + ' to confirm an exact time.';
      }

      form.hidden = true;
      if (success) {
        success.hidden = false;
        var panel = document.getElementById('appointment');
        if (panel) {
          window.scrollTo({
            top: panel.getBoundingClientRect().top + window.pageYOffset - 88,
            behavior: reduceMotion ? 'auto' : 'smooth'
          });
        }
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        required.forEach(function (r) { mark(r.id, false); });
        if (errorBox) errorBox.hidden = true;
        if (success) success.hidden = true;
        form.hidden = false;
        var nameEl = field('name');
        if (nameEl) nameEl.focus();
      });
    }

    form.addEventListener('input', function (ev) {
      var el = ev.target;
      if (el && el.getAttribute('aria-invalid') === 'true' && String(el.value || '').trim()) {
        el.setAttribute('aria-invalid', 'false');
      }
    });
    form.addEventListener('change', function (ev) {
      var el = ev.target;
      if (el && el.getAttribute('aria-invalid') === 'true' && String(el.value || '').trim()) {
        el.setAttribute('aria-invalid', 'false');
      }
    });
  }

  /* ---------------------------------------------- current year */
  function initYear() {
    var slots = document.querySelectorAll('[data-year]');
    for (var i = 0; i < slots.length; i++) {
      slots[i].textContent = String(new Date().getFullYear());
    }
  }

  function boot() {
    initReveal();
    initDrawer();
    initTransitions();
    initFilters();
    initForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
