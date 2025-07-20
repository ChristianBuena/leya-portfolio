// Initialize GSAP and register plugins
const { gsap, ScrollTrigger } = window;
const { to, set, timeline } = gsap;

gsap.registerPlugin(ScrollTrigger);

// Black Book Controller
class BlackBookController {
  constructor() {
    this.pages = [...document.querySelectorAll('.book__page')];
    this.currentPage = 0;
    this.updatePageDisplay(0);
    this.updateButtonStates();
    this.totalPages = this.pages.length;
    this.isAnimating = false;
    this.isMobile = window.innerWidth <= 768;
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.currentPageDisplay = document.querySelector('.current-page');
    this.totalPagesDisplay = document.querySelector('.total-pages');
    
    // Debug: Log all pages in order
    console.log('Pages array:', this.pages.map((page, index) => ({
      index,
      pageId: page.getAttribute('data-page-id') || 'no-id',
      classes: page.className
    })));
    
    // Instructions elements
    this.instructionsOverlay = document.getElementById('instructionsOverlay');
    this.mainInstruction = document.getElementById('mainInstruction');
    this.glossaryInstruction = document.getElementById('glossaryInstruction');
    
    this.init();
    this.setupScrollAnimations();
    this.setupMobileNavigation();
    this.setupFlyingContent();
    this.handleResponsiveDisplay();
    
    // Initialize background transition and instructions
    this.initBackgroundTransition();
  }

  initBackgroundTransition() {
    // Reference to track if book has been opened
    this.bookOpened = false;
    
    // Add handler for scroll events to detect when book is opened
    window.addEventListener('scroll', () => {
      // Track current page for desktop
      if (!this.isMobile) {
        const scrollPosition = window.scrollY;
        const pageHeight = window.innerHeight * 0.25;
        const currentPageFromScroll = Math.floor(scrollPosition / pageHeight);
        
        if (currentPageFromScroll !== this.currentPage && this.pages[currentPageFromScroll]) {
          const pageId = this.pages[currentPageFromScroll].getAttribute('data-page-id') || 'unknown';
          this.updateInstructionsBasedOnPage(pageId);
        }
      }
      
      // If we're past the cover page (first page) and book hasn't been opened yet
      if (window.scrollY > window.innerHeight * 0.25 && !this.bookOpened) {
        document.body.classList.add('book-open');
        document.querySelector('.background-overlay').classList.add('active');
        this.hideInstructions();
        this.bookOpened = true;
      } 
      // If we go back to the cover and book was open
      else if (window.scrollY < window.innerHeight * 0.15 && this.bookOpened) {
        document.body.classList.remove('book-open');
        document.querySelector('.background-overlay').classList.remove('active');
        this.showInstructions();
        this.bookOpened = false;
      }
    });
    
    // For mobile, we need to detect page changes differently
    if (this.isMobile) {
      this.onPageChange = (pageIndex) => {
        if (pageIndex > 0 && !this.bookOpened) {
          document.body.classList.add('book-open');
          document.querySelector('.background-overlay').classList.add('active');
          this.hideInstructions();
          this.bookOpened = true;
        } else if (pageIndex === 0 && this.bookOpened) {
          document.body.classList.remove('book-open');
          document.querySelector('.background-overlay').classList.remove('active');
          this.showInstructions();
          this.bookOpened = false;
        }
        
        // Update instructions based on page
        if (this.pages[pageIndex]) {
          const pageId = this.pages[pageIndex].getAttribute('data-page-id') || 'unknown';
          this.updateInstructionsBasedOnPage(pageId);
        }
      };
    }
    
    // Initialize page tracking for glossary instructions
    this.currentPageId = 'cover';
    this.updateInstructionsBasedOnPage('cover');
  }

  showInstructions() {
    if (this.instructionsOverlay) {
      this.instructionsOverlay.classList.remove('hidden');
    }
  }

  hideInstructions() {
    if (this.instructionsOverlay) {
      this.instructionsOverlay.classList.add('hidden');
    }
  }

  updateInstructionsBasedOnPage(pageId) {
    if (!this.instructionsOverlay) return;
    
    this.currentPageId = pageId;
    
    if (pageId === 'contents') {
      // Show glossary instruction when on contents page
      this.glossaryInstruction.classList.add('show');
    } else {
      // Hide glossary instruction on other pages
      this.glossaryInstruction.classList.remove('show');
    }
  }

  setupFlyingContent() {
    this.flyingOverlay = document.getElementById('flyingContentOverlay');
    this.flyingContent = document.getElementById('flyingContent');
    this.closeFlyingBtn = document.getElementById('closeFlyingBtn');
    
    // Close flying content when clicking close button or overlay
    if (this.closeFlyingBtn) {
      this.closeFlyingBtn.addEventListener('click', () => {
        this.hideFlyingContent();
      });
    }
    
    if (this.flyingOverlay) {
      this.flyingOverlay.addEventListener('click', (e) => {
        if (e.target === this.flyingOverlay) {
          this.hideFlyingContent();
        }
      });
    }
    
    // Add click listeners to glossary items
    this.setupGlossaryClickHandlers();
    
    // Add click listeners to about me highlights
    this.setupAboutMeClickHandlers();
    
    // Add click listeners to journey page
    this.setupJourneyClickHandlers();
    
    // Add click listeners to skills page
    this.setupSkillsClickHandlers();
    
    // Add click listeners to projects page
    this.setupProjectsClickHandlers();
    
    // Add click listeners to web development page
    this.setupWebDevClickHandlers();
    
    // Add click listeners to design portfolio page
    this.setupDesignClickHandlers();
  }

  setupGlossaryClickHandlers() {
    const glossaryItems = document.querySelectorAll('.glossary-item');
    glossaryItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      
      // Add click event for flying content
      item.addEventListener('click', () => {
        this.showFlyingGlossary();
      });
      
      // Add double-click event for direct navigation using data attribute
      item.addEventListener('dblclick', () => {
        const targetPageId = item.getAttribute('data-target-page');
        if (targetPageId) {
          this.navigateToPageById(targetPageId);
        }
      });
      
      // Add hover effect for better UX
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(10px)';
        item.style.transition = 'transform 0.2s ease';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
      });
    });
  }

  setupAboutMeClickHandlers() {
    const aboutHighlights = document.querySelectorAll('.about-highlight');
    aboutHighlights.forEach((highlight) => {
      highlight.addEventListener('click', () => {
        const topic = highlight.getAttribute('data-about-topic');
        this.showFlyingAboutMe(topic);
      });
      
      // Add hover effect
      highlight.addEventListener('mouseenter', () => {
        highlight.style.transform = 'scale(1.05)';
        highlight.style.transition = 'transform 0.2s ease';
      });
      
      highlight.addEventListener('mouseleave', () => {
        highlight.style.transform = 'scale(1)';
      });
    });

    // Add click handler for the About Me title
    const aboutTitle = document.querySelector('.about-title-clickable');
    if (aboutTitle) {
      aboutTitle.addEventListener('click', () => {
        const contentType = aboutTitle.getAttribute('data-page-content');
        this.showFlyingFullContent(contentType);
      });
    }
  }

  setupJourneyClickHandlers() {
    const journeyTitle = document.querySelector('.journey-title-clickable');
    if (journeyTitle) {
      journeyTitle.addEventListener('click', () => {
        const contentType = journeyTitle.getAttribute('data-journey-content');
        this.showFlyingJourney(contentType);
      });
    }
  }

  setupSkillsClickHandlers() {
    // Add click handler for the Skills title
    const skillsTitle = document.querySelector('.skills-title-clickable');
    if (skillsTitle) {
      skillsTitle.addEventListener('click', () => {
        const contentType = skillsTitle.getAttribute('data-skills-content');
        this.showFlyingSkills(contentType);
      });
    }

    // Add click handlers for individual skill items
    const skillItems = document.querySelectorAll('.skills-item');
    skillItems.forEach((item) => {
      item.addEventListener('click', () => {
        const skillTopic = item.getAttribute('data-skill-topic');
        this.showFlyingSkillDetail(skillTopic);
      });
    });
  }

  setupProjectsClickHandlers() {
    // Add click handler for the Projects title
    const projectsTitle = document.querySelector('[data-flying="projects"]');
    if (projectsTitle) {
      projectsTitle.addEventListener('click', () => {
        this.showFlyingProjects('projects-full');
      });
    }

    // Add click handlers for individual project titles
    const projectTitles = document.querySelectorAll('[data-flying^="project-"]');
    projectTitles.forEach((title) => {
      title.addEventListener('click', () => {
        const projectType = title.getAttribute('data-flying');
        this.showFlyingProjectDetail(projectType);
      });
    });
  }

  setupWebDevClickHandlers() {
    // Add click handler for the Web Development title
    const webDevTitle = document.querySelector('[data-flying="web-development"]');
    if (webDevTitle) {
      webDevTitle.addEventListener('click', () => {
        this.showFlyingWebDev('web-dev-full');
      });
    }

    // Add click handlers for individual web dev items
    const webDevItems = document.querySelectorAll('[data-flying="frontend"], [data-flying="backend"], [data-flying="fullstack"], [data-flying="responsive"], [data-flying="performance"]');
    webDevItems.forEach((item) => {
      item.addEventListener('click', () => {
        const webDevType = item.getAttribute('data-flying');
        this.showFlyingWebDevDetail(webDevType);
      });
    });
  }

  setupDesignClickHandlers() {
    // Add click handler for the Design Portfolio title
    const designTitle = document.querySelector('[data-target="design"]');
    if (designTitle) {
      designTitle.addEventListener('click', () => {
        this.showFlyingDesign('design-portfolio-full');
      });
    }

    // Add click handlers for individual design items
    const designItems = document.querySelectorAll('[data-design]');
    designItems.forEach((item) => {
      item.addEventListener('click', () => {
        const designType = item.getAttribute('data-design');
        this.showFlyingDesignDetail(designType);
      });
    });
  }

  // Define page mapping for consistent navigation
  getPageMapping() {
    return [
      { arrayIndex: 0, displayNumber: 0, pageId: 'cover', text: 'Cover' },
      { arrayIndex: 1, displayNumber: 1, pageId: 'contents', text: 'Contents' },
      { arrayIndex: 2, displayNumber: 2, pageId: 'about-me', text: 'About Me' },
      { arrayIndex: 3, displayNumber: 3, pageId: 'my-journey', text: 'My Journey' },
      { arrayIndex: 4, displayNumber: 4, pageId: 'skills', text: 'Skills' },
      { arrayIndex: 5, displayNumber: 5, pageId: 'projects', text: 'Projects' },
      { arrayIndex: 6, displayNumber: 6, pageId: 'web-development', text: 'Web Development' },
      { arrayIndex: 7, displayNumber: 7, pageId: 'design-portfolio', text: 'Design Portfolio' },
      { arrayIndex: 8, displayNumber: 8, pageId: 'achievements', text: 'Achievements' },
      { arrayIndex: 9, displayNumber: 9, pageId: 'testimonials', text: 'Testimonials' },
      { arrayIndex: 10, displayNumber: 10, pageId: 'contact-links', text: 'Contact & Links' }
      // Additional pages can be added here
    ];
  }

  showFlyingGlossary() {
    const glossaryData = [
      { text: 'Contents', page: '1', pageId: 'contents' },
      { text: 'About Me', page: '2', pageId: 'about-me' },
      { text: 'My Journey', page: '3', pageId: 'my-journey' },
      { text: 'Skills', page: '4', pageId: 'skills' },
      { text: 'Projects', page: '5', pageId: 'projects' },
      { text: 'Web Development', page: '6', pageId: 'web-development' },
      { text: 'Design Portfolio', page: '7', pageId: 'design-portfolio' },
      { text: 'Achievements', page: '8', pageId: 'achievements' },
      { text: 'Testimonials', page: '9', pageId: 'testimonials' },
      { text: 'Contact & Links', page: '10', pageId: 'contact-links' }
    ];

    const flyingHtml = `
      <div class="flying-glossary">
        <h2 class="flying-glossary-title">Contents</h2>
        <div class="flying-glossary-list">
          ${glossaryData.map(item => `
            <div class="flying-glossary-item">
              <span class="flying-glossary-text">${item.text}</span>
              <span class="flying-glossary-dots"></span>
              <span class="flying-glossary-page">${item.page}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Add click listeners to flying glossary items for navigation
    this.setupFlyingGlossaryNavigation(glossaryData);
    
    // Animate the content flying from book to mid-right
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingAboutMe(topic) {
    const aboutMeData = {
      'web-development': {
        title: 'Web Development',
        content: [
          'Full-Stack Development with modern frameworks',
          'React, Vue.js, Angular for dynamic frontends',
          'Node.js, Express, PHP for robust backends',
          'Database design with MySQL, MongoDB',
          'API development and integration',
          'Progressive Web Apps (PWAs)',
          'E-commerce solutions with WooCommerce, Shopify'
        ]
      },
      'ui-design': {
        title: 'UI/UX Design',
        content: [
          'User-centered design approach',
          'Wireframing and prototyping with Figma',
          'Responsive design for all devices',
          'Design systems and component libraries',
          'Accessibility-first design principles',
          'User research and usability testing',
          'Brand identity and visual design'
        ]
      },
      'location': {
        title: 'Bangkok, Thailand',
        content: [
          'Based in the vibrant tech hub of Southeast Asia',
          'Working with international clients globally',
          'Available for remote collaboration',
          'UTC+7 timezone (flexible hours)',
          'Fluent in English and Thai',
          'Understanding of diverse cultural contexts',
          'Local market knowledge for APAC projects'
        ]
      },
      'frontend': {
        title: 'Frontend Development',
        content: [
          'Modern JavaScript (ES6+, TypeScript)',
          'React.js with hooks and context',
          'Vue.js 3 with Composition API',
          'CSS3, Sass, Tailwind CSS',
          'Responsive design and mobile-first approach',
          'Performance optimization and lazy loading',
          'Cross-browser compatibility testing'
        ]
      },
      'backend': {
        title: 'Backend Development',
        content: [
          'Node.js and Express.js APIs',
          'PHP with Laravel and CodeIgniter',
          'RESTful API design and development',
          'Database design and optimization',
          'Authentication and security implementation',
          'Server deployment and maintenance',
          'Cloud services (AWS, Google Cloud)'
        ]
      },
      'seo': {
        title: 'SEO Optimization',
        content: [
          'Technical SEO audit and implementation',
          'On-page optimization strategies',
          'Core Web Vitals improvement',
          'Schema markup and structured data',
          'Site speed optimization',
          'Mobile-first indexing preparation',
          'Analytics setup and monitoring'
        ]
      },
      'clean-code': {
        title: 'Clean Code Practices',
        content: [
          'Readable and maintainable code structure',
          'SOLID principles and design patterns',
          'Code documentation and commenting',
          'Version control with Git best practices',
          'Automated testing (unit, integration)',
          'Code review and refactoring',
          'Continuous integration/deployment'
        ]
      },
      'ux': {
        title: 'User Experience',
        content: [
          'User journey mapping and optimization',
          'Conversion rate optimization (CRO)',
          'A/B testing and data-driven decisions',
          'Loading performance optimization',
          'Intuitive navigation design',
          'Error handling and user feedback',
          'Accessibility compliance (WCAG 2.1)'
        ]
      }
    };

    const topicData = aboutMeData[topic];
    if (!topicData) return;

    const flyingHtml = `
      <div class="flying-about">
        <h2 class="flying-about-title">${topicData.title}</h2>
        <div class="flying-about-list">
          ${topicData.content.map(item => `
            <div class="flying-about-item">
              <span class="flying-about-bullet">•</span>
              <span class="flying-about-text">${item}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingFullContent(contentType) {
    const fullContentData = {
      'about-me-full': {
        title: 'About Leya Thaobunyuen',
        sections: [
          {
            heading: 'Professional Overview',
            content: 'I\'m a passionate freelance web developer and UI designer based in the vibrant city of Bangkok, Thailand. With over 5 years of experience in the industry, I specialize in creating responsive, user-focused websites that seamlessly blend clean design with robust functionality.'
          },
          {
            heading: 'Technical Expertise',
            content: 'My technical stack spans both front-end and back-end development. I work with modern frameworks like React, Vue.js, and Angular for dynamic user interfaces, while leveraging Node.js, PHP, and Laravel for server-side solutions. I\'m also proficient in database design, API development, and cloud deployment.'
          },
          {
            heading: 'Design Philosophy',
            content: 'I believe in user-centered design that prioritizes accessibility, performance, and intuitive navigation. Every project starts with understanding the user\'s needs and business goals, then translating those into pixel-perfect interfaces that drive engagement and conversions.'
          },
          {
            heading: 'Core Values',
            content: 'Clean code, SEO optimization, and exceptional user experiences are at the heart of everything I build. I focus on creating solutions that are not just visually appealing, but also maintainable, scalable, and optimized for search engines and performance.'
          },
          {
            heading: 'Global Collaboration',
            content: 'Working remotely from Bangkok, I collaborate with clients across different time zones and cultures. This has given me valuable insights into diverse market needs and the ability to create solutions that work for global audiences.'
          },
          {
            heading: 'Continuous Growth',
            content: 'The tech industry evolves rapidly, and I stay current with the latest trends, frameworks, and best practices. I\'m always learning new technologies and methodologies to deliver cutting-edge solutions for my clients.'
          }
        ]
      }
    };

    const contentData = fullContentData[contentType];
    if (!contentData) return;

    const flyingHtml = `
      <div class="flying-full-content">
        <h2 class="flying-full-title">${contentData.title}</h2>
        <div class="flying-full-sections">
          ${contentData.sections.map(section => `
            <div class="flying-full-section">
              <h3 class="flying-section-heading">${section.heading}</h3>
              <p class="flying-section-content">${section.content}</p>
            </div>
          `).join('')}
        </div>
        <div class="flying-full-footer">
          <p class="flying-footer-text">Ready to bring your ideas to life? Let's collaborate!</p>
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingJourney(contentType) {
    const journeyData = {
      'my-journey-full': {
        title: 'My Journey Into Tech',
        content: [
          {
            section: 'The Beginning',
            text: 'From curiosity to code, my journey into tech was never just about websites—it\'s about creating experiences that connect people.'
          },
          {
            section: 'Visual Foundation',
            text: 'I started as someone who loved visuals: color palettes, clean layouts, and the way a good design just feels right. But as I explored more, I realized that design alone wasn\'t enough—I wanted to build the logic behind it too. That\'s where development came in.'
          },
          {
            section: 'Learning & Growing',
            text: 'Learning HTML, CSS, and JavaScript opened the doors, and from there, I dove deeper into full-stack web development. The more I learned, the more I wanted to push boundaries and create something meaningful.'
          },
          {
            section: 'Real-World Impact',
            text: 'Over the years, I\'ve built responsive blogs, landing pages with real conversion impact, and full custom CMS-powered sites that clients can manage on their own. I\'ve worked remotely with teams and individuals across different industries, helping them bring their online presence to life with clean, SEO-optimized, and user-friendly websites.'
          },
          {
            section: 'Continuous Learning',
            text: 'Every project taught me something—whether it was optimizing performance, debugging an impossible issue, or understanding how users actually interact with a page. And that\'s what I love about this field—it constantly pushes me to learn, adapt, and improve.'
          },
          {
            section: 'Present & Future',
            text: 'Today, I combine design, code, and strategy to create digital spaces that are both functional and beautiful. I\'m passionate about building sites that don\'t just look good but work great—on every screen, for every user.'
          },
          {
            section: 'The Journey Continues',
            text: 'The journey\'s still ongoing, and I\'m excited for what comes next. Every day brings new challenges, technologies to explore, and opportunities to create something that makes a difference.'
          }
        ]
      }
    };

    const contentData = journeyData[contentType];
    if (!contentData) return;

    const flyingHtml = `
      <div class="flying-journey">
        <h2 class="flying-journey-title">${contentData.title}</h2>
        <div class="flying-journey-content">
          ${contentData.content.map((item, index) => `
            <div class="flying-journey-section" style="animation-delay: ${index * 0.1}s">
              <h3 class="flying-journey-section-title">${item.section}</h3>
              <p class="flying-journey-section-text">${item.text}</p>
            </div>
          `).join('')}
        </div>
        <div class="flying-journey-footer">
          <div class="flying-journey-quote">"Building the web, one experience at a time."</div>
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingSkills(contentType) {
    const skillsData = {
      'skills-full': {
        title: 'Skills & Expertise',
        skills: [
          {
            name: 'Web Development',
            description: 'I build responsive, user-friendly websites using clean HTML, modern CSS (Tailwind CSS is my go-to), and dynamic JavaScript. Whether it\'s a landing page or a full system, I always prioritize performance and accessibility.',
            tools: 'HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), PHP, Python'
          },
          {
            name: 'Back-End & Full Stack',
            description: 'I don\'t just stop at the front. I develop full-stack apps with solid back-end logic, database integration, and RESTful APIs. I make sure the system behind the scenes runs just as smoothly as what users see.',
            tools: 'Node.js, PHP, Python, MySQL, Express.js, REST API integration'
          },
          {
            name: 'UI/UX Design',
            description: 'Design is more than just visuals—it\'s about how users feel when they interact with your site. I create intuitive layouts, smooth animations, and clear navigation to guide users effortlessly.',
            tools: 'Responsive Design, Mobile-First Approach, Clean Layouts, Call-to-Action Flow, Accessibility'
          },
          {
            name: 'SEO & Optimization',
            description: 'I optimize websites from the ground up—faster loading times, mobile responsiveness, and SEO best practices baked into the code. I use data to make design decisions that improve ranking and engagement.',
            tools: 'Meta Tag Structuring, Keyword Planning, Lighthouse Audits, Page Speed Optimization, Google Analytics Integration'
          },
          {
            name: 'Version Control & Workflow',
            description: 'I use Git and GitHub to keep my workflow organized, especially when collaborating with other devs or managing feature updates. I believe in writing maintainable, well-documented code.',
            tools: 'Git, GitHub, VS Code, Trello, Figma (for collab)'
          },
          {
            name: 'Soft Skills',
            description: 'Technical skills are only half the game—I bring clear communication, deadline discipline, and a genuine collaborative mindset to every project. I\'m easy to work with, detail-oriented, and always hungry to learn more.',
            tools: 'Communication, Project Management, Problem Solving, Continuous Learning'
          }
        ]
      }
    };

    const contentData = skillsData[contentType];
    if (!contentData) return;

    const flyingHtml = `
      <div class="flying-skills">
        <h2 class="flying-skills-title">${contentData.title}</h2>
        <div class="flying-skills-sections">
          ${contentData.skills.map((skill, index) => `
            <div class="flying-skills-section" style="animation-delay: ${index * 0.1}s">
              <h3 class="flying-section-heading">${skill.name}</h3>
              <p class="flying-section-description">${skill.description}</p>
              <p class="flying-section-tools"><strong>Tools I use:</strong> ${skill.tools}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingSkillDetail(skillTopic) {
    const skillDetails = {
      'web-development': {
        name: 'Web Development',
        description: 'I build responsive, user-friendly websites using clean HTML, modern CSS (Tailwind CSS is my go-to), and dynamic JavaScript. Whether it\'s a landing page or a full system, I always prioritize performance and accessibility.',
        tools: 'HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), PHP, Python'
      },
      'backend-fullstack': {
        name: 'Back-End & Full Stack',
        description: 'I don\'t just stop at the front. I develop full-stack apps with solid back-end logic, database integration, and RESTful APIs. I make sure the system behind the scenes runs just as smoothly as what users see.',
        tools: 'Node.js, PHP, Python, MySQL, Express.js, REST API integration'
      },
      'ui-ux-design': {
        name: 'UI/UX Design',
        description: 'Design is more than just visuals—it\'s about how users feel when they interact with your site. I create intuitive layouts, smooth animations, and clear navigation to guide users effortlessly.',
        tools: 'Responsive Design, Mobile-First Approach, Clean Layouts, Call-to-Action Flow, Accessibility'
      },
      'seo-optimization': {
        name: 'SEO & Optimization',
        description: 'I optimize websites from the ground up—faster loading times, mobile responsiveness, and SEO best practices baked into the code. I use data to make design decisions that improve ranking and engagement.',
        tools: 'Meta Tag Structuring, Keyword Planning, Lighthouse Audits, Page Speed Optimization, Google Analytics Integration'
      },
      'version-control': {
        name: 'Version Control & Workflow',
        description: 'I use Git and GitHub to keep my workflow organized, especially when collaborating with other devs or managing feature updates. I believe in writing maintainable, well-documented code.',
        tools: 'Git, GitHub, VS Code, Trello, Figma (for collab)'
      },
      'soft-skills': {
        name: 'Soft Skills',
        description: 'Technical skills are only half the game—I bring clear communication, deadline discipline, and a genuine collaborative mindset to every project. I\'m easy to work with, detail-oriented, and always hungry to learn more.',
        tools: 'Communication, Project Management, Problem Solving, Continuous Learning'
      }
    };

    const skillData = skillDetails[skillTopic];
    if (!skillData) return;

    const flyingHtml = `
      <div class="flying-skills">
        <h2 class="flying-skills-title">${skillData.name}</h2>
        <div class="flying-skills-sections">
          <div class="flying-skills-section">
            <p class="flying-section-description">${skillData.description}</p>
            <p class="flying-section-tools"><strong>Tools & Focus Areas:</strong> ${skillData.tools}</p>
          </div>
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingProjects(contentType) {
    const projectsData = {
      'projects-full': {
        title: 'Projects',
        projects: [
          {
            name: 'Blog Website with Admin Dashboard',
            description: 'A full-featured blog website with admin dashboard and editor created using React.js. Features include content management, user authentication, comment/reply functionality, and SEO optimization for better search engine ranking.',
            technologies: 'React.js, Node.js, Express, MongoDB, JWT, SEO Tools',
            links: [
              { label: 'Visit Website', url: 'https://letsgetunstuck.blog/' },
              { label: 'Learn More', url: 'https://letsgetunstuck.blog/' }
            ]
          },
          {
            name: 'E-Commerce Shopify Website',
            description: 'A modern e-commerce website built on the Shopify platform. Features include product catalog, shopping cart, secure payment processing, inventory management, and responsive design for optimal user experience.',
            technologies: 'Shopify, Liquid, JavaScript, CSS, Payment Gateway Integration',
            links: [
              { label: 'Visit Store', url: 'https://realafcollection.com/' },
              { label: 'Shop Now', url: 'https://realafcollection.com/' }
            ]
          }
        ]
      }
    };

    const contentData = projectsData[contentType];
    if (!contentData) return;

    const flyingHtml = `
      <div class="flying-projects">
        <h2 class="flying-projects-title">${contentData.title}</h2>
        <div class="flying-projects-sections">
          ${contentData.projects.map((project, index) => `
            <div class="flying-projects-section" style="animation-delay: ${index * 0.1}s">
              <h3 class="flying-section-heading">${project.name}</h3>
              <p class="flying-section-description">${project.description}</p>
              <p class="flying-section-tools"><strong>Technologies:</strong> ${project.technologies}</p>
              <div class="flying-project-links">
                ${project.links.map(link => `
                  <a href="${link.url}" class="flying-project-link" target="_blank" rel="noopener noreferrer">
                    ${link.label}
                  </a>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingProjectDetail(projectType) {
    const projectDetails = {
      'project-1': {
        name: 'Blog Website with Admin Dashboard',
        description: 'A full-featured blog website with admin dashboard and editor created using React.js. Features include content management, user authentication, comment/reply functionality, and SEO optimization for better search engine ranking.',
        technologies: 'React.js, Node.js, Express, MongoDB, JWT, SEO Tools',
        links: [
          { label: 'Visit Website', url: 'https://letsgetunstuck.blog/' },
          { label: 'Learn More', url: 'https://letsgetunstuck.blog/' }
        ]
      },
      'project-2': {
        name: 'E-Commerce Shopify Website',
        description: 'A modern e-commerce website built on the Shopify platform. Features include product catalog, shopping cart, secure payment processing, inventory management, and responsive design for optimal user experience.',
        technologies: 'Shopify, Liquid, JavaScript, CSS, Payment Gateway Integration',
        links: [
          { label: 'Visit Store', url: 'https://realafcollection.com/' },
          { label: 'Shop Now', url: 'https://realafcollection.com/' }
        ]
      }
    };

    const projectData = projectDetails[projectType];
    if (!projectData) return;

    const flyingHtml = `
      <div class="flying-projects">
        <h2 class="flying-projects-title">${projectData.name}</h2>
        <div class="flying-projects-sections">
          <div class="flying-projects-section">
            <p class="flying-section-description">${projectData.description}</p>
            <p class="flying-section-tools"><strong>Technologies Used:</strong> ${projectData.technologies}</p>
            <div class="flying-project-links">
              ${projectData.links.map(link => `
                <a href="${link.url}" class="flying-project-link" target="_blank" rel="noopener noreferrer">
                  ${link.label}
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingWebDev(contentType) {
    const webDevData = {
      'web-dev-full': {
        title: 'Web Development Expertise',
        sections: [
          {
            name: 'Frontend Development',
            description: 'Creating stunning, interactive user interfaces using modern frameworks and libraries. I specialize in React.js, vanilla JavaScript, and responsive CSS to bring designs to life.',
            tools: 'React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Bootstrap'
          },
          {
            name: 'Backend Development',
            description: 'Building robust server-side applications and APIs that power web applications. I work with Node.js, PHP, and Python to create scalable backend solutions.',
            tools: 'Node.js, Express.js, PHP, Python, RESTful APIs, Database Integration'
          },
          {
            name: 'Full Stack Solutions',
            description: 'End-to-end web application development from concept to deployment. I handle both frontend and backend development to deliver complete web solutions.',
            tools: 'MERN Stack, LAMP Stack, Database Design, API Development, Deployment'
          },
          {
            name: 'Responsive Design',
            description: 'Creating websites that work perfectly across all devices and screen sizes. Mobile-first approach ensures optimal user experience everywhere.',
            tools: 'CSS Grid, Flexbox, Media Queries, Mobile-First Design, Cross-Browser Testing'
          },
          {
            name: 'Performance Optimization',
            description: 'Optimizing websites for speed, SEO, and user experience. I focus on fast loading times, clean code, and search engine optimization.',
            tools: 'Lighthouse Audits, SEO Best Practices, Code Optimization, Image Compression'
          }
        ]
      }
    };

    const contentData = webDevData[contentType];
    if (!contentData) return;

    const flyingHtml = `
      <div class="flying-web-dev">
        <h2 class="flying-web-dev-title">${contentData.title}</h2>
        <div class="flying-web-dev-sections">
          ${contentData.sections.map((section, index) => `
            <div class="flying-web-dev-section" style="animation-delay: ${index * 0.1}s">
              <h3 class="flying-section-heading">${section.name}</h3>
              <p class="flying-section-description">${section.description}</p>
              <p class="flying-section-tools"><strong>Technologies & Tools:</strong> ${section.tools}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingWebDevDetail(webDevType) {
    const webDevDetails = {
      'frontend': {
        name: 'Frontend Development',
        description: 'Creating stunning, interactive user interfaces using modern frameworks and libraries. I specialize in React.js, vanilla JavaScript, and responsive CSS to bring designs to life with smooth animations and optimal user experience.',
        tools: 'React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Bootstrap, GSAP, CSS Animations'
      },
      'backend': {
        name: 'Backend Development',
        description: 'Building robust server-side applications and APIs that power web applications. I work with Node.js, PHP, and Python to create scalable backend solutions with secure authentication and efficient database management.',
        tools: 'Node.js, Express.js, PHP, Python, MySQL, MongoDB, JWT Authentication, RESTful APIs'
      },
      'fullstack': {
        name: 'Full Stack Solutions',
        description: 'End-to-end web application development from concept to deployment. I handle both frontend and backend development, database design, and deployment to deliver complete, production-ready web solutions.',
        tools: 'MERN Stack, LAMP Stack, Database Design, API Development, Git, Docker, AWS, Deployment'
      },
      'responsive': {
        name: 'Responsive Design',
        description: 'Creating websites that work perfectly across all devices and screen sizes. I use mobile-first approach with modern CSS techniques to ensure optimal user experience on desktop, tablet, and mobile devices.',
        tools: 'CSS Grid, Flexbox, Media Queries, Mobile-First Design, Cross-Browser Testing, Viewport Optimization'
      },
      'performance': {
        name: 'Performance Optimization',
        description: 'Optimizing websites for speed, SEO, and user experience. I focus on fast loading times, clean code structure, image optimization, and search engine optimization to ensure websites perform at their best.',
        tools: 'Lighthouse Audits, SEO Best Practices, Code Minification, Image Compression, Caching Strategies'
      }
    };

    const webDevData = webDevDetails[webDevType];
    if (!webDevData) return;

    const flyingHtml = `
      <div class="flying-web-dev">
        <h2 class="flying-web-dev-title">${webDevData.name}</h2>
        <div class="flying-web-dev-sections">
          <div class="flying-web-dev-section">
            <p class="flying-section-description">${webDevData.description}</p>
            <p class="flying-section-tools"><strong>Technologies & Tools:</strong> ${webDevData.tools}</p>
          </div>
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  showFlyingDesign(contentType) {
    if (contentType === 'design-portfolio-full') {
      const flyingHtml = `
        <div class="flying-design">
          <h2 class="flying-design-title">Design Portfolio</h2>
          <div class="flying-design-sections">
            <div class="flying-design-section">
              <h3 class="flying-section-heading">Creative Vision</h3>
              <p class="flying-section-description">I believe design is more than aesthetics—it's about solving problems through visual storytelling. Each project reflects my commitment to creating meaningful connections between brands and their audiences through thoughtful, strategic design solutions.</p>
            </div>
            <div class="flying-design-section">
              <h3 class="flying-section-heading">Design Philosophy</h3>
              <p class="flying-section-description">My approach combines minimalist principles with purposeful functionality. I focus on clean typography, intentional color choices, and user-centered layouts that communicate effectively across all mediums and platforms.</p>
            </div>
            <div class="flying-design-section">
              <h3 class="flying-section-heading">Design Process</h3>
              <p class="flying-section-description">From concept to completion, I follow a structured approach: research and discovery, ideation and sketching, digital design and iteration, client feedback and refinement, and final delivery with brand guidelines.</p>
            </div>
          </div>
        </div>
      `;

      this.flyingContent.innerHTML = flyingHtml;
      this.flyingOverlay.classList.add('active');
      
      // Animate the content flying from book to mid-right
      gsap.fromTo('.flying-content', 
        { 
          scale: 0.5,
          x: '200%',
          y: '-50%',
          opacity: 0 
        },
        { 
          scale: 1,
          x: '0%',
          y: '-50%',
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      );
    }
  }

  showFlyingDesignDetail(designType) {
    const designDetails = {
      'ui-ux': {
        name: 'UI/UX Design',
        description: 'Creating intuitive and engaging user experiences through research-driven design. I focus on user journey mapping, wireframing, prototyping, and usability testing to ensure every interface is both beautiful and functional.',
        tools: 'Figma, Adobe XD, Sketch, InVision, Principle, Miro, UserTesting'
      },
      'branding': {
        name: 'Brand Identity',
        description: 'Developing comprehensive brand identities that capture the essence of businesses and resonate with target audiences. From logo design to complete brand guidelines, I create cohesive visual systems.',
        tools: 'Adobe Illustrator, Photoshop, InDesign, Brand guidelines, Logo design, Color theory'
      },
      'graphic': {
        name: 'Graphic Design',
        description: 'Crafting compelling visual communications for both digital and print media. My work spans from marketing materials and social media graphics to editorial design and packaging concepts.',
        tools: 'Adobe Creative Suite, Canva Pro, Typography, Layout design, Color theory, Print production'
      },
      'digital': {
        name: 'Digital Art',
        description: 'Creating original digital artwork and illustrations that enhance brand storytelling. I work with various digital art techniques to produce unique visuals for web, mobile, and marketing applications.',
        tools: 'Adobe Illustrator, Photoshop, Procreate, Digital illustration, Vector art, Photo manipulation'
      },
      'print': {
        name: 'Print Design',
        description: 'Designing for traditional print media with careful attention to typography, layout, and production requirements. My print work includes brochures, posters, business cards, and editorial layouts.',
        tools: 'InDesign, Illustrator, Print production, Typography, CMYK color, Prepress workflow'
      },
      'wireframes': {
        name: 'Wireframes & Prototypes',
        description: 'Building detailed wireframes and interactive prototypes to visualize user flows and test design concepts before development. This process ensures optimal user experience and reduces development time.',
        tools: 'Figma, Adobe XD, Balsamiq, Axure, InVision, Principle, Interactive prototyping'
      },
      'visual': {
        name: 'Visual Communication',
        description: 'Developing strategic visual communications that effectively convey messages across different platforms and audiences. I focus on creating cohesive visual narratives that align with brand objectives.',
        tools: 'Design systems, Style guides, Visual hierarchy, Information design, Infographics, Presentation design'
      }
    };

    const designData = designDetails[designType];
    if (!designData) return;

    const flyingHtml = `
      <div class="flying-design">
        <h2 class="flying-design-title">${designData.name}</h2>
        <div class="flying-design-sections">
          <div class="flying-design-section">
            <p class="flying-section-description">${designData.description}</p>
            <p class="flying-section-tools"><strong>Tools & Technologies:</strong> ${designData.tools}</p>
          </div>
        </div>
      </div>
    `;

    this.flyingContent.innerHTML = flyingHtml;
    this.flyingOverlay.classList.add('active');
    
    // Animate the content flying from book to mid-right (same as glossary)
    gsap.fromTo('.flying-content', 
      { 
        scale: 0.5,
        x: '200%',
        y: '-50%',
        opacity: 0 
      },
      { 
        scale: 1,
        x: '0%',
        y: '-50%',
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
  }

  setupFlyingGlossaryNavigation(glossaryData) {
    const flyingItems = document.querySelectorAll('.flying-glossary-item');
    flyingItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        const targetPageId = glossaryData[index].pageId;
        
        // Close the flying content first
        this.hideFlyingContent();
        
        // Navigate to the target page after a short delay
        setTimeout(() => {
          this.navigateToPageById(targetPageId);
        }, 600); // Wait for close animation to complete
      });
      
      // Add visual feedback for clickable items
      item.style.cursor = 'pointer';
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(15px) scale(1.02)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0) scale(1)';
      });
    });
  }

  navigateToPageById(targetPageId) {
    // Find the page with the matching data-page-id using our page mapping
    const pageMapping = this.getPageMapping();
    const mappedPage = pageMapping.find(p => p.pageId === targetPageId);
    
    if (!mappedPage) {
      // Fallback to original method if page not in mapping
      const targetPage = document.querySelector(`[data-page-id="${targetPageId}"]`);
      if (!targetPage) return;
      const targetPageIndex = this.pages.indexOf(targetPage);
      if (targetPageIndex === -1) return;
      this.navigateToPage(targetPageIndex);
      return;
    }

    // Use the mapped page index
    const targetPageIndex = mappedPage.arrayIndex;

    if (this.isMobile && !this.isAnimating) {
      // For mobile, use the existing goToPage method
      this.goToPage(targetPageIndex);
    } else if (!this.isMobile) {
      // For desktop, calculate the correct scroll position
      // The scroll animations start at (index + 1) * (window.innerHeight * 0.25)
      // So for page index 2 (About Me), we want to scroll to position where that page is fully visible
      // That would be at scroll position (targetPageIndex + 1) * (window.innerHeight * 0.25)
      const targetScrollPosition = (targetPageIndex + 1) * (window.innerHeight * 0.25);
      
      gsap.to(window, {
        scrollTo: targetScrollPosition,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  }

  navigateToPage(targetPageIndex) {
    if (this.isMobile && !this.isAnimating) {
      // For mobile, use the existing goToPage method
      this.goToPage(targetPageIndex);
    } else if (!this.isMobile) {
      // For desktop, calculate the correct scroll position
      // The scroll animations start at (index + 1) * (window.innerHeight * 0.25)
      const targetScrollPosition = (targetPageIndex + 1) * (window.innerHeight * 0.25);
      
      gsap.to(window, {
        scrollTo: targetScrollPosition,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  }

  hideFlyingContent() {
    gsap.to('.flying-content', {
      scale: 0.5,
      x: '-200%',
      opacity: 0,
      duration: 0.5,
      ease: "back.in(1.7)",
      onComplete: () => {
        this.flyingOverlay.classList.remove('active');
      }
    });
  }

  handleResponsiveDisplay() {
    const navContainer = document.querySelector('.mobile-nav-container');
    if (navContainer) {
      // Ensure navigation only shows on mobile
      navContainer.style.display = this.isMobile ? 'flex' : 'none';
    }
  }

  init() {
    // Set initial z-index for pages
    this.pages.forEach((page, index) => {
      set(page, { 
        z: index === 0 ? this.totalPages : -index * 1,
        rotateY: 0
      });
    });

    // Initial book scaling animation
    to('.book', {
      scrollTrigger: {
        scrub: 1,
        start: () => 0,
        end: () => window.innerHeight * 0.25,
      },
      scale: 1,
      duration: 1
    });
  }

  setupScrollAnimations() {
    // Only setup scroll animations on desktop
    if (!this.isMobile) {
      this.pages.forEach((page, index) => {
        if (index === this.totalPages - 1) return; // Skip last page

        // Page flip animation
        to(page, {
          rotateY: `-=${180 - index / 2}`,
          scrollTrigger: {
            scrub: 1,
            start: () => (index + 1) * (window.innerHeight * 0.25),
            end: () => (index + 2) * (window.innerHeight * 0.25),
            onUpdate: () => this.updateCurrentPage(index + 1)
          },
        });

        // Z-index animation for proper layering
        to(page, {
          z: index === 0 ? -this.totalPages : index,
          scrollTrigger: {
            scrub: 1,
            start: () => (index + 1) * (window.innerHeight * 0.25),
            end: () => (index + 1.5) * (window.innerHeight * 0.25),
          },
        });
      });
    }
  }

  setupMobileNavigation() {
    if (this.isMobile && this.prevBtn && this.nextBtn) {
      // Set total pages display (keep original total of 22)
      this.totalPagesDisplay.textContent = this.totalPages;
      
      this.prevBtn.addEventListener('click', () => {
        if (this.currentPage > 0) {
          console.log(`Prev button: navigating from ${this.currentPage} to ${this.currentPage - 1}`);
          this.goToPage(this.currentPage - 1);
        }
      });

      this.nextBtn.addEventListener('click', () => {
        if (this.currentPage < this.totalPages - 1) {
          console.log(`Next button: navigating from ${this.currentPage} to ${this.currentPage + 1}`);
          this.goToPage(this.currentPage + 1);
        }
      });
      
      // Initialize page display and button states
      this.updatePageDisplay(0);
      this.updateButtonStates();
    }
  }

  goToPage(pageIndex) {
    if (this.isAnimating || !this.isMobile) return;
    
    this.isAnimating = true;
    this.currentPage = pageIndex;
    
    // Debug: log navigation
    const pageId = this.pages[pageIndex]?.getAttribute('data-page-id') || 'unknown';
    console.log(`Navigating to page ${pageIndex}: ${pageId}`);
    
    // Update instructions based on current page
    if (this.pages[pageIndex]) {
      const pageId = this.pages[pageIndex].getAttribute('data-page-id') || 'unknown';
      this.updateInstructionsBasedOnPage(pageId);
    }
    
    // Use the same logic as desktop scroll navigation
    console.log(`\n=== NAVIGATING TO PAGE ${pageIndex} (SIMPLIFIED LOGIC) ===`);
    this.pages.forEach((page, index) => {
      if (index < pageIndex) {
        // Pages before current page - should be flipped and behind
        const zValue = -index - 1;
        const pageId = page.getAttribute('data-page-id') || 'unknown';
        console.log(`Page ${index} (${pageId}): before current, z=${zValue}, rotateY=-180`);
        to(page, {
          rotateY: -180,
          z: zValue,
          duration: 1.5,
          ease: "power2.inOut"
        });
      } else if (index === pageIndex) {
        // Current page - should be on top and visible (flipped or not depending on page)
        const zValue = this.totalPages + 100; // Ensure it's on top
        const pageId = page.getAttribute('data-page-id') || 'unknown';
        const rotateValue = pageIndex === 0 ? 0 : -180; // Cover stays at 0, others at -180
        console.log(`Page ${index} (${pageId}): CURRENT PAGE, z=${zValue}, rotateY=${rotateValue} [ON TOP]`);
        to(page, {
          rotateY: rotateValue,
          z: zValue,
          duration: 1.5,
          ease: "power2.inOut"
        });
      } else {
        // Pages after current page - should be unflipped and stacked
        const zValue = this.totalPages - index;
        const pageId = page.getAttribute('data-page-id') || 'unknown';
        console.log(`Page ${index} (${pageId}): after current, z=${zValue}, rotateY=0`);
        to(page, {
          rotateY: 0,
          z: zValue,
          duration: 1.5,
          ease: "power2.inOut"
        });
      }
    });
    console.log(`=== END NAVIGATION ===\n`);
    
    setTimeout(() => {
      this.isAnimating = false;
      
      // Call the page change callback
      if (this.onPageChange) {
        this.onPageChange(pageIndex);
      }
    }, 800);
    
    // Update display and button states
    this.updatePageDisplay(pageIndex);
    this.updateButtonStates();
    
    // Add this to call onPageChange
    if (this.onPageChange) {
      this.onPageChange(pageIndex);
    }
  }

  updatePageDisplay(pageIndex) {
    if (this.currentPageDisplay) {
      // Use the page mapping to get consistent display numbers
      const pageMapping = this.getPageMapping();
      const mappedPage = pageMapping.find(p => p.arrayIndex === pageIndex);
      
      let displayNumber;
      if (mappedPage) {
        displayNumber = mappedPage.displayNumber;
      } else {
        // Fallback for pages beyond the mapped ones
        displayNumber = pageIndex;
      }
      
      this.currentPageDisplay.textContent = displayNumber;
      
      // Debug log
      if (this.pages[pageIndex]) {
        const pageId = this.pages[pageIndex].getAttribute('data-page-id') || 'no-id';
        const mappedPageName = mappedPage ? mappedPage.text : 'Unknown';
        console.log(`Displaying Page ${displayNumber}/22: ${pageId} (${mappedPageName})`);
      }
    }
  }

  updateButtonStates() {
    if (this.isMobile && this.prevBtn && this.nextBtn) {
      // Disable/enable previous button
      this.prevBtn.disabled = this.currentPage === 0;
      
      // Disable/enable next button
      this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
    }
  }

  updateCurrentPage(pageIndex) {
    if (pageIndex !== this.currentPage) {
      this.currentPage = pageIndex;
      
      // Get the current page element to extract page ID
      if (this.pages[pageIndex]) {
        const pageId = this.pages[pageIndex].getAttribute('data-page-id') || 'unknown';
        this.updateInstructionsBasedOnPage(pageId);
      }
    }
  }
}

// Initialize when DOM is loaded
let blackBook;
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the black book
  blackBook = new BlackBookController();

  // Performance optimization - pause animations when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
});

// Function to check if device is mobile
function isMobileDevice() {
  return window.innerWidth <= 768;
}

// Responsive handling
window.addEventListener('resize', () => {
  const currentIsMobile = isMobileDevice();
  ScrollTrigger.refresh();
  
  // Update mobile state and reinitialize if changed
  if (blackBook && currentIsMobile !== blackBook.isMobile) {
    blackBook.isMobile = currentIsMobile;
    
    // Show/hide navigation based on screen size
    const navContainer = document.querySelector('.mobile-nav-container');
    if (navContainer) {
      navContainer.style.display = currentIsMobile ? 'flex' : 'none';
    }
    
    // Reset to first page when switching between mobile/desktop
    if (currentIsMobile && blackBook.currentPage > 0) {
      blackBook.currentPage = 0;
      blackBook.updatePageDisplay(0);
      blackBook.updateButtonStates();
      
      // Reset all pages to initial state
      blackBook.pages.forEach((page, index) => {
        gsap.set(page, { 
          rotateY: 0,
          z: index === 0 ? blackBook.totalPages : -index * 1
        });
      });
    }
  }
});
