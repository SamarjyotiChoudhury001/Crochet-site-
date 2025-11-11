// Navigation menu (no toggle needed - always visible)
const navMenu = document.querySelector('.nav-menu');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');

// Profile Dropdown functionality
const profileIcon = document.getElementById('profileIcon');
const profileDropdown = document.querySelector('.profile-dropdown');
const profileMenu = document.getElementById('profileMenu');

if (profileIcon && profileDropdown) {
    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = profileDropdown.classList.toggle('active');
        
        // On mobile, prevent body scroll when profile menu is open
        if (window.innerWidth <= 768) {
            document.body.style.overflow = isActive ? 'hidden' : '';
        }
        
        // Close cart if open
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close profile dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (profileDropdown && profileDropdown.classList.contains('active')) {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
            // Restore body scroll on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = '';
            }
        }
    }
});

// Close profile dropdown when clicking on menu items
if (profileMenu) {
    const profileMenuItems = profileMenu.querySelectorAll('.profile-menu-item');
    profileMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't close if it's a login/signup link (let it navigate)
            if (item.querySelector('.fa-sign-in-alt') || item.querySelector('.fa-user-plus')) {
                // Allow navigation
                return;
            }
            e.preventDefault();
            profileDropdown.classList.remove('active');
            // Restore body scroll on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = '';
            }
            // Here you would navigate to the appropriate page
            console.log('Navigate to:', item.textContent.trim());
        });
    });
}

// Close profile dropdown on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profileDropdown && profileDropdown.classList.contains('active')) {
        profileDropdown.classList.remove('active');
        // Restore body scroll on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = '';
        }
    }
});

// Cart functionality
const cartIcon = document.querySelector('.cart-icon-wrapper');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartBadge = document.querySelector('.cart-badge');
const cartTotalPrice = document.querySelector('.cart-total-price');

let cart = [];
let cartTotal = 0;

// Open cart
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
}

// Close cart
if (cartClose) {
    cartClose.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close cart when clicking overlay
if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close cart on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add to cart function
function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: parseFloat(productPrice.replace('$', '')),
            quantity: 1
        });
    }
    
    updateCart();
    updateCartBadge();
    
    // Show cart sidebar
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    updateCartBadge();
}

// Update cart display
function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <a href="#shop" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        cartFooter.style.display = 'none';
        cartTotal = 0;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
        
        cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPrice.textContent = `$${cartTotal.toFixed(2)}`;
        cartFooter.style.display = 'block';
    }
}

// Update cart badge
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Make removeFromCart available globally
window.removeFromCart = removeFromCart;

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.btn-product');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        // Add animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Add to cart
        addToCart(productName, productPrice);
    });
});

// Checkout button
const checkoutButton = document.querySelector('.cart-checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your purchase! This is a demo site. In a real application, you would be redirected to checkout.');
            // In a real app, redirect to checkout page
            // window.location.href = '/checkout';
        }
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('.newsletter-input').value;
        
        // Show success message (you can enhance this with a toast notification)
        alert(`Thank you for subscribing! We'll send updates to ${email}`);
        this.querySelector('.newsletter-input').value = '';
        
        // Here you would typically send the email to your backend
    });
}

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you soon.');
        this.reset();
        
        // Here you would typically send the data to your backend
        console.log('Contact form submitted:', data);
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .gallery-item, .feature-card, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(139, 111, 71, 0.3)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(139, 111, 71, 0.2)';
    }
    
    lastScroll = currentScroll;
});

// Product card hover effects
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Gallery item hover effects
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

