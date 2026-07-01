export interface DermatologyService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  iconName: string; // FontAwesome icon class name
  popular?: boolean;
}

export const DERMATOLOGY_SERVICES: DermatologyService[] = [
  {
    id: "laser",
    name: "Laser Scar & Pigment Therapy",
    category: "Laser Treatments",
    description: "Advanced Q-Switched Nd:YAG and fractional CO2 lasers for skin resurfacing, scar fading, and tattoo removal.",
    price: "$150",
    duration: "45 mins",
    iconName: "fa-solid fa-laptop-medical",
    popular: true
  },
  {
    id: "peels",
    name: "Clinical Chemical Peel",
    category: "Peel Treatments",
    description: "Salicylic, Glycolic, or TCA chemical peels custom formulated to deep exfoliate, control active acne, and brighten skin tones.",
    price: "$95",
    duration: "30 mins",
    iconName: "fa-solid fa-face-flushed",
    popular: false
  },
  {
    id: "acne",
    name: "Acne Extraction & Control",
    category: "Acne solutions",
    description: "Medical-grade extraction, comedone therapy, and customized prescriptions targeting severe and cystic acne.",
    price: "$80",
    duration: "45 mins",
    iconName: "fa-solid fa-droplet",
    popular: true
  },
  {
    id: "botox",
    name: "Botox Injectables",
    category: "Injectables",
    description: "Precise wrinkle-relaxing injections of botulinum toxin to soften fine lines on forehead, crow's feet, and frown lines.",
    price: "$250",
    duration: "30 mins",
    iconName: "fa-solid fa-syringe",
    popular: false
  },
  {
    id: "prp",
    name: "PRP Hair & Face Rejuvenation",
    category: "Injectables",
    description: "Platelet-rich plasma therapy utilizing your body's natural growth factors to restore hair growth and boost facial collagen.",
    price: "$300",
    duration: "1 hour",
    iconName: "fa-solid fa-droplet",
    popular: false
  },
  {
    id: "microneedle",
    name: "Dermapen Microneedling",
    category: "Skin Rejuvenation",
    description: "Collagen induction therapy using an automated Dermapen to diminish large pores, stretch marks, and acne scarring.",
    price: "$180",
    duration: "1 hour",
    iconName: "fa-solid fa-wand-sparkles",
    popular: false
  },
  {
    id: "cancer",
    name: "Skin Cancer Screening & Biopsy",
    category: "Clinical",
    description: "Comprehensive dermoscopic mole check, mapping, and clinical punch biopsy of suspicious skin lesions.",
    price: "$120",
    duration: "30 mins",
    iconName: "fa-solid fa-microscope",
    popular: false
  },
  {
    id: "mole",
    name: "Mole & Skin Tag Removal",
    category: "Clinical",
    description: "Safe, scarless radiofrequency ablation or cryotherapy of aesthetic warts, moles, and skin tags.",
    price: "$90",
    duration: "20 mins",
    iconName: "fa-solid fa-tag",
    popular: false
  }
];

export interface Testimonial {
  id: string;
  name: string;
  category: string;
  rating: number;
  text: string;
  avatarUrl: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Somalya Sen",
    category: "Happy Client",
    rating: 5,
    text: "I have been struggling with severe hormonal acne for five years and had tried everything. Dr. Rohan was so understanding. He explained the root cause, put me on a clean medical regimen, and 3 months later my skin has never looked cleaner. I'm so grateful for his expertise!",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "t2",
    name: "Ruhel Chowdhury",
    category: "Happy Client",
    rating: 5,
    text: "Dr. Rohan Sharma is a savior for my skin. I went to him for severe laser melasma correction. He took the time to answer all my questions, performed the Nd:YAG procedure with extreme care, and provided a comprehensive recovery routine. My spots are gone and my confidence is back!",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "t3",
    name: "Nisha Malhotra",
    category: "Regular Patient",
    rating: 5,
    text: "The clinic environment is top notch and the consultation was very professional. Dr. Rohan didn't push expensive, unnecessary cosmetics but gave me a basic, highly scientific routine. My skin barrier feels restored and hydrated. Will definitely keep consulting!",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
  }
];

export interface SkincareProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviewsCount: number;
  img: string;
}

export const SKINCARE_PRODUCTS: SkincareProduct[] = [
  {
    id: "aqua-cream",
    name: "Aqua Cream Intensive Moisturizer",
    price: 12.00,
    category: "Dry Skin / Sensitive",
    rating: 5.0,
    reviewsCount: 48,
    img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "water-cleanser",
    name: "Water Based Gentle Foam Cleanser",
    price: 8.00,
    category: "Oily / Combination",
    rating: 4.5,
    reviewsCount: 36,
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "physical-sunscreen",
    name: "Physical Sunscreen SPF 50 PA+++",
    price: 9.00,
    category: "All Skin Types",
    rating: 5.0,
    reviewsCount: 52,
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80"
  }
];

export const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM"
];

export interface Chamber {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone1: string;
  phone2: string;
  image: string;
}

export const CHAMBERS: Chamber[] = [
  {
    id: 'shah-skin',
    name: 'Shah Skin & Laser Center',
    address: 'Medical College Rd, Gazipur, Dhaka - 1711',
    hours: 'Thursday - Friday | 5:00 PM - 8:00 PM',
    phone1: '001 2345 6789',
    phone2: '012 3456 7890',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'city-cosmetic',
    name: 'City Skin & Cosmetic Clinic',
    address: 'Rafi Ahmed Kidwai Road, Park Street area, Kolkata - 700016',
    hours: 'Monday - Wednesday | 4:00 PM - 7:00 PM',
    phone1: '+91 33 2456 7890',
    phone2: '+91 98300 12345',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'apex-aesthetic',
    name: 'Apex Aesthetic Chamber',
    address: 'Linking Road, Santa Cruz West, Mumbai - 400054',
    hours: 'Saturday - Sunday | 11:00 AM - 3:00 PM',
    phone1: '+91 22 6543 2100',
    phone2: '+91 98200 54321',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
  }
];

export interface SkinConcern {
  id: string;
  name: string;
  shortDesc: string;
  doctorTip: string;
  recommendedServiceId: string;
  discountPrice: string;
  originalPrice: string;
  discountTag: string;
  beforeImg: string;
  afterImg: string;
  caseStudy: {
    challenge: string;
    approach: string;
    outcome: string;
    outcomeStat: string;
  };
}

export const SKIN_CONCERNS: SkinConcern[] = [
  {
    id: "acne",
    name: "Acne & Scar Recovery",
    shortDesc: "Target active outbreaks, clinical redness, and deep acne scarring.",
    doctorTip: "Hormonal acne requires clinical care. Avoid squeezing or popping blemishes, which causes permanent scarring. Instead, focus on salicylic extraction and Nd:YAG laser rejuvenation to rebuild deep collagen.",
    recommendedServiceId: "acne",
    discountPrice: "$64",
    originalPrice: "$80",
    discountTag: "20% Off Clinical Trial",
    beforeImg: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    caseStudy: {
      challenge: "Persistent severe hormonal acne and micro-inflammation across the cheeks.",
      approach: "Combined medical-grade extraction with a customized 3-session chemical peel.",
      outcome: "Completely cleared active cysts and minimized micro-redness.",
      outcomeStat: "92% Reduction in Outbreaks"
    }
  },
  {
    id: "pigmentation",
    name: "Melasma & Dark Spots",
    shortDesc: "Fade stubborn sun damage, dark spots, and hormonal melasma patches.",
    doctorTip: "Melasma is highly sensitive to heat and UV. The secret is combining strict physical SPF 50 sunscreen with gentle clinical Q-Switched fractional laser therapy to break down pigment without irritation.",
    recommendedServiceId: "laser",
    discountPrice: "$120",
    originalPrice: "$150",
    discountTag: "Special First Session Offer",
    beforeImg: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80",
    caseStudy: {
      challenge: "Deep epidermal melasma across the cheekbones caused by UV exposure.",
      approach: "2 sessions of Q-switched Nd:YAG laser combined with a daily clinical tyrosinase inhibitor.",
      outcome: "Evened out skin tone, removing localized pigment clusters completely.",
      outcomeStat: "85% Pigment Clearance"
    }
  },
  {
    id: "aging",
    name: "Wrinkles & Skin Laxity",
    shortDesc: "Soften fine lines, restore hollow contours, and lift saggy skin.",
    doctorTip: "True rejuvenation happens below the surface. We use precise micro-doses of Botox to relax expression lines, alongside Microneedling to stimulate your skin's natural collagen factory.",
    recommendedServiceId: "botox",
    discountPrice: "$200",
    originalPrice: "$250",
    discountTag: "New Patient Special",
    beforeImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
    caseStudy: {
      challenge: "Fine lines around the eyes and volume loss around the nasolabial folds.",
      approach: "Targeted botulinum injections combined with dynamic platelet-rich plasma (PRP) therapy.",
      outcome: "Restored volume, smoothed expression wrinkles, and brightened texture.",
      outcomeStat: "94% Patient Satisfaction"
    }
  },
  {
    id: "tags",
    name: "Moles & Warts Removal",
    shortDesc: "Safe, clean, and scarless removal of aesthetic moles and skin tags.",
    doctorTip: "Never attempt DIY mole removal. Clinical radiofrequency ablation is quick, virtually painless, and leaves minimal to no scarring when performed under sterile conditions.",
    recommendedServiceId: "mole",
    discountPrice: "$75",
    originalPrice: "$90",
    discountTag: "Safe & Quick Clinic Visit",
    beforeImg: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    caseStudy: {
      challenge: "Three raised aesthetic skin tags on the neck area prone to friction.",
      approach: "Radiofrequency electro-cauterization under localized topical anesthesia.",
      outcome: "Clean removal with complete healing and zero scar residue after 7 days.",
      outcomeStat: "100% Safe Scarless Removal"
    }
  },
  {
    id: "hairloss",
    name: "Hair Thinning & Loss",
    shortDesc: "Revitalize dormant follicles and boost scalp hair thickness.",
    doctorTip: "Early intervention is crucial for hair loss. Platelet-Rich Plasma (PRP) treatments harness growth factors from your own blood to stimulate inactive follicles and extend the hair growth phase.",
    recommendedServiceId: "prp",
    discountPrice: "$240",
    originalPrice: "$300",
    discountTag: "Package discount available",
    beforeImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    caseStudy: {
      challenge: "Androgenetic hair thinning around the crown and temples in an early stage.",
      approach: "4 sessions of autologous Platelet-Rich Plasma (PRP) scalp micro-injections.",
      outcome: "Noticeable increase in hair density and thickness around the crown.",
      outcomeStat: "40% Increase in Hair Density"
    }
  }
];

