// Main JavaScript for Mountain Viz 2025 Conference Website

document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const backToTopButton = document.getElementById('backToTop');
    const navbar = document.querySelector('.navbar');
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate navbar height for offset
                const navbarHeight = navbar.offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button functionality
    window.addEventListener('scroll', () => {
        // Show/hide back to top button
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
        
        // Add shadow to navbar on scroll
        if (window.pageYOffset > 10) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Fade-in animations with Intersection Observer
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });
    
    // Mobile menu close when item clicked
    document.querySelectorAll('.navbar-menu .navbar-item').forEach(item => {
        item.addEventListener('click', () => {
            const burger = document.querySelector('.navbar-burger');
            const menu = document.querySelector('.navbar-menu');
            
            if (menu.classList.contains('is-active')) {
                burger.classList.remove('is-active');
                menu.classList.remove('is-active');
            }
        });
    });
    
    // Fix for Alpine.js tabs
    // This ensures the schedule tabs work properly by manually triggering Alpine.js data updates
    document.addEventListener('alpine:init', () => {
        const scheduleTabs = document.querySelectorAll('.tabs li a');
        scheduleTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const clickAttr = this.getAttribute('@click') || this.getAttribute('x-on:click');
                if (clickAttr) {
                    // Extract the tab id from the Alpine.js click attribute
                    const tabMatch = clickAttr.match(/activeTab\s*=\s*['"]([^'"]+)['"]/);
                    if (tabMatch && tabMatch[1]) {
                        const tabId = tabMatch[1];
                        
                        // Force all tab content visibility based on the clicked tab
                        document.querySelectorAll('.schedule-day').forEach(content => {
                            if (content.getAttribute('x-show').includes(tabId)) {
                                content.style.display = 'block';
                            } else {
                                content.style.display = 'none';
                            }
                        });
                        
                        // Update the active class on tab buttons
                        document.querySelectorAll('.tabs li').forEach(tabLi => {
                            if (tabLi.contains(this)) {
                                tabLi.classList.add('is-active');
                            } else {
                                tabLi.classList.remove('is-active');
                            }
                        });
                    }
                }
            });
        });
    });
    
    // Fallback for Alpine.js tabs if alpine:init doesn't trigger
    setTimeout(() => {
        if (!window.Alpine) {
            // Direct tab switching without Alpine.js
            const scheduleTabs = document.querySelectorAll('.tabs li a');
            scheduleTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const clickAttr = this.getAttribute('@click') || this.getAttribute('x-on:click');
                    if (clickAttr) {
                        // Extract the tab id
                        const tabMatch = clickAttr.match(/activeTab\s*=\s*['"]([^'"]+)['"]/);
                        if (tabMatch && tabMatch[1]) {
                            const tabId = tabMatch[1];
                            
                            // Update tab contents
                            document.querySelectorAll('.schedule-day').forEach(content => {
                                const showAttr = content.getAttribute('x-show');
                                if (showAttr && showAttr.includes(tabId)) {
                                    content.style.display = 'block';
                                } else {
                                    content.style.display = 'none';
                                }
                            });
                            
                            // Update active tab
                            document.querySelectorAll('.tabs li').forEach(tabLi => {
                                if (tabLi.contains(this)) {
                                    tabLi.classList.add('is-active');
                                } else {
                                    tabLi.classList.remove('is-active');
                                }
                            });
                        }
                    }
                });
            });
            
            // Initialize first tab as active
            const firstTab = document.querySelector('.tabs li:first-child');
            if (firstTab) {
                firstTab.classList.add('is-active');
                const firstTabId = 'day1'; // Default first tab id
                
                document.querySelectorAll('.schedule-day').forEach(content => {
                    const showAttr = content.getAttribute('x-show');
                    if (showAttr && showAttr.includes(firstTabId)) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                });
            }
        }
    }, 500);
});