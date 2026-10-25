// MediFlow Core Application Controller & State Engine

class MediFlowApp {
  constructor() {
    this.currentSection = 'shop';
    this.cart = [
      { id: 'med-1', quantity: 1 },
      { id: 'med-3', quantity: 1 }
    ];
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.deliveryOrder = {
      orderId: 'MED-92418',
      placedAt: 'Today, 6:45 PM',
      currentStep: 3, // 1: Confirmed, 2: Packed, 3: Out for Delivery, 4: Delivered
      rider: {
        name: 'Rahul Sharma',
        vehicle: 'Ather 450X EV (KA-05-EM-4412)',
        rating: 4.9,
        etaMins: 14,
        phone: '+91 98450 77123',
        deliveryOtp: '4829'
      },
      items: [
        { name: 'Dolo 650 (15 Tabs)', qty: 1, price: 32.50 },
        { name: 'Pan-D Capsules (15 Caps)', qty: 1, price: 145.00 }
      ],
      totalAmount: 187.50
    };
    this.schedules = [...INITIAL_DOSAGE_SCHEDULE];

    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindSearchAndFilters();
    this.renderProducts();
    this.renderCart();
    this.renderPharmacyStores();
    this.renderDeliveryTracker();
    this.renderSchedules();
    this.bindModals();
    this.startMapSimulation();
    this.startTelemetrySimulation();
  }

  // --------------------------------------------------------------------------
  // Live Telemetry Simulation: Active Users & Web Ping (Top Left)
  // --------------------------------------------------------------------------
  startTelemetrySimulation() {
    let userCount = 1842;
    let basePing = 22;

    const userCountEl = document.getElementById('live-user-count');
    const pingValEl = document.getElementById('live-ping-val');
    const pingQualityEl = document.getElementById('live-ping-quality');

    // Dynamic user count micro-fluctuations (every 3.2s)
    setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, +1, +2
      userCount = Math.max(1785, Math.min(1925, userCount + delta));
      if (userCountEl) {
        userCountEl.textContent = userCount.toLocaleString();
        userCountEl.classList.add('flash-update');
        setTimeout(() => userCountEl.classList.remove('flash-update'), 750);
      }
    }, 3200);

    // Live Web Ping Jitter Simulation (every 2.8s)
    setInterval(() => {
      const jitter = Math.floor(Math.random() * 9) - 4; // -4 to +4
      const currentPing = Math.max(16, basePing + jitter);
      if (pingValEl) {
        pingValEl.textContent = `${currentPing}ms`;
        if (currentPing <= 30) {
          pingValEl.style.color = '#34d399';
          if (pingQualityEl) {
            pingQualityEl.textContent = 'Optimal';
            pingQualityEl.style.color = '#38bdf8';
          }
        } else {
          pingValEl.style.color = '#fbbf24';
          if (pingQualityEl) {
            pingQualityEl.textContent = 'Good';
            pingQualityEl.style.color = '#fbbf24';
          }
        }
      }
    }, 2800);

    // Interactive Click Tooltips/Toasts
    const pingChip = document.getElementById('ping-telemetry-chip');
    if (pingChip) {
      pingChip.addEventListener('click', () => {
        const pingText = pingValEl ? pingValEl.textContent : '22ms';
        showToast(`⚡ Web Ping: ${pingText} (SSL Gateway: Asia-South1 / Bangalore Hub • Latency: Optimal)`);
      });
    }

    const usersChip = document.querySelector('.live-users-chip');
    if (usersChip) {
      usersChip.addEventListener('click', () => {
        showToast(`👥 ${userCount.toLocaleString()} patients currently active across verified MediFlow pharmacy network.`);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Navigation & View Switching
  // --------------------------------------------------------------------------
  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const target = item.dataset.target;
        this.switchSection(target);
      });
    });

    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
      card.addEventListener('click', () => {
        const target = card.dataset.target;
        this.switchSection(target);
      });
    });

    // Cart Button Trigger
    const cartBtn = document.getElementById('btn-open-cart');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.toggleCartDrawer(true));
    }

    const closeCartBtn = document.getElementById('btn-close-cart');
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => this.toggleCartDrawer(false));
    }

    const cartBackdrop = document.getElementById('cart-drawer-backdrop');
    if (cartBackdrop) {
      cartBackdrop.addEventListener('click', (e) => {
        if (e.target === cartBackdrop) this.toggleCartDrawer(false);
      });
    }
  }

  switchSection(sectionId) {
    this.currentSection = sectionId;

    // Update nav links active state
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.target === sectionId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update section visibility
    document.querySelectorAll('.section').forEach(sec => {
      if (sec.id === `section-${sectionId}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    window.scrollTo({ top: 380, behavior: 'smooth' });

    if (sectionId === 'delivery') {
      this.startMapSimulation();
    }
  }

  // --------------------------------------------------------------------------
  // Medicine Catalog Filtering & Rendering
  // --------------------------------------------------------------------------
  bindSearchAndFilters() {
    const searchInput = document.getElementById('medicine-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderProducts();
      });
    }

    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeCategory = chip.dataset.category;
        this.renderProducts();
      });
    });
  }

  renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    let filtered = MEDICINES_DATA.filter(med => {
      const matchCat = this.activeCategory === 'all' || med.category === this.activeCategory;
      const matchSearch = !this.searchQuery || 
        med.name.toLowerCase().includes(this.searchQuery) ||
        med.genericName.toLowerCase().includes(this.searchQuery) ||
        med.categoryLabel.toLowerCase().includes(this.searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-md);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="color:#fff;">No Medicines Found</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:0.3rem;">
            Try searching for "Paracetamol", "Dolo", "Antibiotics", or "Pan-D".
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(med => {
      const priceUsd = (med.price / 80).toFixed(2);
      const origUsd = (med.originalPrice / 80).toFixed(2);
      const rxBadge = med.prescriptionRequired
        ? `<span class="badge badge-rose">Rx Required</span>`
        : `<span class="badge badge-emerald">OTC Safe</span>`;

      return `
        <div class="product-card" id="card-${med.id}">
          <div class="product-card-top">
            <div class="product-pill-icon">💊</div>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              ${rxBadge}
              <span class="badge badge-teal">⚡ ${med.deliveryTime}</span>
            </div>
          </div>
          <h3>${med.name}</h3>
          <div class="product-generic">${med.genericName} • ${med.dosage}</div>
          <div class="product-manufacturer">By ${med.manufacturer} • ${med.packSize}</div>
          <div class="product-desc">${med.description}</div>
          
          <div class="product-meta-row">
            <span>⭐ ${med.rating} (${med.reviewsCount} reviews)</span>
            <span style="color: #34d399; font-weight: 600;">✓ In Stock</span>
          </div>

          <div class="product-price-row">
            <div class="price-box">
              <span class="current-price">$${priceUsd}</span>
              <span class="original-price">$${origUsd}</span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">(₹${med.price})</span>
            </div>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <button class="btn-ask-ai-card" onclick="window.mediFlowApp.consultAiForMedicine('${med.id}')" title="Ask Dr. MediFlow AI about ${med.name}">
                <span>🤖</span> Ask AI
              </button>
              <button class="btn-add-cart" onclick="window.mediFlowApp.addToCartById('${med.id}')">
                <span>+</span> Add
              </button>
            </div>
          </div>

          <button class="btn-view-details" onclick="window.mediFlowApp.openMedicineDetails('${med.id}')">
            View Dosage, Schedule & Clinical Info ➔
          </button>
        </div>
      `;
    }).join('');
  }

  consultAiForMedicine(medId) {
    const med = MEDICINES_DATA.find(m => m.id === medId);
    if (!med) return;
    this.closeDetailsModal();
    this.switchSection('chat');
    setTimeout(() => {
      if (window.mediFlowChat) {
        window.mediFlowChat.explainMedicine(med.id, 'all');
      }
    }, 350);
  }

  toggleToolPanel(panelKey) {
    const panels = ['interaction', 'quickguide', 'symptoms'];
    panels.forEach(p => {
      const el = document.getElementById(`tool-panel-${p}`);
      if (el) {
        if (p === panelKey) {
          el.style.display = el.style.display === 'none' ? 'block' : 'none';
        } else {
          el.style.display = 'none';
        }
      }
    });
  }

  runInteractionCheckFromTool() {
    const med1 = document.getElementById('interaction-med-1').value;
    const med2 = document.getElementById('interaction-med-2').value;
    this.toggleToolPanel('interaction');
    if (window.mediFlowChat) {
      window.mediFlowChat.askQuestion(`Can I take ${med1} with ${med2}? Is it safe or are there harmful interactions?`);
    }
  }

  askAboutSelectedMed(topic) {
    const select = document.getElementById('quickguide-med-select');
    const medId = select ? select.value : 'med-1';
    this.toggleToolPanel('quickguide');
    if (window.mediFlowChat) {
      window.mediFlowChat.explainMedicine(medId, topic);
    }
  }

  toggleFloatingChat(forceState) {
    const drawer = document.getElementById('floating-ai-drawer');
    if (!drawer) {
      this.switchSection('chat');
      return;
    }
    if (typeof forceState === 'boolean') {
      if (forceState) drawer.classList.add('open');
      else drawer.classList.remove('open');
    } else {
      drawer.classList.toggle('open');
    }
  }

  openMedicineDetails(medId) {
    const med = MEDICINES_DATA.find(m => m.id === medId);
    if (!med) return;

    const modalBackdrop = document.getElementById('details-modal-backdrop');
    const modalContent = document.getElementById('details-modal-content');

    modalContent.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; color: #fff;">${med.name}</h2>
          <div style="color: var(--accent-cyan); font-weight: 600; font-size: 0.9rem;">${med.genericName} (${med.dosage})</div>
        </div>
        <span class="badge ${med.prescriptionRequired ? 'badge-rose' : 'badge-emerald'}">
          ${med.prescriptionRequired ? 'Prescription Required (Rx)' : 'Over The Counter (OTC)'}
        </span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm);">
        <div><strong>Manufacturer:</strong> ${med.manufacturer}</div>
        <div><strong>Form:</strong> ${med.form} (${med.packSize})</div>
        <div><strong>Price:</strong> $${(med.price / 80).toFixed(2)} (₹${med.price})</div>
        <div><strong>Delivery ETA:</strong> ⚡ ${med.deliveryTime}</div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="color: #fff; margin-bottom: 0.4rem;">📋 Dosage & How to Take:</h4>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${med.dosageInstructions}</p>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="color: #fff; margin-bottom: 0.4rem;">⚠️ Precautions & Warnings:</h4>
        <p style="font-size: 0.88rem; color: #fbbf24; line-height: 1.5;">${med.precautions}</p>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="color: #fff; margin-bottom: 0.4rem;">💡 Verified Generic Bioequivalent (Cost Saver):</h4>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.86rem; color: #34d399;">
          ${med.genericAlternative}
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #fff; margin-bottom: 0.5rem;">📍 In Stock Nearby:</h4>
        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
          ${med.stores.map(s => `
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 0.35rem 0; border-bottom: 1px dashed var(--border-card);">
              <span>${s.name} (${s.distance})</span>
              <span style="color: ${s.inStock ? '#34d399' : '#f43f5e'}; font-weight: 600;">${s.inStock ? '✓ Available' : 'Out of Stock'}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--border-card);">
        <button class="btn-secondary" style="border-color: var(--accent-cyan); color: var(--accent-cyan);" onclick="window.mediFlowApp.consultAiForMedicine('${med.id}')">
          <span>🤖</span> Ask Dr. MediFlow AI
        </button>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn-secondary" onclick="window.mediFlowApp.addCustomSchedule('${med.name}', '${med.dosage}', 'As Directed')">
            ⏰ Add to Schedule
          </button>
          <button class="btn-primary" onclick="window.mediFlowApp.addToCartById('${med.id}'); window.mediFlowApp.closeDetailsModal(); window.mediFlowApp.toggleCartDrawer(true);">
            🛒 Add to Cart & Checkout
          </button>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('open');
  }

  closeDetailsModal() {
    const modalBackdrop = document.getElementById('details-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  // --------------------------------------------------------------------------
  // Cart & Checkout Management
  // --------------------------------------------------------------------------
  addToCartById(medId) {
    const existing = this.cart.find(item => item.id === medId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ id: medId, quantity: 1 });
    }
    this.renderCart();
    if (window.mediFlowChat) {
      window.mediFlowChat.updateCartStatusBadge();
    }
    const med = MEDICINES_DATA.find(m => m.id === medId);
    showToast(`Added ${med ? med.name : 'Medicine'} to your cart!`);
  }

  updateQuantity(medId, delta) {
    const itemIndex = this.cart.findIndex(i => i.id === medId);
    if (itemIndex > -1) {
      this.cart[itemIndex].quantity += delta;
      if (this.cart[itemIndex].quantity <= 0) {
        this.cart.splice(itemIndex, 1);
      }
    }
    this.renderCart();
    if (window.mediFlowChat) {
      window.mediFlowChat.updateCartStatusBadge();
    }
  }

  toggleCartDrawer(isOpen) {
    const drawerBackdrop = document.getElementById('cart-drawer-backdrop');
    if (drawerBackdrop) {
      if (isOpen) {
        drawerBackdrop.classList.add('open');
      } else {
        drawerBackdrop.classList.remove('open');
      }
    }
  }

  renderCart() {
    const badge = document.getElementById('cart-count-badge');
    const itemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.textContent = totalCount;

    if (!itemsContainer) return;

    if (this.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛒</div>
          <h4 style="color: #fff;">Your Cart is Empty</h4>
          <p style="font-size: 0.82rem; margin-top: 0.3rem;">Browse medicines and add them to your order.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    let subtotalInr = 0;
    itemsContainer.innerHTML = this.cart.map(cartItem => {
      const med = MEDICINES_DATA.find(m => m.id === cartItem.id);
      if (!med) return '';
      const itemTotal = med.price * cartItem.quantity;
      subtotalInr += itemTotal;
      const priceUsd = (med.price / 80).toFixed(2);

      return `
        <div class="cart-item-card">
          <div class="cart-item-info">
            <h4>${med.name}</h4>
            <p>${med.packSize} • $${priceUsd} ea</p>
          </div>
          <div class="cart-stepper">
            <button class="btn-step" onclick="window.mediFlowApp.updateQuantity('${med.id}', -1)">-</button>
            <span style="font-size: 0.85rem; font-weight: 700; min-width: 18px; text-align: center;">${cartItem.quantity}</span>
            <button class="btn-step" onclick="window.mediFlowApp.updateQuantity('${med.id}', 1)">+</button>
          </div>
        </div>
      `;
    }).join('');

    const subtotalUsd = (subtotalInr / 80).toFixed(2);
    const deliveryFeeUsd = (subtotalInr > 0) ? '1.50' : '0.00';
    const totalUsd = (parseFloat(subtotalUsd) + parseFloat(deliveryFeeUsd)).toFixed(2);

    if (subtotalEl) subtotalEl.textContent = `$${subtotalUsd} (₹${subtotalInr.toFixed(2)})`;
    if (totalEl) totalEl.textContent = `$${totalUsd}`;
  }

  processCheckout() {
    if (this.cart.length === 0) {
      showToast('Your cart is empty. Add medicines first!');
      return;
    }

    this.toggleCartDrawer(false);

    // Update delivery order data with newly placed items
    const placedItems = this.cart.map(c => {
      const med = MEDICINES_DATA.find(m => m.id === c.id);
      return {
        name: `${med.name} (${med.packSize})`,
        qty: c.quantity,
        price: med.price * c.quantity
      };
    });

    const totalInr = placedItems.reduce((acc, curr) => acc + curr.price, 0);

    this.deliveryOrder = {
      orderId: `MED-${Math.floor(10000 + Math.random() * 90000)}`,
      placedAt: 'Just Now',
      currentStep: 2, // Packaged & Ready for Rider
      rider: {
        name: 'Rahul Sharma',
        vehicle: 'Ather 450X EV (KA-05-EM-4412)',
        rating: 4.9,
        etaMins: 12,
        phone: '+91 98450 77123',
        deliveryOtp: `${Math.floor(1000 + Math.random() * 9000)}`
      },
      items: placedItems,
      totalAmount: totalInr
    };

    // Clear cart
    this.cart = [];
    this.renderCart();
    this.renderDeliveryTracker();

    // Switch to delivery section
    this.switchSection('delivery');
    showToast(`Order #${this.deliveryOrder.orderId} placed successfully! Tracking live dispatch.`);
  }

  // --------------------------------------------------------------------------
  // Live Delivery Tracker & Map Animation
  // --------------------------------------------------------------------------
  renderDeliveryTracker() {
    const orderIdEl = document.getElementById('tracking-order-id');
    const orderOtpEl = document.getElementById('tracking-order-otp');
    const riderNameEl = document.getElementById('rider-name');
    const riderVehicleEl = document.getElementById('rider-vehicle');
    const etaMinsEl = document.getElementById('eta-countdown-mins');

    if (orderIdEl) orderIdEl.textContent = `#${this.deliveryOrder.orderId}`;
    if (orderOtpEl) orderOtpEl.textContent = this.deliveryOrder.rider.deliveryOtp;
    if (riderNameEl) riderNameEl.textContent = this.deliveryOrder.rider.name;
    if (riderVehicleEl) riderVehicleEl.textContent = this.deliveryOrder.rider.vehicle;
    if (etaMinsEl) etaMinsEl.textContent = `${this.deliveryOrder.rider.etaMins} mins`;

    // Update stepper classes
    const stepNodes = document.querySelectorAll('.tracking-stepper .step-item');
    stepNodes.forEach((node, idx) => {
      const stepNum = idx + 1;
      node.classList.remove('completed', 'active');
      if (stepNum < this.deliveryOrder.currentStep) {
        node.classList.add('completed');
      } else if (stepNum === this.deliveryOrder.currentStep) {
        node.classList.add('active');
      }
    });
  }

  advanceDeliveryStep() {
    if (this.deliveryOrder.currentStep < 4) {
      this.deliveryOrder.currentStep += 1;
      if (this.deliveryOrder.currentStep === 4) {
        this.deliveryOrder.rider.etaMins = 0;
        showToast('🎉 Medicine Delivered! Verified with OTP.');
      } else {
        this.deliveryOrder.rider.etaMins = Math.max(3, this.deliveryOrder.rider.etaMins - 5);
        showToast(`Delivery status advanced to Step ${this.deliveryOrder.currentStep}!`);
      }
      this.renderDeliveryTracker();
    } else {
      this.deliveryOrder.currentStep = 1;
      this.deliveryOrder.rider.etaMins = 18;
      this.renderDeliveryTracker();
      showToast('Delivery order tracking restarted.');
    }
  }

  startMapSimulation() {
    const canvas = document.getElementById('delivery-map-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let progress = 0.45;
    let forward = true;

    // Define route waypoints
    const startX = 60, startY = 280;
    const midX1 = 180, midY1 = 120;
    const midX2 = 360, midY2 = 220;
    const endX = 520, endY = 80;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw map grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Delivery Route Path
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(midX1, midY1, midX2, midY2);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 5;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Pharmacy Hub (Start)
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(startX, startY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.fillText('🏥 Pharmacy Hub (Apollo)', startX - 20, startY + 22);

      // Draw Destination (User Campus / Home)
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(endX, endY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText('📍 You (Campus Hostel 304)', endX - 50, endY - 14);

      // Calculate Rider position along curve
      if (forward) {
        progress += 0.003;
        if (progress > 0.88) forward = false;
      } else {
        progress -= 0.003;
        if (progress < 0.25) forward = true;
      }

      const t = progress;
      const currentRiderX = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * midX1 + Math.pow(t, 2) * midX2;
      const currentRiderY = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * midY1 + Math.pow(t, 2) * midY2;

      // Radar Pulse around rider
      const pulseSize = 15 + Math.sin(Date.now() / 200) * 8;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(currentRiderX, currentRiderY, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // Rider Marker Icon
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(currentRiderX, currentRiderY, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText('🛵', currentRiderX - 7, currentRiderY + 4);

      // Rider Label
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.fillText('Rahul (Live)', currentRiderX - 25, currentRiderY - 18);

      if (this.currentSection === 'delivery') {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  // --------------------------------------------------------------------------
  // Where to Get / Pharmacy Locator
  // --------------------------------------------------------------------------
  renderPharmacyStores() {
    const container = document.getElementById('pharmacy-stores-grid');
    if (!container) return;

    container.innerHTML = PHARMACY_STORES.map(store => `
      <div class="pharmacy-store-card">
        <div class="store-card-header">
          <div>
            <h3 style="font-size: 1.2rem; color: #fff; margin-bottom: 0.25rem;">${store.name}</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">${store.address}</p>
          </div>
          <span class="badge badge-teal">${store.badge}</span>
        </div>

        <div class="store-info-row">
          <span>📍 <strong>${store.distance}</strong> away</span>
          <span>⭐ ${store.rating}</span>
          <span style="color: #34d399;">🕒 ${store.openHours}</span>
        </div>

        <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; margin-bottom: 1rem;">
          <div style="color: var(--accent-cyan); font-weight: 600; margin-bottom: 0.25rem;">
            ⚡ Express Delivery: ~${store.expressDelivery}
          </div>
          <div style="color: var(--text-muted);">${store.stockConfidence}</div>
        </div>

        <div class="store-action-buttons">
          <button class="btn-primary" style="flex: 1; padding: 0.55rem; font-size: 0.82rem;" onclick="window.mediFlowApp.switchSection('shop'); showToast('Showing catalog for ${store.name}');">
            Browse Store Stock
          </button>
          <a href="tel:${store.phone}" class="btn-secondary" style="padding: 0.55rem 0.95rem; font-size: 0.82rem;">
            📞 Call
          </a>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // Dosage & Schedule Manager
  // --------------------------------------------------------------------------
  renderSchedules() {
    const list = document.getElementById('schedule-items-list');
    const adherenceEl = document.getElementById('adherence-score');

    if (!list) return;

    const takenCount = this.schedules.filter(s => s.taken).length;
    const totalCount = this.schedules.length;
    const percentage = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

    if (adherenceEl) adherenceEl.textContent = `${percentage}%`;

    list.innerHTML = this.schedules.map(sch => `
      <div class="timeline-item" id="sch-item-${sch.id}">
        <div class="time-slot-badge">
          <span>⏰</span> ${sch.timeSlot}
        </div>
        <div class="timeline-content">
          <h4 style="color: #fff;">${sch.medicineName}</h4>
          <p>${sch.dosage} • ${sch.instructions}</p>
          ${sch.taken ? `<span style="font-size: 0.74rem; color: #34d399; font-weight: 600;">✓ Taken at ${sch.timeTaken || '8:05 AM'}</span>` : '<span style="font-size: 0.74rem; color: #fbbf24;">Pending</span>'}
        </div>
        <button class="btn-toggle-taken ${sch.taken ? 'checked' : ''}" onclick="window.mediFlowApp.toggleScheduleTaken('${sch.id}')" title="Toggle Taken">
          ${sch.taken ? '✓' : ''}
        </button>
      </div>
    `).join('');
  }

  toggleScheduleTaken(schId) {
    const sch = this.schedules.find(s => s.id === schId);
    if (sch) {
      sch.taken = !sch.taken;
      sch.timeTaken = sch.taken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
      this.renderSchedules();
      showToast(sch.taken ? `Marked ${sch.medicineName} as taken!` : `Reset ${sch.medicineName} status.`);
    }
  }

  addCustomSchedule(name, dosage, timing) {
    const newSch = {
      id: `sch-${Date.now()}`,
      medicineName: name,
      dosage: dosage,
      timeSlot: 'Next Scheduled Window',
      instructions: timing || 'Take with water as advised',
      taken: false,
      timeTaken: null
    };
    this.schedules.push(newSch);
    this.renderSchedules();
  }

  // Modals & Details Sheet
  bindModals() {
    const closeDetailsBtn = document.getElementById('btn-close-details');
    if (closeDetailsBtn) {
      closeDetailsBtn.addEventListener('click', () => this.closeDetailsModal());
    }
  }
}

// ----------------------------------------------------------------------------
// Utility: Toast Notifications
// ----------------------------------------------------------------------------
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>💊</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 20);

  // Auto remove after 3.2s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// Global initialization hook
document.addEventListener('DOMContentLoaded', () => {
  window.mediFlowApp = new MediFlowApp();
});
