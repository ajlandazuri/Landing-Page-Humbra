document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Scroll-Driven Premium Animations & Sticky Header
     ========================================================================== */
  const header     = document.getElementById('header');
  const homeSplash = document.getElementById('home');

  // Toggle header aesthetic state on vertical scroll
  // On HOME: transparent with white text; off HOME: solid with dark text
  const handleScroll = () => {
    const homeBottom = homeSplash ? homeSplash.getBoundingClientRect().bottom : 0;
    const isOnHome   = homeBottom > 80; // still within HOME viewport

    if (isOnHome) {
      header.classList.remove('scrolled');
      header.classList.add('on-home');
    } else {
      header.classList.remove('on-home');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial execution in case of page refresh


  // Intersection Observer for scroll-triggered staggered reveals
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once triggered to prevent stutter on scroll-back
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  /* ==========================================================================
     2. Responsive Mobile Navigation Hamburger Drawer
     ========================================================================== */
  const hamburger = document.getElementById('hamburger-menu');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileCerrar = document.getElementById('mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileDrawer.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Block background scroll
  };

  const closeMobileMenu = () => {
    mobileDrawer.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMobileMenu);
  mobileCerrar.addEventListener('click', closeMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small timeout to allow anchor scroll to execute before drawer collapses
      setTimeout(closeMobileMenu, 150);
    });
  });


  /* ==========================================================================
     3. WhatsApp Order Integration
     ========================================================================== */
  const whatsappNumber = "593995146583";

  document.querySelectorAll('.add-to-cart-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-product');
      const price = btn.getAttribute('data-price');
      
      const message = `Hola HUMBRA, me gustaría realizar un pedido del siguiente producto:\n\n- *${name}* ($${price})\n\n¿Me podrían ayudar con el proceso de pago y envío?`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
    });
  });


  /* ==========================================================================
     4. Interactive Skin Diagnostic Quiz Modal
     ========================================================================== */
  const quizModal = document.getElementById('quiz-modal');
  const quizCerrar = document.getElementById('quiz-close');
  const quizTriggers = document.querySelectorAll('.quiz-trigger');
  const quizSteps = document.querySelectorAll('.quiz-step');
  const progressBarFill = document.getElementById('quiz-progress-fill');
  const progressBar = document.getElementById('quiz-progress-bar');
  const quizLoadingStep = document.getElementById('quiz-loading-step');
  const quizResultStep = document.getElementById('quiz-result-step');
  const quizDoneBtn = document.getElementById('quiz-done-btn');
  
  // Custom DOM elements for quiz recommendations
  const quizResultsHeader = document.getElementById('quiz-results-header');
  const quizResultsText = document.getElementById('quiz-results-text');
  const quizResultTypeTag = document.getElementById('quiz-result-type-tag');
  const quizResultTypeDesc = document.getElementById('quiz-result-type-desc');

  let currentStep = 1;
  let quizAnswers = [];
  let recommendedProfile = 'normal';

  const openQuiz = (e) => {
    if (e) e.preventDefault();
    currentStep = 1;
    quizAnswers = [];
    
    // Reset all step states
    quizSteps.forEach(step => step.classList.remove('active'));
    document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
    
    // Hide results & loading steps
    quizLoadingStep.classList.remove('active');
    quizLoadingStep.style.display = 'none';
    quizResultStep.classList.remove('active');
    quizResultStep.style.display = 'none';
    
    // Show progress bar
    progressBar.style.display = 'block';
    updateProgressBar();

    quizModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeQuiz = () => {
    quizModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  quizTriggers.forEach(trigger => {
    trigger.addEventListener('click', openQuiz);
  });

  quizCerrar.addEventListener('click', closeQuiz);
  quizModal.addEventListener('click', (e) => {
    if (e.target === quizModal) closeQuiz();
  });

  const updateProgressBar = () => {
    const percentage = (currentStep / 3) * 100;
    progressBarFill.style.width = `${percentage}%`;
  };

  // Dynamic Skin Diagnostic Engine
  const calculateQuizResults = () => {
    progressBar.style.display = 'none';
    
    // Hide the questions
    quizSteps.forEach(step => step.classList.remove('active'));
    
    // Show Loading state
    quizLoadingStep.style.display = 'block';
    quizLoadingStep.classList.add('active');

    // Analyze answers array
    const occurrences = quizAnswers.reduce((acc, current) => {
      acc[current] = (acc[current] || 0) + 1;
      return acc;
    }, {});

    // Determine dominate profile (fallback to normal if draw)
    let skinProfile = 'normal';
    let max = 0;
    for (const key in occurrences) {
      if (occurrences[key] > max) {
        max = occurrences[key];
        skinProfile = key;
      }
    }

    // Generate response content after brief clinical loading delay
    setTimeout(() => {
      quizLoadingStep.classList.remove('active');
      quizLoadingStep.style.display = 'none';
      
      // Select appropriate customized recommendation copy
      if (skinProfile === 'dry') {
        quizResultsHeader.textContent = "¡Cuidado Rico y Aterciopelado!";
        quizResultsText.textContent = "Tu piel anhela hidratación extrema y lípidos estructurales profundos.";
        quizResultTypeTag.textContent = "KIT PARA PIEL SECA";
        quizResultTypeDesc.textContent = "Recomendamos nuestra Crema Fundente Reparadora de Barrera combinada con micro-suero hialurónico. Un régimen de hidratación clínica completo para calmar la tirantez.";
      } else if (skinProfile === 'oily') {
        quizResultsHeader.textContent = "¡Equilibrio Ligero y Clarificador!";
        quizResultsText.textContent = "Tu piel requiere regulación profunda de sebo sin perder humedad.";
        quizResultTypeTag.textContent = "KIT CLARIFICADOR PARA PIEL GRASA";
        quizResultTypeDesc.textContent = "Recomendamos nuestro gel transparente y ligero de hidratación sin aceite mezclado con extractos botánicos de zinc para cerrar los poros y regular el brillo.";
      } else {
        // Normal profile
        quizResultsHeader.textContent = "¡Equilibrio y Brillo Natural!";
        quizResultsText.textContent = "Tu piel se siente muy cómoda. Enfócate en la protección y un brillo natural contra el medio ambiente.";
        quizResultTypeTag.textContent = "KIT DE BRILLO EQUILIBRADO";
        quizResultTypeDesc.textContent = "Recomendamos nuestra Crema Fundente estándar con infusión botánica, combinada con vitaminas C y E para mantener el equilibrio y proteger contra la contaminación.";
      }

      // Show Results Step
      recommendedProfile = skinProfile;
      quizResultStep.style.display = 'block';
      quizResultStep.classList.add('active');
    }, 1800);
  };

  // Option select trigger bindings
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const answer = btn.getAttribute('data-answer');
      quizAnswers.push(answer);

      if (currentStep < 3) {
        // Deactivate current active
        const currentActive = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
        currentActive.classList.remove('active');
        
        currentStep += 1;
        
        // Activate next
        const nextActive = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
        nextActive.classList.add('active');
        
        updateProgressBar();
      } else {
        // Reached end of questions, calculate results
        calculateQuizResults();
      }
    });
  });

  // Finish button closure (Redirects to WhatsApp with personalized routine order)
  quizDoneBtn.addEventListener('click', () => {
    closeQuiz();
    
    let routineName = "Kit de Brillo Equilibrado (Piel Normal)";
    if (recommendedProfile === 'dry') {
      routineName = "Kit para Piel Seca";
    } else if (recommendedProfile === 'oily') {
      routineName = "Kit Clarificador para Piel Grasa";
    }
    
    const message = `Hola HUMBRA, realicé el test de piel en su sitio web y mi diagnóstico recomendado es el *${routineName}*.\n\nMe gustaría realizar un pedido de esta rutina y que me ayuden con el pago y envío.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  });

  /* ==========================================================================
     5. FAQ Premium Modal & Accordion Logic
     ========================================================================== */
  const faqModal = document.getElementById('faq-modal');
  const faqCerrar = document.getElementById('faq-close');
  const faqTrigger = document.getElementById('faq-trigger');
  const faqOverlay = document.getElementById('faq-overlay');
  const faqQuestions = document.querySelectorAll('.faq-question');

  const openFaq = (e) => {
    if (e) e.preventDefault();
    faqModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeFaq = () => {
    faqModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (faqTrigger) {
    faqTrigger.addEventListener('click', openFaq);
  }
  if (faqCerrar) {
    faqCerrar.addEventListener('click', closeFaq);
  }
  if (faqOverlay) {
    faqOverlay.addEventListener('click', closeFaq);
  }
  
  // Accordion Logic
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answer = question.nextElementSibling;
      
      // Close all other open items for exclusive accordion mode
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== question && otherQuestion.getAttribute('aria-expanded') === 'true') {
          otherQuestion.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherQuestion.nextElementSibling;
          otherAnswer.style.maxHeight = null;
        }
      });
      
      if (!isExpanded) {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });

});
