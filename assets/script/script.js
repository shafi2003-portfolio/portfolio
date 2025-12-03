// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Portfolio website loaded successfully');
  
  // Initialize all features
  initMobileMenu();
  initScrollTop();
  initImageModal();
  initSkillsAnimation();
  initSmoothScroll();
  initActiveNavigation();
});

/* =========================== */
/* MOBILE MENU FUNCTIONALITY   */
/* =========================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  
  // Check if elements exist
  if (!menuBtn || !nav) {
    console.error('Mobile menu elements not found');
    return;
  }
  
  // Function to open/close menu
  function toggleMenu() {
    nav.classList.toggle('active');
    
    // Change menu icon
    if (nav.classList.contains('active')) {
      menuBtn.textContent = '✕';
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      menuBtn.textContent = '☰';
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }
  
  // Click menu button
  menuBtn.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a link
  document.querySelectorAll('#nav a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 900) {
        nav.classList.remove('active');
        menuBtn.textContent = '☰';
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 900 && 
        nav.classList.contains('active') &&
        !nav.contains(event.target) && 
        !menuBtn.contains(event.target)) {
      nav.classList.remove('active');
      menuBtn.textContent = '☰';
      document.body.style.overflow = '';
    }
  });
  
  // Reset menu on window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
      // Close menu if open
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuBtn.textContent = '☰';
        document.body.style.overflow = '';
      }
    }
  });
}

/* =========================== */
/* SCROLL TO TOP BUTTON        */
/* =========================== */
function initScrollTop() {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function() {
    if (window.scrollY > 250) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  // Scroll to top when clicked
  scrollBtn.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* =========================== */
/* IMAGE MODAL (POPUP)         */
/* =========================== */
function initImageModal() {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.querySelector(".img-modal .close");

  if (!modal || !modalImg) return;

  // Make all portfolio images clickable
  document.querySelectorAll(".proj img").forEach(img => {
    img.addEventListener("click", function() {
      modal.style.display = "block";
      modalImg.src = this.src;
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal on X click
  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      modal.style.display = "none";
      document.body.style.overflow = "";
    });
  }

  // Close modal when clicking outside the image
  modal.addEventListener("click", function(e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

/* =========================== */
/* SKILLS ANIMATION            */
/* =========================== */
function initSkillsAnimation() {
  const card = document.querySelector('.skills')?.closest('.about-card');
  if (!card) return;

  const bars = Array.from(card.querySelectorAll('.bar i'));

  // Set animation target for each bar
  bars.forEach(bar => {
    const percent = String(bar.dataset.percent || '').trim();
    const n = (/^\d{1,3}$/.test(percent)) ? percent : '100';
    bar.style.setProperty('--target', n + '%');
  });

  // Function to animate bars
  function animateBars() {
    bars.forEach(bar => {
      bar.classList.remove('fill');
      // Force reflow to restart animation
      void bar.offsetWidth;
      bar.classList.add('fill');
    });
  }

  // Animate when skills section is in view
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBars();
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.3 });

  observer.observe(card);

  // Also animate on hover and click
  card.addEventListener('mouseenter', animateBars);
  card.addEventListener('click', animateBars);
}

/* =========================== */
/* SMOOTH SCROLL               */
/* =========================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip empty or invalid links
      if (href === '#' || href === '#!' || !href.startsWith('#')) return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        // Get header height for offset
        const headerHeight = document.querySelector('header').offsetHeight || 70;
        
        // Scroll to target
        window.scrollTo({
          top: target.offsetTop - headerHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* =========================== */
/* ACTIVE NAVIGATION           */
/* =========================== */
function initActiveNavigation() {
  // Update active nav on scroll
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Run once on load
  
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#nav a');
    
    // Get current scroll position with offset
    const headerHeight = document.querySelector('header').offsetHeight || 70;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    let currentSection = '';
    
    // Find current section
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Update active class on nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

/* =========================== */
/* CONTACT FORM HANDLER        */
/* =========================== */
function handleContact(event) {
  event.preventDefault();
  
  const form = event.target;
  
  // Get form values
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();
  
  // Validation
  if (!name || !email || !message) {
    alert('Please fill in all required fields (Name, Email, Message).');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Create email body
  const emailSubject = subject || 'Contact from Portfolio Website';
  const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
  
  // Create mailto link
  const mailtoLink = `mailto:ksmohamedshafi2025@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;
  
  // Open email client
  window.open(mailtoLink, '_blank');
  
  // Show success message
  alert('Thank you for your message! Your email client will open. Please send the email to contact me.');
  
  // Reset form after a short delay
  setTimeout(function() {
    form.reset();
  }, 1000);
}

/* =========================== */
/* EXTRA HELPER FUNCTIONS      */
/* =========================== */

// Simple notification function (optional)
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#00e5ff'};
    color: white;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(function() {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(function() {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);