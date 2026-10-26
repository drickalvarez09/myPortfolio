(function(){
  var nav = document.getElementById('siteNav');
  var progress = document.getElementById('scrollProgress');
  var toggle = document.getElementById('navToggle');
  var toggleIcon = document.getElementById('navToggleIcon');
  var panel = document.getElementById('mobilePanel');
  var navLinks = document.querySelectorAll('.nav-links a, .mobile-panel a[href^="#"]');
  var sections = document.querySelectorAll('main section[id]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1200;
    var start = null;
    function tick(now){
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function onScroll(){
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-scrolled', y > 12);

    var docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = docH > 0 ? (y / docH * 100) + '%' : '0%';
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menuIconOpen = '<path d="M6 6l12 12M18 6 6 18"/>';
  var menuIconClosed = '<path d="M4 7h16M4 12h16M4 17h16"/>';

  function setMenu(open, restoreFocus){
    panel.classList.toggle('is-open', open);
    nav.classList.toggle('menu-open', open);
    toggle.classList.toggle('is-active', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggleIcon.innerHTML = open ? menuIconOpen : menuIconClosed;
    if (!open && restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', function(){
    setMenu(!panel.classList.contains('is-open'));
  });

  document.querySelectorAll('.mobile-panel a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false); });
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && panel.classList.contains('is-open')) setMenu(false, true);
  });

  document.addEventListener('click', function(e){
    if (!panel.classList.contains('is-open')) return;
    if (panel.contains(e.target) || toggle.contains(e.target)) return;
    setMenu(false);
  });

  window.addEventListener('resize', function(){
    if (window.innerWidth > 900 && panel.classList.contains('is-open')) setMenu(false);
  });

  if ('IntersectionObserver' in window){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.getAttribute('id');
        var link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting){
          document.querySelectorAll('.nav-links a').forEach(function(l){
            l.classList.remove('is-active');
            l.removeAttribute('aria-current');
          });
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function(s){ spy.observe(s); });

    var reveal = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el){ reveal.observe(el); });

    var counters = document.querySelectorAll('.stat-num[data-count]');
    if (reduceMotion){
      counters.forEach(function(el){
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
      });
    } else {
      var counterObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function(el){ counterObserver.observe(el); });
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); });
    document.querySelectorAll('.stat-num[data-count]').forEach(function(el){
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function(openItem){
        openItem.classList.remove('is-open');
        var q = openItem.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
        var a = openItem.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0px';
      });
      if (!wasOpen){
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        var answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Service card glass glare
  if (!reduceMotion){
    document.querySelectorAll('.service-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  document.querySelectorAll('.shot-img').forEach(function(img){
    function markLoaded(){
      var shot = img.closest('.project-shot');
      if (shot) shot.classList.add('has-shot');
    }
    if (img.complete && img.naturalWidth > 0) markLoaded();
    img.addEventListener('load', markLoaded);
    img.addEventListener('error', function(){ img.remove(); });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  var wheelViewport = document.getElementById('langWheel');
  var wheelTrack = document.getElementById('wheelTrack');
  if (wheelViewport && wheelTrack){
    var wheelItems = Array.prototype.slice.call(wheelTrack.children);
    var wheelUp = document.getElementById('wheelUp');
    var wheelDown = document.getElementById('wheelDown');
    var itemHeight = 76;
    var current = 0;
    var lastIndex = wheelItems.length - 1;

    function renderWheel(){
      var offset = (wheelViewport.clientHeight / 2) - (itemHeight / 2) - (current * itemHeight);
      wheelTrack.style.transform = 'translateY(' + offset + 'px)';

      wheelItems.forEach(function(item, i){
        item.id = 'wheelOpt' + i;
        var d = i - current;
        var ad = Math.min(Math.abs(d), 4);
        var scale = 1 - ad * 0.13;
        var opacity = 1 - ad * 0.25;
        item.style.transform = 'rotateX(' + (d * -12) + 'deg) scale(' + scale + ')';
        item.style.opacity = Math.max(opacity, 0.1);
        item.classList.toggle('is-active', d === 0);
        item.setAttribute('aria-selected', d === 0 ? 'true' : 'false');
      });
      wheelViewport.setAttribute('aria-activedescendant', 'wheelOpt' + current);

      wheelUp.classList.toggle('is-disabled', current === 0);
      wheelDown.classList.toggle('is-disabled', current === lastIndex);
    }

    function goWheel(dir){
      current = Math.min(lastIndex, Math.max(0, current + dir));
      renderWheel();
    }

    wheelUp.addEventListener('click', function(){ goWheel(-1); });
    wheelDown.addEventListener('click', function(){ goWheel(1); });

    var wheelAccum = 0;
    var wheelResetTimer = null;
    wheelViewport.addEventListener('wheel', function(e){
      var dy = e.deltaY;
      if (!dy) return;

      // At either end, let the page scroll normally instead of trapping it.
      if ((current === 0 && dy < 0) || (current === lastIndex && dy > 0)){
        wheelAccum = 0;
        return;
      }

      e.preventDefault();
      wheelAccum += dy;
      clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(function(){ wheelAccum = 0; }, 200);
      if (Math.abs(wheelAccum) > 45){
        goWheel(wheelAccum > 0 ? 1 : -1);
        wheelAccum = 0;
      }
    }, { passive: false });

    wheelViewport.addEventListener('keydown', function(e){
      if (e.key === 'ArrowUp'){ e.preventDefault(); goWheel(-1); }
      if (e.key === 'ArrowDown'){ e.preventDefault(); goWheel(1); }
    });

    var touchStartY = null;
    wheelViewport.addEventListener('touchstart', function(e){
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    wheelViewport.addEventListener('touchend', function(e){
      if (touchStartY === null) return;
      var dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 30) goWheel(dy > 0 ? 1 : -1);
      touchStartY = null;
    });

    renderWheel();
    window.addEventListener('resize', renderWheel);
  }

  var canvas = document.getElementById('particleCanvas');
  if (canvas && canvas.getContext){
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width, height, particles;
    var pointer = { x: null, y: null, active: false };
    var linkDist = 130;
    var pointerDist = 160;

    function sizeCanvas(){
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticles(){
      var count = Math.round((width * height) / 15000);
      count = Math.max(30, Math.min(count, 110));
      particles = [];
      for (var i = 0; i < count; i++){
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    function step(){
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++){
        var p = particles[i];
        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.35){
          p.vx *= 0.96;
          p.vy *= 0.96;
        }
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (pointer.active){
          var dx = p.x - pointer.x;
          var dy = p.y - pointer.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < pointerDist && d > 0.01){
            var force = (pointerDist - d) / pointerDist * 0.035;
            p.x += (dx / d) * force * 10;
            p.y += (dy / d) * force * 10;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 179, 255, 0.55)';
        ctx.fill();
      }

      for (var a = 0; a < particles.length; a++){
        for (var b = a + 1; b < particles.length; b++){
          var pa = particles[a], pb = particles[b];
          var ddx = pa.x - pb.x;
          var ddy = pa.y - pb.y;
          var dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < linkDist){
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = 'rgba(111, 162, 255, ' + ((1 - dist / linkDist) * 0.22) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (pointer.active){
        for (var pi = 0; pi < particles.length; pi++){
          var pp = particles[pi];
          var pdx = pp.x - pointer.x;
          var pdy = pp.y - pointer.y;
          var pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist < pointerDist){
            ctx.beginPath();
            ctx.moveTo(pp.x, pp.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = 'rgba(111, 162, 255, ' + ((1 - pdist / pointerDist) * 0.32) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 220, 255, 0.85)';
        ctx.fill();
      }

    }

    var baseCount = 0;
    var maxParticles = 0;

    function spawnBurst(x, y){
      var n = 6;
      for (var i = 0; i < n; i++){
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 0.9 + 0.3;
        particles.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 1.6 + 0.8
        });
      }
      if (particles.length > maxParticles){
        particles.splice(0, particles.length - maxParticles);
      }
    }

    var rafId = null;
    function loop(){
      step();
      rafId = requestAnimationFrame(loop);
    }
    function start(){
      if (reduceMotion || rafId !== null || document.hidden) return;
      rafId = requestAnimationFrame(loop);
    }
    function stop(){
      if (rafId !== null){ cancelAnimationFrame(rafId); rafId = null; }
    }

    sizeCanvas();
    makeParticles();
    baseCount = particles.length;
    maxParticles = baseCount + 60;
    if (reduceMotion) step(); else start();

    document.addEventListener('visibilitychange', function(){
      if (document.hidden) stop(); else start();
    });

    if (!reduceMotion){
      document.addEventListener('pointerdown', function(e){
        spawnBurst(e.clientX, e.clientY);
      }, { passive: true });
    }

    window.addEventListener('resize', function(){
      sizeCanvas();
      makeParticles();
      if (reduceMotion) step();
    });

    if (window.matchMedia('(pointer: fine)').matches){
      window.addEventListener('pointermove', function(e){
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      }, { passive: true });
      window.addEventListener('pointerleave', function(){
        pointer.active = false;
      });
    }
  }

  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion){
    document.querySelectorAll('.project-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--mx', ((px + 0.5) * 100) + '%');
        card.style.setProperty('--my', ((py + 0.5) * 100) + '%');
        card.style.transform = 'perspective(800px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 7) + 'deg) translateY(-5px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });

    document.querySelectorAll('.btn.magnetic').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.12) + 'px, ' + (y * 0.18) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){
        btn.style.transform = '';
      });
    });
  }

  // Keep an open FAQ answer sized correctly when the layout reflows.
  window.addEventListener('resize', function(){
    document.querySelectorAll('.faq-item.is-open .faq-answer').forEach(function(a){
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  document.querySelectorAll('.btn').forEach(function(btn){
    btn.addEventListener('pointerdown', function(e){
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function(){ ripple.remove(); });
    });
  });

  // Signals to the inline failsafe in index.html that setup completed.
  window.__pfReady = true;
})();
