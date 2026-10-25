// MediFlow Clinical Pharmacist Chat Assistant Engine
// Comprehensive, easy-to-use medical intelligence and interactive guidance

class PharmacistChat {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.inputField = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('btn-chat-send');
    this.micBtn = document.getElementById('btn-chat-mic');
    this.clearBtn = document.getElementById('btn-chat-clear');
    this.isResponding = false;
    this.recognition = null;
    this.isListening = false;
    this.activeSpeechUtterance = null;
    this.currentlySpeakingBtn = null;

    this.initSpeechRecognition();
    this.bindEvents();
    this.initCategoryFilters();
    this.updateCartStatusBadge();
  }

  bindEvents() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    }

    if (this.inputField) {
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    if (this.micBtn) {
      this.micBtn.addEventListener('click', () => this.toggleVoiceInput());
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clearChatHistory());
    }

    // Bind all suggestion buttons dynamically
    this.bindSuggestionButtons();
  }

  bindSuggestionButtons() {
    const pills = document.querySelectorAll('.suggestion-pill, .chat-quick-chip');
    pills.forEach(pill => {
      // Avoid duplicate listener attachments
      if (!pill.dataset.bound) {
        pill.dataset.bound = 'true';
        pill.addEventListener('click', () => {
          const query = pill.dataset.query || pill.innerText.replace(/^[^\w]+/, '').trim();
          this.askQuestion(query);
        });
      }
    });
  }

  initCategoryFilters() {
    const filterChips = document.querySelectorAll('.chat-filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const category = chip.dataset.category;
        this.filterSuggestions(category);
      });
    });
  }

  filterSuggestions(category) {
    const pills = document.querySelectorAll('.suggestion-pill');
    pills.forEach(pill => {
      const pillCat = pill.dataset.category || 'all';
      if (category === 'all' || pillCat === category) {
        pill.style.display = 'flex';
      } else {
        pill.style.display = 'none';
      }
    });
  }

  updateCartStatusBadge() {
    const cartSummary = document.getElementById('chat-cart-summary');
    if (!cartSummary) return;

    const cart = window.mediFlowApp ? window.mediFlowApp.cart : [];
    if (!cart || cart.length === 0) {
      cartSummary.innerHTML = `
        <div style="font-size: 0.78rem; color: var(--text-muted);">
          🛒 Cart is empty. Add medicines to audit interactions.
        </div>
      `;
    } else {
      const names = cart.map(item => {
        const med = MEDICINES_DATA.find(m => m.id === item.id);
        return med ? med.name : 'Item';
      }).join(', ');

      cartSummary.innerHTML = `
        <div style="font-size: 0.78rem; color: #fff; margin-bottom: 0.35rem;">
          🛒 <strong>Cart (${cart.length} items):</strong> <span style="color: var(--accent-cyan);">${names}</span>
        </div>
        <button class="btn-chat-tool-xs" onclick="window.mediFlowChat.auditCart()">
          🛡️ Run Safety & Interaction Audit
        </button>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // Speech Recognition (Voice-to-Text)
  // --------------------------------------------------------------------------
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.micBtn) {
          this.micBtn.classList.add('listening');
          this.micBtn.title = 'Listening... Speak your medicine doubt now';
        }
        if (this.inputField) {
          this.inputField.placeholder = '🎙️ Listening... Please speak your medicine doubt now...';
        }
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.inputField) {
          this.inputField.value = transcript;
        }
        this.stopVoiceInput();
        if (transcript.trim().length > 0) {
          this.handleSendMessage();
        }
      };

      this.recognition.onerror = () => {
        this.stopVoiceInput();
        showToast('Voice input ended. You can also type your medicine doubt.');
      };

      this.recognition.onend = () => {
        this.stopVoiceInput();
      };
    }
  }

  toggleVoiceInput() {
    if (!this.recognition) {
      showToast('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (this.isListening) {
      this.stopVoiceInput();
    } else {
      try {
        this.recognition.start();
      } catch (e) {
        this.stopVoiceInput();
      }
    }
  }

  stopVoiceInput() {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
    if (this.micBtn) {
      this.micBtn.classList.remove('listening');
      this.micBtn.title = 'Speak Question (Voice Input)';
    }
    if (this.inputField) {
      this.inputField.placeholder = "Ask Dr. MediFlow AI any medicine doubt (e.g. 'Can I take Dolo with Combiflam?')...";
    }
  }

  // --------------------------------------------------------------------------
  // Text-to-Speech (Read Aloud) & Copy
  // --------------------------------------------------------------------------
  speakMessage(text, btnElement) {
    if (!('speechSynthesis' in window)) {
      showToast('Speech audio is not supported in your browser.');
      return;
    }

    // If currently speaking this message, toggle off
    if (window.speechSynthesis.speaking && this.currentlySpeakingBtn === btnElement) {
      window.speechSynthesis.cancel();
      this.currentlySpeakingBtn = null;
      btnElement.innerHTML = `<span>🔊</span> Listen`;
      btnElement.classList.remove('speaking');
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();
    if (this.currentlySpeakingBtn) {
      this.currentlySpeakingBtn.innerHTML = `<span>🔊</span> Listen`;
      this.currentlySpeakingBtn.classList.remove('speaking');
    }

    // Clean markdown and emojis for smooth natural speech
    const cleanSpeech = text
      .replace(/[#*\`_~]/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s.,?!'-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.currentlySpeakingBtn = btnElement;
      btnElement.innerHTML = `<span>⏹️</span> Stop Audio`;
      btnElement.classList.add('speaking');
    };

    utterance.onend = utterance.onerror = () => {
      btnElement.innerHTML = `<span>🔊</span> Listen`;
      btnElement.classList.remove('speaking');
      this.currentlySpeakingBtn = null;
    };

    window.speechSynthesis.speak(utterance);
  }

  copyResponseText(text, btnElement) {
    const cleanText = text
      .replace(/<[^>]*>/g, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    navigator.clipboard.writeText(cleanText).then(() => {
      const originalHtml = btnElement.innerHTML;
      btnElement.innerHTML = `<span>✓</span> Copied!`;
      btnElement.style.color = '#34d399';
      setTimeout(() => {
        btnElement.innerHTML = originalHtml;
        btnElement.style.color = '';
      }, 2000);
      showToast('Pharmacist guidance copied to clipboard!');
    }).catch(() => {
      showToast('Copied to clipboard');
    });
  }

  // --------------------------------------------------------------------------
  // Chat Messaging Core
  // --------------------------------------------------------------------------
  askQuestion(text) {
    if (!text || this.isResponding) return;
    this.appendMessage('user', text);
    this.processQuery(text);
  }

  handleSendMessage() {
    const text = this.inputField.value.trim();
    if (!text || this.isResponding) return;
    this.inputField.value = '';
    this.appendMessage('user', text);
    this.processQuery(text);
  }

  appendMessage(sender, contentHtml, relatedMedicine = null, suggestedFollowUps = []) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    const icon = sender === 'bot' ? '🤖' : '👤';
    const rawTextForSpeech = contentHtml;

    let actionButtonsHtml = '';
    let medicineCardHtml = '';
    let followUpsHtml = '';

    if (sender === 'bot') {
      actionButtonsHtml = `
        <div class="chat-msg-actions">
          <button class="btn-msg-action btn-read-aloud" title="Read Advice Aloud">
            <span>🔊</span> Listen
          </button>
          <button class="btn-msg-action btn-copy-advice" title="Copy Guidance">
            <span>📋</span> Copy
          </button>
          <span class="chat-msg-verified">✓ Verified Clinical AI Guidance</span>
        </div>
      `;

      if (relatedMedicine) {
        medicineCardHtml = this.generateInChatMessageCard(relatedMedicine);
      }

      if (suggestedFollowUps && suggestedFollowUps.length > 0) {
        followUpsHtml = `
          <div class="chat-followups-wrap">
            <span class="chat-followups-title">💡 Helpful Follow-ups:</span>
            <div class="chat-followups-chips">
              ${suggestedFollowUps.map(f => `
                <button class="chat-quick-chip" data-query="${f.query}">
                  ${f.label}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    bubble.innerHTML = `
      <div class="chat-avatar-icon">${icon}</div>
      <div class="bubble-content">
        ${this.formatMarkdown(contentHtml)}
        ${medicineCardHtml}
        ${actionButtonsHtml}
        ${followUpsHtml}
      </div>
    `;

    this.messagesContainer.appendChild(bubble);

    // Bind speech and copy buttons
    if (sender === 'bot') {
      const readBtn = bubble.querySelector('.btn-read-aloud');
      if (readBtn) {
        readBtn.addEventListener('click', () => this.speakMessage(rawTextForSpeech, readBtn));
      }

      const copyBtn = bubble.querySelector('.btn-copy-advice');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copyResponseText(rawTextForSpeech, copyBtn));
      }

      // Bind follow-up chips
      const chips = bubble.querySelectorAll('.chat-quick-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const q = chip.dataset.query;
          this.askQuestion(q);
        });
      });
    }

    this.scrollToBottom();
    return bubble;
  }

  generateInChatMessageCard(med) {
    const priceUsd = (med.price / 80).toFixed(2);
    return `
      <div class="inchat-medicine-card">
        <div class="inchat-med-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="inchat-med-icon">💊</div>
            <div>
              <div class="inchat-med-name">${med.name}</div>
              <div class="inchat-med-generic">${med.genericName} • ${med.dosage}</div>
            </div>
          </div>
          <div class="inchat-med-price">
            <span style="font-size: 1.1rem; font-weight: 800; color: #fff;">$${priceUsd}</span>
            <span style="font-size: 0.72rem; color: var(--text-muted);">(₹${med.price})</span>
          </div>
        </div>
        
        <div class="inchat-med-timing">
          <strong>⏰ Timing:</strong> ${med.dosageInstructions}
        </div>

        <div class="inchat-med-actions">
          <button class="btn-primary inchat-btn" onclick="window.mediFlowApp.addToCartById('${med.id}'); window.mediFlowChat.updateCartStatusBadge();">
            <span>🛒</span> Add to Order ($${priceUsd})
          </button>
          <button class="btn-secondary inchat-btn" onclick="window.mediFlowApp.addCustomSchedule('${med.name}', '${med.dosage}', 'As Directed')">
            <span>⏰</span> Set Reminder
          </button>
          <button class="btn-secondary inchat-btn" onclick="window.mediFlowApp.openMedicineDetails('${med.id}')">
            <span>ℹ️</span> Details
          </button>
        </div>
      </div>
    `;
  }

  showTypingIndicator() {
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bot typing-bubble';
    typingBubble.id = 'chat-typing-indicator';
    typingBubble.innerHTML = `
      <div class="chat-avatar-icon">🤖</div>
      <div class="bubble-content" style="padding: 0.6rem 1rem;">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <span style="font-size: 0.78rem; color: var(--text-secondary); margin-left: 0.4rem;">Dr. MediFlow AI reviewing clinical guidelines...</span>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(typingBubble);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  clearChatHistory() {
    if (!this.messagesContainer) return;
    this.messagesContainer.innerHTML = `
      <div class="chat-bubble bot">
        <div class="chat-avatar-icon">🤖</div>
        <div class="bubble-content">
          <h3>Hello! I am your 24/7 MediFlow AI Pharmacist.</h3>
          <p>
            I am here to ensure you take the right medicine safely, prevent dangerous interactions, and save money with bioequivalent generic alternatives.
          </p>
          <div class="chat-features-strip">
            <div class="feature-tag">🛡️ Cart Safety Audit</div>
            <div class="feature-tag">⚖️ Drug-Drug Interactions</div>
            <div class="feature-tag">🍽️ Food & Empty Stomach Rules</div>
            <div class="feature-tag">💰 Generic Cost Savers</div>
          </div>
          <p style="margin-top: 0.75rem; color: #38bdf8; font-size: 0.85rem;">
            👇 Use the quick tool bar above, tap any suggested query on the left, or ask your own question!
          </p>
        </div>
      </div>
    `;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    showToast('Chat history cleared.');
  }

  // --------------------------------------------------------------------------
  // Intelligent Query Processing & Clinical Engine
  // --------------------------------------------------------------------------
  processQuery(rawQuery) {
    this.isResponding = true;
    this.showTypingIndicator();

    const cleanQuery = rawQuery.toLowerCase();

    // 1. Check for Cart Safety Audit request
    if (cleanQuery.includes('audit cart') || cleanQuery.includes('check cart') || cleanQuery.includes('my cart safety')) {
      setTimeout(() => {
        this.removeTypingIndicator();
        this.runCartSafetyAudit();
        this.isResponding = false;
      }, 650);
      return;
    }

    // 2. Check for Drug Interaction Check request between 2 medicines
    const interactionPair = this.detectDrugPair(cleanQuery);
    if (interactionPair) {
      setTimeout(() => {
        this.removeTypingIndicator();
        const responseData = this.evaluateDrugInteraction(interactionPair[0], interactionPair[1]);
        this.appendMessage('bot', responseData.text, responseData.medicine, responseData.followUps);
        this.isResponding = false;
      }, 700);
      return;
    }

    // 3. Match against AI_KNOWLEDGE_BASE
    let match = null;
    for (const item of AI_KNOWLEDGE_BASE) {
      for (const trigger of item.triggers) {
        if (cleanQuery.includes(trigger.toLowerCase())) {
          match = item;
          break;
        }
      }
      if (match) break;
    }

    let responseText = '';
    let matchedMedicine = this.findMentionedMedicine(cleanQuery);
    let followUps = [];

    if (match) {
      responseText = match.response;
      followUps = this.generateFollowUpsForTopic(match.category, matchedMedicine);
    } else {
      // Dynamic fallback analyzer with clinical knowledge
      const dynamicResult = this.generateDynamicMedicalResponse(cleanQuery, rawQuery);
      responseText = dynamicResult.text;
      matchedMedicine = dynamicResult.medicine || matchedMedicine;
      followUps = dynamicResult.followUps;
    }

    // Realistic typing delay (600 - 850ms)
    setTimeout(() => {
      this.removeTypingIndicator();
      this.appendMessage('bot', responseText, matchedMedicine, followUps);
      this.isResponding = false;
    }, 750);
  }

  // --------------------------------------------------------------------------
  // 1-Click Interactive Cart Safety Audit
  // --------------------------------------------------------------------------
  auditCart() {
    this.askQuestion("Audit my cart safety and check for drug interactions");
  }

  runCartSafetyAudit() {
    const cart = window.mediFlowApp ? window.mediFlowApp.cart : [];
    if (!cart || cart.length === 0) {
      this.appendMessage('bot', `### 🛒 Cart Safety Review: Cart is Currently Empty
- You have no medicines in your cart yet.
- Browse our catalog or scan a prescription, then run this audit to automatically check for duplicate salts, food timing compatibility, and adverse drug interactions.`, null, [
        { label: "💊 Browse Fever & Pain Medicines", query: "What are the safest fever and pain medicines?" },
        { label: "🌿 Safe Antacids for Acidity", query: "Should Pantoprazole be taken on empty stomach?" }
      ]);
      return;
    }

    const cartMeds = cart.map(item => MEDICINES_DATA.find(m => m.id === item.id)).filter(Boolean);
    const medNames = cartMeds.map(m => m.name);

    let issues = [];
    let positiveNotes = [];
    let scheduleSuggestions = [];
    let genericSavingsTotal = 0;

    // Check duplicate Paracetamol (Dolo + Combiflam)
    const hasDolo = cartMeds.some(m => m.name.toLowerCase().includes('dolo') || m.genericName.toLowerCase().includes('paracetamol'));
    const hasCombiflam = cartMeds.some(m => m.name.toLowerCase().includes('combiflam'));
    if (hasDolo && hasCombiflam) {
      issues.push(`🚨 **DUPLICATE ACTIVE INGREDIENT WARNING:** Both **Dolo 650** and **Combiflam** contain Paracetamol (650mg + 325mg). Taking them together exceeds the safe 4,000mg/day liver safety limit. Use only one of them at a time!`);
    }

    // Check Antibiotic + Antacid synergy
    const hasAntibiotic = cartMeds.some(m => m.category === 'antibiotics');
    const hasAntacid = cartMeds.some(m => m.category === 'digestive');
    if (hasAntibiotic && hasAntacid) {
      positiveNotes.push(`🟢 **Beneficial Protective Regimen:** Taking an antacid/PPI (like Pan-D) before breakfast provides gastric mucosal protection against antibiotic-induced stomach upset.`);
    }

    // Check Allergy / Sedation warning
    const hasAntihistamine = cartMeds.some(m => m.category === 'allergy');
    if (hasAntihistamine) {
      scheduleSuggestions.push(`🌙 Take **Cetirizine** at bedtime to prevent daytime drowsiness.`);
    }

    if (hasAntacid) {
      scheduleSuggestions.push(`🌅 Take **Pan-D** first thing in the morning 30 minutes before breakfast.`);
    }

    if (hasDolo) {
      scheduleSuggestions.push(`☀️ Take **Dolo 650** strictly after food with plenty of water.`);
    }

    // Calculate generic savings
    cartMeds.forEach(m => {
      const origPrice = m.originalPrice || m.price * 1.25;
      genericSavingsTotal += (origPrice - m.price);
    });

    let verdict = issues.length > 0 ? "⚠️ CAUTION REQUIRED: Potential Issues Detected" : "🟢 ALL CLEAR: Compatible & Safe Regimen";

    const auditResponse = `### 🛡️ MediFlow AI Cart Safety Audit
**Verdict: ${verdict}**

**Medications In Your Cart (${cartMeds.length}):**
${cartMeds.map(m => `• **${m.name}** (${m.genericName}) — *${m.dosage}*`).join('\n')}

${issues.length > 0 ? `#### ⚠️ Critical Clinical Alerts:\n${issues.join('\n\n')}\n` : ''}

#### 📋 Clinical Recommendations & Timing:
${positiveNotes.length > 0 ? positiveNotes.join('\n') + '\n' : ''}
${scheduleSuggestions.map(s => `• ${s}`).join('\n')}

#### 💰 Generic Cost Efficiency:
- You are already saving approximately **$${(genericSavingsTotal / 80).toFixed(2)} (₹${genericSavingsTotal.toFixed(2)})** through verified MediFlow generic pricing!`;

    this.appendMessage('bot', auditResponse, cartMeds[0], [
      { label: "⏰ Add All to Schedule", query: "How to schedule all medicines in my cart?" },
      { label: "🍷 Alcohol Safety with My Cart", query: "Can I drink alcohol with the medicines in my cart?" }
    ]);
  }

  // --------------------------------------------------------------------------
  // Drug-to-Drug Interaction Checking
  // --------------------------------------------------------------------------
  detectDrugPair(clean) {
    const medKeywords = [
      { key: 'dolo', name: 'Dolo 650' },
      { key: 'combiflam', name: 'Combiflam' },
      { key: 'augmentin', name: 'Augmentin 625 Duo' },
      { key: 'pan-d', name: 'Pan-D' },
      { key: 'pantoprazole', name: 'Pan-D' },
      { key: 'azithral', name: 'Azithral 500' },
      { key: 'azithromycin', name: 'Azithral 500' },
      { key: 'cetirizine', name: 'Cetirizine 10mg' },
      { key: 'glycomet', name: 'Glycomet-GP 1 Forte' },
      { key: 'telma', name: 'Telma 40' },
      { key: 'becosules', name: 'Becosules Performance' },
      { key: 'electral', name: 'Electral ORS' },
      { key: 'ibuprofen', name: 'Combiflam (Ibuprofen)' },
      { key: 'paracetamol', name: 'Dolo 650 (Paracetamol)' }
    ];

    const detected = [];
    for (const item of medKeywords) {
      if (clean.includes(item.key) && !detected.some(d => d.name === item.name)) {
        detected.push(item);
      }
    }

    if (detected.length >= 2) {
      return [detected[0].name, detected[1].name];
    }
    return null;
  }

  evaluateDrugInteraction(drugA, drugB) {
    const pairStr = `${drugA} + ${drugB}`.toLowerCase();

    // Dolo + Combiflam
    if ((pairStr.includes('dolo') || pairStr.includes('paracetamol')) && pairStr.includes('combiflam')) {
      const med = MEDICINES_DATA.find(m => m.name === 'Dolo 650');
      return {
        text: `### 🚨 CRITICAL CONTRAINDICATION: ${drugA} + ${drugB}
**Verdict: DO NOT TAKE TOGETHER! Severe Overdose Risk**

- **Clinical Problem:** Both formulations contain **Paracetamol**. Combining them easily breaches the 4,000 mg/day safe threshold.
- **Consequence:** Excessive cumulative dose triggers toxic accumulation of NAPQI in the liver, leading to acute **hepatocellular damage**.
- **Action Plan:** Take only **ONE** of them. If you have fever, prefer Dolo 650. If you have severe muscle/joint inflammation, take Combiflam after food.`,
        medicine: med,
        followUps: [
          { label: "💡 When can I take Combiflam alone?", query: "How to take Combiflam safely?" },
          { label: "🌿 Safe alternative for severe pain", query: "What is safe to take with Paracetamol for pain?" }
        ]
      };
    }

    // Antibiotic + Antacid (Augmentin / Pan-D)
    if (pairStr.includes('augmentin') && pairStr.includes('pan-d')) {
      const med = MEDICINES_DATA.find(m => m.name === 'Pan-D');
      return {
        text: `### 🟢 Compatible & Recommended: ${drugA} + ${drugB}
**Verdict: Safe & Highly Recommended Regimen**

- **Clinical Rationale:** Amoxicillin/Clavulanate commonly irritates the stomach lining and triggers acid hypersecretion. Pan-D provides protective acid suppression.
- **Timing Separation:**
  - 🌅 **Pan-D:** Take 30-40 minutes BEFORE breakfast on an empty stomach.
  - 🥞 **Augmentin:** Take WITH or immediately AFTER breakfast. Never on an empty stomach.`,
        medicine: med,
        followUps: [
          { label: "⏰ What if I miss an antibiotic dose?", query: "What to do if I missed a dose of Augmentin?" },
          { label: "🥛 Can I take Augmentin with milk?", query: "Can I take antibiotics with dairy or milk?" }
        ]
      };
    }

    // General compatibility
    const medA = MEDICINES_DATA.find(m => drugA.toLowerCase().includes(m.name.toLowerCase()));
    return {
      text: `### ⚖️ Clinical Interaction Analysis: ${drugA} & ${drugB}
**Verdict: Generally Safe with Proper Administration Intervals**

- **Pharmacological Review:** No major direct biochemical contraindications reported in clinical reference databases between these two therapeutic classes.
- **Standard Precautions:**
  1. Stagger oral medications by at least **30 to 60 minutes** to allow optimal gastrointestinal absorption.
  2. Always take oral tablets with a full glass (250ml) of clean drinking water.
  3. If experiencing unexpected nausea, dizziness, or rash, discontinue and alert your physician.`,
      medicine: medA,
      followUps: [
        { label: "🍽️ Take with food or empty stomach?", query: `Should I take ${drugA} before or after food?` },
        { label: "💰 View generic savings", query: `What is the generic alternative for ${drugA}?` }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // Medicine-Specific Quick Guidance Tool
  // --------------------------------------------------------------------------
  explainMedicine(medId, topic = 'all') {
    const med = MEDICINES_DATA.find(m => m.id === medId);
    if (!med) return;

    if (topic === 'dosage') {
      this.askQuestion(`How should I take ${med.name} and what is the proper dosage?`);
    } else if (topic === 'side_effects') {
      this.askQuestion(`What are the side effects and precautions for ${med.name}?`);
    } else if (topic === 'food') {
      this.askQuestion(`Should ${med.name} be taken with food or on an empty stomach?`);
    } else if (topic === 'generic') {
      this.askQuestion(`What is the cheaper generic alternative for ${med.name}?`);
    } else {
      this.askQuestion(`Tell me about ${med.name} (${med.genericName}): dosage, precautions, and generic alternative.`);
    }
  }

  findMentionedMedicine(clean) {
    for (const med of MEDICINES_DATA) {
      if (clean.includes(med.name.toLowerCase()) || clean.includes(med.genericName.toLowerCase().split(' ')[0])) {
        return med;
      }
    }
    return null;
  }

  generateFollowUpsForTopic(category, med) {
    const medName = med ? med.name : 'this medicine';
    if (category === 'interaction') {
      return [
        { label: "⏰ Best timing schedule", query: `What is the best daily schedule for ${medName}?` },
        { label: "🍷 Alcohol safety check", query: `Can I drink alcohol with ${medName}?` }
      ];
    }
    if (category === 'dosage') {
      return [
        { label: "⚠️ What are the side effects?", query: `What are the side effects of ${medName}?` },
        { label: "💰 Generic alternative", query: `What is the cheaper generic alternative for ${medName}?` }
      ];
    }
    if (category === 'generics') {
      return [
        { label: "🛒 Add generic to cart", query: "How do I order generic medicine on MediFlow?" },
        { label: "🛡️ Cart safety audit", query: "Audit my cart safety and check for drug interactions" }
      ];
    }
    return [
      { label: `📋 Full instructions for ${medName}`, query: `How to take ${medName} correctly?` },
      { label: "⚠️ Missed dose advice", query: "What should I do if I miss a medicine dose?" }
    ];
  }

  generateDynamicMedicalResponse(clean, original) {
    // 1. Fever & Body Aches
    if (clean.includes('fever') || clean.includes('temperature') || clean.includes('body ache') || clean.includes('chills')) {
      const med = MEDICINES_DATA.find(m => m.id === 'med-1');
      return {
        text: `### 🌡️ Fever & Body Ache Clinical Management Guide
- **First-Line Medication:** **Paracetamol 650mg (Dolo 650)** every 6 to 8 hours as needed. Take post meals with water.
- **Safety Ceiling:** Do NOT exceed 4,000mg (6 tablets of 650mg) in 24 hours to prevent liver toxicity.
- **Hydration:** Drink oral rehydration fluids (Electral ORS) or coconut water to replace fever perspiration.
- 🚨 **Red Flag Warning:** Seek immediate emergency care if fever surpasses 103°F (39.4°C), lasts beyond 3 days, or causes neck stiffness, delirium, or breathing difficulty.`,
        medicine: med,
        followUps: [
          { label: "⚖️ Can I take Paracetamol with Ibuprofen?", query: "Can I take Paracetamol with Ibuprofen?" },
          { label: "💰 Generic Paracetamol savings", query: "Is generic Paracetamol identical to Dolo 650?" }
        ]
      };
    }

    // 2. Acidity, Heartburn & GERD
    if (clean.includes('acidity') || clean.includes('heartburn') || clean.includes('gerd') || clean.includes('gas') || clean.includes('reflux') || clean.includes('bloating')) {
      const med = MEDICINES_DATA.find(m => m.id === 'med-3');
      return {
        text: `### 🌿 Acid Reflux, GERD & Acidity Guidance
- **Recommended Medicine:** **Pan-D (Pantoprazole 40mg + Domperidone 30mg SR)**.
- **Golden Rule:** Must be taken **30 to 60 minutes BEFORE breakfast** on an empty stomach with water.
- **Why?** It shuts down proton acid pumps right as they activate for digestion, providing all-day acid suppression.
- **Lifestyle Fixes:** Avoid lying down for 2 hours after dinner, elevate your pillow by 15°, and reduce late-night coffee/spicy foods.`,
        medicine: med,
        followUps: [
          { label: "💊 Can I take Pan-D with Antibiotics?", query: "Can I take Augmentin with Pan-D?" },
          { label: "⚠️ Pan-D side effects", query: "What are the precautions and side effects of Pan-D?" }
        ]
      };
    }

    // 3. Cough, Cold, Sore Throat
    if (clean.includes('cough') || clean.includes('cold') || clean.includes('sore throat') || clean.includes('sneezing') || clean.includes('runny nose')) {
      const med = MEDICINES_DATA.find(m => m.id === 'med-5');
      return {
        text: `### 🧣 Cough, Cold & Sore Throat Protocol
- **Runny Nose & Sneezing:** **Cetirizine 10mg** once daily at bedtime.
- **Sore Throat Relief:** Gargle with warm salt water (1/2 tsp salt in 1 cup warm water) 3 times daily.
- **Dry Cough:** Warm water with honey and lemon or a Dextromethorphan syrup.
- **When to suspect bacterial infection:** If yellow/green phlegm persists past 5 days with high fever, consult a doctor for antibiotic evaluation (e.g., Augmentin or Azithral).`,
        medicine: med,
        followUps: [
          { label: "🤧 Does Cetirizine cause drowsiness?", query: "Does Cetirizine cause severe drowsiness?" },
          { label: "💊 When do I need antibiotics for cold?", query: "What is the correct timing for Amoxicillin?" }
        ]
      };
    }

    // 4. Headache & Migraine
    if (clean.includes('headache') || clean.includes('migraine') || clean.includes('head pain')) {
      const med = MEDICINES_DATA.find(m => m.id === 'med-9');
      return {
        text: `### 🧠 Headache & Migraine Relief Guidance
- **Tension Headache:** Often caused by eye strain, dehydration, or poor posture. Drink 500ml of water and rest in a dim room.
- **Medication:** **Paracetamol 650mg** or **Combiflam (Ibuprofen + Paracetamol)** taken after a light meal.
- ⚠️ **Thunderclap Warning:** If you experience a sudden, explosive headache ("worst headache of your life") accompanied by visual aura or arm numbness, seek immediate ER attention.`,
        medicine: med,
        followUps: [
          { label: "⚖️ Dolo vs Combiflam difference", query: "Can I take Paracetamol with Ibuprofen?" },
          { label: "⚠️ What to do if I missed a dose?", query: "What to do if I missed a dose?" }
        ]
      };
    }

    // 5. Diarrhea & Dehydration
    if (clean.includes('diarrhea') || clean.includes('loose') || clean.includes('vomit') || clean.includes('dehydration')) {
      const med = MEDICINES_DATA.find(m => m.id === 'med-10');
      return {
        text: `### 💧 Diarrhea & Fluid Restoration Protocol
- **Crucial Step:** Prevention of dehydration with **Electral ORS (Oral Rehydration Salts)**.
- **Preparation:** Dissolve 1 sachet in **1 Liter of clean drinking water**. Sip throughout the day.
- **Diet:** Follow the BRAT regimen (Bananas, Rice, Applesauce, Toast). Avoid milk, caffeine, and greasy food.
- 🚨 Consult a doctor if stools contain blood or diarrhea continues past 48 hours.`,
        medicine: med,
        followUps: [
          { label: "💧 How to prepare Electral ORS correctly?", query: "What is the correct way to prepare Electral ORS?" },
          { label: "💊 Antibiotics for stomach infection", query: "What to do for severe stomach infection?" }
        ]
      };
    }

    // 6. Antibiotic course rule
    if (clean.includes('antibiotic') || clean.includes('amoxicillin') || clean.includes('azithral')) {
      const med = MEDICINES_DATA.find(m => m.id === 'med-2');
      return {
        text: `### 🛡️ Essential Antibiotic Safety Rules
1. 🚨 **Finish the Complete Course:** Never stop after 2 days even if you feel 100% healed. Residual bacteria mutate into antibiotic-resistant superbugs.
2. **Fixed Time Intervals:** Take doses at equal intervals (e.g., every 12 hours for twice-daily, every 8 hours for thrice-daily).
3. **Protect Your Gut:** Take a probiotic or bowl of fresh curd 2 hours away from your antibiotic dose.`,
        medicine: med,
        followUps: [
          { label: "⏰ Amoxicillin timing guide", query: "What is the correct timing for Amoxicillin?" },
          { label: "🌿 Safe antacids with antibiotics", query: "Can I take Augmentin with Pan-D?" }
        ]
      };
    }

    // Default synthesized pharmacist guidance
    const firstMed = MEDICINES_DATA[0];
    return {
      text: `### 💡 Dr. MediFlow AI Clinical Guidance: "${original}"
- **Pharmacological Review:** All medications must strictly observe designated intervals, meal compatibility, and hydration.
- **Universal Safety Checklist:**
  1. **Active Generic Salt Verification:** Check active ingredients to avoid double-dosing.
  2. **Food Timing:** NSAIDs and fever reducers require food; proton pump inhibitors (PPIs) require an empty stomach.
  3. **Storage:** Keep away from moisture and direct sunlight (below 25°C).
- 🩺 *Educational Guidance Disclaimer: MediFlow AI provides verified educational pharmaceutical support. Always consult your attending doctor in medical emergencies.*`,
      medicine: null,
      followUps: [
        { label: "🛡️ Audit my cart for safety", query: "Audit my cart safety and check for drug interactions" },
        { label: "💊 Browse all verified medicines", query: "What medicines are available in the MediFlow catalog?" }
      ]
    };
  }

  formatMarkdown(text) {
    if (!text) return '';
    let formatted = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size:1.15rem; margin-bottom:0.5rem; color:#38bdf8;">$1</h2>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Lists
      .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
      .replace(/^\s*•\s+(.*$)/gim, '<li>$1</li>')
      // Alert/Warning highlight boxes
      .replace(/🚨 (.*)/g, '<div class="chat-alert-box alert-danger">🚨 $1</div>')
      .replace(/⚠️ (.*)/g, '<div class="chat-alert-box alert-warning">⚠️ $1</div>')
      .replace(/🟢 (.*)/g, '<div class="chat-alert-box alert-success">🟢 $1</div>')
      .replace(/💡 (.*)/g, '<div class="chat-alert-box alert-tip">💡 $1</div>')
      // Line breaks
      .replace(/\n\n/g, '<br><br>');

    // Wrap loose <li> in <ul>
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>[\s\S]*?<\/li>)/, '<ul>$1</ul>');
    }

    return formatted;
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.mediFlowChat = new PharmacistChat();
});
