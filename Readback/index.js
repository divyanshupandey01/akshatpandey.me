/* ReadBack Landing Page Interactions & Logic */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── Mobile Menu Toggle ───
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.contains('translate-x-full');
      if (open) {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        // Animate burger menu lines to X
        mobileMenuBtn.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        mobileMenuBtn.children[1].style.opacity = '0';
        mobileMenuBtn.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        // Animate back to hamburger lines
        mobileMenuBtn.children[0].style.transform = 'none';
        mobileMenuBtn.children[1].style.opacity = '1';
        mobileMenuBtn.children[2].style.transform = 'none';
      }
    });

    // Close mobile menu on link clicks
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        mobileMenuBtn.children[0].style.transform = 'none';
        mobileMenuBtn.children[1].style.opacity = '1';
        mobileMenuBtn.children[2].style.transform = 'none';
      });
    });
  }

  // ─── Sticky Header Blur ───
  const navHeader = document.getElementById('nav-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navHeader.classList.add('scrolled', 'shadow-premium');
      navHeader.style.paddingBlock = '12px';
    } else {
      navHeader.classList.remove('scrolled', 'shadow-premium');
      navHeader.style.paddingBlock = '0px';
    }
  }, { passive: true });

  // ─── Hero 3D Mouse Parallax ───
  const wrapper = document.getElementById('hero-mockup-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Map pixel displacements to mild rotation degrees
      const rotX = (y / (rect.height / 2)) * -6; // max 6 degrees
      const rotY = (x / (rect.width / 2)) * 6;
      
      wrapper.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      wrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // ─── Scroll Reveal Triggers ───
  const revealElements = document.querySelectorAll('.reveal-section');
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          self.unobserve(entry.target); // Trigger animation once
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ─── Interactive Demo Mechanics ───
  const articleScroll = document.getElementById('demo-article-scroll');
  const scrollBar = document.getElementById('demo-scroll-bar');
  const scrollPct = document.getElementById('demo-scroll-pct');
  const headingIndicator = document.getElementById('demo-heading');
  const paragraphPreview = document.getElementById('demo-paragraph-preview');
  const stateIndicator = document.getElementById('demo-state');
  const timeIndicator = document.getElementById('demo-time');
  const btnResume = document.getElementById('demo-btn-resume');
  const paraEls = document.querySelectorAll('.demo-p');

  let activePara = null;
  let simulatedReadingTime = 12;
  let readingTimeInterval = null;

  // Track reading time during demo interaction
  function startReadingTimer() {
    if (readingTimeInterval) return;
    readingTimeInterval = setInterval(() => {
      simulatedReadingTime += 1;
      if (timeIndicator) {
        timeIndicator.textContent = `${simulatedReadingTime}s`;
      }
    }, 1000);
  }

  function stopReadingTimer() {
    if (readingTimeInterval) {
      clearInterval(readingTimeInterval);
      readingTimeInterval = null;
    }
  }

  if (articleScroll) {
    articleScroll.addEventListener('scroll', () => {
      // 1. Calculate and update progress bar
      const scrollTop = articleScroll.scrollTop;
      const scrollHeight = articleScroll.scrollHeight - articleScroll.clientHeight;
      const pct = Math.min(100, Math.round((scrollTop / Math.max(1, scrollHeight)) * 100));
      
      if (scrollBar) scrollBar.style.width = `${pct}%`;
      if (scrollPct) scrollPct.textContent = `${pct}%`;

      // 2. Start reading time log simulation
      if (scrollTop > 10) {
        startReadingTimer();
        if (stateIndicator) {
          if (pct >= 95) {
            stateIndicator.textContent = 'Completed';
            stateIndicator.className = 'text-sm font-extrabold text-[#34C759]';
          } else {
            stateIndicator.textContent = 'In Progress';
            stateIndicator.className = 'text-sm font-extrabold text-[#007AFF]';
          }
        }
      } else {
        stopReadingTimer();
        if (stateIndicator) {
          stateIndicator.textContent = 'Not Started';
          stateIndicator.className = 'text-sm font-extrabold text-[#FF9F0A]';
        }
      }

      // 3. Detect center visible paragraph
      const centerLine = articleScroll.getBoundingClientRect().top + (articleScroll.clientHeight * 0.4);
      let closestParagraph = null;
      let minDistance = Infinity;

      paraEls.forEach(p => {
        const rect = p.getBoundingClientRect();
        const distance = Math.abs(rect.top + (rect.height / 2) - centerLine);
        if (distance < minDistance) {
          minDistance = distance;
          closestParagraph = p;
        }
      });

      if (closestParagraph && closestParagraph !== activePara) {
        // Clear old highlight
        if (activePara) activePara.classList.remove('highlighted');
        
        activePara = closestParagraph;
        activePara.classList.add('highlighted');

        // Update mockup labels
        if (headingIndicator) {
          headingIndicator.textContent = activePara.getAttribute('data-para-heading');
        }
        if (paragraphPreview) {
          paragraphPreview.textContent = `"${activePara.textContent.trim().slice(0, 50)}..."`;
        }
      }
    }, { passive: true });

    // Handle interactive resume mock trigger
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        // Find paragraph 4 (index 3) to demonstrate scroll resumption
        const targetPara = document.querySelector('[data-para-index="3"]');
        if (targetPara && articleScroll) {
          const offsetTop = targetPara.offsetTop - (articleScroll.clientHeight * 0.25);
          articleScroll.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
          });

          // Custom highlight flash
          setTimeout(() => {
            targetPara.classList.remove('highlighted');
            // Force redraw
            void targetPara.offsetWidth;
            targetPara.classList.add('highlighted');
          }, 300);
        }
      });
    }
  }

  // ─── FAQ Accordion Toggles ───
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('.faq-icon');
      const open = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';

      // Close all other FAQs
      faqTriggers.forEach(t => {
        const c = t.nextElementSibling;
        const i = t.querySelector('.faq-icon');
        c.style.maxHeight = '0px';
        if (i) i.textContent = '+';
      });

      if (!open) {
        content.style.maxHeight = `${content.scrollHeight}px`;
        if (icon) icon.textContent = '−';
      } else {
        content.style.maxHeight = '0px';
        if (icon) icon.textContent = '+';
      }
    });
  });

});
