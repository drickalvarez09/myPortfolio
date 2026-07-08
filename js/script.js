(function(){
  var nav = document.getElementById('siteNav');
  var progress = document.getElementById('scrollProgress');
  var toggle = document.getElementById('navToggle');
  var toggleIcon = document.getElementById('navToggleIcon');
  var panel = document.getElementById('mobilePanel');
  var navLinks = document.querySelectorAll('.nav-links a, .mobile-panel a[href^="#"]');
  var sections = document.querySelectorAll('main section[id]');

  function onScroll(){
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-scrolled', y > 12);

    var docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = docH > 0 ? (y / docH * 100) + '%' : '0%';
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', function(){
    var open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggleIcon.innerHTML = open
      ? '<path d="M6 6l12 12M18 6 6 18"/>'
      : '<path d="M4 7h16M4 12h16M4 17h16"/>';
  });

  document.querySelectorAll('.mobile-panel a').forEach(function(a){
    a.addEventListener('click', function(){
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggleIcon.innerHTML = '<path d="M4 7h16M4 12h16M4 17h16"/>';
    });
  });

  if ('IntersectionObserver' in window){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.getAttribute('id');
        var link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting){
          document.querySelectorAll('.nav-links a').forEach(function(l){ l.classList.remove('is-active'); });
          link.classList.add('is-active');
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
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); });
  }

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
        var d = i - current;
        var ad = Math.min(Math.abs(d), 4);
        var scale = 1 - ad * 0.13;
        var opacity = 1 - ad * 0.25;
        item.style.transform = 'rotateX(' + (d * -12) + 'deg) scale(' + scale + ')';
        item.style.opacity = Math.max(opacity, 0.1);
        item.classList.toggle('is-active', d === 0);
        item.setAttribute('aria-selected', d === 0 ? 'true' : 'false');
      });

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
      e.preventDefault();
      wheelAccum += e.deltaY;
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
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

      if (!reduceMotion) requestAnimationFrame(step);
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

    sizeCanvas();
    makeParticles();
    baseCount = particles.length;
    maxParticles = baseCount + 60;
    step();

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

  if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('.project-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 7) + 'deg) translateY(-5px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

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
})();