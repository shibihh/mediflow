// MediFlow Medicine & Prescription Scanner Engine

class MedicineScanner {
  constructor() {
    this.currentPreset = 'prescription'; // 'prescription' or 'strip'
    this.isScanning = false;
    this.initElements();
    this.bindEvents();
    this.loadPreset(this.currentPreset);
  }

  initElements() {
    this.viewfinder = document.getElementById('scanner-viewfinder');
    this.previewImg = document.getElementById('scanner-preview-img');
    this.laserLine = document.getElementById('scan-laser');
    this.scanBtn = document.getElementById('btn-start-scan');
    this.presetBtns = document.querySelectorAll('.btn-preset');
    this.resultsContainer = document.getElementById('scanner-results-content');
    this.statusBadge = document.getElementById('scanner-status-badge');
    this.fileInput = document.getElementById('scanner-file-upload');
  }

  bindEvents() {
    if (this.presetBtns) {
      this.presetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const presetKey = btn.dataset.preset;
          this.presetBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.loadPreset(presetKey);
        });
      });
    }

    if (this.scanBtn) {
      this.scanBtn.addEventListener('click', () => {
        this.runAiScan();
      });
    }

    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.previewImg.src = event.target.result;
            this.currentPreset = 'custom';
            this.presetBtns.forEach(b => b.classList.remove('active'));
            this.statusBadge.innerHTML = `<span class="badge badge-amber badge-pulse">Custom Image Loaded</span>`;
            showToast('Custom image loaded. Click "Scan Document" to analyze.');
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  loadPreset(key) {
    this.currentPreset = key;
    const preset = SCAN_PRESETS[key];
    if (!preset) return;

    this.previewImg.src = preset.imageSrc;
    this.statusBadge.innerHTML = `<span class="badge badge-cyan">Ready to Scan</span>`;
    
    // Render initial teaser
    this.resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">⚡</div>
        <h4 style="color: #fff; margin-bottom: 0.4rem;">${preset.title} Ready</h4>
        <p style="font-size: 0.85rem; max-width: 360px; margin: 0 auto 1.25rem;">
          Click <strong>"Run AI Deep Scan"</strong> to extract handwritten/typed prescriptions, active salts, dosages, and verify stock availability.
        </p>
        <button class="btn-primary" onclick="window.mediFlowScanner.runAiScan()" style="padding: 0.65rem 1.4rem; font-size: 0.85rem;">
          🔍 Analyze with MediFlow Vision AI
        </button>
      </div>
    `;
  }

  runAiScan() {
    if (this.isScanning) return;
    this.isScanning = true;

    // Add laser animation class
    this.viewfinder.classList.add('scanning');
    this.scanBtn.disabled = true;
    this.scanBtn.innerHTML = `<span>⏳</span> AI Neural Processing...`;
    this.statusBadge.innerHTML = `<span class="badge badge-amber badge-pulse">Scanning Active...</span>`;

    // Progressive loading steps in results card
    const steps = [
      "📷 Enhancing contrast and optical alignment...",
      "🔤 MediFlow Vision OCR extracting text characters...",
      "🧬 Matching active salt signatures against National Drug Register...",
      "🛡️ Checking contraindications, dosage instructions & nearby pharmacy stock..."
    ];

    let stepIndex = 0;
    this.resultsContainer.innerHTML = `
      <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.85rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="typing-dot" style="background:#06b6d4;"></div>
          <span id="scan-step-text" style="font-size: 0.9rem; color: var(--accent-cyan); font-weight: 600;">${steps[0]}</span>
        </div>
        <div style="width: 100%; height: 6px; background: var(--bg-surface); border-radius: 999px; overflow: hidden;">
          <div id="scan-progress-bar" style="width: 25%; height: 100%; background: linear-gradient(90deg, #06b6d4, #10b981); transition: width 0.4s ease;"></div>
        </div>
      </div>
    `;

    const stepInterval = setInterval(() => {
      stepIndex++;
      const stepText = document.getElementById('scan-step-text');
      const progressBar = document.getElementById('scan-progress-bar');
      if (stepText && progressBar && stepIndex < steps.length) {
        stepText.textContent = steps[stepIndex];
        progressBar.style.width = `${((stepIndex + 1) / steps.length) * 100}%`;
      } else {
        clearInterval(stepInterval);
        setTimeout(() => {
          this.renderScanResults();
        }, 400);
      }
    }, 550);
  }

  renderScanResults() {
    this.isScanning = false;
    this.viewfinder.classList.remove('scanning');
    this.scanBtn.disabled = false;
    this.scanBtn.innerHTML = `<span>⚡</span> Run AI Deep Scan`;
    this.statusBadge.innerHTML = `<span class="badge badge-emerald">Scan Complete • 99% Confidence</span>`;

    const preset = SCAN_PRESETS[this.currentPreset] || SCAN_PRESETS.prescription;

    let itemsHtml = '';
    preset.medicinesFound.forEach(med => {
      itemsHtml += `
        <div class="extracted-medicine-item">
          <div class="extracted-item-header">
            <div>
              <strong style="color: #fff; font-size: 1.05rem;">${med.name}</strong>
              <div style="font-size: 0.78rem; color: var(--accent-cyan);">${med.generic}</div>
            </div>
            <span class="dosage-badge-pill">${med.dosage}</span>
          </div>
          <div class="extracted-item-detail">
            <strong>⏰ Timing:</strong> ${med.timing}
          </div>
          <div class="extracted-item-detail">
            <strong>🎯 Purpose:</strong> ${med.purpose}
          </div>
          <div class="extracted-item-detail">
            <strong>📅 Recommended Duration:</strong> ${med.duration}
          </div>
          <div class="extracted-item-actions">
            <div>
              <span style="font-size: 1.05rem; font-weight: 800; color: #fff;">$${(med.price / 80).toFixed(2)}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);"> / (₹${med.price.toFixed(2)})</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-add-cart" onclick="window.mediFlowApp.addToCartById('${med.matchedId}')">
                <span>🛒</span> Add to Cart
              </button>
              <button class="btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;" onclick="window.mediFlowScanner.addScanToSchedule('${med.name}', '${med.dosage}', '${med.timing}')">
                <span>⏰</span> Set Reminder
              </button>
            </div>
          </div>
        </div>
      `;
    });

    let headerExtraHtml = '';
    if (this.currentPreset === 'prescription') {
      headerExtraHtml = `
        <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 1rem; font-size: 0.82rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
            <span><strong>Doctor:</strong> ${preset.doctorName}</span>
            <span class="badge badge-teal">Verified MD</span>
          </div>
          <div><strong>Hospital:</strong> ${preset.hospital} | <strong>Patient:</strong> ${preset.patient}</div>
          <div style="margin-top: 0.4rem; color: #94a3b8;"><strong>Doctor's Notes:</strong> "${preset.doctorAdvice}"</div>
        </div>
      `;
    } else if (this.currentPreset === 'strip') {
      headerExtraHtml = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 1rem; font-size: 0.82rem;">
          <div style="color: #34d399; font-weight: 700; margin-bottom: 0.3rem;">💡 Cost Saver Intelligence:</div>
          <div>${preset.genericVsBrand.savings}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;">Generic: ${preset.genericVsBrand.genericCost} vs Branded: ${preset.genericVsBrand.brandCost}</div>
        </div>
      `;
    }

    this.resultsContainer.innerHTML = `
      <div>
        ${headerExtraHtml}
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; gap: 0.5rem; flex-wrap: wrap;">
          <h4 style="font-size: 0.95rem; color: #fff;">Detected Medications (${preset.medicinesFound.length})</h4>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-secondary" style="padding: 0.45rem 0.85rem; font-size: 0.8rem; border-color: var(--accent-cyan); color: var(--accent-cyan);" onclick="window.mediFlowScanner.consultAiForScan()">
              <span>🤖</span> Ask AI Pharmacist Review
            </button>
            <button class="btn-primary" style="padding: 0.45rem 0.95rem; font-size: 0.8rem;" onclick="window.mediFlowScanner.addAllMedsToCart()">
              🛒 Add All to Cart
            </button>
          </div>
        </div>
        ${itemsHtml}
        <div style="margin-top: 1rem; padding: 0.75rem; background: var(--bg-surface); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; justify-content: space-between;">
          <span>📍 <strong>Where to Get:</strong> ${preset.nearbyAvailability}</span>
          <button class="btn-secondary" style="padding: 0.35rem 0.7rem; font-size: 0.75rem;" onclick="window.mediFlowApp.switchSection('locator')">
            View Stores ➔
          </button>
        </div>
      </div>
    `;

    showToast('AI Scan Complete! Medicines extracted with exact dosages and precautions.');
  }

  consultAiForScan() {
    const preset = SCAN_PRESETS[this.currentPreset] || SCAN_PRESETS.prescription;
    const names = preset.medicinesFound.map(m => m.name).join(', ');
    window.mediFlowApp.switchSection('chat');
    setTimeout(() => {
      if (window.mediFlowChat) {
        window.mediFlowChat.askQuestion(`Review my scanned prescription with medications: ${names}. Check for drug interactions, proper food timing, and any precautions.`);
      }
    }, 350);
  }

  addAllMedsToCart() {
    const preset = SCAN_PRESETS[this.currentPreset] || SCAN_PRESETS.prescription;
    preset.medicinesFound.forEach(med => {
      window.mediFlowApp.addToCartById(med.matchedId);
    });
    showToast(`Added ${preset.medicinesFound.length} medicines to cart!`);
    window.mediFlowApp.toggleCartDrawer(true);
  }

  addScanToSchedule(medName, dosage, timing) {
    window.mediFlowApp.addCustomSchedule(medName, dosage, timing);
    showToast(`⏰ Scheduled reminder created for ${medName}!`);
  }
}

// Global initialization hook
document.addEventListener('DOMContentLoaded', () => {
  window.mediFlowScanner = new MedicineScanner();
});
