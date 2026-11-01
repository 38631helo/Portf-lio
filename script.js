/**
 * Portfólio Heloisa Oliveira Martinho - Técnica em Tecnologia da Informação
 * Identidade: Universo Oceânico, Fundo do Mar e Experiência Interativa
 * Script Principal: JavaScript Puro (sem dependências ou frameworks)
 *
 * Funcionalidades:
 *  1. Cursor fluido oceânico com rastro luminoso (Referência: Esther Wong)
 *  2. Canvas oceânico avançado: bolhas subindo, correntes de luz e cardume de peixes reagindo ao mouse
 *  3. Efeito interativo de cliques gerando estouro de bolhas submarinas
 *  4. Portal oceânico e jornada de animais marinhos no scroll (Referência: aengel.io)
 *  5. Módulo abissal expansivo com alternância de zonas oceânicas e tilt 3D (Referência: img2)
 *  6. Menu de navegação fixo, menu mobile e scrollspy sem a seção de projetos
 *  7. Modo Superfície vs Modo Abissal (Claro / Escuro) com persistência em localStorage
 *  8. Animações suaves ao rolar a página (IntersectionObserver)
 *  9. Validação completa do formulário de contato com feedback visual
 */

(function () {
  'use strict';

  /* ==========================================================
     1. CURSOR PERSONALIZADO (REFERÊNCIA: ESTHER WONG EM AZUL OCEÂNICO)
     ========================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isPointerActive = false;

  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  if (cursorDot && cursorRing && !isTouchDevice()) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isPointerActive) {
        isPointerActive = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Efeito magnético e expansão do anel em elementos clicáveis
    function updateInteractiveCursor() {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, .btn-cta, .abyss-cube, [role="button"]'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursorRing.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.classList.remove('cursor-active');
        });
      });
    }
    updateInteractiveCursor();

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
     2. CANVAS OCEÂNICO AVANÇADO: BOLHAS, CORRENTES E PEIXES REATIVOS
     ========================================================== */
  const canvas = document.getElementById('oceanCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Linhas de correntes marítimas suaves (Referência img1)
    const currentLines = [
      { yBase: 0.32, amp: 40, freq: 0.002, speed: 0.008, color: 'rgba(0, 240, 255, 0.4)', width: 2.2 },
      { yBase: 0.46, amp: 55, freq: 0.0016, speed: 0.006, color: 'rgba(45, 212, 191, 0.35)', width: 2.0 },
      { yBase: 0.58, amp: 50, freq: 0.0022, speed: 0.010, color: 'rgba(56, 189, 248, 0.28)', width: 1.6 },
      { yBase: 0.72, amp: 65, freq: 0.0014, speed: 0.005, color: 'rgba(2, 132, 199, 0.22)', width: 2.5 }
    ];

    // Bolhas submarinas com oscilação orgânica
    const bubbleCount = 42;
    const bubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4.5 + 1.2,
        speedY: Math.random() * 0.7 + 0.3,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        wobbleAmp: Math.random() * 1.5 + 0.5,
        wobbleOffset: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.5 + 0.25
      });
    }

    // Bolhas interativas geradas pelo usuário (ao clicar ou mover)
    const dynamicBubbles = [];

    function spawnBubbleBurst(x, y, count = 8) {
      for (let i = 0; i < count; i++) {
        dynamicBubbles.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 20,
          radius: Math.random() * 5 + 2,
          speedY: Math.random() * 1.8 + 0.8,
          speedX: (Math.random() - 0.5) * 1.4,
          wobbleOffset: Math.random() * Math.PI * 2,
          alpha: 0.85
        });
      }
    }

    // Evento de clique para explodir bolhas marinhas
    window.addEventListener('click', (e) => {
      spawnBubbleBurst(e.clientX, e.clientY, 10);
    });

    // Cardume de pequenos peixes marinhos luminosos
    const fishCount = 14;
    const schoolOfFish = [];
    for (let i = 0; i < fishCount; i++) {
      schoolOfFish.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.8) + height * 0.1,
        length: Math.random() * 10 + 12,
        speed: Math.random() * 0.8 + 0.6,
        color: i % 2 === 0 ? 'rgba(0, 240, 255, 0.75)' : 'rgba(94, 234, 212, 0.75)',
        angle: 0,
        wigglePhase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    function renderOceanWorld() {
      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        time += 1;
      }

      // 1. Renderiza correntes marítimas fluidas
      currentLines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.55)';

        const baseY = height * line.yBase;
        const step = 10;

        for (let x = 0; x <= width + step; x += step) {
          const y =
            baseY +
            Math.sin(x * line.freq + time * line.speed) * line.amp +
            Math.cos(x * 0.0012 + time * (line.speed * 0.7)) * (line.amp * 0.35);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // 2. Renderiza bolhas submarinas naturais
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(94, 234, 212, 0.7)';

      bubbles.forEach((b) => {
        if (!prefersReducedMotion) {
          b.y -= b.speedY;
          b.x += Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * (b.wobbleAmp * 0.4);

          // Ao atingir a superfície, renasce nas profundezas
          if (b.y < -20) {
            b.y = height + 20;
            b.x = Math.random() * width;
          }
        }

        // Desenha a bolha esférica com reflexo de água
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 240, 255, ${b.alpha * 0.25})`;
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(224, 247, 250, ${b.alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ponto de brilho de luz na bolha
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.9})`;
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Renderiza bolhas dinâmicas criadas por cliques
      for (let i = dynamicBubbles.length - 1; i >= 0; i--) {
        const db = dynamicBubbles[i];
        db.y -= db.speedY;
        db.x += db.speedX;
        db.alpha -= 0.008;

        if (db.alpha <= 0 || db.y < -10) {
          dynamicBubbles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(45, 212, 191, ${db.alpha * 0.3})`;
        ctx.arc(db.x, db.y, db.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${db.alpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 4. Renderiza cardume de peixinhos que reagem ao mouse
      schoolOfFish.forEach((fish) => {
        if (!prefersReducedMotion) {
          // Desvio se o mouse estiver próximo
          const dx = fish.x - mouseX;
          const dy = fish.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110 && isPointerActive) {
            // Peixe se assusta e desvia acelerando
            fish.x += (dx / dist) * 2.8;
            fish.y += (dy / dist) * 1.8;
          } else {
            // Nado constante para a direita com leve ondulação
            fish.x += fish.speed;
            fish.y += Math.sin(time * 0.03 + fish.wigglePhase) * 0.45;
          }

          // Retorna pela esquerda ao cruzar a tela
          if (fish.x > width + 40) {
            fish.x = -40;
            fish.y = Math.random() * (height * 0.8) + height * 0.1;
          }
        }

        // Desenha a silhueta hidrodinâmica do peixinho
        ctx.save();
        ctx.translate(fish.x, fish.y);
        ctx.fillStyle = fish.color;
        ctx.strokeStyle = '#e0f7fa';
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        // Corpo do peixe em forma de gota
        ctx.moveTo(fish.length, 0);
        ctx.quadraticCurveTo(fish.length * 0.3, -fish.length * 0.35, 0, 0);
        ctx.lineTo(-fish.length * 0.3, -fish.length * 0.25);
        ctx.lineTo(-fish.length * 0.15, 0);
        ctx.lineTo(-fish.length * 0.3, fish.length * 0.25);
        ctx.lineTo(0, 0);
        ctx.quadraticCurveTo(fish.length * 0.3, fish.length * 0.35, fish.length, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });

      requestAnimationFrame(renderOceanWorld);
    }

    renderOceanWorld();
  }

  /* ==========================================================
     3. PORTAL OCEÂNICO & JORNADA DA BALEIA NO SCROLL
     ========================================================== */
  const heroPortal = document.getElementById('heroPortal');
  const whaleContainer = document.getElementById('whaleContainer');
  const turtleContainer = document.getElementById('turtleContainer');
  const dolphinContainer = document.getElementById('dolphinContainer');
  const depthProgressBar = document.getElementById('depthProgressBar');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;

    // Atualiza a barra de profundidade marítima
    if (depthProgressBar) {
      depthProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent * 100))}%`;
    }

    // Abertura do portal ao submergir (Referência aengel.io)
    if (heroPortal) {
      const scaleVal = 1 + scrollY * 0.002;
      const rotateVal = scrollY * 0.09;
      const opacityVal = Math.max(0, 1 - scrollY * 0.0016);
      heroPortal.style.transform = `translate(-50%, -50%) scale(${scaleVal}) rotate(${rotateVal}deg)`;
      heroPortal.style.opacity = `${opacityVal}`;
    }

    // Passagem suave da baleia ao longo da navegação da página
    if (whaleContainer) {
      const windowWidth = window.innerWidth;
      const travelX = -240 + scrollPercent * (windowWidth + 480);
      const waveY = Math.sin(scrollPercent * Math.PI * 4) * 45;
      whaleContainer.style.transform = `translate3d(${travelX}px, ${waveY}px, 0)`;
    }

    // Parallax suave da tartaruga e do golfinho
    if (turtleContainer) {
      const turtleY = scrollY * 0.15;
      turtleContainer.style.transform = `translateY(${turtleY}px)`;
    }

    if (dolphinContainer) {
      const dolphinY = scrollY * -0.12;
      dolphinContainer.style.transform = `translateY(${dolphinY}px)`;
    }
  });

  /* ==========================================================
     4. MÓDULO INTERATIVO EXPANSIVO (REFERÊNCIA: IMG2 / aengel.io)
     ========================================================== */
  const abyssCube = document.getElementById('abyssCube');
  const cubeGlow = document.getElementById('cubeGlow');
  const cubeDepth = document.getElementById('cubeDepth');
  const cubeCoord = document.getElementById('cubeCoord');

  if (abyssCube) {
    const oceanZones = [
      { depth: '120M // SUPERFICIAL', coord: "COORD: 23°32'S 46°38'W" },
      { depth: '450M // MESOPELÁGICA', coord: "COORD: 00°15'N 30°20'W" },
      { depth: '850M // ZONA BATIAL', coord: "COORD: 18°25'S 12°10'W" },
      { depth: '2400M // ZONA ABISSAL', coord: "COORD: 34°40'S 52°18'W" },
      { depth: '6200M // FOSSA HADAL', coord: "COORD: 11°21'N 142°12'E" }
    ];
    let zoneIndex = 0;

    // Efeito de movimento 3D ao passar o mouse
    abyssCube.addEventListener('mousemove', (e) => {
      const rect = abyssCube.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * -15;
      const tiltY = (x / rect.width) * 15;

      abyssCube.style.transform = `scale(1.03) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;

      if (cubeGlow) {
        const glowX = ((e.clientX - rect.left) / rect.width) * 100;
        const glowY = ((e.clientY - rect.top) / rect.height) * 100;
        cubeGlow.style.left = `${glowX}%`;
        cubeGlow.style.top = `${glowY}%`;
      }
    });

    abyssCube.addEventListener('mouseleave', () => {
      abyssCube.style.transform = '';
      if (cubeGlow) {
        cubeGlow.style.left = '50%';
        cubeGlow.style.top = '50%';
      }
    });

    // Ao clicar, modula a profundidade oceânica e pulsa as frequências de cor
    abyssCube.addEventListener('click', () => {
      zoneIndex = (zoneIndex + 1) % oceanZones.length;
      if (cubeDepth) {
        cubeDepth.textContent = `PROFUNDIDADE: ${oceanZones[zoneIndex].depth}`;
      }
      if (cubeCoord) {
        cubeCoord.textContent = oceanZones[zoneIndex].coord;
      }
      abyssCube.classList.toggle('is-expanded');
    });
  }

  /* ==========================================================
     5. MENU FIXO, MENU MOBILE & SCROLLSPY (SEM PROJETOS)
     ========================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle do menu hambúrguer no celular
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('is-open');
      navMenu.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fecha menu mobile ao clicar em qualquer link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is-open');
        navMenu.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scrollspy para destacar o link ativo no menu (Início, Sobre Mim, Imersão, Contato)
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  /* ==========================================================
     6. MODO SUPERFÍCIE VS MODO ABISSAL (COM LOCALSTORAGE)
     ========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');

  function applyTheme(isLight) {
    if (isLight) {
      document.body.classList.add('light-theme');
      if (themeLabel) themeLabel.textContent = 'Modo Abissal';
      localStorage.setItem('heloisa-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      if (themeLabel) themeLabel.textContent = 'Modo Superfície';
      localStorage.setItem('heloisa-theme', 'dark');
    }
  }

  // Carrega preferência persistida ou padrão escuro (fundo do mar abissal)
  const savedTheme = localStorage.getItem('heloisa-theme');
  if (savedTheme === 'light') {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isCurrentlyLight = document.body.classList.contains('light-theme');
      applyTheme(!isCurrentlyLight);
    });
  }

  /* ==========================================================
     7. ANIMAÇÕES SUAVES AO ROLAR A PÁGINA (INTERSECTION OBSERVER)
     ========================================================== */
  const revealElements = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback gracioso para navegadores antigos
    revealElements.forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  /* ==========================================================
     8. VALIDAÇÃO ROBUSTA DO FORMULÁRIO DE CONTATO (JS PURO)
     ========================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const successAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(input, condition) {
      const formGroup = input.closest('.form-group');
      if (!condition) {
        formGroup.classList.add('has-error');
        return false;
      } else {
        formGroup.classList.remove('has-error');
        return true;
      }
    }

    // Limpa alertas de erro ao digitar nos campos
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup) formGroup.classList.remove('has-error');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length > 1);
      const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length > 1);
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Exibe feedback positivo de sucesso com animação
        if (successAlert) {
          successAlert.classList.add('is-shown');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reseta o formulário
        contactForm.reset();

        // Oculta a mensagem de sucesso automaticamente após 7 segundos
        setTimeout(() => {
          if (successAlert) {
            successAlert.classList.remove('is-shown');
          }
        }, 7000);
      }
    });
  }
})();
