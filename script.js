/**
 * Portfólio Heloisa Oliveira Martinho
 * Script principal: Cursor fluido oceânico e correntes luminosas no canvas
 * JavaScript puro (sem dependências ou frameworks)
 */

(function () {
  'use strict';

  /* ==========================================================
     1. CURSOR PERSONALIZADO (REFERÊNCIA: ESTHER WONG EM AZUL OCEÂNICO)
     ========================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  // Posições reais do mouse e posições interpoladas para fluidez (lerp)
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isPointerActive = false;

  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  if (cursorDot && cursorRing && !isTouchDevice()) {
    // Rastreia coordenadas do mouse
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isPointerActive) {
        isPointerActive = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }

      // O ponto central acompanha instantaneamente
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Animação contínua do anel externo com interpolação linear (suavidade)
    function animateCursor() {
      // Lerp (interpolação): aproxima o anel suavemente do ponto do mouse
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Efeito de ampliação e brilho ao passar por elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, .btn-cta, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('cursor-active');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('cursor-active');
      });
    });

    // Ocultar quando o cursor sai da janela
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isPointerActive = false;
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      isPointerActive = true;
    });
  }

  /* ==========================================================
     2. CANVAS DE CORRENTES LUMINOSAS OCEÂNICAS (REFERÊNCIA: IMG1)
     ========================================================== */
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Configuração das linhas luminosas e partículas
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Linhas luminosas fluidas simulando correntes marítimas (como na img1)
  const lines = [
    { yBase: 0.38, amp: 45, freq: 0.002, speed: 0.008, color: 'rgba(0, 229, 255, 0.45)', width: 2.2 },
    { yBase: 0.42, amp: 65, freq: 0.0016, speed: 0.006, color: 'rgba(56, 189, 248, 0.35)', width: 1.8 },
    { yBase: 0.48, amp: 55, freq: 0.0024, speed: 0.010, color: 'rgba(0, 229, 255, 0.25)', width: 1.5 },
    { yBase: 0.52, amp: 75, freq: 0.0014, speed: 0.005, color: 'rgba(2, 132, 199, 0.22)', width: 2.8 },
    { yBase: 0.58, amp: 40, freq: 0.0028, speed: 0.012, color: 'rgba(125, 211, 252, 0.3)', width: 1.2 }
  ];

  // Partículas bioluminescentes sutis
  const particleCount = 45;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    });
  }

  let time = 0;

  function renderOcean() {
    ctx.clearRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      time += 1;
    }

    // Desenha linhas luminosas da corrente marítima
    lines.forEach((line) => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(0, 229, 255, 0.6)';

      const baseY = height * line.yBase;
      const step = 8;

      for (let x = 0; x <= width + step; x += step) {
        const y = baseY + Math.sin(x * line.freq + time * line.speed) * line.amp +
                         Math.cos(x * 0.001 + time * (line.speed * 0.7)) * (line.amp * 0.3);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    // Restaura sombra para partículas
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';

    // Desenha partículas bioluminescentes
    particles.forEach((p) => {
      if (!prefersReducedMotion) {
        p.y -= p.speedY;
        p.x += p.speedX;

        // Se sair do topo, recria na base
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      }

      const alpha = p.opacity + Math.sin(time * p.pulseSpeed) * 0.2;
      ctx.fillStyle = `rgba(0, 229, 255, ${Math.max(0.05, Math.min(1, alpha))})`;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(renderOcean);
  }

  renderOcean();
})();
