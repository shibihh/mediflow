// MediFlow Medicine Database & Configuration
const MEDICINES_DATA = [
  {
    id: "med-1",
    name: "Dolo 650",
    genericName: "Paracetamol (Acetaminophen)",
    dosage: "650mg",
    form: "Tablet",
    category: "fever",
    categoryLabel: "Fever & Pain",
    price: 32.50,
    originalPrice: 40.00,
    prescriptionRequired: false,
    rating: 4.8,
    reviewsCount: 1420,
    inStock: true,
    packSize: "15 Tablets / Strip",
    manufacturer: "Micro Labs Ltd",
    deliveryTime: "15-20 mins",
    description: "Fast-acting relief from fever, body aches, headache, and mild to moderate pain. Antipyretic and analgesic action.",
    dosageInstructions: "1 tablet every 6 to 8 hours as needed. Maximum 4000mg per day. Take after food with water.",
    sideEffects: ["Mild nausea in rare cases", "Liver strain if overdosed"],
    precautions: "Do not exceed recommended dose. Avoid alcohol while taking paracetamol.",
    genericAlternative: "Generic Paracetamol 650mg (Save 60%)",
    stores: [
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 32.50 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 31.00 },
      { name: "Campus Health Care", distance: "0.2 km", inStock: true, price: 33.00 },
      { name: "Wellness Forever 24/7", distance: "1.4 km", inStock: true, price: 34.00 }
    ]
  },
  {
    id: "med-2",
    name: "Augmentin 625 Duo",
    genericName: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    dosage: "625mg",
    form: "Tablet",
    category: "antibiotics",
    categoryLabel: "Antibiotics",
    price: 185.00,
    originalPrice: 220.00,
    prescriptionRequired: true,
    rating: 4.7,
    reviewsCount: 890,
    inStock: true,
    packSize: "10 Tablets / Strip",
    manufacturer: "GlaxoSmithKline (GSK)",
    deliveryTime: "15-25 mins",
    description: "Broad-spectrum antibacterial medication used to treat bacterial infections of the respiratory tract, ear, sinus, skin, and urinary tract.",
    dosageInstructions: "1 tablet twice daily (every 12 hours) with or just before meals. Complete the entire prescribed course.",
    sideEffects: ["Diarrhea", "Stomach upset", "Mild rash"],
    precautions: "Must be taken with doctor prescription. Do not stop early even if feeling better to avoid resistance.",
    genericAlternative: "Moxikind-CV 625 (Mankind Pharma)",
    stores: [
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 185.00 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 182.00 },
      { name: "City Care Meds", distance: "1.1 km", inStock: false, price: 185.00 },
      { name: "Wellness Forever 24/7", distance: "1.4 km", inStock: true, price: 190.00 }
    ]
  },
  {
    id: "med-3",
    name: "Pan-D",
    genericName: "Pantoprazole (40mg) + Domperidone (30mg SR)",
    dosage: "40mg/30mg",
    form: "Capsule",
    category: "digestive",
    categoryLabel: "Digestion & Acidity",
    price: 145.00,
    originalPrice: 175.00,
    prescriptionRequired: true,
    rating: 4.9,
    reviewsCount: 1105,
    inStock: true,
    packSize: "15 Capsules / Strip",
    manufacturer: "Alkem Laboratories",
    deliveryTime: "12-18 mins",
    description: "Relieves gastroesophageal reflux disease (GERD), acid reflux, heartburn, bloating, and nausea.",
    dosageInstructions: "Take 1 capsule once daily in the morning, 30 to 60 minutes before breakfast with a glass of water.",
    sideEffects: ["Dry mouth", "Headache", "Mild dizziness"],
    precautions: "Do not chew or crush capsule. Swallow whole.",
    genericAlternative: "Pantocid DSR (Sun Pharma)",
    stores: [
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 145.00 },
      { name: "Campus Health Care", distance: "0.2 km", inStock: true, price: 142.00 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 144.00 }
    ]
  },
  {
    id: "med-4",
    name: "Azithral 500",
    genericName: "Azithromycin",
    dosage: "500mg",
    form: "Tablet",
    category: "antibiotics",
    categoryLabel: "Antibiotics",
    price: 115.00,
    originalPrice: 135.00,
    prescriptionRequired: true,
    rating: 4.6,
    reviewsCount: 750,
    inStock: true,
    packSize: "5 Tablets / Pack",
    manufacturer: "Alembic Pharmaceuticals",
    deliveryTime: "20 mins",
    description: "Macrolide antibiotic used for throat infections, bronchitis, tonsillitis, sinusitis, and skin infections.",
    dosageInstructions: "1 tablet once daily, either 1 hour before food or 2 hours after food, typically for 3 or 5 days.",
    sideEffects: ["Loose stools", "Nausea", "Abdominal discomfort"],
    precautions: "Prescription mandatory. Take at the exact same hour every day.",
    genericAlternative: "Azee 500 (Cipla)",
    stores: [
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 115.00 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 112.00 },
      { name: "Campus Health Care", distance: "0.2 km", inStock: false, price: 115.00 }
    ]
  },
  {
    id: "med-5",
    name: "Cetirizine 10mg (Cetzine)",
    genericName: "Cetirizine Hydrochloride",
    dosage: "10mg",
    form: "Tablet",
    category: "allergy",
    categoryLabel: "Allergy & Cold",
    price: 28.00,
    originalPrice: 35.00,
    prescriptionRequired: false,
    rating: 4.8,
    reviewsCount: 2150,
    inStock: true,
    packSize: "10 Tablets / Strip",
    manufacturer: "Dr. Reddy's Laboratories",
    deliveryTime: "15 mins",
    description: "Non-sedating antihistamine for sneezing, runny nose, watery eyes, itchy throat, allergic rhinitis, and skin hives.",
    dosageInstructions: "1 tablet once daily, preferably at bedtime. Can be taken with or without food.",
    sideEffects: ["Mild drowsiness in sensitive individuals", "Dry mouth"],
    precautions: "Avoid driving or operating heavy machinery if drowsiness occurs.",
    genericAlternative: "Alerid 10mg (Cipla)",
    stores: [
      { name: "Campus Health Care", distance: "0.2 km", inStock: true, price: 27.00 },
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 28.00 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 28.00 },
      { name: "Wellness Forever 24/7", distance: "1.4 km", inStock: true, price: 30.00 }
    ]
  },
  {
    id: "med-6",
    name: "Glycomet-GP 1 Forte",
    genericName: "Glimepiride (1mg) + Metformin (1000mg PR)",
    dosage: "1mg/1000mg",
    form: "Tablet",
    category: "chronic",
    categoryLabel: "Diabetes & Chronic",
    price: 130.00,
    originalPrice: 155.00,
    prescriptionRequired: true,
    rating: 4.8,
    reviewsCount: 940,
    inStock: true,
    packSize: "15 Tablets / Strip",
    manufacturer: "USV Private Limited",
    deliveryTime: "25 mins",
    description: "Oral anti-diabetic combination medicine for type 2 diabetes mellitus to control elevated blood sugar levels.",
    dosageInstructions: "Take 1 tablet once or twice daily with main meals (breakfast/dinner). Do not skip meals.",
    sideEffects: ["Hypoglycemia (low sugar)", "Gas/bloating", "Metallic taste"],
    precautions: "Monitor blood glucose levels regularly. Keep glucose candy handy in case of dizziness.",
    genericAlternative: "Zoryl-M 1 Forte (Intas)",
    stores: [
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 130.00 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 128.00 },
      { name: "City Care Meds", distance: "1.1 km", inStock: true, price: 132.00 }
    ]
  },
  {
    id: "med-7",
    name: "Telma 40",
    genericName: "Telmisartan",
    dosage: "40mg",
    form: "Tablet",
    category: "chronic",
    categoryLabel: "Hypertension / BP",
    price: 122.00,
    originalPrice: 145.00,
    prescriptionRequired: true,
    rating: 4.9,
    reviewsCount: 1680,
    inStock: true,
    packSize: "15 Tablets / Strip",
    manufacturer: "Glenmark Pharmaceuticals",
    deliveryTime: "20 mins",
    description: "Angiotensin Receptor Blocker (ARB) prescribed for high blood pressure (hypertension) and cardiovascular risk reduction.",
    dosageInstructions: "1 tablet once daily, preferably at the same fixed time each morning. Swallow whole with water.",
    sideEffects: ["Dizziness on standing", "Sinus congestion", "Back pain"],
    precautions: "Do not stop abruptly without consulting doctor. Maintain adequate hydration.",
    genericAlternative: "Telpres 40 (Abbott)",
    stores: [
      { name: "Campus Health Care", distance: "0.2 km", inStock: true, price: 120.00 },
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 122.00 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 121.00 }
    ]
  },
  {
    id: "med-8",
    name: "Becosules Performance",
    genericName: "Multivitamins + Vitamin B-Complex + Zinc + Ginseng",
    dosage: "Daily Supplement",
    form: "Capsule",
    category: "vitamins",
    categoryLabel: "Vitamins & Energy",
    price: 88.00,
    originalPrice: 105.00,
    prescriptionRequired: false,
    rating: 4.9,
    reviewsCount: 3200,
    inStock: true,
    packSize: "30 Capsules / Bottle",
    manufacturer: "Pfizer Ltd",
    deliveryTime: "15 mins",
    description: "Comprehensive daily essential multivitamin and mineral formula to enhance physical stamina, mental clarity, and immunity.",
    dosageInstructions: "1 capsule daily after breakfast or lunch with plenty of water.",
    sideEffects: ["Harmless bright yellow urine due to Vitamin B2"],
    precautions: "Do not consume on an empty stomach. Safe for daily wellness.",
    genericAlternative: "Zincovit Tablet (Apex Laboratories)",
    stores: [
      { name: "Campus Health Care", distance: "0.2 km", inStock: true, price: 85.00 },
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 88.00 },
      { name: "Wellness Forever 24/7", distance: "1.4 km", inStock: true, price: 90.00 }
    ]
  },
  {
    id: "med-9",
    name: "Combiflam",
    genericName: "Ibuprofen (400mg) + Paracetamol (325mg)",
    dosage: "400mg/325mg",
    form: "Tablet",
    category: "fever",
    categoryLabel: "Fever & Pain",
    price: 45.00,
    originalPrice: 52.00,
    prescriptionRequired: false,
    rating: 4.7,
    reviewsCount: 1840,
    inStock: true,
    packSize: "20 Tablets / Strip",
    manufacturer: "Sanofi India",
    deliveryTime: "15 mins",
    description: "Dual-action painkiller and anti-inflammatory formulation for toothache, muscle sprains, headache, and menstrual cramps.",
    dosageInstructions: "1 tablet post meals up to 2-3 times daily as needed. Maintain minimum 6 hours gap.",
    sideEffects: ["Mild gastric acidity", "Heartburn"],
    precautions: "Always take after food. Patients with gastric ulcers should exercise caution.",
    genericAlternative: "Ibugesic Plus (Cipla)",
    stores: [
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 45.00 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 44.00 },
      { name: "Campus Health Care", distance: "0.2 km", inStock: true, price: 45.00 }
    ]
  },
  {
    id: "med-10",
    name: "Electral ORS Powder",
    genericName: "WHO Recommended Oral Rehydration Salts (ORS)",
    dosage: "21.8g Sachet",
    form: "Powder Sachet",
    category: "digestive",
    categoryLabel: "First Aid & Wellness",
    price: 24.00,
    originalPrice: 26.00,
    prescriptionRequired: false,
    rating: 5.0,
    reviewsCount: 4200,
    inStock: true,
    packSize: "1 Sachet (Yields 1 Litre)",
    manufacturer: "FDC Ltd",
    deliveryTime: "12 mins",
    description: "Restores electrolyte balance, fluid levels and prevents dehydration during diarrhea, vomiting, heat exhaustion, and fever.",
    dosageInstructions: "Dissolve entire contents of sachet in exactly 1 litre of clean drinking water. Sip continuously throughout the day.",
    sideEffects: ["None when properly diluted"],
    precautions: "Do not boil solution after preparing. Discard any unused solution after 24 hours.",
    genericAlternative: "Walyte ORS",
    stores: [
      { name: "Campus Health Care", distance: "0.2 km", inStock: true, price: 24.00 },
      { name: "Apollo Pharmacy - Central", distance: "0.4 km", inStock: true, price: 24.00 },
      { name: "MedPlus Chemist - North", distance: "0.8 km", inStock: true, price: 23.50 }
    ]
  }
];

// Sample Prescriptions for Scanner Pipeline
const SCAN_PRESETS = {
  prescription: {
    id: "preset-prescription",
    title: "Hospital Prescription (Dr. E. Vance, St. Mary's)",
    imageSrc: "assets/sample_prescription.jpg",
    detectedType: "Doctor Prescription (Handwritten & Typed Rx)",
    confidence: "98.7%",
    doctorName: "Dr. Eleanor Vance, MD (General Physician)",
    hospital: "St. Mary's General Hospital",
    patient: "Sarah Jenkins (34 F)",
    extractedDate: "14 Oct 2026",
    medicinesFound: [
      {
        name: "Dolo 650mg",
        generic: "Paracetamol",
        dosage: "1-0-1 (Morning & Evening, TDS/BD)",
        timing: "After meals with water",
        duration: "5 days",
        purpose: "Fever & body ache reduction",
        matchedId: "med-1",
        price: 32.50,
        inStock: true
      },
      {
        name: "Azithromycin 500mg",
        generic: "Azithromycin Antibiotic",
        dosage: "1-0-0 (OD - Morning)",
        timing: "1 hour before food or 2 hours after",
        duration: "3 days",
        purpose: "Bacterial infection control",
        matchedId: "med-4",
        price: 115.00,
        inStock: true
      },
      {
        name: "Pantoprazole 40mg",
        generic: "Pantoprazole (Antacid)",
        dosage: "1-0-0 (OD - Morning)",
        timing: "Empty stomach (30 mins before breakfast)",
        duration: "7 days",
        purpose: "Prevent gastric irritation & acidity",
        matchedId: "med-3",
        price: 145.00,
        inStock: true
      }
    ],
    doctorAdvice: "Take with water. Drink plenty of fluids. Follow up if fever persists beyond 3 days.",
    nearbyAvailability: "All 3 items are available together at Apollo Pharmacy (0.4 km) & MedPlus (0.8 km)"
  },
  strip: {
    id: "preset-strip",
    title: "Medicine Blister Packaging (Amoxicillin 500mg)",
    imageSrc: "assets/sample_strip.jpg",
    detectedType: "Medicine Blister Strip (OCR Vision Model)",
    confidence: "99.4%",
    ocrTextRaw: "AMOXICILLIN 500mg CAPSULES | 10 Capsules | Each capsule contains: Amoxicillin 500mg | Rx Only | Lot: AMX21345 Exp: 09/2026",
    medicinesFound: [
      {
        name: "Amoxicillin 500mg Capsules",
        generic: "Amoxicillin (Penicillin class antibiotic)",
        dosage: "500mg",
        timing: "1 capsule every 8 hours (or twice daily as doctor advises) with full glass of water",
        duration: "As prescribed (standard 5-7 days)",
        purpose: "Bacterial infections (chest, ear, sinus, throat, UTI)",
        matchedId: "med-2",
        price: 95.00,
        inStock: true
      }
    ],
    storageInstruction: "Store below 25°C in a dry place. Keep out of reach of children.",
    safetyWarnings: [
      "⚠️ Do NOT take if you have a known penicillin allergy.",
      "⚠️ Complete the full course even if symptoms subside.",
      "⚠️ Take with meals to minimize stomach irritation."
    ],
    genericVsBrand: {
      genericCost: "$4.00 (₹95.00)",
      brandCost: "$8.50 (₹185.00)",
      savings: "Save 48% with Generic Bioequivalent"
    },
    nearbyAvailability: "In Stock at Campus Pharmacy (0.2 km away) & Apollo (0.4 km away)"
  }
};

// Clinical FAQ Knowledge Base & Drug Interaction Dataset
const AI_KNOWLEDGE_BASE = [
  {
    triggers: ["paracetamol", "ibuprofen", "combiflam", "together", "mix", "can i take paracetamol with ibuprofen"],
    response: `### 💊 Paracetamol & Ibuprofen Interaction Analysis

**Verdict: Generally Safe to Alternate or Combine under Guidance**

- **Mechanism:** Paracetamol (Acetaminophen) is a pain/fever reliever acting primarily in the central nervous system, while Ibuprofen is an NSAID that reduces swelling and inflammation peripherally.
- **How to take safely:**
  1. Often recommended to alternate them (e.g. Paracetamol at 8 AM, Ibuprofen at 12 PM) to avoid overlapping peaks.
  2. **Max Paracetamol:** 4,000 mg in 24 hours.
  3. **Max Ibuprofen:** 1,200 mg over-the-counter in 24 hours.
- **Precautions:** Always take Ibuprofen with food to protect your stomach lining. Do not take with other cold/flu combinations that already contain Paracetamol!`,
    category: "interaction"
  },
  {
    triggers: ["amoxicillin", "dosage", "timing", "antibiotic", "how to take amoxicillin"],
    response: `### 💊 Amoxicillin Dosage & Timing Guide

- **Standard Adult Dosage:** 500mg capsule every 8 hours (3 times a day) OR 875mg every 12 hours, depending on infection severity.
- **Timing:** Can be taken with or without food. Taking it at the start of a meal helps reduce gastrointestinal discomfort.
- **Crucial Rule:** 🚨 **Always complete the full course** (usually 5 to 7 days), even if your symptoms completely disappear after day 2. Stopping early leads to antibiotic resistance!
- **Dietary Tip:** Consider taking a probiotic (e.g. curd/yogurt or capsules) 2 hours apart to support gut flora.`,
    category: "dosage"
  },
  {
    triggers: ["missed", "miss", "forgot", "forget", "missed dose", "forgot dose", "what to do if i miss"],
    response: `### ⏰ What to Do If You Missed a Medicine Dose

1. **General Rule:** Take the missed dose as soon as you remember.
2. **Exception (Double Dose Warning):** If it is almost time for your next scheduled dose, **SKIP the missed dose** and resume your normal schedule.
3. ⚠️ **NEVER take two doses together** or an extra tablet to compensate for the forgotten one, as this can trigger toxic levels or sudden drops in blood pressure/blood sugar.
4. **Tip for MediFlow App:** Turn on the *Dosage Reminder Push Notifications* in the Schedule tab to ensure you never miss a dose!`,
    category: "advice"
  },
  {
    triggers: ["antacid", "pantoprazole", "pan-d", "food", "empty stomach", "heartburn", "gerd", "acidity"],
    response: `### 🌿 Pantoprazole / Pan-D Usage & Timing

- **Correct Administration:** Take **30 to 60 minutes BEFORE breakfast** on an empty stomach with a full glass of water.
- **Why empty stomach?** Proton Pump Inhibitors (PPIs) require the acid pumps in your stomach to be activated by the upcoming meal to block acid production most effectively.
- **Do not chew or crush:** Swallow the capsule whole because it has an enteric coating designed to survive stomach acid.
- **Lifestyle recommendations:** Avoid lying down for 2 hours after meals, reduce caffeine/spicy foods, and elevate head during sleep.`,
    category: "usage"
  },
  {
    triggers: ["cetirizine", "allergy", "sleepy", "drowsy", "side effects of cetirizine"],
    response: `### 🤧 Cetirizine 10mg (Antihistamine) Information

- **Primary Uses:** Allergic rhinitis, hay fever, sneezing, itching, hives (urticaria), runny nose.
- **Timing:** Best taken once daily at **night before bedtime** because it can cause mild drowsiness in about 10-15% of people.
- **Common Side Effects:** Mild sedation, dry mouth, tiredness, headache.
- **Interactions:** Avoid consuming alcohol while taking Cetirizine, as alcohol magnifies the sedative effect. Safe for daily seasonal use as directed.`,
    category: "side_effects"
  },
  {
    triggers: ["generic", "branded", "dolo", "substitute", "alternative", "cost", "difference"],
    response: `### 🔬 Generic vs. Branded Medicines Explained

- **Is Generic Paracetamol as effective as Dolo 650?**
  **YES, 100% bioequivalent!** Both contain identical active pharmaceutical ingredient (API): 650mg Paracetamol.
- **Standards:** FDA and CDSCO regulatory authorities mandate that generic drugs must have the same active ingredient, strength, safety profile, dosage form, and route of administration as brand-name drugs.
- **Why is generic cheaper?** Generic manufacturers do not have repeated R&D clinical trial costs or massive marketing/branding budgets.
- **MediFlow Feature:** When you scan or add any branded medicine in MediFlow, our AI automatically suggests verified generic bio-alternatives that save you between **30% and 75%** on your pharmacy bill!`,
    category: "generics"
  },
  {
    triggers: ["dolo and combiflam", "combiflam and dolo", "dolo with combiflam", "combiflam with dolo", "paracetamol with combiflam", "duplicate paracetamol"],
    response: `### 🚨 CRITICAL CONTRAINDICATION: Dolo 650 + Combiflam
**Verdict: DO NOT TAKE TOGETHER! High Overdose Risk**

- **Why?** Both medicines contain **Paracetamol** (Dolo has 650mg, Combiflam has 325mg + 400mg Ibuprofen).
- **Hazard:** Taking them together or within short intervals causes cumulative Paracetamol toxicity. The absolute maximum adult daily limit is 4,000mg. Overdosing leads to severe, acute **liver damage (hepatotoxicity)**.
- **Safe Alternative:**
  1. If fever or pain is mild: Take **Dolo 650 alone** with water after food.
  2. If swelling, sprain, or dental pain is prominent: Take **Combiflam alone** after food.
  3. Never combine them without explicit physician instruction.`,
    category: "interaction"
  },
  {
    triggers: ["augmentin and pan-d", "antibiotic with antacid", "amoxicillin with pantoprazole", "augmentin with pan-d"],
    response: `### 🟢 Compatible & Recommended: Augmentin 625 Duo + Pan-D
**Verdict: Safe & Clinically Beneficial Combination**

- **Why Combine?** Broad-spectrum antibiotics like Augmentin (Amoxicillin + Clavulanic Acid) frequently cause gastric irritation, acid reflux, and nausea. Pan-D (Pantoprazole + Domperidone) prevents mucosal damage and suppresses reflux.
- **How to Schedule for Maximum Absorption:**
  1. 🌅 **Morning (Empty Stomach):** Take Pan-D capsule 30-45 minutes before breakfast with a glass of water.
  2. 🥞 **Breakfast / Meal:** Eat your meal, then take Augmentin 625 Duo. Taking antibiotics with meals minimizes nausea and diarrhea.
  3. 🌙 **Evening / Night:** Take your second Augmentin dose with dinner (12-hour spacing).`,
    category: "interaction"
  },
  {
    triggers: ["alcohol", "beer", "wine", "drinking with medicine", "alcohol with paracetamol", "alcohol with antibiotic"],
    response: `### 🍷 Alcohol & Medication Safety Analysis
**Verdict: Avoid Alcohol with Acute & Chronic Medications**

- **Paracetamol (Dolo / Combiflam):** Alcohol depletes hepatic glutathione, drastically lowering the threshold for Paracetamol-induced liver toxicity.
- **Antihistamines (Cetirizine):** Alcohol strongly amplifies the central sedative action, causing severe drowsiness, impaired reflexes, and slowed breathing.
- **Antibiotics (Augmentin, Azithral):** Alcohol suppresses immune defense and exacerbates gastrointestinal distress and dehydration.
- **Diabetes Meds (Glycomet-GP):** High risk of severe hypoglycemia (dangerous drop in blood sugar) and lactic acidosis.
- **Rule of Thumb:** Refrain from alcohol for at least 48 hours after concluding any medication course.`,
    category: "safety"
  },
  {
    triggers: ["azithral", "azithromycin", "azithral 500", "how to take azithromycin", "azithral dosage"],
    response: `### 💊 Azithral 500 (Azithromycin) Clinical Guide
- **Class:** Macrolide antibiotic targeting bacterial respiratory, throat, sinus, and skin infections.
- **Standard Regimen:** 1 tablet (500mg) once daily (OD) for 3 or 5 days consecutively.
- **Timing & Food:**
  - Best taken **1 hour before food** or **2 hours after food** with plenty of water for optimal absorption.
  - If stomach irritation occurs, a light non-dairy snack is permissible.
- **Important Precautions:**
  - 🚨 Do NOT consume antacids containing aluminum or magnesium within 2 hours of Azithral, as they bind and block absorption.
  - Complete the exact prescribed 3 or 5 day duration.`,
    category: "dosage"
  },
  {
    triggers: ["glycomet", "metformin", "diabetes", "blood sugar", "glimepiride", "sugar medicine"],
    response: `### 🩺 Glycomet-GP 1 Forte (Diabetes Management) Guide
- **Active Salts:** Metformin 1000mg PR + Glimepiride 1mg.
- **Action:** Stimulates pancreas to release insulin and increases cellular insulin sensitivity.
- **How to Take Safely:**
  1. Take **with or immediately after your main meal** (breakfast or dinner). Never take on an empty stomach!
  2. Metformin extended release (PR) must be swallowed whole—**never crush or chew**.
- **Hypoglycemia Watch:**
  - Keep fast-acting sugar (sweets, glucose powder, juice) nearby in case of tremors, cold sweating, or dizziness.
  - Monitor fasting and post-prandial blood glucose levels regularly.`,
    category: "chronic"
  },
  {
    triggers: ["telma", "telmisartan", "blood pressure", "hypertension", "bp medicine", "telma 40"],
    response: `### 🩺 Telma 40 (Telmisartan) Cardiovascular Guide
- **Indication:** Essential hypertension (high blood pressure) and heart protection.
- **Administration Protocol:**
  - Take **1 tablet once daily**, consistently at the same time every morning with water.
  - Can be taken with or without food.
- **Safety Tips:**
  - **Avoid sudden standing:** Blood pressure drops momentarily when getting out of bed (postural hypotension). Sit for 30 seconds first.
  - Maintain adequate hydration. Do not use potassium salt substitutes without physician supervision.
  - Never discontinue abruptly, as rebound hypertension may occur.`,
    category: "chronic"
  },
  {
    triggers: ["becosules", "multivitamin", "b complex", "yellow urine", "vitamin supplement"],
    response: `### 🌿 Becosules Performance (Multivitamin & Zinc) Guide
- **Composition:** B-Complex vitamins (B1, B2, B6, B12), Vitamin C, Niacinamide, Calcium Pantothenate, Folic Acid & Zinc.
- **Best Timing:** Take **1 capsule once daily after breakfast or lunch** with a full glass of water.
- **Reassurance Note:**
  - 💡 **Harmless Bright Yellow Urine:** You will notice bright fluorescent yellow urine after taking Becosules. This is completely natural and harmless—it is simply your body excreting excess water-soluble Vitamin B2 (Riboflavin).
  - Enhances cellular energy, skin/hair vitality, and oral ulcer healing.`,
    category: "wellness"
  },
  {
    triggers: ["ors", "electral", "dehydration", "loose motion", "diarrhea", "vomiting", "weakness"],
    response: `### 💧 Electral ORS (Oral Rehydration Solution) Protocol
- **WHO Standard Formula:** Replenishes vital electrolytes (Sodium, Potassium, Chloride, Citrate) and glucose during fluid loss.
- **Preparation Instructions:**
  1. Dissolve the **entire 21.8g sachet in exactly 1 Liter (1000ml) of clean drinking water**.
  2. Mix thoroughly until transparent.
  3. ⚠️ **Do not boil or heat** after preparation.
  4. ⚠️ **Do not dilute** with too little or too much water—the exact 1L ratio ensures cellular osmotic balance.
- **Consumption:** Sip continuously throughout the day. Discard any solution remaining after 24 hours and prepare a fresh sachet.`,
    category: "wellness"
  },
  {
    triggers: ["pregnancy", "pregnant", "breastfeeding", "safe in pregnancy"],
    response: `### 🤰 Pregnancy & Lactation Pharmaceutical Safety Rules
- **Category Safe (First-Line):**
  - **Paracetamol (Acetaminophen)** is internationally recognized as the safest first-line analgesic/antipyretic across all three trimesters when taken at lowest effective doses.
- **Medicines to AVOID or EXERCISE CAUTION:**
  - 🚨 **Avoid NSAIDs (Ibuprofen, Combiflam):** Particularly contraindicated during the 3rd trimester due to premature closure of ductus arteriosus in the fetus.
  - 🚨 **Avoid Self-Administering Antibiotics:** Certain classes (e.g., Fluoroquinolones, Tetracyclines) interfere with fetal bone and cartilage development.
- **Golden Rule:** Always present your obstetrician with any prescription before consumption.`,
    category: "safety"
  },
  {
    triggers: ["child", "children", "pediatric", "baby", "kid dosage"],
    response: `### 👶 Pediatric (Children's) Medication Safety Rule
- **Weight-Based Dosing is Mandatory:**
  - Children are **NOT miniature adults**. Dosing must always be calculated by body weight (mg/kg), never by guessing tablet fractions.
- **Hazard Warning:**
  - 🚨 **Never cut adult tablets** like Combiflam, Augmentin 625, or Dolo 650 for young children. Adult strengths can lead to organ toxicity.
  - Always utilize dedicated **pediatric oral suspensions or drops** with calibrated measuring syringes/droppers.
  - Avoid Aspirin in children under 16 due to Reye's Syndrome risk.`,
    category: "safety"
  }
];

// Partner Pharmacies for Stock & Location Finder
const PHARMACY_STORES = [
  {
    id: "store-1",
    name: "Apollo Pharmacy - Metro Hub",
    address: "Shop 4, Campus Avenue, 100m from Central Gate",
    distance: "0.4 km",
    rating: 4.8,
    openHours: "24/7 Open",
    phone: "+91 98450 12345",
    expressDelivery: "15 min",
    badge: "Super Partner",
    stockConfidence: "99% Realtime API Sync"
  },
  {
    id: "store-2",
    name: "Campus Health Care Chemist",
    address: "Student Amenity Block, University Medical Center",
    distance: "0.2 km",
    rating: 4.9,
    openHours: "8:00 AM - 10:00 PM",
    phone: "+91 98450 23456",
    expressDelivery: "10 min",
    badge: "Campus Special",
    stockConfidence: "Direct Campus Dispensary"
  },
  {
    id: "store-3",
    name: "MedPlus Chemists & Druggists",
    address: "12 Green Valley Cross, Opposite Metro Station",
    distance: "0.8 km",
    rating: 4.7,
    openHours: "7:00 AM - 11:30 PM",
    phone: "+91 98450 34567",
    expressDelivery: "20 min",
    badge: "Verified Discount Store",
    stockConfidence: "98% Realtime API Sync"
  },
  {
    id: "store-4",
    name: "Wellness Forever 24/7",
    address: "High Street Junction, Sector 4",
    distance: "1.4 km",
    rating: 4.9,
    openHours: "24/7 Open",
    phone: "+91 98450 45678",
    expressDelivery: "25 min",
    badge: "Night Pharmacy",
    stockConfidence: "High Stock Availability"
  }
];

// Initial Dosage Schedule Items
const INITIAL_DOSAGE_SCHEDULE = [
  {
    id: "sch-1",
    medicineName: "Pantoprazole 40mg",
    dosage: "1 Capsule (OD)",
    timeSlot: "Morning (8:00 AM)",
    instructions: "Empty stomach before breakfast",
    taken: true,
    timeTaken: "08:05 AM"
  },
  {
    id: "sch-2",
    medicineName: "Dolo 650",
    dosage: "1 Tablet",
    timeSlot: "Afternoon (1:30 PM)",
    instructions: "After lunch with warm water",
    taken: false,
    timeTaken: null
  },
  {
    id: "sch-3",
    medicineName: "Becosules Performance",
    dosage: "1 Capsule",
    timeSlot: "Evening (6:00 PM)",
    instructions: "Post tea/snack with water",
    taken: false,
    timeTaken: null
  },
  {
    id: "sch-4",
    medicineName: "Cetirizine 10mg",
    dosage: "1 Tablet",
    timeSlot: "Night (10:00 PM)",
    instructions: "Before bedtime",
    taken: false,
    timeTaken: null
  }
];
