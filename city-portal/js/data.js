// --- MOCK DATABASE DEFAULTS ---
const DEFAULT_NEWS = [
  {
    id: 5,
    category: "Municipal",
    badgeClass: "bg-brandBlue text-white",
    title: "Fwara Chowk Beautification Project Completed; Fountain Restored",
    summary: "The Municipal Committee of Rajpura completed the landscape renovation at Fwara Chowk. The iconic central water fountain has been restored with new decorative lighting.",
    date: "June 25, 2026",
    readTime: "2 min read",
    image: "assets/fwara_chowk.png",
    content: "The landmark Fwara Chowk (Fountain Roundabout) in Rajpura has officially reopened to the public following a month-long beautification project. The Municipal Committee restored the structural fountain, installed LED spotlights, and planted seasonal flowers around the roundabout.<br><br>The local authorities announced plans to renovate surrounding retail stores to match the new aesthetic."
  },
  {
    id: 1,
    category: "Alert",
    badgeClass: "bg-red-500 text-white",
    title: "Rajpura Bye-pass Road Construction Nears Completion; Traffic Diverted",
    summary: "The Municipal Corporation announced that the final black-topping of the new Rajpura Bye-pass flyover starts tomorrow. Commuters are advised to take alternative routes via Nalagarh Road.",
    date: "June 24, 2026",
    readTime: "3 min read",
    image: "assets/youtube_street.jpg",
    content: "The Municipal Corporation of Rajpura has issued a public traffic advisory. The final phase of construction on the Rajpura-Patiala Bye-pass road flyover will begin tomorrow morning, marking the near-completion of a major two-year infrastructure project.<br><br>Heavy vehicles traveling between Chandigarh and Patiala are diverted to the Nalagarh Highway link road. Light motor vehicles can use the inner sector roads. MC Commissioner stated that this detour will remain in place for 5 days. Facade cladding along the service lanes is also being finalized to improve thermal insulation and aesthetics for adjacent commercial establishments."
  },
  {
    id: 2,
    category: "Municipal",
    badgeClass: "bg-brandBlue text-white",
    title: "Rajpura MC Launches Clean City Drive in Ward 5 & Ward 7",
    summary: "A new waste segregation initiative was flagged off by the Mayor today. Cleanliness bins will be distributed to 10,000 households over the next two weeks.",
    date: "June 23, 2026",
    readTime: "4 min read",
    image: "assets/clean_city.png",
    content: "Under the Swachh Rajpura initiative, the Municipal Committee has launched a ward-wise waste segregation drive today. Starting with Wards 5 and 7, municipal workers will distribute separate biodegradable and non-biodegradable collection bins to residents.<br><br>Mayor Sanjeev Kumar flagged off the campaign, emphasizing citizen participation. 'Our goal is to make Rajpura a model green town,' he remarked. Citizen volunteers will also run door-to-door awareness programs."
  },
  {
    id: 3,
    category: "Business",
    badgeClass: "bg-amber-500 text-black",
    title: "New IT Hub Focal Point to Open Next Month, Booking Open",
    summary: "Rajpura Focal Point's new commercial block is set to host 20+ software and backend consulting startups, creating over 500 local tech jobs.",
    date: "June 21, 2026",
    readTime: "5 min read",
    image: "assets/it_hub.png",
    content: "The Industrial Area Focal Point of Rajpura is undergoing a major technological expansion. A newly constructed commercial complex, Rajpura Tech Center, is scheduled to open its doors next month. Over 20 startups and small IT ventures have already leased spaces.<br><br>This development is expected to boost the local economy and keep talent within Punjab. Facilities include high-speed fiber lines, sustainable backup power, and a modern cafeteria. The opening ceremony will invite prominent business delegates from Chandigarh."
  },
  {
    id: 4,
    category: "Sports",
    badgeClass: "bg-emerald-600 text-white",
    title: "Rajpura Sports Club Secures Punjab Kabaddi Semi-Final Spot",
    summary: "In a nail-biting match against Bathinda Warriors, the local Rajpura team clinched victory by 3 points. The semi-finals will be played this Friday.",
    date: "June 20, 2026",
    readTime: "3 min read",
    image: "assets/kabaddi_sports.png",
    content: "The Rajpura Sports Club Kabaddi team advanced to the semi-finals of the State Kabaddi League following a thriller at the local government stadium. They defeated the Bathinda Warriors by a score of 38-35.<br><br>Star raider Balwan Singh scored the match-winning points in the final raid. Coach Gurpreet Singh praised the team's defensive structure. The semi-final matchup is scheduled against Ludhiana at the same venue."
  }
];

const DEFAULT_DIRECTORY = [
  {
    id: 1,
    name: "Wills Hotels & Resorts",
    category: "Food & Dining",
    ward: "Town Hall",
    rating: "4.9",
    reviewsCount: 35,
    tagline: "Stay once, carry memories forever",
    logo: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
    phone: "+91 98765-12345",
    email: "hello@willshotels.com",
    website: "willshotels.com",
    address: "10, Bypass Road near Town Hall, Rajpura",
    desc: "Wills Hotels & Resorts offers premium hospitality services in Rajpura. Featuring high-end luxury suites, a fine dining restaurant, swimming pool, and banquet hall perfect for weddings and corporate gatherings. Visited and reviewed by major regional columns as the top premium stay option in Rajpura.",
    services: ["Luxury Suites", "Banquet Hall", "Swimming Pool", "Multi-Cuisine Buffet", "24/7 Room Service", "Valet Parking"],
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=300",
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=300"
    ]
  },
  {
    id: 2,
    name: "Rajpura Sweet House",
    category: "Food & Dining",
    ward: "Kasturba Road",
    rating: "4.7",
    reviewsCount: 124,
    tagline: "Tradition of sweetness since 1975",
    logo: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800",
    phone: "+91 98142-23456",
    email: "contact@rajpurasweets.com",
    website: "rajpurasweets.com",
    address: "Main Bazar, Kasturba Road, Rajpura",
    desc: "Renowned for local Punjabi sweets, pure desi ghee preparations, and fresh dry fruit delicacies. Rajpura Sweet House has been serving households and weddings in Patiala district for over four decades. Try our famous Dhoda Sweet and Milk cake.",
    services: ["Pure Desi Ghee Sweets", "Custom Wedding Boxes", "Snacks & Samosas", "Outdoor Catering", "Festive Hampers"],
    gallery: [
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=300",
      "https://images.unsplash.com/photo-1589187151032-573886192e4a?q=80&w=300",
      "https://images.unsplash.com/photo-1505253658129-0ec8a341e97d?q=80&w=300"
    ]
  },
  {
    id: 3,
    name: "Calibre Electronics",
    category: "Shops & Retail",
    ward: "Calibre Market",
    rating: "4.5",
    reviewsCount: 89,
    tagline: "Your local tech & electronics expert",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
    phone: "+91 98881-34567",
    email: "info@calibreelectronics.com",
    website: "calibreparts.in",
    address: "Shop 42, Calibre Market, Rajpura",
    desc: "The largest multi-brand retail shop in Rajpura for home appliances, laptops, smartphones, and custom desktop builds. We provide official brand warranty products with easy EMI financing options.",
    services: ["Smartphones & Laptops", "Home Appliances", "Custom PC Building", "Repair Services", "Zero Cost EMI"],
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=300",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=300"
    ]
  },
  {
    id: 4,
    name: "Bassi Dental Clinic",
    category: "Health & Medical",
    ward: "Town Hall",
    rating: "4.8",
    reviewsCount: 62,
    tagline: "Smile with confidence",
    logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=800",
    phone: "+91 99155-78901",
    email: "drbassi@bassidental.com",
    website: "bassidental.com",
    address: "Adjoining Town Hall, Ward 6, Rajpura",
    desc: "Providing state-of-the-art dental care in Rajpura. Led by Dr. Bassi, our clinic specializes in cosmetic dentistry, dental implants, root canals, and braces. Fully sanitized, child-friendly environment.",
    services: ["Dental Implants", "Cosmetic Smile Design", "Root Canal Treatment", "Teeth Whitening", "Orthodontic Braces"],
    gallery: [
      "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?q=80&w=300",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=300",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=300"
    ]
  },
  {
    id: 5,
    name: "Apex Wood Crafts",
    category: "Professional Services",
    ward: "Focal Point",
    rating: "4.6",
    reviewsCount: 28,
    tagline: "Premium wood siding & furniture builders",
    logo: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800",
    phone: "+91 98762-90123",
    email: "apexwood@focalpoint.org",
    website: "apexwoods.in",
    address: "Plot 115, Focal Point Phase II, Rajpura",
    desc: "Specialized in customized home furniture, modern wood siding installations, wall paneling, and weather protection boards. We source sustainable, termite-treated seasoned timber.",
    services: ["Custom Wood Siding", "Modular Kitchens", "Modern Furniture Design", "Cladding Refurbishment", "Polishing & Joinery"],
    gallery: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=300",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=300"
    ]
  }
];

const DEFAULT_JOBS = [
  {
    id: 1,
    title: "Senior Accounts Assistant",
    company: "Calibre Enterprises",
    logo: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=80",
    type: "Full-Time",
    locationMode: "On-Site",
    salary: "₹18,000 - ₹25,000 / Month",
    appliedCount: 23,
    posted: "2 days ago",
    desc: "We are looking for a senior accountant to manage bookkeeping, GST filings, and general financial ledgers for our industrial manufacturing branch at Focal Point. Candidates must have Tally ERP proficiency and 2+ years of experience.",
    requirements: [
      "2+ years experience in corporate accounting",
      "Sound knowledge of Tally, GST, and TDS filings",
      "B.Com or relevant commerce degree",
      "Good communication skills in Punjabi/Hindi"
    ],
    responsibilities: [
      "Post and process journal entries to ensure all business transactions are recorded",
      "Prepare monthly reports and quarterly GST spreadsheets",
      "Coordinate with CA for audit filings",
      "Process monthly payroll for factory workers"
    ],
    phone: "+91 98881-34567"
  },
  {
    id: 2,
    title: "Showroom Sales Executive",
    company: "Soni Garments",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=80",
    type: "Full-Time",
    locationMode: "On-Site",
    salary: "₹12,000 - ₹16,000 / Month",
    appliedCount: 41,
    posted: "3 days ago",
    desc: "Join our retail sales team at the busiest market strip in Rajpura. You will assist walk-in customers, manage stock displays, and handle cash register transactions during evening shifts.",
    requirements: [
      "12th Pass or graduate (any stream)",
      "Polite personality with strong persuasion skills",
      "Previous retail/apparel experience is a plus",
      "Ability to handle billing systems"
    ],
    responsibilities: [
      "Welcoming and assisting clients as they enter the showroom",
      "Keep apparel display racks fully stocked and organized",
      "Track and report stock shortages to the manager",
      "Manage client checkouts and billing counter"
    ],
    phone: "+91 98142-99887"
  },
  {
    id: 3,
    title: "Data Entry Operator",
    company: "Tech-Focal Startups",
    logo: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=80",
    type: "Part-Time",
    locationMode: "Remote",
    salary: "₹8,000 - ₹10,000 / Month",
    appliedCount: 89,
    posted: "1 day ago",
    desc: "Looking for students or part-timers to handle remote database inputs. You will transfer catalog details into our cloud software. Computer and high-speed internet at home are required.",
    requirements: [
      "Excellent typing speed (minimum 40 WPM)",
      "Attention to detail and basic MS Excel skills",
      "Must own a personal laptop and stable internet connection",
      "Flexible working schedule"
    ],
    responsibilities: [
      "Input product titles, prices, and descriptions into database",
      "Verify data accuracy by comparing with scanned source documents",
      "Maintain a daily log of entries uploaded",
      "Coordinate queries with the data supervisor online"
    ],
    phone: "+91 99144-88552"
  }
];

const DEFAULT_EVENTS = [
  {
    id: 1,
    category: "Festivals",
    badgeClass: "event-green",
    title: "Monsoon Teej Festival",
    desc: "Celebrate Teej with traditional Punjabi swings, giddha performances, and sweet food stalls.",
    date: "Aug 15, 2026",
    days: [15],
    interestCount: 1642,
    image: "assets/teej_festival.png"
  },
  {
    id: 2,
    category: "Sports",
    badgeClass: "event-blue",
    title: "Annual Kabaddi Championship",
    desc: "Top 8 teams of Patiala district battle it out for the grand trophy. Live commentary and food court.",
    date: "Aug 12, 2026",
    days: [12, 13, 14],
    interestCount: 843,
    image: "assets/kabaddi_sports.png"
  },
  {
    id: 3,
    category: "Commercial",
    badgeClass: "event-yellow",
    title: "Grand Monsoon Market Sale",
    desc: "Amazing discounts of up to 40% across electronic shops, apparel, and furniture stores at Calibre market.",
    date: "Aug 6, 2026",
    days: [6, 7],
    interestCount: 994,
    image: "assets/market_sale.png"
  },
  {
    id: 4,
    category: "Community",
    badgeClass: "event-red",
    title: "Public Civic Town Hall Meet",
    desc: "Meet Municipal Corporation representatives to discuss road work and clean water strategies in Ward 5.",
    date: "Aug 22, 2026",
    days: [22],
    interestCount: 258,
    image: "assets/town_hall.png"
  }
];

const DEFAULT_BUZZ = [
  { sender: "Sandeep Singh", time: "10:15 AM", message: "Water supply is back in Ward 5, pressure is low though.", isSent: false },
  { sender: "Navjot MC", time: "10:48 AM", message: "MC road repair workers have arrived near Bypass road. Expect minor blocks.", isSent: false },
  { sender: "Ravi Kumar", time: "11:20 AM", message: "Anyone knows if Bassi Clinic is open today?", isSent: false },
  { sender: "Harpreet Kaur", time: "11:22 AM", message: "Yes Ravi, Bassi clinic is open till 6 PM. Took my son there in the morning.", isSent: false }
];

// --- PILLARS MAPPING FOR PREVIEW (Home Page) ---
const PILLARS_PREVIEWS = [
  {
    badge: "NEWS",
    title: "Breaking News & Local Incidents",
    desc: "Stay informed about road closures, water updates, sports results, and municipal bulletins around Rajpura.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800"
  },
  {
    badge: "DIRECTORY",
    title: "Verified Shop & Services Finder",
    desc: "Access contact details, locations, services list, and opening timings for local businesses.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800"
  },
  {
    badge: "CAREERS",
    title: "Active Job Openings in Rajpura",
    desc: "Apply directly via phone or WhatsApp to factory, retail, clerical, and local startup vacancies.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800"
  },
  {
    badge: "CALENDAR",
    title: "Upcoming Community Events & Sales",
    desc: "Track local matches, Teej melas, and commercial discounts across the monthly layout grids.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"
  }
];

// --- LOCAL STORAGE STATE INITIALIZATION ---
let newsDb = JSON.parse(localStorage.getItem('myrajpura_news_v4')) || DEFAULT_NEWS;
let directoryDb = JSON.parse(localStorage.getItem('myrajpura_directory_v4')) || DEFAULT_DIRECTORY;
let jobsDb = JSON.parse(localStorage.getItem('myrajpura_jobs_v4')) || DEFAULT_JOBS;
let eventsDb = JSON.parse(localStorage.getItem('myrajpura_events_v4')) || DEFAULT_EVENTS;
let buzzDb = JSON.parse(localStorage.getItem('myrajpura_buzz_v4')) || DEFAULT_BUZZ;

// Save database back to persist defaults if first run
function saveDatabasesToLocalStorage() {
  localStorage.setItem('myrajpura_news_v4', JSON.stringify(newsDb));
  localStorage.setItem('myrajpura_directory_v4', JSON.stringify(directoryDb));
  localStorage.setItem('myrajpura_jobs_v4', JSON.stringify(jobsDb));
  localStorage.setItem('myrajpura_events_v4', JSON.stringify(eventsDb));
  localStorage.setItem('myrajpura_buzz_v4', JSON.stringify(buzzDb));
}
saveDatabasesToLocalStorage();
