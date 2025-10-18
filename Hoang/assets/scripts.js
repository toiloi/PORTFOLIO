        // Fade-in on scroll
        const faders = document.querySelectorAll('.fade-in');
        const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
        const appearOnScroll = new IntersectionObserver(function(entries, observer){
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            });
        }, appearOptions);
        faders.forEach(fader => { appearOnScroll.observe(fader); });


        const skillBars = document.querySelectorAll('.skill-bar div');
        window.addEventListener('scroll', () => {
            skillBars.forEach(bar => {
                const barPos = bar.getBoundingClientRect().top;
                const screenPos = window.innerHeight / 1.2;
                if(barPos < screenPos){
                    bar.style.width = bar.getAttribute('data-width');
                }
            });
        });

        const navLinks = document.querySelectorAll("nav ul li a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            });
        });


        const colToggles = document.querySelectorAll('.col-toggle');
        function openContent(btn, content) {
            btn.setAttribute('aria-expanded', 'true');
            content.classList.add('open');

            content.style.maxHeight = content.scrollHeight + 'px';
            const onEnd = () => {
                if (btn.getAttribute('aria-expanded') === 'true') {
                    content.style.maxHeight = 'none';
                }
                content.removeEventListener('transitionend', onEnd);
            };
            content.addEventListener('transitionend', onEnd);
        }

        function closeContent(btn, content) {
            btn.setAttribute('aria-expanded', 'false');
            const currentHeight = content.scrollHeight;
            content.style.maxHeight = currentHeight + 'px';
            content.offsetHeight;
            content.style.maxHeight = '0px';
            content.classList.remove('open');
        }

        colToggles.forEach(btn => {
            const content = btn.nextElementSibling;
            btn.addEventListener('click', () => {
                const isOpen = btn.getAttribute('aria-expanded') === 'true';
                if (isOpen) {
                    closeContent(btn, content);
                } else {
                    openContent(btn, content);
                }
            });
            window.addEventListener('resize', () => {
                if (btn.getAttribute('aria-expanded') === 'true') {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    setTimeout(() => { content.style.maxHeight = 'none'; }, 350);
                }
            });
        });

        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const aboutObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const contents = aboutSection.querySelectorAll('.col-content');
                    contents.forEach((c, i) => {
                        const btn = c.previousElementSibling;
                        if (btn && btn.getAttribute('aria-expanded') !== 'true') {
                            setTimeout(() => {
                                openContent(btn, c);
                            }, i * 150);
                        }
                    });
                    obs.unobserve(aboutSection);
                });
            }, { threshold: 0.25 });
            aboutObserver.observe(aboutSection);
        }

        const hero = document.getElementById('hero');
        if (hero) {
            const heroObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    hero.classList.add('show');
                    obs.unobserve(hero);
                });
            }, { threshold: 0.15 });
            heroObserver.observe(hero);
        }

        function createRipple(e) {
            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            target.appendChild(ripple);
            setTimeout(() => { ripple.remove(); }, 600);
        }

        const logoLink = document.querySelector('.logo-link');
        if (logoLink) logoLink.addEventListener('click', createRipple);
        document.querySelectorAll('nav ul li a').forEach(a => a.addEventListener('click', createRipple));