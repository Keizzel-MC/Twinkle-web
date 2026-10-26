'use strict';

/**
 * Twinkle — Modern Interactive Experience
 * Includes:
 * - Web Audio API Synthesizer (ultra-soft, subtle UI sound design)
 * - Canvas Particle & Constellation Twinkle System (with click spark bursts)
 * - Interactive Hero Showcase Dashboard (tabs, live metrics, streaming console & command prompt, files, settings)
 * - 3D Mouse Parallax & Dynamic Light Reflection
 * - Card Spotlight Cursor Glow
 * - Interactive Copy-to-Clipboard
 * - Scroll Reveal & Floating Back-to-Top
 * - Sound Toggle Controls
 * - Accessible Navigation & Contact Form
 */

(() => {
  // ----------------------------------------------------
  // 1. Web Audio API Synthesizer (TwinkleAudio)
  // ----------------------------------------------------
  class TwinkleAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.lastHoverTime = 0;
      this.hoverMinInterval = 65; // ms limit between hover pops

      // Load sound preference from localStorage
      try {
        const stored = localStorage.getItem('twinkle_sound_enabled');
        if (stored !== null) {
          this.enabled = stored === 'true';
        }
      } catch (e) {
        this.enabled = true;
      }
    }

    init() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      try {
        localStorage.setItem('twinkle_sound_enabled', String(this.enabled));
      } catch (e) {}

      if (this.enabled) {
        this.init();
        this.playChime();
      }
      return this.enabled;
    }

    // Soft, delicate warm sine pop for hovers
    playHover() {
      if (!this.enabled) return;
      const now = Date.now();
      if (now - this.lastHoverTime < this.hoverMinInterval) return;
      this.lastHoverTime = now;

      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;

      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(700, t + 0.038);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.022, t + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.048);
        osc.onended = () => {
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
        };
      } catch (e) {}
    }

    // Soft tactile UI click (Minecraft / mechanical inspired)
    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;

      try {
        const t = this.ctx.currentTime;

        // Low body pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.032);

        gain.gain.setValueAtTime(0.045, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.038);

        // High subtle tick
        const tick = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tick.type = 'triangle';
        tick.frequency.setValueAtTime(1400, t);
        tick.frequency.exponentialRampToValueAtTime(600, t + 0.015);

        tickGain.gain.setValueAtTime(0.02, t);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);

        tick.connect(tickGain);
        tickGain.connect(this.ctx.destination);
        tick.start(t);
        tick.stop(t + 0.018);

        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
          tick.disconnect();
          tickGain.disconnect();
        };
      } catch (e) {}
    }

    // Celestial twinkle chime (pentatonic sparkle chord)
    playChime() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;

      try {
        const t = this.ctx.currentTime;
        const freqs = [1046.5, 1318.5, 1567.98]; // C6, E6, G6
        freqs.forEach((freq, idx) => {
          const startTime = t + (idx * 0.03);
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.exponentialRampToValueAtTime(0.025, startTime + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.34);
          osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
          };
        });
      } catch (e) {}
    }

    // Soft smooth tab switch sweep
    playTab() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;

      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, t);
        osc.frequency.exponentialRampToValueAtTime(560, t + 0.065);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.032, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      } catch (e) {}
    }

    // Soft mechanical terminal keystroke
    playKey() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;

      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(640, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.018);

        gain.gain.setValueAtTime(0.018, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.022);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      } catch (e) {}
    }

    // Command executed feedback
    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;

      try {
        const t = this.ctx.currentTime;
        const freqs = [783.99, 1046.5]; // G5, C6
        freqs.forEach((freq, idx) => {
          const st = t + (idx * 0.06);
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0.0001, st);
          gain.gain.exponentialRampToValueAtTime(0.035, st + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(st);
          osc.stop(st + 0.24);
          osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
          };
        });
      } catch (e) {}
    }
  }

  const audio = new TwinkleAudio();

  // Resume audio context on first user interaction anywhere
  const unlockAudio = () => {
    audio.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });

  // ----------------------------------------------------
  // 2. Canvas Particles & Constellation Engine (TwinkleParticles)
  // ----------------------------------------------------
  class TwinkleParticles {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.sparkles = [];
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.mouse = { x: -9999, y: -9999, active: false };
      this.animId = null;
      this.paused = false;

      // Check prefers-reduced-motion
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });

      const count = window.innerWidth < 768 ? 36 : 65;
      const palette = [
        'rgba(104, 230, 244, ', // Cyan
        'rgba(134, 182, 255, ', // Blue
        'rgba(203, 165, 255, ', // Violet
        'rgba(129, 244, 236, ', // Aquamarine
        'rgba(255, 255, 255, '  // Starlight White
      ];

      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseRadius: Math.random() * 1.6 + 0.8,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: Math.random() * 0.025 + 0.015,
          colorPrefix: palette[Math.floor(Math.random() * palette.length)],
          isSparkle: Math.random() > 0.65 // Some are 4-point diamond stars
        });
      }

      // Mouse tracking
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.active = true;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.mouse.active = false;
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      }, { passive: true });

      // Click sparkle burst
      window.addEventListener('pointerdown', (e) => {
        this.spawnSparkleBurst(e.clientX, e.clientY);
      }, { passive: true });

      // Tab visibility pause
      document.addEventListener('visibilitychange', () => {
        this.paused = document.hidden;
        if (!this.paused && !this.animId) {
          this.render();
        }
      });

      if (!this.reducedMotion) {
        this.render();
      }
    }

    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    spawnSparkleBurst(x, y) {
      if (this.reducedMotion) return;
      const count = 14;
      const palette = [
        'rgba(104, 230, 244, ',
        'rgba(134, 182, 255, ',
        'rgba(203, 165, 255, ',
        'rgba(255, 255, 255, '
      ];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.8 + 1.2;
        this.sparkles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          life: 1.0,
          decay: Math.random() * 0.03 + 0.02,
          radius: Math.random() * 2.2 + 1.2,
          colorPrefix: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    }

    drawDiamond(ctx, x, y, size, alpha, colorPrefix) {
      ctx.save();
      ctx.fillStyle = colorPrefix + alpha + ')';
      ctx.beginPath();
      ctx.moveTo(x, y - size * 2.2);
      ctx.lineTo(x + size * 0.6, y);
      ctx.lineTo(x, y + size * 2.2);
      ctx.lineTo(x - size * 0.6, y);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x - size * 2.2, y);
      ctx.lineTo(x, y + size * 0.6);
      ctx.lineTo(x + size * 2.2, y);
      ctx.lineTo(x, y - size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    render() {
      if (this.paused) {
        this.animId = null;
        return;
      }

      this.ctx.clearRect(0, 0, this.width, this.height);

      // Render sparkles from click bursts
      for (let i = this.sparkles.length - 1; i >= 0; i--) {
        const s = this.sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.life -= s.decay;

        if (s.life <= 0) {
          this.sparkles.splice(i, 1);
          continue;
        }

        const a = Math.max(0, s.life);
        this.ctx.fillStyle = s.colorPrefix + a + ')';
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius * a, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Render particles & constellation lines
      const pLen = this.particles.length;
      for (let i = 0; i < pLen; i++) {
        const p = this.particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.phaseSpeed;

        // Wrap around bounds
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
        if (p.y < -10) p.y = this.height + 10;
        if (p.y > this.height + 10) p.y = -10;

        // Pulsing alpha
        const pulse = (Math.sin(p.phase) + 1) * 0.5; // 0..1
        let alpha = 0.25 + pulse * 0.55;
        let radius = p.baseRadius * (0.85 + pulse * 0.3);

        // Mouse proximity interaction
        if (this.mouse.active) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const factor = (130 - dist) / 130;
            alpha = Math.min(1.0, alpha + factor * 0.4);
            radius += factor * 0.8;
            // Draw faint interactive line to cursor
            this.ctx.strokeStyle = `rgba(104, 230, 244, ${factor * 0.22})`;
            this.ctx.lineWidth = 0.75;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
          }
        }

        // Connect nearby particles with gentle constellation threads
        for (let j = i + 1; j < pLen; j++) {
          const p2 = this.particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cDist < 85) {
            const lineAlpha = (1 - cDist / 85) * 0.14 * alpha;
            this.ctx.strokeStyle = `rgba(134, 182, 255, ${lineAlpha})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }

        // Draw particle
        if (p.isSparkle && pulse > 0.4) {
          this.drawDiamond(this.ctx, p.x, p.y, radius, alpha, p.colorPrefix);
        } else {
          this.ctx.fillStyle = p.colorPrefix + alpha + ')';
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.animId = requestAnimationFrame(() => this.render());
    }
  }

  // ----------------------------------------------------
  // 3. Interactive Hero Dashboard (TwinkleDashboard)
  // ----------------------------------------------------
  class TwinkleDashboard {
    constructor() {
      this.dash = document.querySelector('.dashboard');
      if (!this.dash) return;

      this.tabs = document.querySelectorAll('[data-dash-tab]');
      this.views = document.querySelectorAll('[data-dash-view]');
      this.visualWrapper = document.querySelector('.hero-visual');

      // Console elements
      this.cmdInput = document.querySelector('[data-dash-input]');
      this.cmdSend = document.querySelector('[data-dash-send]');
      this.consoleTerm = document.querySelector('[data-dash-console]');
      this.cmdChips = document.querySelectorAll('[data-cmd-chip]');

      // Metrics elements for live oscillation
      this.ramText = document.querySelector('[data-metric-ram]');
      this.ramFill = document.querySelector('[data-metric-ram-bar]');
      this.cpuText = document.querySelector('[data-metric-cpu]');

      this.currentTab = 'panel';
      this.streamInterval = null;

      this.init();
    }

    init() {
      // Tab switching
      this.tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-dash-tab');
          if (target && target !== this.currentTab) {
            this.switchTab(target);
          }
        });
        tab.addEventListener('mouseenter', () => audio.playHover());
      });

      // Quick action buttons in panel view
      const actionButtons = document.querySelectorAll('[data-dash-action]');
      actionButtons.forEach((btn) => {
        btn.addEventListener('mouseenter', () => audio.playHover());
        btn.addEventListener('click', () => {
          const act = btn.getAttribute('data-dash-action');
          this.handleAction(act, btn);
        });
      });

      // Console Command Input & Chips
      if (this.cmdInput && this.cmdSend) {
        this.cmdInput.addEventListener('keydown', (e) => {
          audio.playKey();
          if (e.key === 'Enter') {
            this.executeCommand(this.cmdInput.value.trim());
          }
        });

        this.cmdSend.addEventListener('click', () => {
          this.executeCommand(this.cmdInput.value.trim());
        });
        this.cmdSend.addEventListener('mouseenter', () => audio.playHover());
      }

      this.cmdChips.forEach((chip) => {
        chip.addEventListener('mouseenter', () => audio.playHover());
        chip.addEventListener('click', () => {
          const cmd = chip.getAttribute('data-cmd-chip');
          if (cmd) this.executeCommand(cmd);
        });
      });

      // Interactive Settings Switches
      const toggles = document.querySelectorAll('[data-dash-toggle]');
      toggles.forEach((t) => {
        t.addEventListener('mouseenter', () => audio.playHover());
        t.addEventListener('click', () => {
          const checked = t.getAttribute('aria-checked') === 'true';
          t.setAttribute('aria-checked', String(!checked));
          t.classList.toggle('active', !checked);
          audio.playClick();
          this.showDashboardToast('Ajuste actualizado en caliente ✓');
        });
      });

      // Interactive File Tree
      const fileItems = document.querySelectorAll('[data-dash-file]');
      fileItems.forEach((f) => {
        f.addEventListener('mouseenter', () => audio.playHover());
        f.addEventListener('click', () => {
          const fileName = f.getAttribute('data-dash-file');
          this.previewFile(fileName);
        });
      });

      // Close file preview modal
      const closePreview = document.querySelector('[data-dash-file-close]');
      if (closePreview) {
        closePreview.addEventListener('click', () => {
          const preview = document.querySelector('[data-dash-file-preview]');
          if (preview) preview.classList.remove('open');
          audio.playClick();
        });
      }

      // Parallax 3D Tilt
      this.initTilt();

      // Start live RAM/CPU micro oscillation
      this.startMetricsSimulation();

      // Start periodic console event simulation
      this.startConsoleSimulation();
    }

    switchTab(tabId) {
      this.currentTab = tabId;
      audio.playTab();

      this.tabs.forEach((t) => {
        const matches = t.getAttribute('data-dash-tab') === tabId;
        t.classList.toggle('on', matches);
        t.setAttribute('aria-selected', String(matches));
      });

      this.views.forEach((v) => {
        const matches = v.getAttribute('data-dash-view') === tabId;
        v.classList.toggle('active', matches);
      });

      if (tabId === 'console' && this.consoleTerm) {
        this.consoleTerm.scrollTop = this.consoleTerm.scrollHeight;
        if (this.cmdInput) this.cmdInput.focus();
      }
    }

    handleAction(action, btn) {
      audio.playClick();
      const origText = btn.innerHTML;
      btn.disabled = true;

      if (action === 'restart') {
        btn.innerHTML = '⚡ Reiniciando...';
        this.appendLog('[Server thread/WARN]: Servidor reiniciándose...', 'warn');
        this.showDashboardToast('Comando de reinicio enviado.');
        setTimeout(() => {
          this.appendLog('[Server thread/INFO]: [Twinkle] Servidor iniciado y sincronizado (20.0 TPS).', 'success');
          btn.innerHTML = origText;
          btn.disabled = false;
          audio.playSuccess();
        }, 1800);
      } else if (action === 'save') {
        btn.innerHTML = '💾 Guardando...';
        this.appendLog('[Server thread/INFO]: [Server] Guardando mundo...', 'info');
        setTimeout(() => {
          this.appendLog('[Server thread/INFO]: [Server] ¡Mundo y datos guardados correctamente!', 'success');
          this.showDashboardToast('Mundo guardado con éxito ✓');
          btn.innerHTML = origText;
          btn.disabled = false;
          audio.playSuccess();
        }, 800);
      } else if (action === 'backup') {
        btn.innerHTML = '📦 Creando copia...';
        this.appendLog('[Backup/INFO]: Creando respaldo de seguridad comprimido...', 'info');
        setTimeout(() => {
          this.appendLog('[Backup/SUCCESS]: Backup "backup_twinkle_2026.zip" completado (142 MB).', 'success');
          this.showDashboardToast('Copia de seguridad generada ✓');
          btn.innerHTML = origText;
          btn.disabled = false;
          audio.playChime();
        }, 1200);
      }
    }

    executeCommand(cmd) {
      if (!cmd || !this.consoleTerm) return;
      audio.playClick();

      // Clear input
      if (this.cmdInput) this.cmdInput.value = '';

      const cleanCmd = cmd.startsWith('/') ? cmd.slice(1).trim() : cmd.trim();
      const lower = cleanCmd.toLowerCase();

      // Append user command line
      this.appendLog(`> /${cleanCmd}`, 'cmd');

      // Command replies
      setTimeout(() => {
        if (lower === 'clear' || lower === 'cls') {
          this.consoleTerm.innerHTML = '';
          this.appendLog('[Consola limpiada]', 'info');
          return;
        }

        if (lower === 'tps') {
          this.appendLog('[Server thread/INFO]: TPS de 1m, 5m, 15m: 20.0, 20.0, 20.0', 'success');
          this.appendLog('[Server thread/INFO]: Memoria libre: 4,710 MB / 8,192 MB (RAM saludable)', 'info');
          audio.playSuccess();
        } else if (lower === 'list') {
          this.appendLog('[Server thread/INFO]: Hay 8 de un máximo de 30 jugadores conectados:', 'info');
          this.appendLog('[Server thread/INFO]: Keizzel, Alex_99, Steve_Pro, Miner_X, RedstoneKing, LunaMC, EnderPro, CraftGirl', 'success');
          audio.playSuccess();
        } else if (lower.startsWith('say ')) {
          const msg = cleanCmd.slice(4);
          this.appendLog(`[Server thread/INFO]: [Servidor] ${msg}`, 'chat');
          audio.playSuccess();
        } else if (lower.startsWith('time set')) {
          this.appendLog(`[Server thread/INFO]: Se fijó el tiempo del mundo a 1000 (Día despejado).`, 'success');
          audio.playSuccess();
        } else if (lower === 'save-all') {
          this.appendLog('[Server thread/INFO]: Guardando los fragmentos del mundo y jugadores...', 'info');
          this.appendLog('[Server thread/INFO]: ¡Guardado completado exitosamente!', 'success');
          audio.playSuccess();
        } else if (lower === 'help') {
          this.appendLog('[Ayuda]: Comandos interactivos disponibles:', 'info');
          this.appendLog('  /tps, /list, /say <texto>, /time set day, /save-all, /clear', 'info');
        } else {
          this.appendLog(`[Server thread/INFO]: Comando desconocido o no soportado en la vista previa. Escribe "/help".`, 'warn');
        }
      }, 140);
    }

    appendLog(text, type = 'info') {
      if (!this.consoleTerm) return;
      const line = document.createElement('div');
      line.className = `term-line term-${type}`;
      line.textContent = text;
      this.consoleTerm.appendChild(line);
      this.consoleTerm.scrollTop = this.consoleTerm.scrollHeight;
    }

    previewFile(fileName) {
      audio.playClick();
      const preview = document.querySelector('[data-dash-file-preview]');
      const title = document.querySelector('[data-dash-preview-title]');
      const code = document.querySelector('[data-dash-preview-code]');
      if (!preview || !title || !code) return;

      const fileSnippets = {
        'server.properties': `# Propiedades del servidor Twinkle\nmotd=§b§lTwinkle Server§r §7- ¡Bienvenido!\nserver-port=25565\nonline-mode=true\nmax-players=30\ndifficulty=hard\npvp=true\nview-distance=10\nenable-rcon=false`,
        'paper.yml': `# Optimizaciones Paper 1.21.4\nsettings:\n  save-empty-scoreboard-teams: false\n  velocity-support:\n    enabled: true\nworld-settings:\n  default:\n    anti-xray:\n      enabled: true\n      engine-mode: 2\n    entity-per-chunk-save-limit:\n      arrow: 16\n      item: 32`,
        'ops.json': `[\n  {\n    "uuid": "4f9b8c-keizzel-mc-001",\n    "name": "Keizzel",\n    "level": 4,\n    "bypassesPlayerLimit": true\n  }\n]`,
        'plugins': `Directorios de complementos cargados:\n- EssentialsX v2.20.1\n- LuckPerms v5.4.102\n- ViaVersion v4.9.2\n- CoreProtect v22.4\n(4 plugins activos, 0 errores)`
      };

      title.textContent = fileName;
      code.textContent = fileSnippets[fileName] || `# Contenido de ${fileName}\n(Archivo disponible para edición en CraftPanel)`;
      preview.classList.add('open');
    }

    showDashboardToast(msg) {
      let toast = document.querySelector('.dash-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'dash-toast';
        this.dash.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2400);
    }

    startMetricsSimulation() {
      setInterval(() => {
        if (this.currentTab !== 'panel') return;
        // Minor dynamic RAM variance
        const baseRam = 3.42;
        const delta = (Math.random() - 0.5) * 0.12;
        const currentRam = Math.max(3.2, Math.min(3.7, baseRam + delta)).toFixed(2);
        if (this.ramText) this.ramText.textContent = `${currentRam} / 8.0 GB`;
        if (this.ramFill) {
          const pct = Math.round((currentRam / 8.0) * 100);
          this.ramFill.style.width = `${pct}%`;
        }
        if (this.cpuText) {
          const cpuVal = (12.5 + Math.random() * 4.2).toFixed(1);
          this.cpuText.textContent = `${cpuVal}%`;
        }
      }, 3500);
    }

    startConsoleSimulation() {
      const simulatedEvents = [
        '[Server thread/INFO]: [Twinkle] Guardado automático de chunks completado.',
        '[Server thread/INFO]: Alex_99 ha obtenido el logro [¡Comienza la aventura!]',
        '[Server thread/INFO]: <Miner_X> Encontré diamantes en capa -58 :D',
        '[Server thread/INFO]: Comprobación de TPS: 20.0 TPS estables (0 tics retrasados)',
        '[Server thread/INFO]: Keizzel: Guardado de seguridad programado para las 04:00'
      ];
      let idx = 0;

      setInterval(() => {
        if (document.hidden) return;
        const evt = simulatedEvents[idx % simulatedEvents.length];
        idx++;
        this.appendLog(evt, 'info');
      }, 12000);
    }

    initTilt() {
      if (!this.visualWrapper || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      let reqId = null;
      let targetRotX = 3;
      let targetRotY = -4;
      let curRotX = 3;
      let curRotY = -4;

      const onMouseMove = (e) => {
        const rect = this.visualWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 2 - 1; // -1 .. 1
        const py = (y / rect.height) * 2 - 1;

        targetRotY = px * 7.5;
        targetRotX = -py * 6.5;

        // Dynamic light reflection coordinate
        this.dash.style.setProperty('--light-x', `${Math.round(x)}px`);
        this.dash.style.setProperty('--light-y', `${Math.round(y)}px`);
      };

      const onMouseLeave = () => {
        targetRotX = 3;
        targetRotY = -4;
        this.dash.style.setProperty('--light-x', `-999px`);
        this.dash.style.setProperty('--light-y', `-999px`);
      };

      this.visualWrapper.addEventListener('mousemove', onMouseMove, { passive: true });
      this.visualWrapper.addEventListener('mouseleave', onMouseLeave, { passive: true });

      const updateSpring = () => {
        curRotX += (targetRotX - curRotX) * 0.12;
        curRotY += (targetRotY - curRotY) * 0.12;
        this.dash.style.transform = `perspective(1200px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
        reqId = requestAnimationFrame(updateSpring);
      };

      reqId = requestAnimationFrame(updateSpring);
    }
  }

  // ----------------------------------------------------
  // 4. Interactive Feature Cards Spotlight & Hover (SpotlightCards)
  // ----------------------------------------------------
  const initSpotlightCards = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });

      card.addEventListener('mouseenter', () => audio.playHover());
      card.addEventListener('click', () => {
        audio.playChime();
        card.classList.add('card-bump');
        setTimeout(() => card.classList.remove('card-bump'), 400);
      });
    });
  };

  // ----------------------------------------------------
  // 5. Interactive Copy-to-Clipboard Button
  // ----------------------------------------------------
  const initCopyButtons = () => {
    const copyBtns = document.querySelectorAll('[data-copy]');
    copyBtns.forEach((btn) => {
      btn.addEventListener('mouseenter', () => audio.playHover());
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        if (!text) return;

        try {
          await navigator.clipboard.writeText(text);
          audio.playSuccess();

          const label = btn.querySelector('.copy-text') || btn;
          const orig = label.textContent;
          label.textContent = '¡Copiado! ✓';
          btn.classList.add('copied');

          setTimeout(() => {
            label.textContent = orig;
            btn.classList.remove('copied');
          }, 2400);
        } catch (err) {
          // Fallback if clipboard fails
          audio.playClick();
        }
      });
    });
  };

  // ----------------------------------------------------
  // 6. Sound Toggle Button Controller
  // ----------------------------------------------------
  const initSoundToggle = () => {
    const toggles = document.querySelectorAll('[data-sound-toggle]');
    const updateUI = (enabled) => {
      toggles.forEach((btn) => {
        btn.setAttribute('aria-pressed', String(enabled));
        btn.setAttribute('aria-label', enabled ? 'Efectos de sonido: activados' : 'Efectos de sonido: silenciados');
        const icon = btn.querySelector('.sound-icon');
        const label = btn.querySelector('.sound-label');
        if (icon) icon.textContent = enabled ? '🔊' : '🔇';
        if (label) label.textContent = enabled ? 'Sonido' : 'Silencio';
        btn.classList.toggle('muted', !enabled);
      });
    };

    updateUI(audio.enabled);

    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const enabled = audio.toggle();
        updateUI(enabled);
      });
      btn.addEventListener('mouseenter', () => audio.playHover());
    });
  };

  // ----------------------------------------------------
  // 7. Scroll Reveal & Floating Back to Top
  // ----------------------------------------------------
  const initScrollFeatures = () => {
    const header = document.querySelector('.site-header');
    const backToTop = document.querySelector('[data-back-to-top]');
    document.documentElement.classList.add('js-loaded');

    const onScroll = () => {
      const top = window.scrollY || 0;
      if (header) {
        header.classList.toggle('scrolled', top > 25);
      }
      if (backToTop) {
        backToTop.classList.toggle('visible', top > 380);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (backToTop) {
      backToTop.addEventListener('mouseenter', () => audio.playHover());
      backToTop.addEventListener('click', () => {
        audio.playChime();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Scroll reveal observer
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    } else {
      revealEls.forEach((el) => el.classList.add('revealed'));
    }
  };

  // ----------------------------------------------------
  // 8. General Interactive Audio Bindings
  // ----------------------------------------------------
  const initAudioFeedback = () => {
    // Buttons and links hover & click
    const interactiveElements = document.querySelectorAll(
      '.btn, .nav-links a, .brand, .footer-grid a, .toc a, .menu-toggle, .dash-side-item'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => audio.playHover());
      el.addEventListener('click', (e) => {
        if (!el.getAttribute('data-dash-tab') && !el.getAttribute('data-copy')) {
          audio.playClick();
        }
      });
    });
  };

  // ----------------------------------------------------
  // 9. Existing Mobile Menu, Year, and Contact Form
  // ----------------------------------------------------
  const initSiteBasics = () => {
    const menu = document.querySelector('[data-menu-toggle]');
    const nav = document.getElementById('site-nav');
    if (menu && nav) {
      menu.addEventListener('click', () => {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        menu.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('open', open);
        audio.playClick();
      });
      nav.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
          menu.setAttribute('aria-expanded', 'false');
          nav.classList.remove('open');
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          menu.setAttribute('aria-expanded', 'false');
          nav.classList.remove('open');
        }
      });
    }

    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    const form = document.getElementById('contact-form');
    if (!form) return;
    const submit = form.querySelector('button[type="submit"]');
    const feedback = document.getElementById('contact-feedback');
    const contactEmail = '';
    if (!contactEmail) {
      submit.disabled = true;
      feedback.textContent = 'El formulario estará disponible cuando el responsable publique un correo de contacto válido. Por ahora puedes contactar mediante GitHub.';
      return;
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const topic = form.elements.topic.value;
      const message = form.elements.message.value.trim();
      if (!message || message.length > 2000) {
        feedback.textContent = 'Escribe un mensaje de hasta 2,000 caracteres.';
        return;
      }
      if (!form.elements.privacyConsent.checked) {
        feedback.textContent = 'Confirma que has leído cómo se procesará tu mensaje.';
        form.elements.privacyConsent.focus();
        return;
      }
      audio.playSuccess();
      const subject = encodeURIComponent('[Twinkle] ' + topic);
      const body = encodeURIComponent(message);
      feedback.textContent = 'Se abrirá tu aplicación de correo. El mensaje no se ha enviado todavía: deberás confirmarlo allí.';
      window.location.href = 'mailto:' + contactEmail + '?subject=' + subject + '&body=' + body;
    });
  };

  // ----------------------------------------------------
  // Initialization when DOM is ready
  // ----------------------------------------------------
  const onReady = () => {
    initSiteBasics();
    new TwinkleParticles('twinkle-canvas');
    new TwinkleDashboard();
    initSpotlightCards();
    initCopyButtons();
    initSoundToggle();
    initScrollFeatures();
    initAudioFeedback();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
