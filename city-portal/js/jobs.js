import { jobsDb } from './data.js';
import { state } from './navigation.js';

// --- JOB BOARD LOGIC (Yoda Split-Pane) ---
export function renderJobFeed() {
  const container = document.getElementById('job-feed-list');
  if (!container) return;

  let filtered = jobsDb;

  // Search keyword inside filters
  const searchInput = document.getElementById('job-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (searchVal) {
    filtered = filtered.filter(j => j.title.toLowerCase().includes(searchVal) || j.company.toLowerCase().includes(searchVal));
  }

  // Job Type Checkboxes
  const selectedTypes = Array.from(document.querySelectorAll('.job-filter-checkbox:checked')).map(c => c.value);
  if (selectedTypes.length > 0) {
    filtered = filtered.filter(j => selectedTypes.includes(j.type));
  }

  // Location Mode Checkboxes
  const selectedLocs = Array.from(document.querySelectorAll('.job-location-checkbox:checked')).map(c => c.value);
  if (selectedLocs.length > 0) {
    filtered = filtered.filter(j => selectedLocs.includes(j.locationMode));
  }

  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <i class="fa-solid fa-magnifying-glass-chart text-3xl mb-2 text-slate-300"></i>
        <p class="text-sm">No career openings match your selection filters.</p>
      </div>
    `;
    const detailsPane = document.getElementById('job-details-pane');
    if (detailsPane) {
      detailsPane.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
          <i class="fa-solid fa-briefcase text-4xl mb-3 text-slate-355"></i>
          <p class="text-sm">No job selected.</p>
        </div>
      `;
    }
    return;
  }

  filtered.forEach((job, index) => {
    // If no active job is selected, select the first match
    if (index === 0 && (!state.activeJobId || !filtered.some(j => j.id === state.activeJobId))) {
      state.activeJobId = job.id;
    }

    const isActive = job.id === state.activeJobId;
    const cardActiveBorder = isActive ? 'border-brandGold ring-1 ring-brandGold' : 'border-slate-200 dark:border-slate-800';
    const cardActiveBg = isActive ? 'bg-slate-50 dark:bg-[#2e3b4e]/30' : 'bg-white dark:bg-[#1e293b]';

    container.innerHTML += `
      <div class="border rounded-xl p-5 shadow-sm transition-all cursor-pointer ${cardActiveBorder} ${cardActiveBg}" onclick="setActiveJob(${job.id})">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-lg text-black">
            ${job.logo ? `<img class="w-full h-full object-cover" src="${job.logo}" alt="Logo">` : job.company[0]}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-snug truncate hover:text-brandGold transition-colors font-headings uppercase">${job.title}</h4>
              <i class="fa-solid fa-bookmark text-slate-400 hover:text-brandGold text-xs shrink-0 pt-0.5"></i>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">${job.company}</p>
            
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span class="text-[9px] font-bold bg-brandBlue/10 text-brandBlue dark:bg-brandGold/10 dark:text-brandGold px-2 py-0.5 rounded">${job.type}</span>
              <span class="text-[9px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded">${job.locationMode}</span>
            </div>
            
            <div class="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span class="text-brandBlue dark:text-brandGold font-bold">${job.salary.split(' /')[0]}</span>
              <span>${job.posted}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

export function setActiveJob(jobId) {
  state.activeJobId = jobId;
  renderJobFeed();
  renderJobDetails();
}

export function renderJobDetails() {
  const detailsPane = document.getElementById('job-details-pane');
  if (!detailsPane) return;

  const job = jobsDb.find(j => j.id === state.activeJobId);

  if (!job) {
    detailsPane.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
        <i class="fa-solid fa-briefcase text-4xl mb-3 text-slate-355"></i>
        <p class="text-sm">Please select a job vacancy from the listing feed to view specifications.</p>
      </div>
    `;
    return;
  }

  // Generate lists
  let reqsHtml = '';
  job.requirements.forEach(r => reqsHtml += `<li class="flex items-start gap-2.5"><i class="fa-solid fa-circle-check text-brandGold mt-1 text-xs"></i><span>${r}</span></li>`);
  
  let respsHtml = '';
  job.responsibilities.forEach(r => respsHtml += `<li class="flex items-start gap-2.5"><i class="fa-solid fa-circle-right text-brandBlue dark:text-brandGold mt-1 text-xs"></i><span>${r}</span></li>`);

  detailsPane.innerHTML = `
    <!-- Detail Header -->
    <div class="flex items-center gap-5 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
      <div class="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-2xl text-black shrink-0">
        ${job.logo ? `<img class="w-full h-full object-cover" src="${job.logo}" alt="Logo">` : job.company[0]}
      </div>
      <div>
        <h3 class="text-2xl font-bold font-headings leading-tight uppercase">${job.title}</h3>
        <p class="text-sm text-brandBlue dark:text-brandGold font-bold mt-0.5">${job.company}</p>
        <div class="flex items-center gap-3 text-xs text-slate-400 mt-2 font-semibold">
          <span><i class="fa-solid fa-briefcase mr-1"></i>${job.type}</span>
          <span>•</span>
          <span><i class="fa-solid fa-location-dot mr-1"></i>${job.locationMode}</span>
        </div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-[#0f172a]/50 p-4 rounded-xl text-xs mb-6">
      <div>
        <div class="text-slate-400 font-bold uppercase tracking-wider">Salary Bracket</div>
        <div class="text-sm font-extrabold text-brandBlue dark:text-brandGold mt-1">${job.salary}</div>
      </div>
      <div>
        <div class="text-slate-400 font-bold uppercase tracking-wider">Simulated Applicants</div>
        <div class="text-sm font-extrabold mt-1">${job.appliedCount} applied</div>
      </div>
    </div>

    <!-- Description -->
    <div class="flex-1 space-y-6 text-sm leading-relaxed">
      <div>
        <h4 class="font-bold text-slate-900 dark:text-white border-l-4 border-brandGold pl-2.5 mb-2 font-headings uppercase">Overview</h4>
        <p class="text-slate-600 dark:text-slate-400 text-xs">${job.desc}</p>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 dark:text-white border-l-4 border-brandGold pl-2.5 mb-3 font-headings uppercase">Requirements</h4>
        <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          ${reqsHtml}
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 dark:text-white border-l-4 border-brandGold pl-2.5 mb-3 font-headings uppercase">Responsibilities</h4>
        <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          ${respsHtml}
        </ul>
      </div>
    </div>

    <!-- Apply Box -->
    <div class="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6 flex gap-4">
      <a href="tel:${job.phone}" class="btn-gold flex-1 text-center py-3 text-xs uppercase flex items-center justify-center gap-2">
        <i class="fa-solid fa-phone"></i> Call Employer
      </a>
      <a href="https://wa.me/${job.phone.replace(/[^0-9]/g, '')}?text=Hi, I am interested in the ${job.title} position at ${job.company} posted on MyRajpura." target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 text-center py-3 text-xs uppercase rounded-md font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
        <i class="fa-brands fa-whatsapp text-sm"></i> Apply WhatsApp
      </a>
    </div>
  `;
}

export function applyJobFilters() {
  renderJobFeed();
  renderJobDetails();
}

export function resetJobFilters() {
  const searchInput = document.getElementById('job-search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.job-filter-checkbox').forEach(c => c.checked = false);
  document.querySelectorAll('.job-location-checkbox').forEach(c => c.checked = false);
  renderJobFeed();
  renderJobDetails();
}

export function toggleJobDrawer(open) {
  const drawer = document.getElementById('job-post-drawer');
  const panel = document.getElementById('job-drawer-panel');
  
  if (!drawer || !panel) return;

  if (open) {
    drawer.classList.remove('hidden');
    setTimeout(() => {
      panel.classList.remove('translate-x-full');
    }, 50);
  } else {
    panel.classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 300);
  }
}

export function submitJobDrawer(event) {
  event.preventDefault();
  
  const company = document.getElementById('drawer-job-company').value.trim();
  const title = document.getElementById('drawer-job-title').value.trim();
  const type = document.getElementById('drawer-job-type').value;
  const locationMode = document.getElementById('drawer-job-location-mode').value;
  const salaryVal = document.getElementById('drawer-job-salary').value.trim();
  const phone = document.getElementById('drawer-job-phone').value.trim();
  const desc = document.getElementById('drawer-job-desc').value.trim();

  const newJob = {
    id: Date.now(),
    title: title,
    company: company,
    type: type,
    locationMode: locationMode,
    salary: `₹${salaryVal} / Month`,
    appliedCount: 0,
    posted: "Just now",
    desc: desc,
    requirements: [
      "Immediate joiner preferred",
      "Valid contact details provided",
      "Fluency in regional language"
    ],
    responsibilities: [
      "Handle direct responsibilities assigned by manager",
      "Maintain active communication with employer"
    ],
    phone: phone
  };

  jobsDb.unshift(newJob);
  state.activeJobId = newJob.id;
  
  document.getElementById('drawer-job-form').reset();
  toggleJobDrawer(false);
  
  renderJobFeed();
  renderJobDetails();
}
