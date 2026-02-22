// ── Smooth scrolling ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ── Fade-in sections on scroll ──
const sections = document.querySelectorAll('section');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeObserver.observe(section);
});

// ── Matrix Rain ──
(function () {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const FONT_SIZE = 13;
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>/\\{}[]|';

    let drops = [];

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const cols = Math.floor(canvas.width / FONT_SIZE);
        drops = Array.from({ length: cols }, () => Math.random() * -60);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${FONT_SIZE}px monospace`;

        drops.forEach((y, i) => {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const brightness = Math.random();

            if (brightness > 0.92) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = `rgba(0, 212, 170, ${brightness * 0.6 + 0.2})`;
            }

            ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);

            if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.5;
        });
    }

    setInterval(draw, 50);
})();

// ── Terminal Typing (About section) ──
(function () {
    const lines = [
        { type: 'cmd', text: 'whoami' },
        { type: 'out', text: 'stefon-la-touche' },
        { type: 'blank' },
        { type: 'cmd', text: 'cat about.txt' },
        { type: 'out', text: 'Scrum Master · Data Analyst · Aspiring Security Engineer' },
        { type: 'out', text: 'Passionate about cloud infrastructure, data pipelines & cybersecurity.' },
        { type: 'out', text: 'Building real projects, deployed on AWS S3 + CloudFront.' },
        { type: 'blank' },
        { type: 'cmd', text: 'ls certifications/' },
        { type: 'out', text: 'CompTIA_A+    ITIL_4_Foundation' },
        { type: 'out', text: 'AWS_Cloud_Practitioner_[pursuing]    Network+_[pursuing]    Security+_[pursuing]' },
        { type: 'blank' },
        { type: 'cmd', text: 'echo $MISSION' },
        { type: 'out', text: '"Bridge project management, data analytics & security engineering."' },
    ];

    const body = document.getElementById('terminal-body');
    if (!body) return;

    let started = false;
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function typeLine(line) {
        const el = document.createElement('div');
        el.className = 'term-line';

        if (line.type === 'blank') {
            el.innerHTML = '&nbsp;';
            body.appendChild(el);
            return;
        }

        if (line.type === 'out') {
            el.classList.add('term-out');
        }

        if (line.type === 'cmd') {
            const prompt = document.createElement('span');
            prompt.className = 'term-prompt';
            prompt.textContent = '$ ';
            el.appendChild(prompt);
        }

        const span = document.createElement('span');
        el.appendChild(span);
        body.appendChild(el);

        const delay = line.type === 'cmd' ? 55 : 18;
        for (const ch of line.text) {
            span.textContent += ch;
            body.scrollTop = body.scrollHeight;
            await sleep(delay);
        }

        await sleep(line.type === 'cmd' ? 350 : 80);
    }

    async function run() {
        for (const line of lines) {
            await typeLine(line);
        }
        const cursor = document.createElement('span');
        cursor.className = 'term-cursor';
        cursor.textContent = '█';
        body.appendChild(cursor);
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            run();
        }
    }, { threshold: 0.3 });

    const terminal = document.querySelector('.terminal');
    if (terminal) observer.observe(terminal);
})();

// ── Skill Progress Bars ──
(function () {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.skill-bar').forEach(bar => {
                bar.style.width = bar.dataset.level + '%';
            });
            observer.disconnect();
        }
    }, { threshold: 0.3 });

    observer.observe(skillsSection);
})();
