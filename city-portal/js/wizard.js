// --- USER SUBMISSION PORTAL LOGIC (Hireup 444 Wizard) ---
function initiateSubmissionWizard(type) {
  currentWizardType = type;
  currentWizardStep = 1;
  
  // Update UI Elements
  const selectionHub = document.getElementById('submit-selection-hub');
  if (selectionHub) selectionHub.classList.add('hidden');
  
  const wizard = document.getElementById('submission-wizard');
  if (wizard) wizard.classList.remove('hidden');

  // Change wizard title
  const titles = {
    news: "Submit a News Tip",
    business: "Register Business Directory",
    job: "Post a Job opening",
    event: "Submit Local Event"
  };
  const wizardTitle = document.getElementById('wizard-form-title');
  if (wizardTitle) wizardTitle.textContent = titles[type];

  // Draw input fields
  drawWizardFields();
  updateWizardProgressNodes();
}

function cancelSubmissionWizard() {
  const wizard = document.getElementById('submission-wizard');
  if (wizard) wizard.classList.add('hidden');

  const selectionHub = document.getElementById('submit-selection-hub');
  if (selectionHub) selectionHub.classList.remove('hidden');
  
  // Clean form
  const form = document.getElementById('submission-wizard-form');
  if (form) form.reset();
}

function openContributeTab(type) {
  navigateTo('contribute');
  initiateSubmissionWizard(type);
}

function drawWizardFields() {
  const step1 = document.getElementById('wizard-step-1-fields');
  const step2 = document.getElementById('wizard-step-2-fields');
  
  if (!step1 || !step2) return;

  step1.innerHTML = '';
  step2.innerHTML = '';
  
  if (currentWizardType === 'news') {
    step1.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">News Title / Headline</label>
        <input type="text" id="form-news-title" placeholder="e.g. Major Rain Cause Traffic Block Near Focal Point" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">News Category</label>
        <select id="form-news-cat" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
          <option value="Municipal">🏛️ Civic & Municipal</option>
          <option value="Alert">🚨 Road / Public Alert</option>
          <option value="Business">🛍️ Business Openings</option>
          <option value="Sports">🏆 Local Sports</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Short Excerpt / Summary</label>
        <input type="text" id="form-news-summary" placeholder="Briefly summarize the incident in 1 or 2 lines..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
    `;
    step2.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Report details / Content</label>
        <textarea id="form-news-content" rows="6" placeholder="Provide full details of the incident..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required></textarea>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Attach Photo Cover URL (Optional)</label>
        <input type="url" id="form-news-image" placeholder="Paste an image address url..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
      </div>
    `;
  } else if (currentWizardType === 'business') {
    step1.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Business / Shop Name</label>
        <input type="text" id="form-biz-name" placeholder="e.g. Soni Sweets and Catering" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Category</label>
          <select id="form-biz-cat" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
            <option value="Food & Dining">🍽️ Food & Dining</option>
            <option value="Shops & Retail">🛍️ Shops & Retail</option>
            <option value="Health & Medical">🏥 Health & Medical</option>
            <option value="Professional Services">🛠️ Local Crafts & Services</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Ward / Area</label>
          <select id="form-biz-ward" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
            <option value="Kasturba Road">Kasturba Road</option>
            <option value="Town Hall">Town Hall Area</option>
            <option value="Focal Point">Focal Point</option>
            <option value="Calibre Market">Calibre Market</option>
            <option value="Nehru Market">Nehru Market</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Catchy Slogan / Tagline</label>
        <input type="text" id="form-biz-tagline" placeholder="e.g. Best Punjabi Samosas In Town" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
    `;
    step2.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Contact Phone</label>
          <input type="tel" id="form-biz-phone" placeholder="+91 98142-XXXXX" inputmode="tel" autocomplete="tel" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Email address</label>
          <input type="email" id="form-biz-email" placeholder="contact@shopname.com" autocomplete="email" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Full Shop Address</label>
        <input type="text" id="form-biz-address" placeholder="Shop Number, Bazar Street, Landmark, Rajpura" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Cover Image URL (Paste URL Link)</label>
        <input type="url" id="form-biz-cover" placeholder="Paste image url showing your storefront..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Listing Description</label>
        <textarea id="form-biz-desc" rows="3" placeholder="Provide background about your shop and specialization..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required></textarea>
      </div>
    `;
  } else if (currentWizardType === 'job') {
    step1.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Job Title</label>
        <input type="text" id="form-job-title" placeholder="e.g. Graphic Designer / Office Admin" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Company / Business Name</label>
        <input type="text" id="form-job-company" placeholder="e.g. Bassi Diagnostics Center" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Job Type</label>
          <select id="form-job-type" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Daily Wage">Daily Wage (Dihari)</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Location Mode</label>
          <select id="form-job-loc" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
            <option value="On-Site">On-Site (Rajpura)</option>
            <option value="Remote">Work From Home</option>
          </select>
        </div>
      </div>
    `;
    step2.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Salary Offer (Monthly)</label>
        <input type="text" id="form-job-salary" placeholder="e.g. ₹15,000 - ₹18,000" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Contact Phone / WhatsApp</label>
        <input type="tel" id="form-job-phone" placeholder="+91 98XXX-XXXXX" inputmode="tel" autocomplete="tel" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Job Specifications / Description</label>
        <textarea id="form-job-desc" rows="4" placeholder="Mention key duties and who should apply..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required></textarea>
      </div>
    `;
  } else if (currentWizardType === 'event') {
    step1.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Event Name / Title</label>
        <input type="text" id="form-event-title" placeholder="e.g. Rajpura Trade Fair and Expo" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Category</label>
        <select id="form-event-cat" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
          <option value="Festivals">Festivals & Fairs</option>
          <option value="Sports">Sports matches</option>
          <option value="Commercial">Retail Sales / Discounts</option>
          <option value="Community">Civic Meetings</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Start Date</label>
          <input type="date" id="form-event-date" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Duration (Days)</label>
          <input type="number" id="form-event-duration" min="1" max="7" value="1" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
        </div>
      </div>
    `;
    step2.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Brief description</label>
        <textarea id="form-event-desc" rows="4" placeholder="Briefly state timing, venue details, tickets if any..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required></textarea>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Event Image URL</label>
        <input type="url" id="form-event-image" placeholder="Paste custom cover image url link..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
      </div>
    `;
  }
}

function updateWizardProgressNodes() {
  document.getElementById('step-node-1').className = "step-node w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs active";
  document.getElementById('step-node-2').className = "step-node w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs";
  document.getElementById('step-node-3').className = "step-node w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs";
  
  document.getElementById('step-line-1').className = "flex-1 h-[2px] bg-slate-200 dark:bg-slate-700 mx-2";
  document.getElementById('step-line-2').className = "flex-1 h-[2px] bg-slate-200 dark:bg-slate-700 mx-2";

  if (currentWizardStep >= 2) {
    document.getElementById('step-node-1').classList.add('completed');
    document.getElementById('step-node-2').classList.add('active');
    document.getElementById('step-line-1').classList.add('bg-brandGold', 'dark:bg-brandGold');
  }
  if (currentWizardStep === 3) {
    document.getElementById('step-node-2').classList.add('completed');
    document.getElementById('step-node-3').classList.add('active');
    document.getElementById('step-line-2').classList.add('bg-brandGold', 'dark:bg-brandGold');
  }
}

function navigateWizardStep(offset) {
  // Simple validation for required fields
  if (offset > 0) {
    const activeCont = document.getElementById(`wizard-step-${currentWizardStep}-fields`);
    if (activeCont) {
      const inputs = activeCont.querySelectorAll('input[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(el => {
        if (!el.value.trim()) {
          isValid = false;
          el.classList.add('border-red-500');
          el.addEventListener('input', () => el.classList.remove('border-red-500'), { once: true });
        }
      });

      if (!isValid) return; // Stop if form fields are empty
    }
  }

  currentWizardStep += offset;
  
  // Contain boundaries
  if (currentWizardStep < 1) currentWizardStep = 1;
  if (currentWizardStep > 3) currentWizardStep = 3;

  // Toggle step wrappers
  const step1 = document.getElementById('wizard-step-1-fields');
  const step2 = document.getElementById('wizard-step-2-fields');
  const step3 = document.getElementById('wizard-step-3-fields');

  if (step1) step1.classList.add('hidden');
  if (step2) step2.classList.add('hidden');
  if (step3) step3.classList.add('hidden');
  
  const currentStepFields = document.getElementById(`wizard-step-${currentWizardStep}-fields`);
  if (currentStepFields) currentStepFields.classList.remove('hidden');

  // Toggle Nav buttons
  const prevBtn = document.getElementById('btn-wizard-prev');
  const nextBtn = document.getElementById('btn-wizard-next');
  const submitBtn = document.getElementById('btn-wizard-submit');

  if (prevBtn && nextBtn && submitBtn) {
    if (currentWizardStep === 1) {
      prevBtn.classList.add('hidden');
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    } else if (currentWizardStep === 2) {
      prevBtn.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    } else if (currentWizardStep === 3) {
      prevBtn.classList.remove('hidden');
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
      generateWizardCardPreview();
    }
  }

  updateWizardProgressNodes();
}

function generateWizardCardPreview() {
  const container = document.getElementById('wizard-card-preview-container');
  if (!container) return;
  container.innerHTML = '';

  if (currentWizardType === 'news') {
    const title = document.getElementById('form-news-title').value.trim();
    const cat = document.getElementById('form-news-cat').value;
    const summary = document.getElementById('form-news-summary').value.trim();
    const img = document.getElementById('form-news-image').value.trim() || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600';

    container.innerHTML = `
      <article class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col w-full max-w-sm">
        <img class="w-full h-44 object-cover" src="${img}" alt="${title}">
        <div class="p-5 space-y-2 flex-1 flex flex-col justify-between">
          <div class="space-y-2 text-black">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-brandBlue text-white uppercase">${cat}</span>
            <h3 class="text-lg font-bold leading-tight font-headings uppercase">${title}</h3>
            <p class="text-xs text-slate-500 line-clamp-2">${summary}</p>
          </div>
          <div class="text-[10px] text-slate-400 font-semibold border-t pt-3 flex justify-between">
            <span>Just now</span>
            <span>2 min read</span>
          </div>
        </div>
      </article>
    `;
  } else if (currentWizardType === 'business') {
    const name = document.getElementById('form-biz-name').value.trim();
    const cat = document.getElementById('form-biz-cat').value;
    const ward = document.getElementById('form-biz-ward').value;
    const tagline = document.getElementById('form-biz-tagline').value.trim();
    const cover = document.getElementById('form-biz-cover').value.trim() || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600';

    container.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative flex flex-col justify-between w-full max-w-sm text-black">
        <div>
          <div class="relative w-full h-40 overflow-hidden bg-slate-100">
            <img class="w-full h-full object-cover" src="${cover}" alt="${name}">
            <span class="absolute top-3 left-3 bg-[#111827]/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">FEATURED</span>
          </div>

          <div class="p-5 relative mt-4">
            <div class="absolute -top-10 left-5 w-12 h-12 rounded-full border-2 border-white shadow-md bg-white overflow-hidden flex items-center justify-center font-bold text-lg">
              ${name[0]}
            </div>

            <div class="flex items-center gap-2">
              <h4 class="text-lg font-bold font-headings uppercase">${name}</h4>
              <i class="fa-solid fa-circle-check text-brandGold text-xs"></i>
            </div>
            
            <div class="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mt-1">
              <span><i class="fa-solid fa-map-pin mr-1.5 text-brandGold"></i>${ward}</span>
              <span>•</span>
              <span><i class="fa-solid fa-star mr-1 text-brandGold"></i>5.0 (New)</span>
            </div>
            
            <p class="text-xs text-slate-500 mt-2 italic leading-relaxed line-clamp-1">"${tagline}"</p>
          </div>
        </div>

        <div class="p-5 border-t flex justify-between items-center text-xs">
          <span class="text-brandGold font-semibold uppercase tracking-wider text-[10px]">${cat}</span>
          <span class="text-brandBlue font-bold">View Listing <i class="fa-solid fa-chevron-right ml-1"></i></span>
        </div>
      </div>
    `;
  } else if (currentWizardType === 'job') {
    const title = document.getElementById('form-job-title').value.trim();
    const company = document.getElementById('form-job-company').value.trim();
    const type = document.getElementById('form-job-type').value;
    const loc = document.getElementById('form-job-loc').value;
    const salary = document.getElementById('form-job-salary').value.trim();

    container.innerHTML = `
      <div class="border rounded-xl p-5 shadow-sm bg-white border-slate-200 w-full max-w-sm text-black">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border flex items-center justify-center font-bold text-lg text-black">
            ${company[0]}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm leading-snug truncate font-headings uppercase">${title}</h4>
            <p class="text-xs text-slate-500 font-semibold mt-0.5">${company}</p>
            
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span class="text-[9px] font-bold bg-brandBlue/10 text-brandBlue px-2 py-0.5 rounded">${type}</span>
              <span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">${loc}</span>
            </div>
            
            <div class="border-t pt-3 mt-3 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span class="text-brandBlue font-bold">₹${salary}</span>
              <span>Just now</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (currentWizardType === 'event') {
    const title = document.getElementById('form-event-title').value.trim();
    const cat = document.getElementById('form-event-cat').value;
    const dateInput = document.getElementById('form-event-date').value;
    const img = document.getElementById('form-event-image').value.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300';
    
    let dateStr = "Aug 1, 2026";
    if (dateInput) {
      const d = new Date(dateInput);
      dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    container.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between w-full max-w-xs text-black">
        <div>
          <div class="relative w-full h-32 overflow-hidden bg-slate-100">
            <img class="w-full h-full object-cover" src="${img}" alt="${title}">
            <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span class="bg-[#111827]/75 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <i class="fa-solid fa-calendar text-brandGold"></i>${dateStr.split(',')[0]}
              </span>
              <span class="bg-[#111827]/75 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <i class="fa-solid fa-users text-brandGold"></i>0
              </span>
            </div>
          </div>

          <div class="p-4">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">${cat}</span>
            <h4 class="font-bold text-sm mt-0.5 font-headings uppercase leading-tight">${title}</h4>
          </div>
        </div>
      </div>
    `;
  }
}

function handleWizardSubmit(event) {
  event.preventDefault();

  if (currentWizardType === 'news') {
    const title = document.getElementById('form-news-title').value.trim();
    const cat = document.getElementById('form-news-cat').value;
    const summary = document.getElementById('form-news-summary').value.trim();
    const detail = document.getElementById('form-news-content').value.trim();
    const img = document.getElementById('form-news-image').value.trim() || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600';

    const newObj = {
      id: Date.now(),
      category: cat,
      badgeClass: cat === 'Alert' ? 'bg-red-500 text-white' : (cat === 'Sports' ? 'bg-emerald-600 text-white' : 'bg-brandBlue text-white'),
      title: title,
      summary: summary,
      content: detail,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: "2 min read",
      image: img
    };
    
    newsDb.unshift(newObj);
    localStorage.setItem('myrajpura_news_v4', JSON.stringify(newsDb));
    navigateTo('news');
  } else if (currentWizardType === 'business') {
    const name = document.getElementById('form-biz-name').value.trim();
    const cat = document.getElementById('form-biz-cat').value;
    const ward = document.getElementById('form-biz-ward').value;
    const tagline = document.getElementById('form-biz-tagline').value.trim();
    const phone = document.getElementById('form-biz-phone').value.trim();
    const email = document.getElementById('form-biz-email').value.trim();
    const address = document.getElementById('form-biz-address').value.trim();
    const cover = document.getElementById('form-biz-cover').value.trim() || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600';
    const desc = document.getElementById('form-biz-desc').value.trim();

    const newObj = {
      id: Date.now(),
      name: name,
      category: cat,
      ward: ward,
      rating: "5.0",
      reviewsCount: 1,
      tagline: tagline,
      logo: "https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=100",
      cover: cover,
      phone: phone,
      email: email,
      website: "myrajpura.com/directory",
      address: address,
      desc: desc,
      services: ["Verfied Local Outlet", "Customer Support Available"],
      gallery: [cover, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300"]
    };

    directoryDb.unshift(newObj);
    localStorage.setItem('myrajpura_directory_v4', JSON.stringify(directoryDb));
    navigateTo('directory');
  } else if (currentWizardType === 'job') {
    const title = document.getElementById('form-job-title').value.trim();
    const company = document.getElementById('form-job-company').value.trim();
    const type = document.getElementById('form-job-type').value;
    const loc = document.getElementById('form-job-loc').value;
    const salary = document.getElementById('form-job-salary').value.trim();
    const phone = document.getElementById('form-job-phone').value.trim();
    const desc = document.getElementById('form-job-desc').value.trim();

    const newObj = {
      id: Date.now(),
      title: title,
      company: company,
      type: type,
      locationMode: loc,
      salary: `₹${salary} / Month`,
      appliedCount: 0,
      posted: "Just now",
      desc: desc,
      requirements: ["Immediate Joiner", "Fluency in local communication"],
      responsibilities: ["Fulfill direct requests by managers"],
      phone: phone
    };

    jobsDb.unshift(newObj);
    activeJobId = newObj.id;
    localStorage.setItem('myrajpura_jobs_v4', JSON.stringify(jobsDb));
    navigateTo('jobs');
  } else if (currentWizardType === 'event') {
    const title = document.getElementById('form-event-title').value.trim();
    const cat = document.getElementById('form-event-cat').value;
    const dateInput = document.getElementById('form-event-date').value;
    const duration = parseInt(document.getElementById('form-event-duration').value) || 1;
    const desc = document.getElementById('form-event-desc').value.trim();
    const img = document.getElementById('form-event-image').value.trim() || 'assets/town_hall.png';

    const d = new Date(dateInput);
    const dayVal = d.getDate();
    
    // Generate arrays of days
    let dayArr = [];
    for (let i = 0; i < duration; i++) {
      dayArr.push(dayVal + i);
    }

    const newObj = {
      id: Date.now(),
      category: cat,
      badgeClass: cat === 'Festivals' ? 'event-green' : (cat === 'Sports' ? 'event-blue' : (cat === 'Commercial' ? 'event-yellow' : 'event-red')),
      title: title,
      desc: desc,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      days: dayArr,
      interestCount: 0,
      image: img
    };

    eventsDb.unshift(newObj);
    localStorage.setItem('myrajpura_events_v4', JSON.stringify(eventsDb));
    navigateTo('events');
  }

  // Clean and hide wizard
  const wizard = document.getElementById('submission-wizard');
  if (wizard) wizard.classList.add('hidden');
  
  const selectionHub = document.getElementById('submit-selection-hub');
  if (selectionHub) selectionHub.classList.remove('hidden');

  const form = document.getElementById('submission-wizard-form');
  if (form) form.reset();
  
  // Alert success
  alert("Thank you! Your community listing was submitted successfully and is now active.");
}
