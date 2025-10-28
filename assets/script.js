// ===================================
// Smooth Scrolling for Navigation
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===================================
    // Intersection Observer for Animations
    // ===================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const animatedElements = document.querySelectorAll(
        '.kpi-card, .info-card, .trend-card, .stage-card, ' +
        '.benchmark-card, .risk-card, .profit-card, .checklist-card, ' +
        '.env-stage-card, .conclusion-card'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ===================================
    // Active Navigation Highlighting on Scroll
    // ===================================
    
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // ===================================
    // KPI Card Number Animation
    // ===================================
    
    function animateValue(element, start, end, duration, suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Animate KPI values when they come into view
    const kpiObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueElement = entry.target.querySelector('.kpi-value');
                if (valueElement && !valueElement.dataset.animated) {
                    const text = valueElement.textContent;
                    const match = text.match(/[\d.]+/);
                    
                    if (match) {
                        const value = parseFloat(match[0]);
                        const suffix = text.replace(/[\d.]+/, '').trim();
                        
                        valueElement.textContent = '0';
                        animateValue(valueElement, 0, value, 1500, suffix);
                        valueElement.dataset.animated = 'true';
                    }
                }
                kpiObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.kpi-card').forEach(card => {
        kpiObserver.observe(card);
    });
    
    // ===================================
    // Checklist Functionality
    // ===================================
    
    const checkboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        // Load saved state from localStorage
        const saved = localStorage.getItem(checkbox.id);
        if (saved === 'true') {
            checkbox.checked = true;
        }
        
        // Save state on change
        checkbox.addEventListener('change', function() {
            localStorage.setItem(this.id, this.checked);
            
            // Add completion animation
            if (this.checked) {
                const label = this.nextElementSibling;
                label.style.transition = 'all 0.3s ease';
                label.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    label.style.transform = 'scale(1)';
                }, 300);
            }
        });
    });
    
    // Calculate and display completion percentage
    function updateChecklistProgress() {
        const checklistCards = document.querySelectorAll('.checklist-card');
        
        checklistCards.forEach(card => {
            const checkboxes = card.querySelectorAll('input[type="checkbox"]');
            const total = checkboxes.length;
            const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
            const percentage = Math.round((checked / total) * 100);
            
            // Create or update progress indicator
            let progressIndicator = card.querySelector('.progress-indicator');
            if (!progressIndicator) {
                progressIndicator = document.createElement('div');
                progressIndicator.className = 'progress-indicator';
                progressIndicator.style.cssText = `
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    background: rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                `;
                card.querySelector('.checklist-header').style.position = 'relative';
                card.querySelector('.checklist-header').appendChild(progressIndicator);
            }
            
            progressIndicator.textContent = `${percentage}%`;
        });
    }
    
    // Update progress on load and change
    updateChecklistProgress();
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateChecklistProgress);
    });
    
    // ===================================
    // Image Lazy Loading Enhancement
    // ===================================
    
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading animation
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                img.addEventListener('load', function() {
                    img.style.opacity = '1';
                });
                
                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1 });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // ===================================
    // Print Functionality
    // ===================================
    
    // Add print button (optional)
    const createPrintButton = () => {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '<i class="fas fa-print"></i> 리포트 출력';
        printBtn.className = 'print-button';
        printBtn.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            background: linear-gradient(135deg, #2d7a3e 0%, #1d5a2e 100%);
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 999;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        `;
        
        printBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
        });
        
        printBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });
        
        printBtn.addEventListener('click', function() {
            window.print();
        });
        
        document.body.appendChild(printBtn);
    };
    
    createPrintButton();
    
    // ===================================
    // Back to Top Button
    // ===================================
    
    const createBackToTopButton = () => {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 32px;
            background: white;
            color: #2d7a3e;
            border: 2px solid #2d7a3e;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        backToTopBtn.addEventListener('mouseenter', function() {
            this.style.background = '#2d7a3e';
            this.style.color = 'white';
        });
        
        backToTopBtn.addEventListener('mouseleave', function() {
            this.style.background = 'white';
            this.style.color = '#2d7a3e';
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        document.body.appendChild(backToTopBtn);
    };
    
    createBackToTopButton();
    
    // ===================================
    // Tooltip Enhancement
    // ===================================
    
    // Add tooltips to risk scores
    const riskScores = document.querySelectorAll('.risk-score');
    
    riskScores.forEach(score => {
        score.style.cursor = 'help';
        score.title = '리스크 점수 = 발생 가능성 × 영향도';
    });
    
    // ===================================
    // Data Export Functionality (Future Enhancement)
    // ===================================
    
    window.exportChecklistData = function() {
        const data = {};
        const checkboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent.trim();
            data[label] = checkbox.checked;
        });
        
        // Convert to JSON and download
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'smartfarm-checklist-' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
        
        URL.revokeObjectURL(url);
    };
    
    // ===================================
    // Performance Optimization
    // ===================================
    
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    };
    
    // ===================================
    // Mobile Menu Toggle (for responsive nav)
    // ===================================
    
    if (window.innerWidth < 768) {
        const nav = document.querySelector('.nav');
        const header = document.querySelector('.header-content');
        
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.className = 'menu-toggle';
        menuToggle.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            display: block;
        `;
        
        menuToggle.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'var(--primary-green-dark)';
            nav.style.padding = '16px';
        });
        
        header.insertBefore(menuToggle, nav);
        nav.style.display = 'none';
    }
    
    // ===================================
    // Console Welcome Message
    // ===================================
    
    console.log('%c🌱 스마트팜 데이터 분석 리포트', 'font-size: 20px; color: #2d7a3e; font-weight: bold;');
    console.log('%c김선비 농가 | 방울토마토 (보니또_미푸코)', 'font-size: 14px; color: #1e88e5;');
    console.log('%cROI: 22.80% | 투자회수: 4.39년', 'font-size: 12px; color: #43a047;');
    console.log('%c분석 기준일: 2025년 10월 28일', 'font-size: 12px; color: #616161;');
    
});

// ===================================
// Global Utility Functions
// ===================================

// Format number with commas
window.formatNumber = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Calculate percentage
window.calculatePercentage = function(part, total) {
    return Math.round((part / total) * 100);
};

// Get current date in Korean format
window.getCurrentDateKR = function() {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
};