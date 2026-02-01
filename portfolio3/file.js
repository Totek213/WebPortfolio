// Main Application Class
class EcoSwapApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadItems();
        this.animateStats();
        this.checkAuthStatus();
        this.loadCartFromStorage();
        this.setupScrollAnimations();
    }

    setupElements() {
        // Navigation
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Auth Elements
        this.loginBtn = document.getElementById('loginBtn');
        this.registerBtn = document.getElementById('registerBtn');
        this.joinNowBtn = document.getElementById('joinNowBtn');
        this.authModal = document.getElementById('authModal');
        this.closeAuthModal = document.getElementById('closeAuthModal');
        this.authTabs = document.querySelectorAll('.auth-tab');
        this.authForm = document.getElementById('authForm');
        this.authSubmitBtn = document.getElementById('authSubmitBtn');
        this.authModalTitle = document.getElementById('authModalTitle');
        
        // Marketplace Elements
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.itemsGrid = document.getElementById('itemsGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        
        // Cart Elements
        this.cartIcon = document.getElementById('cartIcon');
        this.cartCount = document.getElementById('cartCount');
        this.cartModal = document.getElementById('cartModal');
        this.closeCartModal = document.getElementById('closeCartModal');
        this.cartItems = document.getElementById('cartItems');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        
        // Contact Forms
        this.contactForm = document.getElementById('contactForm');
        this.newsletterForm = document.getElementById('newsletterForm');
        
        // Stats
        this.usersCount = document.getElementById('usersCount');
        this.itemsCount = document.getElementById('itemsCount');
        this.exchangesCount = document.getElementById('exchangesCount');
        
        // Other Buttons
        this.howItWorksBtn = document.getElementById('howItWorksBtn');
        this.newTopicBtn = document.getElementById('newTopicBtn');
    }

    setupEventListeners() {
        // Navigation Events
        this.navToggle.addEventListener('click', () => this.toggleNavMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Auth Events
        this.loginBtn.addEventListener('click', () => this.openAuthModal('login'));
        this.registerBtn.addEventListener('click', () => this.openAuthModal('register'));
        this.joinNowBtn.addEventListener('click', () => this.openAuthModal('register'));
        this.closeAuthModal.addEventListener('click', () => this.closeModal(this.authModal));
        this.authTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchAuthTab(tab.dataset.tab));
        });
        this.authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));

        // Marketplace Events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterItems(btn.dataset.category));
        });
        this.searchBtn.addEventListener('click', () => this.searchItems());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchItems();
        });
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMoreItems());
        }

        // Cart Events
        this.cartIcon.addEventListener('click', () => this.openCart());
        this.closeCartModal.addEventListener('click', () => this.closeModal(this.cartModal));
        this.checkoutBtn.addEventListener('click', () => this.checkout());

        // Contact Form Events
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        // Other Button Events
        if (this.howItWorksBtn) {
            this.howItWorksBtn.addEventListener('click', () => {
                document.querySelector('.how-it-works').scrollIntoView({ behavior: 'smooth' });
            });
        }
        if (this.newTopicBtn) {
            this.newTopicBtn.addEventListener('click', () => this.showNotification('New topic feature coming soon!', 'info'));
        }

        // Add to Cart Events (event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || 
                e.target.closest('.add-to-cart')) {
                const btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const itemId = btn.dataset.id;
                this.addToCart(itemId);
            }
            
            // Contact item owner
            if (e.target.classList.contains('contact-btn') || 
                e.target.closest('.contact-btn')) {
                const btn = e.target.classList.contains('contact-btn') ? e.target : e.target.closest('.contact-btn');
                const itemId = btn.dataset.id;
                this.contactItemOwner(itemId);
            }
            
            // RSVP to events
            if (e.target.classList.contains('btn-primary') && 
                e.target.textContent.includes('RSVP')) {
                const eventTitle = e.target.closest('.event-card').querySelector('h3').textContent;
                this.showNotification(`You've RSVP'd to "${eventTitle}"!`, 'success');
            }
            
            // Forum reply buttons
            if (e.target.classList.contains('btn-outline') && 
                e.target.textContent.includes('Reply')) {
                const topicTitle = e.target.closest('.topic-card').querySelector('.topic-title').textContent;
                this.showNotification(`Replying to: "${topicTitle}"`, 'info');
            }
        });

        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    this.closeModal(modal);
                });
            }
        });
    }

    // Navigation Methods
    toggleNavMenu() {
        this.navMenu.classList.toggle('active');
    }

    handleNavClick(e) {
        // Update active nav link
        this.navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            this.navMenu.classList.remove('active');
        }
    }

    // Auth System Methods
    openAuthModal(mode) {
        this.switchAuthTab(mode);
        this.authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    switchAuthTab(tab) {
        // Update tabs
        this.authTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        // Update form
        const isLogin = tab === 'login';
        this.authModalTitle.innerHTML = isLogin 
            ? '<i class="fas fa-sign-in-alt"></i> Login to EcoSwap' 
            : '<i class="fas fa-user-plus"></i> Join EcoSwap';
        
        this.authSubmitBtn.innerHTML = isLogin
            ? '<i class="fas fa-sign-in-alt"></i> Login'
            : '<i class="fas fa-user-plus"></i> Create Account';
        
        // Show/hide registration fields
        const regFields = ['authNameGroup', 'authLocationGroup', 'authPhoneGroup'];
        regFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.style.display = isLogin ? 'none' : 'block';
            }
        });
    }

    handleAuthSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const isLogin = document.querySelector('.auth-tab.active').dataset.tab === 'login';
        
        if (isLogin) {
            // Simulate login
            localStorage.setItem('ecoswap_user', JSON.stringify({ 
                email, 
                name: 'EcoSwap Member',
                joined: new Date().toISOString()
            }));
            this.showNotification('Successfully logged in!', 'success');
            this.checkAuthStatus();
            this.closeModal(this.authModal);
        } else {
            // Registration
            const name = document.getElementById('authName').value;
            const location = document.getElementById('authLocation').value;
            
            if (!name || !location) {
                this.showNotification('Please fill all required fields', 'error');
                return;
            }
            
            const user = {
                email,
                name,
                location,
                joined: new Date().toISOString()
            };
            
            localStorage.setItem('ecoswap_user', JSON.stringify(user));
            this.showNotification(`Welcome ${name}! Your account has been created.`, 'success');
            
            // Update stats
            this.incrementStat('usersCount');
            
            // Switch to login tab and reset form
            this.switchAuthTab('login');
            this.authForm.reset();
        }
    }

    checkAuthStatus() {
        const user = localStorage.getItem('ecoswap_user');
        if (user) {
            const userData = JSON.parse(user);
            this.loginBtn.innerHTML = `<i class="fas fa-user"></i> ${userData.name}`;
            this.registerBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            
            // Update logout functionality
            this.registerBtn.onclick = () => {
                localStorage.removeItem('ecoswap_user');
                this.showNotification('Successfully logged out', 'info');
                this.checkAuthStatus();
            };
        } else {
            this.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            this.registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
            this.registerBtn.onclick = () => this.openAuthModal('register');
        }
    }

    // Marketplace Methods
    loadItems() {
        const items = this.getSampleItems();
        this.displayItems(items);
        this.itemsCount.textContent = items.length;
    }

    getSampleItems() {
        return [
            {
                id: 1,
                title: "Bosch Power Drill",
                category: "tools",
                description: "Power drill in excellent condition, used only a few times. Complete with bits.",
                price: "For Exchange",
                location: "New York, Manhattan",
                icon: "fas fa-tools",
                badge: "Popular"
            },
            {
                id: 2,
                title: "Fantasy Book Collection",
                category: "books",
                description: "Complete set of 8 fantasy books by various authors. Very good condition.",
                price: "Free",
                location: "Chicago, Downtown",
                icon: "fas fa-book",
                badge: null
            },
            {
                id: 3,
                title: "Children's Bicycle 16\"",
                category: "other",
                description: "Bicycle for children ages 4-6. Good condition, needs gear adjustment.",
                price: "For Exchange",
                location: "San Francisco, Mission",
                icon: "fas fa-bicycle",
                badge: "For Kids"
            },
            {
                id: 4,
                title: "Workshop Hammer",
                category: "tools",
                description: "Heavy-duty workshop hammer. Solid construction with metal head.",
                price: "Free",
                location: "Seattle, Capitol Hill",
                icon: "fas fa-hammer",
                badge: null
            },
            {
                id: 5,
                title: "Samsung Galaxy S10",
                category: "electronics",
                description: "Smartphone in good condition. Screen scratch-free, battery lasts all day.",
                price: "For Exchange",
                location: "Austin, Downtown",
                icon: "fas fa-mobile-alt",
                badge: "Electronics"
            },
            {
                id: 6,
                title: "Vinyl Record Collection - Rock",
                category: "other",
                description: "Collection of 15 rock music vinyl records. Good condition.",
                price: "For Exchange",
                location: "Portland, Pearl District",
                icon: "fas fa-compact-disc",
                badge: "Vintage"
            },
            {
                id: 7,
                title: "Gardening Tools Set",
                category: "tools",
                description: "Complete gardening set: rake, shovel, pruners. Perfect for spring season.",
                price: "For Rent",
                location: "Denver, Highlands",
                icon: "fas fa-leaf",
                badge: "Seasonal"
            },
            {
                id: 8,
                title: "Cookbook Collection",
                category: "books",
                description: "5 cookbooks featuring cuisines from around the world. Many recipes.",
                price: "For Exchange",
                location: "Boston, Back Bay",
                icon: "fas fa-utensils",
                badge: null
            }
        ];
    }

    displayItems(items) {
        this.itemsGrid.innerHTML = '';
        
        items.forEach(item => {
            const itemCard = this.createItemCard(item);
            this.itemsGrid.appendChild(itemCard);
        });
    }

    createItemCard(item) {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.dataset.category = item.category;
        
        div.innerHTML = `
            ${item.badge ? `<div class="item-badge">${item.badge}</div>` : ''}
            <div class="item-image">
                <i class="${item.icon}"></i>
                <div class="item-category">${this.getCategoryName(item.category)}</div>
            </div>
            <div class="item-content">
                <div class="item-header">
                    <h3 class="item-title">${item.title}</h3>
                    <div class="item-price">${item.price}</div>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <div class="item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${item.location}</span>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${item.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline btn-sm contact-btn" data-id="${item.id}">
                            <i class="fas fa-envelope"></i> Message
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return div;
    }

    getCategoryName(category) {
        const categories = {
            'tools': 'Tools',
            'books': 'Books',
            'clothes': 'Clothing',
            'electronics': 'Electronics',
            'other': 'Other'
        };
        return categories[category] || category;
    }

    filterItems(category) {
        // Update active filter
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        // Filter items
        const allItems = this.getSampleItems();
        const filteredItems = category === 'all' 
            ? allItems 
            : allItems.filter(item => item.category === category);
        
        this.displayItems(filteredItems);
    }

    searchItems() {
        const query = this.searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.showNotification('Please enter what you\'re looking for', 'info');
            return;
        }
        
        const allItems = this.getSampleItems();
        const results = allItems.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
        
        if (results.length === 0) {
            this.showNotification(`No items found for "${query}"`, 'info');
        } else {
            this.displayItems(results);
            this.showNotification(`Found ${results.length} items`, 'success');
        }
    }

    loadMoreItems() {
        this.showNotification('Loading more items...', 'info');
        
        // Simulate loading more items
        setTimeout(() => {
            const newItems = [
                {
                    id: 9,
                    title: "Office Chair",
                    category: "other",
                    description: "Ergonomic office chair with adjustable height. Comfortable, very good condition.",
                    price: "For Exchange",
                    location: "Miami, South Beach",
                    icon: "fas fa-chair",
                    badge: null
                },
                {
                    id: 10,
                    title: "Dell Latitude Laptop",
                    category: "electronics",
                    description: "Laptop for basic tasks. Runs smoothly, battery recently replaced.",
                    price: "For Exchange",
                    location: "Atlanta, Midtown",
                    icon: "fas fa-laptop",
                    badge: "Electronics"
                }
            ];
            
            newItems.forEach(item => {
                const itemCard = this.createItemCard(item);
                this.itemsGrid.appendChild(itemCard);
            });
            
            this.showNotification('Added 2 new items', 'success');
            this.loadMoreBtn.disabled = true;
            this.loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Items Loaded';
        }, 1000);
    }

    // Cart System Methods
    addToCart(itemId) {
        const items = this.getSampleItems();
        const item = items.find(i => i.id === parseInt(itemId));
        
        if (!item) return;
        
        let cart = JSON.parse(localStorage.getItem('ecoswap_cart') || '[]');
        
        // Check if item already in cart
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            item.quantity = 1;
            cart.push(item);
        }
        
        localStorage.setItem('ecoswap_cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification(`"${item.title}" added to cart`, 'success');
    }

    contactItemOwner(itemId) {
        const items = this.getSampleItems();
        const item = items.find(i => i.id === parseInt(itemId));
        
        if (item) {
            this.showNotification(`Message sent to owner of "${item.title}"`, 'success');
        }
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('ecoswap_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        this.cartCount.textContent = totalItems;
    }

    openCart() {
        this.updateCartDisplay();
        this.cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('ecoswap_cart') || '[]');
        
        if (cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <h4>Your cart is empty</h4>
                    <p>Add items to your cart to reserve them</p>
                </div>
            `;
            
            document.getElementById('cartItemsCount').textContent = '0';
            document.getElementById('cartDeposit').textContent = '$0';
            document.getElementById('cartTotal').textContent = '$0';
            return;
        }
        
        let itemsCount = 0;
        let html = '';
        
        cart.forEach(item => {
            itemsCount += item.quantity || 1;
            
            html += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-category">${this.getCategoryName(item.category)}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="cart-item-quantity">${item.quantity || 1}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
            `;
        });
        
        this.cartItems.innerHTML = html;
        
        // Update counts
        document.getElementById('cartItemsCount').textContent = itemsCount;
        document.getElementById('cartDeposit').textContent = '$0'; // No deposit system
        document.getElementById('cartTotal').textContent = '$0';
        
        // Add event listeners to cart controls
        this.cartItems.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => this.updateCartQuantity(e.target.dataset.id, -1));
        });
        
        this.cartItems.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', (e) => this.updateCartQuantity(e.target.dataset.id, 1));
        });
        
        this.cartItems.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.removeFromCart(e.target.dataset.id));
        });
    }

    updateCartQuantity(itemId, change) {
        let cart = JSON.parse(localStorage.getItem('ecoswap_cart') || '[]');
        const itemIndex = cart.findIndex(item => item.id === parseInt(itemId));
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + change;
            
            if (cart[itemIndex].quantity < 1) {
                cart.splice(itemIndex, 1);
            }
            
            localStorage.setItem('ecoswap_cart', JSON.stringify(cart));
            this.updateCartCount();
            this.updateCartDisplay();
        }
    }

    removeFromCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('ecoswap_cart') || '[]');
        cart = cart.filter(item => item.id !== parseInt(itemId));
        localStorage.setItem('ecoswap_cart', JSON.stringify(cart));
        this.updateCartCount();
        this.updateCartDisplay();
        this.showNotification('Item removed from cart', 'info');
    }

    checkout() {
        const cart = JSON.parse(localStorage.getItem('ecoswap_cart') || '[]');
        
        if (cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }
        
        const user = localStorage.getItem('ecoswap_user');
        if (!user) {
            this.showNotification('Please login to reserve items', 'error');
            this.closeModal(this.cartModal);
            this.openAuthModal('login');
            return;
        }
        
        // Simulate checkout process
        const itemNames = cart.map(item => item.title).join(', ');
        this.showNotification(`Reservation complete for: ${itemNames}. Item owners will contact you.`, 'success');
        
        // Clear cart and update stats
        localStorage.removeItem('ecoswap_cart');
        this.updateCartCount();
        this.updateCartDisplay();
        this.closeModal(this.cartModal);
        this.incrementStat('exchangesCount');
    }

    loadCartFromStorage() {
        this.updateCartCount();
    }

    // Stats Animation
    animateStats() {
        this.animateCounter(this.usersCount, 1250);
        this.animateCounter(this.itemsCount, 543);
        this.animateCounter(this.exchangesCount, 289);
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    }

    incrementStat(statId) {
        const element = document.getElementById(statId);
        const current = parseInt(element.textContent.replace(/,/g, ''));
        element.textContent = (current + 1).toLocaleString();
    }

    // Form Handlers
    handleContactSubmit(e) {
        e.preventDefault();
        this.showNotification('Message sent! We\'ll respond within 24 hours.', 'success');
        e.target.reset();
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        this.showNotification('Thanks for subscribing to our newsletter!', 'success');
        e.target.reset();
    }

    // WOW Animations on Scroll
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all sections for animation
        document.querySelectorAll('.section-title, .section-subtitle, .item-card, .step-card, .event-card, .topic-card, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(150%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'info': 'info-circle',
            'warning': 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#4CAF50',
            'error': '#FF5722',
            'info': '#2196F3',
            'warning': '#FF9800'
        };
        return colors[type] || '#2196F3';
    }

    // Utility Methods
    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new EcoSwapApp();
    
    // Make app available globally for debugging
    window.EcoSwap = app;
});

// Add some CSS for animations
const style = document.createElement('style');
style.textContent = `
    .section-title, .section-subtitle, .item-card, .step-card, .event-card, .topic-card, .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification {
        font-family: 'Open Sans', sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);