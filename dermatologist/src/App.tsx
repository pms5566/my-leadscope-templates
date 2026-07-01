import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  GraduationCap,
  Activity,
  Heart,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShoppingBag,
  Star,
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Check,
  Stethoscope,
  BookOpen,
  Camera
} from 'lucide-react';
import {
  DERMATOLOGY_SERVICES,
  TESTIMONIALS,
  SKINCARE_PRODUCTS,
  CHAMBERS,
  SKIN_CONCERNS,
  TIME_SLOTS,
  type SkincareProduct
} from './mockData';
import doctorPortrait from './assets/doctor-portrait.png';

interface CartItem extends SkincareProduct {
  quantity: number;
}

interface AppointmentRequest {
  name: string;
  phone: string;
  email: string;
  chamberId: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  notes: string;
}

// Helper to extract lead parameters from URL query params (for live personalizer previews)
const getParam = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  const val = params.get(name);
  return val ? decodeURIComponent(val) : fallback;
};

function App() {
  const businessName = getParam('name', 'DermAura Clinic');
  const phone = getParam('phone', '+91 98200 54321');
  const address = getParam('address', 'Linking Road, Santa Cruz West, Mumbai - 400054');
  const email = getParam('email', 'hello@dermaura.clinic');

  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Concern Finder state
  const [activeConcernId, setActiveConcernId] = useState<string>('acne');
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Topic advisor state
  const [activeTopicId, setActiveTopicId] = useState<string>('barrier');

  // Testimonials Carousel States
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Modals States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState<AppointmentRequest>({
    name: '',
    phone: '',
    email: '',
    chamberId: CHAMBERS[0].id,
    serviceId: DERMATOLOGY_SERVICES[0].id,
    date: '',
    timeSlot: TIME_SLOTS[0],
    notes: ''
  });

  const [remoteModalOpen, setRemoteModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'analyzing' | 'report'>('upload');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [remoteConcern, setRemoteConcern] = useState<string>('acne');
  const [remoteDetails, setRemoteDetails] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState('Initializing dermal scan...');

  // Newsletter States
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);



  // Track scroll for header transition and active link
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['about', 'concerns', 'topics', 'services', 'shop', 'chambers'];
      let currentSection = 'home';
      const scrollPos = window.scrollY + 150;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Remote analysis progress animation
  useEffect(() => {
    if (uploadStep === 'analyzing') {
      setAnalysisProgress(0);
      const texts = [
        'Uploading high-resolution dermal profile...',
        'Mapping surface hydration and tissue redness...',
        'Running AI classification on pore-density and sebum scales...',
        'Synthesizing personalized dermatological analysis...',
        'Compiling customized clinical prescription report...'
      ];
      
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setUploadStep('report'), 500);
            return 100;
          }
          const next = prev + 5;
          const textIdx = Math.min(Math.floor((next / 100) * texts.length), texts.length - 1);
          setAnalysisText(texts[textIdx]);
          return next;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [uploadStep]);

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Add to cart helper
  const addToCart = (product: SkincareProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Appointment submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date) {
      alert('Please fill in name, phone, and date.');
      return;
    }
    setBookingSuccess(true);
  };

  // Remote analysis trigger
  const triggerRemoteAnalysis = () => {
    setUploadedPhoto('https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80');
    setUploadStep('analyzing');
  };

  // Quick book preset helper
  const openBookingForService = (serviceId: string) => {
    setBookingForm(prev => ({ ...prev, serviceId }));
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  // Add recommended bundle
  const addAnalysisBundle = () => {
    const products = SKINCARE_PRODUCTS.slice(0, 2);
    products.forEach(p => addToCart(p));
    setRemoteModalOpen(false);
  };

  const activeConcern = SKIN_CONCERNS.find(c => c.id === activeConcernId) || SKIN_CONCERNS[0];
  const recommendedService = DERMATOLOGY_SERVICES.find(s => s.id === activeConcern.recommendedServiceId);

  // Topics and advice data
  const TOPICS = [
    { id: 'barrier', label: 'Skin Barrier', text: 'A compromised barrier leads to skin sensitivity, flaking, and redness. Avoid harsh active acids and nourish it daily with ceramides, niacinamide, and squalane.' },
    { id: 'sun', label: 'Sun Protection', text: 'SPF is your ultimate anti-aging tool. Apply a nickel-sized amount of SPF 50 mineral sunscreen daily, and reapply every 2 hours when outdoors.' },
    { id: 'aging', label: 'Skin Aging', text: 'True rejuvenation happens below the surface. Focus on retinoids, vitamin C, and collagen-boosting peptides. Rebuilding cellular health is the key to volume restoration.' },
    { id: 'acne', label: 'Acne Control', text: 'Acne is an inflammatory condition. Clean pores with salicylic acid extraction and laser therapy to destroy bacteria without stripping your skin of moisture.' },
    { id: 'hormones', label: 'Hormonal Shifts', text: 'Hormonal spikes drive sebum production. Clean clinical diets, stress management, and topical retinoids work from the inside out to balance your skin.' },
    { id: 'hydration', label: 'Hydration Science', text: 'Dehydrated skin lacks water, not oil. Layer low-molecular hyaluronic acid serums on damp skin, then seal with a light occlusive moisturizer.' },
    { id: 'scars', label: 'Scar Management', text: 'Fresh scars are active tissue. Combine silicone sheeting with early fractional CO2 laser sessions to flatten textured scar tissue efficiently.' },
    { id: 'lifestyle', label: 'Lifestyle & Diet', text: 'Your skin reflects your physiological state. Keep sugar intake low, hydrate, sleep 8 hours to reduce cortisol levels, and avoid vaping or smoking.' }
  ];

  const activeTopic = TOPICS.find(t => t.id === activeTopicId) || TOPICS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1a1721] selection:bg-[#d47a3b] selection:text-white">
      
      {/* Top Banner */}
      <div className="bg-[#0b6b78] text-white text-center py-2.5 px-4 text-xs font-bold tracking-wider relative z-50">
        ✨ Advancing Skin Health: Schedule a virtual or in-person session today. 
        <strong className="underline ml-2 cursor-pointer hover:text-[#e89c67] transition-colors" onClick={() => { setBookingSuccess(false); setBookingModalOpen(true); }}>Book Appointment</strong>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 h-20 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md shadow-amber-900/5' : 'bg-[#faf7f2]/90 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-heading text-2xl font-bold tracking-tight text-[#1a1721] flex items-center gap-2" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            <span className="w-8 h-8 rounded-full bg-[#d47a3b] text-white flex items-center justify-center font-black text-base shadow-sm shadow-[#d47a3b]/20">{businessName.charAt(0)}</span>
            <span className="text-xl">{businessName}</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('about')} className={`font-semibold text-sm transition-colors hover:text-[#d47a3b] relative py-2 ${activeSection === 'about' ? 'text-[#d47a3b] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#d47a3b]' : 'text-slate-600'}`}>About</button>
            <button onClick={() => scrollToSection('concerns')} className={`font-semibold text-sm transition-colors hover:text-[#d47a3b] relative py-2 ${activeSection === 'concerns' ? 'text-[#d47a3b] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#d47a3b]' : 'text-slate-600'}`}>Concern Finder</button>
            <button onClick={() => scrollToSection('topics')} className={`font-semibold text-sm transition-colors hover:text-[#d47a3b] relative py-2 ${activeSection === 'topics' ? 'text-[#d47a3b] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#d47a3b]' : 'text-slate-600'}`}>Skincare Topics</button>
            <button onClick={() => scrollToSection('services')} className={`font-semibold text-sm transition-colors hover:text-[#d47a3b] relative py-2 ${activeSection === 'services' ? 'text-[#d47a3b] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#d47a3b]' : 'text-slate-600'}`}>Services</button>
            <button onClick={() => scrollToSection('shop')} className={`font-semibold text-sm transition-colors hover:text-[#d47a3b] relative py-2 ${activeSection === 'shop' ? 'text-[#d47a3b] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#d47a3b]' : 'text-slate-600'}`}>Clinical Shop</button>
            <button onClick={() => scrollToSection('chambers')} className={`font-semibold text-sm transition-colors hover:text-[#d47a3b] relative py-2 ${activeSection === 'chambers' ? 'text-[#d47a3b] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#d47a3b]' : 'text-slate-600'}`}>Chambers</button>
          </nav>

          {/* Header CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => { setBookingSuccess(false); setBookingModalOpen(true); }} className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white rounded-full px-6 py-2.5 h-auto min-h-0 text-xs font-bold tracking-wider shadow-sm shadow-[#d47a3b]/20">
              BOOK CONSULTATION <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </button>
            <button onClick={() => setCartOpen(true)} className="relative w-11 h-11 border border-slate-200 bg-white hover:bg-[#d47a3b] hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#0b6b78] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="relative w-10 h-10 border border-slate-200 bg-white rounded-full flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0b6b78] text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn btn-ghost btn-circle text-slate-800">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 shadow-2xl flex flex-col gap-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-heading font-bold text-slate-900 tracking-wider">NAVIGATION</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-4 text-left">
              <button onClick={() => scrollToSection('about')} className="py-2 font-semibold text-slate-700 border-b border-slate-50 text-left">About</button>
              <button onClick={() => scrollToSection('concerns')} className="py-2 font-semibold text-slate-700 border-b border-slate-50 text-left">Concern Finder</button>
              <button onClick={() => scrollToSection('topics')} className="py-2 font-semibold text-slate-700 border-b border-slate-50 text-left">Skincare Topics</button>
              <button onClick={() => scrollToSection('services')} className="py-2 font-semibold text-slate-700 border-b border-slate-50 text-left">Services</button>
              <button onClick={() => scrollToSection('shop')} className="py-2 font-semibold text-slate-700 border-b border-slate-50 text-left">Clinical Shop</button>
              <button onClick={() => scrollToSection('chambers')} className="py-2 font-semibold text-slate-700 border-b border-slate-50 text-left">Chambers</button>
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <button onClick={() => { setMobileMenuOpen(false); setRemoteModalOpen(true); setUploadStep('upload'); }} className="btn btn-outline border-slate-200 text-slate-700 w-full">
                AI Skin Analysis
              </button>
              <button onClick={() => { setMobileMenuOpen(false); setBookingSuccess(false); setBookingModalOpen(true); }} className="btn bg-[#d47a3b] text-white hover:bg-[#b05d25] border-none w-full">
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section 
          id="home" 
          className="py-20 sm:py-32 overflow-hidden relative bg-cover bg-center min-h-[85vh] flex items-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80')" }}
        >
          {/* Light cream gradient overlay to blend photo on the right and ensure text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/95 to-[#faf7f2]/30 z-0"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column (Hero Content) */}
              <div className="lg:col-span-7 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d47a3b]/5 border border-[#d47a3b]/10 rounded-full text-[#d47a3b] font-bold text-xs uppercase tracking-wider mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalized Medical-Grade Skincare</span>
                </div>
                
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-[#1a1721]">
                  Advancing Skin Health Through <span className="text-[#d47a3b]">Knowledge & Care</span>
                </h1>
                
                <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-xl">
                  {businessName} combines clinical precision with advanced aesthetics, offering diagnostic skincare assessments and customized treatments for radiant skin health.
                </p>

                {/* Main Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                  <button onClick={() => { setBookingSuccess(false); setBookingModalOpen(true); }} className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white text-sm font-semibold rounded-full px-8 py-4 h-auto min-h-0 shadow-lg shadow-[#d47a3b]/20">
                    BOOK APPOINTMENT <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                  <button onClick={() => { setRemoteModalOpen(true); setUploadStep('upload'); }} className="btn bg-[#0b6b78] hover:bg-[#084f59] border-none text-white text-sm font-semibold rounded-full px-8 py-4 h-auto min-h-0 shadow-lg shadow-[#0b6b78]/20">
                    START ONLINE SCAN <Camera className="w-4 h-4 ml-2" />
                  </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-6 max-w-md bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                  <div className="text-left">
                    <span className="block text-2xl font-black text-[#d47a3b]">28K+</span>
                    <span className="text-xs text-slate-500 font-medium">Patients Treated</span>
                  </div>
                  <div className="text-left border-l border-slate-100 pl-6">
                    <span className="block text-2xl font-black text-[#0b6b78]">15+</span>
                    <span className="text-xs text-slate-500 font-medium">Years Active</span>
                  </div>
                  <div className="text-left border-l border-slate-100 pl-6">
                    <span className="block text-2xl font-black text-[#1a1721]">5.0/5</span>
                    <span className="text-xs text-slate-500 font-medium">Patient Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Column (Floating Badges & Interactive Widget) */}
              <div className="lg:col-span-5 relative flex flex-col gap-6 items-center lg:items-end justify-center mt-8 lg:mt-0">
                {/* Floating Specialty Badge */}
                <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-lg flex items-center gap-3 max-w-[260px] animate-float-slow mr-auto lg:mr-12">
                  <div className="w-10 h-10 bg-[#d47a3b]/10 text-[#d47a3b] rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-900 leading-tight">{businessName} Clinical Suite</span>
                    <span className="text-[10px] text-slate-500">Board-certified specialists & sterile settings</span>
                  </div>
                </div>

                {/* Frosted glass Remote Scan Card */}
                <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-6 rounded-3xl shadow-xl flex flex-col gap-4 max-w-[320px] animate-float-delayed text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0b6b78]/10 text-[#0b6b78] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 leading-tight">Dermal AI Diagnostics</span>
                      <span className="text-[9px] text-[#0b6b78] font-bold uppercase tracking-wider">Remote Analysis Available</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Can't visit our clinic? Simulate a skin analysis report and get expert recommended products in minutes.
                  </p>
                  <button 
                    onClick={() => { setRemoteModalOpen(true); setUploadStep('upload'); }}
                    className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white w-full rounded-xl py-2.5 h-auto min-h-0 text-[11px] font-bold tracking-wider"
                  >
                    START VIRTUAL SKIN SCAN &rarr;
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Areas of Attention Grid */}
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                CLINICAL HIGHLIGHTS
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900">
                Areas Receiving My Attention Right Now
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <div className="bg-[#faf7f2] border border-[#f2ece4] rounded-2xl p-6 text-left hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="absolute top-4 right-4 text-xs font-bold text-[#d47a3b] opacity-20 group-hover:opacity-100 transition-opacity">01</span>
                <div className="w-10 h-10 bg-[#d47a3b]/10 text-[#d47a3b] rounded-xl flex items-center justify-center mb-5">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1a1721] mb-2">Acne Research</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Assessing effective molecular solutions for hormonal outbreaks, blackheads, and micro-scarring triggers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#faf7f2] border border-[#f2ece4] rounded-2xl p-6 text-left hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="absolute top-4 right-4 text-xs font-bold text-[#0b6b78] opacity-20 group-hover:opacity-100 transition-opacity">02</span>
                <div className="w-10 h-10 bg-[#0b6b78]/10 text-[#0b6b78] rounded-xl flex items-center justify-center mb-5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1a1721] mb-2">Patient Education</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Empowering treatments through clear scientific guidelines, routine optimizations, and clinical tips.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#faf7f2] border border-[#f2ece4] rounded-2xl p-6 text-left hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="absolute top-4 right-4 text-xs font-bold text-[#d47a3b] opacity-20 group-hover:opacity-100 transition-opacity">03</span>
                <div className="w-10 h-10 bg-[#d47a3b]/10 text-[#d47a3b] rounded-xl flex items-center justify-center mb-5">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1a1721] mb-2">Preventive Dermatology</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focusing on skin barrier preservation, early cancer screening, and strict daily sunscreen science.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#faf7f2] border border-[#f2ece4] rounded-2xl p-6 text-left hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="absolute top-4 right-4 text-xs font-bold text-[#0b6b78] opacity-20 group-hover:opacity-100 transition-opacity">04</span>
                <div className="w-10 h-10 bg-[#0b6b78]/10 text-[#0b6b78] rounded-xl flex items-center justify-center mb-5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1a1721] mb-2">Emerging Treatments</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pioneering tissue regeneration protocols utilizing Platelet-Rich Plasma (PRP) and fractional microneedling.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Interactive Concern Finder Section */}
        <section id="concerns" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                INTERACTIVE CLINICAL FINDER
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                Real Patient Challenges, Tailored Clinical Treatments
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Select a skin concern below to reveal the customized treatment plan, recommended service, and drag the slider to inspect the clinical transformation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Concern Selection Panel */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-left">Select Skin Concern:</span>
                {SKIN_CONCERNS.map((concern) => (
                  <button
                    key={concern.id}
                    onClick={() => {
                      setActiveConcernId(concern.id);
                      setSliderPos(50); // Reset slider position
                    }}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                      activeConcernId === concern.id
                        ? 'bg-[#d47a3b]/5 border-[#d47a3b] shadow-sm shadow-[#d47a3b]/5'
                        : 'bg-white border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className={`font-heading font-extrabold text-sm ${activeConcernId === concern.id ? 'text-[#d47a3b]' : 'text-slate-900'}`}>
                        {concern.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{concern.shortDesc}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeConcernId === concern.id ? 'text-[#d47a3b] translate-x-1' : 'text-slate-400'}`} />
                  </button>
                ))}

                {/* Quick Doctor Tip Box */}
                <div className="mt-6 bg-[#0b6b78]/5 border border-[#0b6b78]/10 rounded-2xl p-5 text-left flex gap-4 items-start">
                  <img 
                    src={doctorPortrait} 
                    alt="Clinical Specialist" 
                    className="w-12 h-12 rounded-full object-cover border border-white shadow-sm flex-shrink-0"
                  />
                  <div>
                    <div className="flex gap-2 items-center mb-1.5">
                      <h5 className="font-heading font-bold text-xs text-[#0b6b78] uppercase tracking-wider">{businessName} Specialist Tip</h5>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      "{activeConcern.doctorTip}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Slider & Recommended Plan Card */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                
                {/* Before/After Slider Container (Col 7) */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-left block">Transformative Results:</span>
                  
                  {/* The Interactive Slider Widget */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-slate-100 select-none">
                    {/* Before Image */}
                    <img 
                      src={activeConcern.beforeImg} 
                      alt="Before treatment"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* After Image Container (clipped width) */}
                    <div 
                      className="absolute inset-0 overflow-hidden" 
                      style={{ width: `${sliderPos}%` }}
                    >
                      <img 
                        src={activeConcern.afterImg} 
                        alt="After treatment"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%', height: '100%' }} // Lock aspect matching the parent
                      />
                    </div>

                    {/* Labels */}
                    <span className="absolute bottom-4 left-4 bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full pointer-events-none">
                      Before
                    </span>
                    <span className="absolute bottom-4 right-4 bg-[#d47a3b]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full pointer-events-none">
                      After Recovery
                    </span>

                    {/* Drag Line Handler */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center pointer-events-none"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white text-[#d47a3b] shadow-lg flex items-center justify-center text-xs font-bold pointer-events-none border border-slate-200">
                        &lsaquo;&rsaquo;
                      </div>
                    </div>

                    {/* Range Input Slider Overlay */}
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sliderPos} 
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-ew-resize"
                    />
                  </div>

                  {/* Case Study Details card */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 text-left shadow-sm">
                    <div className="flex justify-between items-start gap-4 mb-3 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Case Study Summary</span>
                        <h4 className="font-heading font-extrabold text-sm text-slate-900 mt-0.5">Clinical Case: {activeConcern.name}</h4>
                      </div>
                      <span className="bg-[#0b6b78]/10 text-[#0b6b78] text-xs font-extrabold px-3 py-1 rounded-full whitespace-nowrap">
                        {activeConcern.caseStudy.outcomeStat}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Challenge</span>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{activeConcern.caseStudy.challenge}</p>
                      </div>
                      <div className="sm:border-l sm:border-slate-100 sm:pl-4">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Approach</span>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{activeConcern.caseStudy.approach}</p>
                      </div>
                      <div className="sm:border-l sm:border-slate-100 sm:pl-4">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Outcome</span>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{activeConcern.caseStudy.outcome}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Service & Pricing Card (Col 5) */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-left block">Recommended Plan:</span>
                  
                  {recommendedService && (
                    <div className="bg-white border-2 border-[#d47a3b] rounded-3xl p-6 flex flex-col justify-between h-full shadow-sm text-left relative overflow-hidden">
                      {/* Popular ribbon */}
                      <span className="absolute top-0 right-0 bg-[#d47a3b] text-white text-[9px] font-bold uppercase px-4 py-1.5 rounded-bl-2xl">
                        Recommended
                      </span>

                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Clinic Treatment Plan</span>
                        <h3 className="font-heading font-black text-xl text-slate-900 leading-tight mb-3">
                          {recommendedService.name}
                        </h3>
                        <div className="inline-block px-3 py-1 bg-[#d47a3b]/10 text-[#d47a3b] text-xs font-extrabold rounded-full mb-5">
                          {activeConcern.discountTag}
                        </div>
                        
                        <p className="text-xs text-slate-600 leading-relaxed mb-6">
                          {recommendedService.description}
                        </p>

                        <div className="space-y-3 mb-8">
                          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                            <Clock className="w-4 h-4 text-[#0b6b78]" />
                            <span>Duration: {recommendedService.duration}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                            <Sparkles className="w-4 h-4 text-[#0b6b78]" />
                            <span>Treatment: {recommendedService.category}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Clinical consultation included</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-2 mb-6">
                          <span className="text-3xl font-black text-[#d47a3b]">{activeConcern.discountPrice}</span>
                          <span className="text-sm text-slate-400 line-through font-medium">{activeConcern.originalPrice}</span>
                        </div>

                        <button 
                          onClick={() => openBookingForService(recommendedService.id)}
                          className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white w-full rounded-xl py-3 h-auto min-h-0 text-xs font-bold tracking-wider"
                        >
                          BOOK TREATMENT NOW
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* Meet the Expert Section (Bio & Badges & Remote Analysis Box) */}
        <section id="about" className="py-20 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column (Clinic space photo with Badges) */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-sm">
                  
                  {/* Photo frame */}
                  <div className="aspect-[1/1.1] rounded-3xl overflow-hidden border border-slate-100 shadow-md">
                    <img 
                      src={doctorPortrait} 
                      alt={`${businessName} Clinical Lead Specialist`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute -bottom-6 -right-4 bg-white border border-slate-100 p-4 rounded-xl shadow-lg flex flex-col items-start gap-1">
                    <div className="flex gap-0.5 text-amber-500 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </div>
                    <span className="text-xs font-extrabold text-[#1a1721]">5.0 Patient Rating</span>
                    <span className="text-[10px] text-slate-500">Verified by 5,000+ consults</span>
                  </div>

                  {/* Certifications and Badges icons */}
                  <div className="absolute -left-6 bottom-12 flex flex-col gap-2.5">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-md">
                      <GraduationCap className="w-6 h-6 text-[#d47a3b]" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-md">
                      <Award className="w-6 h-6 text-[#0b6b78]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Bio Text & Remote consultation CTA) */}
              <div className="lg:col-span-7 text-left">
                <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                  ABOUT THE CLINIC
                </span>
                
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug mb-6">
                  Meet Our Lead Specialist.<br />
                  <span className="text-[#0b6b78] font-bold">Clinical Dermatology Experts.</span>
                </h2>

                <p className="text-slate-700 text-base mb-4 font-medium">
                  At {businessName}, our medical team is led by board-certified dermatologists and research advisors with over 15 years of clinical excellence in dermatology, venereology, and advanced skin lasers.
                </p>

                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  Our specialists completed their medical degrees from top-tier institutions, including MDs in Dermatology from the prestigious All India Institute of Medical Sciences (AIIMS), New Delhi, alongside advanced Laser Surgery fellowships in Bangkok, Thailand. {businessName} is dedicated to combining medical-grade precision with customized aesthetic artistry, ensuring clean, scientific, and lasting results.
                </p>

                {/* Dynamic Credentials Badges Grid */}
                <div className="flex flex-wrap gap-3 mb-10">
                  <div className="flex items-center gap-2 bg-[#faf7f2] border border-[#f2ece4] rounded-full px-5 py-2.5">
                    <GraduationCap className="w-4 h-4 text-[#d47a3b]" />
                    <span className="text-xs font-bold text-slate-700">MD, AIIMS New Delhi</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#faf7f2] border border-[#f2ece4] rounded-full px-5 py-2.5">
                    <Award className="w-4 h-4 text-[#d47a3b]" />
                    <span className="text-xs font-bold text-slate-700">Laser Surgery Fellow</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#faf7f2] border border-[#f2ece4] rounded-full px-5 py-2.5">
                    <Stethoscope className="w-4 h-4 text-[#d47a3b]" />
                    <span className="text-xs font-bold text-slate-700">15+ Years Experience</span>
                  </div>
                </div>

                {/* Remote consult banner inspired by CosmetIQ */}
                <div className="bg-gradient-to-r from-[#d47a3b] to-[#c16729] rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md shadow-[#d47a3b]/10">
                  <div className="text-left">
                    <h4 className="font-heading text-lg font-black tracking-tight flex items-center gap-2">
                      <Camera className="w-5 h-5 text-white" /> Get Expert Skin Analysis Remotely
                    </h4>
                    <p className="text-xs text-amber-50/80 mt-1 max-w-md">
                      Can't make it to our clinic? Upload photos of your skin concern and receive a customized preliminary clinical skincare advice report within hours.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setRemoteModalOpen(true); setUploadStep('upload'); }}
                    className="btn bg-white hover:bg-amber-50 text-[#d47a3b] border-none rounded-full px-6 py-3 h-auto min-h-0 text-xs font-extrabold tracking-wider shadow-sm flex-shrink-0"
                  >
                    START REMOTE SCAN
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Topics I Discuss Section */}
        <section id="topics" className="py-20 bg-[#faf7f2] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                SKINCARE SCIENCE
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-4">
                Topics I Frequently Discuss & Advise On
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Click any floating skincare bubble below to read my clinical recommendations and restore your skin's health.
              </p>
            </div>

            {/* Layout combining visual circle & advisor description card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Interactive visual topics bubbles */}
              <div className="lg:col-span-7 flex justify-center relative min-h-[380px] lg:min-h-[440px]">
                {/* Visual central hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-28 h-28 rounded-full border-4 border-white bg-gradient-to-tr from-[#d47a3b] to-[#0b6b78] shadow-xl flex flex-col items-center justify-center text-white">
                  <Sparkles className="w-8 h-8 animate-pulse text-white" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest mt-1 text-white">{businessName}</span>
                </div>
                
                {/* Decorative background dashed rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-dashed border-slate-300 rounded-full animate-spin-slow pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-dashed border-[#d47a3b]/15 rounded-full pointer-events-none"></div>

                {/* Floating Bubbles positioned mathematically on desktop, or simple interactive flex grid on mobile */}
                {/* Mobile view layout: Flex container */}
                <div className="flex flex-wrap gap-2.5 justify-center max-w-md lg:hidden relative z-20">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${
                        activeTopicId === topic.id
                          ? 'bg-[#d47a3b] border-[#d47a3b] text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>

                {/* Desktop View Layout: Absolute positioning around the center */}
                <div className="hidden lg:block absolute inset-0">
                  {/* Topic 1 (12 o'clock) */}
                  <button
                    onClick={() => setActiveTopicId('barrier')}
                    className={`absolute top-2 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-xs font-bold border shadow-sm bubble-item z-20 ${
                      activeTopicId === 'barrier' ? 'bg-[#d47a3b] border-[#d47a3b] text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    🛡️ Skin Barrier
                  </button>

                  {/* Topic 2 (2 o'clock) */}
                  <button
                    onClick={() => setActiveTopicId('sun')}
                    className={`absolute top-16 right-8 px-5 py-3 rounded-full text-xs font-bold border shadow-sm bubble-item z-20 ${
                      activeTopicId === 'sun' ? 'bg-[#d47a3b] border-[#d47a3b] text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    ☀️ Sun Protection
                  </button>

                  {/* Topic 3 (4 o'clock) */}
                  <button
                    onClick={() => setActiveTopicId('aging')}
                    className={`absolute bottom-24 right-4 px-5 py-3 rounded-full text-xs font-bold border shadow-sm bubble-item z-20 ${
                      activeTopicId === 'aging' ? 'bg-[#d47a3b] border-[#d47a3b] text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    🧬 Skin Aging
                  </button>

                  {/* Topic 4 (5 o'clock) */}
                  <button
                    onClick={() => setActiveTopicId('acne')}
                    className={`absolute bottom-4 left-2/3 -translate-x-1/2 px-5 py-3 rounded-full text-xs font-bold border shadow-sm bubble-item z-20 ${
                      activeTopicId === 'acne' ? 'bg-[#d47a3b] border-[#d47a3b] text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    🦠 Acne Control
                  </button>

                  {/* Topic 5 (7 o'clock) */}
                  <button
                    onClick={() => setActiveTopicId('hormones')}
                    className={`absolute bottom-4 left-1/3 -translate-x-1/2 px-5 py-3 rounded-full text-xs font-bold border shadow-sm bubble-item z-20 ${
                      activeTopicId === 'hormones' ? 'bg-[#d47a3b] border-[#d47a3b] text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    🩸 Hormonal Shifts
                  </button>

                  {/* Topic 6 (8 o'clock) */}
                  <button
                    onClick={() => setActiveTopicId('hydration')}
                    className={`absolute bottom-24 left-4 px-5 py-3 rounded-full text-xs font-bold border shadow-sm bubble-item z-20 ${
                      activeTopicId === 'hydration' ? 'bg-[#d47a3b] border-[#d47a3b] text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    💧 Hydration Science
                  </button>

                  {/* Topic 7 (10 o'clock) */}
                  <button
                    onClick={() => setActiveTopicId('scars')}
                    className={`absolute top-16 left-8 px-5 py-3 rounded-full text-xs font-bold border shadow-sm bubble-item z-20 ${
                      activeTopicId === 'scars' ? 'bg-[#d47a3b] border-[#d47a3b] text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    🩹 Scar Management
                  </button>

                  {/* Topic 8 (Center Top Right) */}
                  <button
                    onClick={() => setActiveTopicId('lifestyle')}
                    className={`absolute top-1/3 right-1/4 translate-x-8 px-4 py-2.5 rounded-full text-xs font-bold border shadow-sm bubble-item z-20 ${
                      activeTopicId === 'lifestyle' ? 'bg-[#d47a3b] border-[#d47a3b] text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    🥗 Lifestyle & Diet
                  </button>
                </div>
              </div>

              {/* Right Column: Skincare advisor tip description */}
              <div className="lg:col-span-5 text-left">
                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm relative overflow-hidden">
                  {/* Small decorative glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#d47a3b]/5 rounded-bl-full pointer-events-none"></div>
                  
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Interactive Advisor</span>
                  <h3 className="font-heading font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#d47a3b]" /> {activeTopic.label} Recommendations
                  </h3>
                  
                  <div className="border-l-4 border-[#d47a3b] pl-4 py-1 my-6 bg-[#faf7f2] pr-4 rounded-r-xl">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                      "{activeTopic.text}"
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Each skincare topic requires custom assessments based on individual genetic factors and environments. Use our clinical search tools or consult in-person.
                  </p>

                  <button 
                    onClick={() => { setBookingSuccess(false); setBookingForm(prev => ({ ...prev, notes: `Consultation regarding: ${activeTopic.label}` })); setBookingModalOpen(true); }}
                    className="btn bg-[#0b6b78] hover:bg-[#084f59] border-none text-white rounded-xl px-5 py-3 h-auto min-h-0 text-xs font-bold tracking-wider"
                  >
                    DISCUSS IN CONSULTATION &rarr;
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                WORKFLOW TIMELINE
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900">
                How Does It Work?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-slate-100 pointer-events-none z-0"></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#faf7f2] border-2 border-[#d47a3b] flex items-center justify-center text-slate-800 mb-5 shadow-sm">
                  <Camera className="w-6 h-6 text-[#d47a3b]" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-slate-900 mb-2">1. Identify Concern</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Identify your specific skin concern using our interactive concern finder or submit diagnostic photos online.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#faf7f2] border-2 border-[#0b6b78] flex items-center justify-center text-slate-800 mb-5 shadow-sm">
                  <Calendar className="w-6 h-6 text-[#0b6b78]" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-slate-900 mb-2">2. Schedule Appointment</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Book a quick clinical chamber session or coordinate a customized virtual treatment consultation.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#faf7f2] border-2 border-[#d47a3b] flex items-center justify-center text-slate-800 mb-5 shadow-sm">
                  <Stethoscope className="w-6 h-6 text-[#d47a3b]" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-slate-900 mb-2">3. Get Treatment</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Receive professional clinical treatment and a customized pharmaceutical-grade daily skincare plan.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Services & Treatment Options */}
        <section id="services" className="py-20 bg-[#faf7f2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                SERVICES PORTFOLIO
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-4">
                Clinical Services & Laser Resurfacing
              </h2>
              <p className="text-slate-600 text-sm">
                Advanced diagnostic, clinical, and aesthetic treatments conducted in fully sterile chamber settings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {DERMATOLOGY_SERVICES.map((service) => (
                <div key={service.id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-md transition-all flex flex-col justify-between text-left relative group">
                  {service.popular && (
                    <span className="absolute top-4 right-4 bg-[#0b6b78]/10 text-[#0b6b78] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      Popular Choice
                    </span>
                  )}
                  
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">{service.category}</span>
                    <h4 className="font-heading font-black text-lg text-slate-900 leading-snug mb-3 group-hover:text-[#d47a3b] transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mb-4">
                      <span className="text-lg font-black text-[#d47a3b]">{service.price}</span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {service.duration}
                      </span>
                    </div>

                    <button 
                      onClick={() => openBookingForService(service.id)}
                      className="btn btn-outline border-slate-200 text-slate-700 hover:bg-[#d47a3b] hover:border-[#d47a3b] w-full rounded-xl py-2.5 h-auto min-h-0 text-xs font-bold tracking-wider"
                    >
                      Book Chamber Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Clinical Skincare Shop */}
        <section id="shop" className="py-20 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                DOCTOR RECOMMENDED PRODUCTS
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-4">
                Clinical Skincare Essentials
              </h2>
              <p className="text-slate-600 text-sm">
                Specially formulated products with clean actives to soothe skin barrier and control redness.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SKINCARE_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-[#faf7f2] border border-[#f2ece4] rounded-3xl p-5 hover:shadow-sm transition-all flex flex-col justify-between text-left group">
                  <div>
                    {/* Image */}
                    <div className="aspect-square rounded-2xl overflow-hidden mb-5 border border-[#f2ece4] bg-white relative">
                      <img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-bold px-2 py-0.5 rounded-full text-slate-600 border border-slate-100">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-2 font-bold">
                      <div className="flex gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      </div>
                      <span className="text-slate-500 font-medium">({product.reviewsCount} reviews)</span>
                    </div>

                    <h4 className="font-heading font-extrabold text-base text-slate-900 leading-snug mb-3">
                      {product.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#f2ece4] pt-4 mt-3">
                    <span className="text-lg font-black text-[#d47a3b]">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="btn bg-[#0b6b78] hover:bg-[#084f59] border-none text-white rounded-xl px-4 py-2.5 h-auto min-h-0 text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Chambers & Locations Section */}
        <section id="chambers" className="py-20 bg-[#faf7f2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                CHAMBERS & SCHEDULING
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-4">
                Three Convenient Clinic Locations
              </h2>
              <p className="text-slate-600 text-sm">
                Our specialists conduct in-person consultations across multiple centers. Verify hours and book slots.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {CHAMBERS.map((chamber) => (
                <div key={chamber.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between text-left group">
                  <div>
                    {/* Chamber Image */}
                    <div className="aspect-[16/9] overflow-hidden border-b border-slate-50 relative">
                      <img 
                        src={chamber.image} 
                        alt={chamber.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute bottom-3 left-3 bg-[#0b6b78] text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full">
                        Active Chamber
                      </span>
                    </div>

                    <div className="p-6">
                      <h4 className="font-heading font-black text-lg text-slate-900 leading-snug mb-3 group-hover:text-[#d47a3b] transition-colors">
                        {chamber.name}
                      </h4>
                      
                      <div className="space-y-3.5 mt-5">
                        <div className="flex gap-2.5 items-start text-xs text-slate-600">
                          <MapPin className="w-4.5 h-4.5 text-[#d47a3b] flex-shrink-0 mt-0.5" />
                          <span>{chamber.address}</span>
                        </div>
                        <div className="flex gap-2.5 items-start text-xs text-slate-600">
                          <Clock className="w-4.5 h-4.5 text-[#d47a3b] flex-shrink-0 mt-0.5" />
                          <span>{chamber.hours}</span>
                        </div>
                        <div className="flex gap-2.5 items-start text-xs text-slate-600">
                          <Phone className="w-4.5 h-4.5 text-[#d47a3b] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="block">{chamber.phone1}</span>
                            <span className="block">{chamber.phone2}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button 
                      onClick={() => {
                        setBookingForm(prev => ({ ...prev, chamberId: chamber.id }));
                        setBookingSuccess(false);
                        setBookingModalOpen(true);
                      }}
                      className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white w-full rounded-xl py-3 h-auto min-h-0 text-xs font-bold tracking-wider"
                    >
                      Book Chamber Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Testimonials Slider */}
        <section className="py-20 bg-white border-y border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block px-3 py-1 bg-[#d47a3b]/5 border border-[#d47a3b]/10 text-[#d47a3b] text-xs font-bold uppercase tracking-wider rounded-full mb-8">
              PATIENT REVIEWS
            </span>
            
            {/* The active testimonial */}
            <div className="relative min-h-[220px] flex flex-col items-center justify-center">
              <div className="flex justify-center text-amber-500 mb-6">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>

              <p className="font-heading text-lg sm:text-xl font-bold text-slate-800 italic leading-relaxed max-w-2xl mb-8">
                "{TESTIMONIALS[testimonialIndex].text}"
              </p>

              <div className="flex items-center justify-center gap-3">
                <img 
                  src={TESTIMONIALS[testimonialIndex].avatarUrl} 
                  alt={TESTIMONIALS[testimonialIndex].name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                />
                <div className="text-left leading-tight">
                  <span className="block font-bold text-xs text-slate-900">{TESTIMONIALS[testimonialIndex].name}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{TESTIMONIALS[testimonialIndex].category}</span>
                </div>
              </div>
            </div>

            {/* Slider Navigation controls */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button 
                onClick={() => setTestimonialIndex(prev => Math.max(0, prev - 1))}
                disabled={testimonialIndex === 0}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 disabled:opacity-40 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <span className="text-xs text-slate-400 font-bold">
                {testimonialIndex + 1} / {TESTIMONIALS.length}
              </span>
              <button 
                onClick={() => setTestimonialIndex(prev => Math.min(TESTIMONIALS.length - 1, prev + 1))}
                disabled={testimonialIndex === TESTIMONIALS.length - 1}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 disabled:opacity-40 transition-opacity"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#121418] text-white py-16 text-left border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Column 1: Info and Brand */}
            <div className="md:col-span-4 text-left">
              <span className="font-heading text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-5">
                <span className="w-7 h-7 rounded-full bg-[#d47a3b] text-white flex items-center justify-center font-black text-sm">D</span>
                <span>Derm<span className="text-[#d47a3b]">Aura</span> <span className="font-light text-slate-400">Clinic</span></span>
              </span>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
                Advancing skin health through clinical excellence, research innovation, and sterile aesthetic procedures. Get glowing skin you deserve.
              </p>
              <div className="flex gap-4 text-slate-400 text-xs">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>&bull;</span>
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-3 text-left">
              <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300 mb-5">Services</h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => scrollToSection('concerns')} className="hover:text-white">Acne Extractions</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white">Nd:YAG Scar Lasers</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white">Clinical Chemical Peels</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white">Botox Injectables</button></li>
              </ul>
            </div>

            {/* Column 3: Contact details */}
            <div className="md:col-span-3 text-left">
              <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300 mb-5">Primary Contact</h5>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex gap-2 items-start">
                  <MapPin className="w-4 h-4 text-[#d47a3b] flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Phone className="w-4 h-4 text-[#d47a3b] flex-shrink-0" />
                  <span>{phone}</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Mail className="w-4 h-4 text-[#d47a3b] flex-shrink-0" />
                  <span>{email}</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="md:col-span-2 text-left">
              <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300 mb-5">Newsletter</h5>
              <p className="text-[11px] text-slate-400 leading-normal mb-4">
                Subscribe to get daily skincare tips.
              </p>
              {newsletterSuccess ? (
                <div className="bg-[#0b6b78]/25 border border-[#0b6b78]/40 text-[#0b6b78] p-2.5 rounded-lg text-center text-xs font-bold">
                  Subscribed!
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setNewsletterSuccess(true); }}
                  className="flex flex-col gap-2"
                >
                  <input 
                    type="email" 
                    placeholder="email address" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="bg-[#1e222b] border border-slate-700 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d47a3b] w-full"
                  />
                  <button className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white text-[11px] font-bold tracking-wider rounded-xl w-full h-auto min-h-0 py-2.5">
                    SUBSCRIBE
                  </button>
                </form>
              )}
            </div>

          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {businessName}. All Rights Reserved. Clinical skin treatments and aesthetic surgery.
          </div>
        </div>
      </footer>

      {/* Appointment Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-extrabold text-slate-900 mb-2">Chamber Booking Confirmed!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mb-6">
                  Thank you, <strong>{bookingForm.name}</strong>. Your session reservation request has been processed. A clinic representative will text confirmation to <strong>{bookingForm.phone}</strong> shortly.
                </p>
                <button 
                  onClick={() => setBookingModalOpen(false)}
                  className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white rounded-xl px-6 py-2.5 h-auto min-h-0 text-xs font-bold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <h3 className="font-heading text-xl font-extrabold text-slate-900 mb-2">Schedule Chamber Consultation</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Select your preferred clinic location, treatment, and pick your available calendar date slot.
                </p>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Patient Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Somalya Sen" 
                      value={bookingForm.name} 
                      onChange={e => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none focus:border-[#d47a3b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contact Phone</label>
                      <input 
                        type="tel" 
                        placeholder={phone} 
                        value={bookingForm.phone} 
                        onChange={e => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none focus:border-[#d47a3b]"
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="patient@domain.com" 
                        value={bookingForm.email} 
                        onChange={e => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none focus:border-[#d47a3b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Chamber Selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Clinic Chamber</label>
                      <select 
                        value={bookingForm.chamberId}
                        onChange={e => setBookingForm(prev => ({ ...prev, chamberId: e.target.value }))}
                        className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none focus:border-[#d47a3b]"
                      >
                        {CHAMBERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    {/* Service Selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Skincare Service</label>
                      <select 
                        value={bookingForm.serviceId}
                        onChange={e => setBookingForm(prev => ({ ...prev, serviceId: e.target.value }))}
                        className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none focus:border-[#d47a3b]"
                      >
                        {DERMATOLOGY_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} ({s.price})</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Appointment Date</label>
                      <input 
                        type="date" 
                        value={bookingForm.date} 
                        onChange={e => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                        className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-[#1a1721] focus:outline-none focus:border-[#d47a3b]"
                      />
                    </div>
                    {/* Time Slot */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preferred Time Slot</label>
                      <select 
                        value={bookingForm.timeSlot}
                        onChange={e => setBookingForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                        className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none focus:border-[#d47a3b]"
                      >
                        {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Describe symptoms (Optional)</label>
                    <textarea 
                      placeholder="e.g. Hormonal cysts on jawline for past 3 months..." 
                      rows={2}
                      value={bookingForm.notes} 
                      onChange={e => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none focus:border-[#d47a3b] resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setBookingModalOpen(false)}
                    className="btn btn-ghost text-slate-500 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white rounded-xl px-6 py-2.5 h-auto min-h-0 text-xs font-bold"
                  >
                    Submit Booking Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Remote Skin Analysis Modal (CosmetIQ style) */}
      {remoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setRemoteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {uploadStep === 'upload' && (
              <div>
                <h3 className="font-heading text-xl font-extrabold text-slate-900 mb-2">Remote Dermal Skin Analysis</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Provide details and simulate a scan of your skin condition for customized dermatologist advice.
                </p>

                <div className="space-y-4">
                  {/* Photo selector placeholder */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Simulate Skin Texture Photo Upload</label>
                    <div 
                      onClick={triggerRemoteAnalysis}
                      className="border-2 border-dashed border-slate-300 hover:border-[#d47a3b] rounded-2xl p-8 text-center cursor-pointer bg-[#faf7f2] transition-colors group"
                    >
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#d47a3b] mx-auto mb-3" />
                      <span className="block text-xs font-bold text-slate-700">Click to upload mock facial close-up</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Supports JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>

                  {/* Primary Skin Concern */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Primary Skin Concern</label>
                    <select
                      value={remoteConcern}
                      onChange={(e) => setRemoteConcern(e.target.value)}
                      className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none"
                    >
                      <option value="acne">Active Hormonal Acne & Outbreaks</option>
                      <option value="pigmentation">Sunspots, Melasma, or Dark Patches</option>
                      <option value="aging">Expression Lines & Loss of Elasticity</option>
                      <option value="tags">Raised Skin Moles or Warts</option>
                      <option value="hairloss">Scalp Thinning & Hair Shedding</option>
                    </select>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Describe symptoms (sebum level, dryness, redness)</label>
                    <textarea 
                      placeholder="e.g. My cheeks feel very oily by midday but dry and flaky around the mouth..."
                      rows={3}
                      value={remoteDetails}
                      onChange={e => setRemoteDetails(e.target.value)}
                      className="bg-[#faf7f2] border border-slate-200 rounded-xl p-3 text-xs w-full text-slate-900 focus:outline-none focus:border-[#d47a3b] resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setRemoteModalOpen(false)}
                    className="btn btn-ghost text-slate-500 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={triggerRemoteAnalysis}
                    className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white rounded-xl px-6 py-2.5 h-auto min-h-0 text-xs font-bold"
                  >
                    Simulate Analysis Scan
                  </button>
                </div>
              </div>
            )}

            {uploadStep === 'analyzing' && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 border-4 border-[#d47a3b]/20 border-t-[#d47a3b] rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">Analyzing Skin Profile...</h3>
                <p className="text-xs text-slate-400 mb-6 font-medium animate-pulse">{analysisText}</p>
                
                {/* Progress bar */}
                <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full mx-auto overflow-hidden">
                  <div 
                    className="bg-[#d47a3b] h-full transition-all duration-150" 
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <span className="block text-xs font-bold text-[#d47a3b] mt-2">{analysisProgress}%</span>
              </div>
            )}

            {uploadStep === 'report' && (
              <div className="max-h-[500px] overflow-y-auto pr-1">
                <div className="bg-[#0b6b78]/10 text-[#0b6b78] p-4 rounded-2xl flex items-center gap-3 mb-6">
                  {uploadedPhoto && (
                    <img 
                      src={uploadedPhoto} 
                      alt="Uploaded skin closeup" 
                      className="w-12 h-12 rounded-xl object-cover border border-[#0b6b78]/25"
                    />
                  )}
                  <div className="text-left">
                    <span className="block text-xs font-bold uppercase">AI Dermoscopic Analysis Complete</span>
                    <span className="text-[10px] text-slate-600">Preliminary recommendations compiled successfully</span>
                  </div>
                </div>

                <h3 className="font-heading text-lg font-extrabold text-slate-900 mb-1">Dermal Assessment Report</h3>
                <span className="text-[10px] text-slate-400 font-bold block mb-4">Patient Profile ID: #DPR-2026</span>

                <div className="space-y-5">
                  {/* Stats diagnosis */}
                  <div className="grid grid-cols-3 gap-3 bg-[#faf7f2] p-4 rounded-xl text-center">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Redness Scale</span>
                      <span className="text-xs font-extrabold text-amber-600 block mt-0.5">Moderate (Level 3)</span>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Sebum Level</span>
                      <span className="text-xs font-extrabold text-red-600 block mt-0.5">High (Level 4)</span>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Hydration index</span>
                      <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">Adequate (64%)</span>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="text-left">
                    <h5 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2">Preliminary Assessment</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Based on the skin analysis scan, the patient exhibits localized hyper-sebum clogging in the T-zone alongside moderate micro-inflammatory redness (erythema). The skin barrier functions are currently stable but prone to stress from excess oil.
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="text-left border-t border-slate-100 pt-4">
                    <h5 className="font-heading font-extrabold text-xs text-[#0b6b78] uppercase tracking-wider mb-2">Clinical Care Steps</h5>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                      <li>Use a mild water-based foam cleanser containing salicylic acid (0.5-2%) daily.</li>
                      <li>Incorporate lightweight hyaluronic acid serums to maintain cell hydration.</li>
                      <li>Avoid physical facial scrubs, which aggravate inflammatory outbreaks.</li>
                    </ul>
                  </div>

                  {/* Bundle Suggestion */}
                  <div className="bg-[#faf7f2] border border-[#f2ece4] p-5 rounded-2xl text-left flex items-center justify-between gap-4">
                    <div className="max-w-[240px]">
                      <h6 className="font-heading font-extrabold text-xs text-slate-900">Recommended Skincare Bundle</h6>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        Clean Cleanser + Intensive Moisturizer to hydrate and repair barrier.
                      </p>
                    </div>
                    <button 
                      onClick={addAnalysisBundle}
                      className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white rounded-xl px-4 py-2.5 h-auto min-h-0 text-[10px] font-bold tracking-wider"
                    >
                      ADD BUNDLE ($20.00)
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button 
                    onClick={() => setRemoteModalOpen(false)}
                    className="btn btn-ghost text-slate-500 text-xs font-bold"
                  >
                    Close Report
                  </button>
                  <button 
                    onClick={() => { setRemoteModalOpen(false); setBookingSuccess(false); setBookingForm(prev => ({ ...prev, notes: 'Follow-up appointment for remote dermal AI analysis.' })); setBookingModalOpen(true); }}
                    className="btn bg-[#0b6b78] hover:bg-[#084f59] border-none text-white rounded-xl px-5 py-2.5 h-auto min-h-0 text-xs font-bold"
                  >
                    Book Clinical Consultation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end" onClick={() => setCartOpen(false)}>
          <div className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between text-left" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <span className="font-heading text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#d47a3b]" /> Skincare Cart ({cartItemCount})
                </span>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center">
                  <ShoppingBag className="w-12 h-12 mb-3 stroke-1" />
                  <span className="text-xs font-bold">Your cart is currently empty.</span>
                  <button onClick={() => { setCartOpen(false); scrollToSection('shop'); }} className="text-xs text-[#d47a3b] font-bold mt-2 hover:underline">
                    Browse clinical products &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border border-slate-100 rounded-2xl items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100" 
                        />
                        <div className="text-left">
                          <span className="block font-bold text-xs text-slate-900 leading-tight line-clamp-1">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{item.category}</span>
                          <span className="text-xs font-black text-[#d47a3b] block mt-1">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border border-slate-100 rounded-lg p-1 bg-slate-50">
                        <button 
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subtotal & Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-500 font-bold">Subtotal:</span>
                  <span className="text-xl font-black text-[#d47a3b]">${cartSubtotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => {
                    alert(`🛒 Order Submitted: Simulated purchase of $${cartSubtotal.toFixed(2)} in clinical items complete.`);
                    setCart([]);
                    setCartOpen(false);
                  }}
                  className="btn bg-[#d47a3b] hover:bg-[#b05d25] border-none text-white w-full rounded-xl py-3.5 h-auto min-h-0 text-xs font-bold tracking-wider"
                >
                  SIMULATE SECURE CHECKOUT
                </button>
                <span className="block text-center text-[10px] text-slate-400 mt-2 font-medium">
                  Free pickup at any active clinic chamber location.
                </span>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
