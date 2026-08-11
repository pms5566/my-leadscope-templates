// --- EVENTS CALENDAR LOGIC (Sooma 51, 52) ---
function toggleEventsView(view) {
  currentEventView = view;
  const btnSchedules = document.getElementById('btn-events-schedules');
  const btnCalendar = document.getElementById('btn-events-calendar');
  const schedulesCont = document.getElementById('events-schedules-container');
  const calendarCont = document.getElementById('events-calendar-container');

  if (!btnSchedules || !btnCalendar || !schedulesCont || !calendarCont) return;

  if (view === 'calendar') {
    btnCalendar.className = "px-4 py-1.5 text-xs font-bold rounded bg-brandBlue text-white dark:bg-brandGold dark:text-black transition-colors";
    btnSchedules.className = "px-4 py-1.5 text-xs font-semibold text-slate-500 rounded transition-colors";
    schedulesCont.classList.add('hidden');
    calendarCont.classList.remove('hidden');
    renderEventsCalendar();
  } else {
    btnSchedules.className = "px-4 py-1.5 text-xs font-bold rounded bg-brandBlue text-white dark:bg-brandGold dark:text-black transition-colors";
    btnCalendar.className = "px-4 py-1.5 text-xs font-semibold text-slate-500 rounded transition-colors";
    calendarCont.classList.add('hidden');
    schedulesCont.classList.remove('hidden');
    renderEventsSchedules();
  }
}

function renderEvents() {
  if (currentEventView === 'calendar') {
    renderEventsCalendar();
  } else {
    renderEventsSchedules();
  }
}

function renderEventsSchedules() {
  const container = document.getElementById('events-grid-container');
  if (!container) return;

  let filtered = eventsDb;

  // Filters
  const searchInput = document.getElementById('event-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (searchVal) {
    filtered = filtered.filter(e => e.title.toLowerCase().includes(searchVal) || e.desc.toLowerCase().includes(searchVal));
  }

  const catFilter = document.getElementById('event-category-filter');
  const catVal = catFilter ? catFilter.value : 'All';
  if (catVal !== 'All') {
    filtered = filtered.filter(e => e.category === catVal);
  }

  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500">
        <i class="fa-solid fa-calendar-xmark text-4xl mb-3 text-slate-355"></i>
        <p>No upcoming schedules matching your criteria.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(event => {
    container.innerHTML += `
      <div class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
        <div>
          <!-- Photo Container -->
          <div class="relative w-full h-40 overflow-hidden bg-slate-100">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${event.image}" alt="${event.title}">
            
            <!-- Float Badges (Sooma 51 inspired) -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span class="bg-[#111827]/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                <i class="fa-solid fa-calendar text-brandGold"></i>${event.date.split(',')[0]}
              </span>
              <span class="bg-[#111827]/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                <i class="fa-solid fa-users text-brandGold"></i>${event.interestCount}
              </span>
            </div>
          </div>

          <div class="p-5">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${event.category}</span>
            <h4 class="font-bold text-lg mt-1 font-headings uppercase hover:text-brandGold transition-colors leading-tight">${event.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">${event.desc}</p>
          </div>
        </div>

        <div class="p-5 border-t border-slate-100 dark:border-slate-800">
          <button class="w-full border border-slate-200 dark:border-slate-700 hover:border-brandGold hover:text-brandGold py-2 rounded-lg text-xs font-bold transition-all uppercase flex items-center justify-center gap-1.5" onclick="starEvent(${event.id})">
            <i class="fa-regular fa-star"></i>Interested
          </button>
        </div>
      </div>
    `;
  });
}

function starEvent(eventId) {
  const event = eventsDb.find(e => e.id === eventId);
  if (event) {
    event.interestCount += 1;
    saveDatabasesToLocalStorage();
    renderEvents();
  }
}

function applyEventFilters() {
  renderEvents();
}

// --- INTERACTIVE MONTHLY CALENDAR GRID (Sooma 52) ---
function changeCalendarMonth(offset) {
  currentCalendarMonth += offset;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear -= 1;
  } else if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear += 1;
  }
  
  // Format Month Year text
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const calendarMonthYear = document.getElementById('calendar-month-year');
  if (calendarMonthYear) calendarMonthYear.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
  
  renderEventsCalendar();
}

function renderEventsCalendar() {
  const container = document.getElementById('calendar-days-container');
  if (!container) return;
  
  container.innerHTML = '';

  // Get first day of month
  const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  // Adjust so Monday is 0
  const adjustedStartCol = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Days in month
  const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  
  // Days in previous month
  const prevMonthTotalDays = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

  // Draw prefix columns (Other Month days)
  for (let i = adjustedStartCol - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    container.innerHTML += `
      <div class="calendar-day other-month">
        <span class="text-xs text-slate-400 font-bold">${dayNum}</span>
      </div>
    `;
  }

  // Draw current month days
  for (let day = 1; day <= totalDays; day++) {
    // Check if this date has any events
    const dayEvents = eventsDb.filter(e => {
      const evDate = new Date(e.date);
      const isAugustMatches = evDate.getMonth() === currentCalendarMonth && evDate.getFullYear() === currentCalendarYear;
      return isAugustMatches && e.days.includes(day);
    });

    let eventsHtml = '';
    dayEvents.forEach(e => {
      eventsHtml += `
        <div class="calendar-event-strip ${e.badgeClass}" title="${e.title}" onclick="openCalendarEventDetail('${e.title}', '${e.desc}', '${e.date}')">
          ${e.title}
        </div>
      `;
    });

    container.innerHTML += `
      <div class="calendar-day">
        <span class="text-xs font-extrabold text-slate-600 dark:text-slate-300">${day}</span>
        <div class="space-y-1 mt-1 overflow-y-auto max-h-[60px]">
          ${eventsHtml}
        </div>
      </div>
    `;
  }

  // Fill remaining suffix columns to complete full calendar week rows (multiple of 7)
  const totalSlotsUsed = adjustedStartCol + totalDays;
  const suffixSlotsNeeded = (7 - (totalSlotsUsed % 7)) % 7;
  for (let day = 1; day <= suffixSlotsNeeded; day++) {
    container.innerHTML += `
      <div class="calendar-day other-month">
        <span class="text-xs text-slate-400 font-bold">${day}</span>
      </div>
    `;
  }
}

function openCalendarEventDetail(title, desc, date) {
  // Use global news detail modal to show event specifications
  const modalImg = document.getElementById('modal-news-image');
  if (modalImg) modalImg.style.backgroundImage = "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600')";
  
  const modalMeta = document.getElementById('modal-news-meta');
  if (modalMeta) {
    modalMeta.innerHTML = `
      <span class="bg-brandGold text-black font-bold px-2 py-0.5 rounded uppercase">COMMUNITY EVENT</span>
      <span>•</span>
      <span>Date: ${date}</span>
    `;
  }
  
  const modalTitle = document.getElementById('modal-news-title');
  if (modalTitle) modalTitle.textContent = title;

  const modalContent = document.getElementById('modal-news-content');
  if (modalContent) {
    modalContent.innerHTML = `<p>${desc}</p><br><p>Interested counts: simulated local attendees are tracking this. RSVP via our submission forms in the contribution tab.</p>`;
  }

  const modal = document.getElementById('news-detail-modal');
  if (modal) modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
