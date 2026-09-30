// ============================================================================
// src/data/projects.js
// Saare Live Demo links aur Project details yahan store hain.
// Aap website ke "+ Add / Manage Website" button se bhi naya link add kar sakte hain.
// ============================================================================

import restaurantImg from '../assets/images/demo_restaurant_site_1790578659417.jpg';
import clinicImg from '../assets/images/demo_dental_clinic_1790578673637.jpg';
import gymImg from '../assets/images/demo_fitness_gym_1790578686389.jpg';
import salonImg from '../assets/images/demo_luxury_salon_1790578696432.jpg';
import realEstateImg from '../assets/images/demo_real_estate_1790578708336.jpg';

export const CATEGORY_FALLBACK_IMAGES = {
  'Restaurant & Cafe': restaurantImg,
  'Clinic & Medical': clinicImg,
  'Gym & Fitness': gymImg,
  'Salon & Studio': salonImg,
  'Real Estate & Builders': realEstateImg,
  Other: restaurantImg
};

export const CARD_COLOR_THEMES = [
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    hiName: 'रॉयल ब्लू',
    primary: '#0F52AD',
    secondary: '#0B418C',
    accentDark: '#072B60',
    glowTop: '#2970D6',
    glowMid: '#1559B8',
    shadow: 'rgba(11, 65, 140, 0.58)'
  },
  {
    id: 'warm-gold',
    name: 'Warm Gold',
    hiName: 'वॉर्म गोल्ड',
    primary: '#B79B54',
    secondary: '#967B36',
    accentDark: '#5C4A1C',
    glowTop: '#D4B86A',
    glowMid: '#B79B54',
    shadow: 'rgba(150, 123, 54, 0.55)'
  },
  {
    id: 'charcoal-slate',
    name: 'Dark Charcoal',
    hiName: 'डार्क चारकोल',
    primary: '#3B3D42',
    secondary: '#232529',
    accentDark: '#141619',
    glowTop: '#646870',
    glowMid: '#484B52',
    shadow: 'rgba(35, 37, 41, 0.58)'
  },
  {
    id: 'deep-plum',
    name: 'Royal Plum',
    hiName: 'रॉयल प्लम',
    primary: '#7A2866',
    secondary: '#521844',
    accentDark: '#360E2C',
    glowTop: '#A3488C',
    glowMid: '#853070',
    shadow: 'rgba(82, 24, 68, 0.55)'
  },
  {
    id: 'emerald-teal',
    name: 'Emerald Teal',
    hiName: 'एमराल्ड ग्रीन',
    primary: '#0E7460',
    secondary: '#095243',
    accentDark: '#05362B',
    glowTop: '#269C85',
    glowMid: '#13826C',
    shadow: 'rgba(9, 82, 67, 0.55)'
  },
  {
    id: 'crimson-rose',
    name: 'Crimson Rose',
    hiName: 'क्रिमसन रेड',
    primary: '#B8254B',
    secondary: '#8A1735',
    accentDark: '#590D21',
    glowTop: '#D94C70',
    glowMid: '#C22F55',
    shadow: 'rgba(138, 23, 53, 0.55)'
  },
  {
    id: 'indigo-violet',
    name: 'Indigo Violet',
    hiName: 'इंडिगो वायलेट',
    primary: '#463ACB',
    secondary: '#312699',
    accentDark: '#1E1666',
    glowTop: '#6E62E5',
    glowMid: '#5246D4',
    shadow: 'rgba(49, 38, 153, 0.55)'
  }
];

function shadeHexColor(hex, percent) {
  const clean = (hex || '#0F52AD').replace('#', '');
  if (clean.length !== 6) return '#0B418C';
  const num = parseInt(clean, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgba(hex, alpha = 0.55) {
  const clean = (hex || '#0F52AD').replace('#', '');
  if (clean.length !== 6) return `rgba(11, 65, 140, ${alpha})`;
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const DEFAULT_PROJECT_COLOR_MAP = {
  'demo-restaurant': 'royal-blue',
  'demo-clinic': 'warm-gold',
  'demo-gym': 'charcoal-slate',
  'demo-salon': 'deep-plum',
  'demo-realestate': 'emerald-teal'
};

export function resolveCardTheme(project, fallbackIndex = 0) {
  const rawColor =
    project?.cardColor ||
    DEFAULT_PROJECT_COLOR_MAP[project?.id] ||
    CARD_COLOR_THEMES[fallbackIndex % CARD_COLOR_THEMES.length].id;

  const preset = CARD_COLOR_THEMES.find(
    (t) => t.id === rawColor || t.primary.toLowerCase() === String(rawColor).toLowerCase()
  );
  if (preset) return preset;

  if (typeof rawColor === 'string' && rawColor.startsWith('#')) {
    return {
      id: rawColor,
      name: 'Custom Color',
      hiName: 'कस्टम कलर',
      primary: rawColor,
      secondary: shadeHexColor(rawColor, -28),
      accentDark: shadeHexColor(rawColor, -58),
      glowTop: shadeHexColor(rawColor, 26),
      glowMid: shadeHexColor(rawColor, 10),
      shadow: hexToRgba(rawColor, 0.55)
    };
  }

  return CARD_COLOR_THEMES[fallbackIndex % CARD_COLOR_THEMES.length];
}

export const SITE_CONFIG = {
  developerName: 'Kishore Dewangan',
  aestheticLine: 'Engineering digital systems for local commerce.',
  badgeText: 'Available for Local Business Websites',
  hindiIntro: 'अपनी दुकान या बिज़नेस की कैटेगरी चुनें और लाइव वेबसाइट डेमो खोल कर देखें 👇',
  whatsappNumber: '919876543210',
  email: 'kishudewangan29@gmail.com',
  instagramUrl: 'https://instagram.com/',
  githubUrl: 'https://github.com/',
  defaultAdminPassword: '1234'
};

export const INITIAL_PROJECTS = [
  {
    id: 'demo-restaurant',
    title: 'Royal Spice Dining & Cloud Kitchen',
    category: 'Restaurant & Cafe',
    cardColor: 'royal-blue',
    hindiIdea: 'रेस्टोरेंट, कैफे और मिठाई दुकान के लिए QR डिजिटल मेनू और डायरेक्ट WhatsApp ऑर्डर वेबसाइट',
    liveUrl: 'https://themewagon.github.io/restoran/',
    adminUrl: 'https://themewagon.github.io/restoran/booking.html',
    deliveryDays: '5 Days',
    image: restaurantImg,
    highlights: ['QR Digital Menu', 'Direct WhatsApp Order', 'Table Booking']
  },
  {
    id: 'demo-clinic',
    title: 'CarePlus Dental & Multi-Specialty Clinic',
    category: 'Clinic & Medical',
    cardColor: 'warm-gold',
    hindiIdea: 'डॉक्टर क्लीनिक, डेंटल और पैथोलॉजी लैब के लिए ऑनलाइन अपॉइंटमेंट बुकिंग वेबसाइट',
    liveUrl: 'https://themewagon.github.io/klinik/',
    adminUrl: 'https://themewagon.github.io/klinik/appointment.html',
    deliveryDays: '4 Days',
    image: clinicImg,
    highlights: ['OPD Slot Booking', 'Doctor Profile & Fees', 'Google Maps Location']
  },
  {
    id: 'demo-gym',
    title: 'UrbanFit Strength & Fitness Club',
    category: 'Gym & Fitness',
    cardColor: 'charcoal-slate',
    hindiIdea: 'जिम, योगा स्टूडियो और फिटनेस क्लब के लिए फ्री ट्रायल पास और मेंबरशिप प्लान वेबसाइट',
    liveUrl: 'https://themewagon.github.io/gymlife/',
    adminUrl: 'https://themewagon.github.io/gymlife/bmi-calculator.html',
    deliveryDays: '5 Days',
    image: gymImg,
    highlights: ['Free Trial Pass Lead', 'Membership Plans', 'BMI & Trainer Guide']
  },
  {
    id: 'demo-salon',
    title: 'GlowAura Bridal Salon & Makeup Studio',
    category: 'Salon & Studio',
    cardColor: 'deep-plum',
    hindiIdea: 'ब्यूटी पार्लर, सैलून और ब्राइडल मेकअप आर्टिस्ट के लिए पोर्टफोलियो और बुकिंग वेबसाइट',
    liveUrl: 'https://themewagon.github.io/salone/',
    adminUrl: 'https://themewagon.github.io/salone/price.html',
    deliveryDays: '4 Days',
    image: salonImg,
    highlights: ['Bridal Lookbook Gallery', 'Rate Card & Combos', 'Instant Slot Booking']
  },
  {
    id: 'demo-realestate',
    title: 'PrimeNest Builders & Property Showcase',
    category: 'Real Estate & Builders',
    cardColor: 'emerald-teal',
    hindiIdea: 'प्रॉपर्टी डीलर, बिल्डर और कॉलोनाइज़र के लिए प्लॉट/फ्लैट शोकेस और साइट-विज़िट वेबसाइट',
    liveUrl: 'https://themewagon.github.io/makaan/',
    adminUrl: 'https://themewagon.github.io/makaan/property-list.html',
    deliveryDays: '6 Days',
    image: realEstateImg,
    highlights: ['Plot / Flat Filter', 'Brochure on WhatsApp', 'Site Visit Booking']
  }
];
