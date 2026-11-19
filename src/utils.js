// ============================================
// COGNIBOOKS - UTILITY FUNCTIONS LIBRARY
// ============================================
// Swiss Army knife of helper functions

// ============================================
// REGEX CONSTANTS (module-level to avoid esbuild regex parser issues)
// ============================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NON_DIGIT_REGEX = /\D/g;
const SLUGIFY_CLEAN_REGEX = /[^\w\s-]/g;
const SLUGIFY_SPACES_REGEX = /\s+/g;
const SLUGIFY_DASHES_REGEX = /-+/g;
const WORD_BOUNDARY_REGEX = /\b\w/g;
const MOBILE_UA_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const TABLET_UA_REGEX = /iPad|Android/i;
const HEX_COLOR_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

// ============================================
// EMAIL & VALIDATION
// ============================================
export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export const isValidCreditCard = (cardNumber) => {
  // Luhn algorithm
  const digits = cardNumber.replace(NON_DIGIT_REGEX, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateForm = (fields) => {
  const errors = {};
  
  Object.keys(fields).forEach(key => {
    const value = fields[key];
    
    if (!value || value.trim() === '') {
      errors[key] = `${key} is required`;
    }
    
    if (key === 'email' && !isValidEmail(value)) {
      errors[key] = 'Invalid email address';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// PRICE & CURRENCY FORMATTING
// ============================================
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

export const calculateDiscount = (original, discounted) => {
  if (original === 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

// ============================================
// DATE & TIME
// ============================================
export const formatDate = (date) => {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

export const formatRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(date);
};

export const getTimeRemaining = (endTime) => {
  const total = Date.parse(endTime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return { total, days, hours, minutes, seconds };
};

// ============================================
// STRING MANIPULATION
// ============================================
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(SLUGIFY_CLEAN_REGEX, '')
    .replace(SLUGIFY_SPACES_REGEX, '-')
    .replace(SLUGIFY_DASHES_REGEX, '-')
    .trim();
};

export const truncate = (text, maxLength, suffix = '...') => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const capitalizeWords = (text) => {
  return text.replace(WORD_BOUNDARY_REGEX, char => char.toUpperCase());
};

export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// ============================================
// ARRAY & OBJECT UTILITIES
// ============================================
export const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

export const unique = (array) => {
  return [...new Set(array)];
};

export const pluck = (array, key) => {
  return array.map(item => item[key]);
};

// ============================================
// RANDOM GENERATORS
// ============================================
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min, max, decimals = 2) => {
  return (Math.random() * (max - min) + min).toFixed(decimals);
};

export const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle',
  'Denver', 'Boston', 'Portland', 'Miami', 'Atlanta', 'Toronto', 'Vancouver'
];

export const generateRandomName = () => {
  const first = randomElement(firstNames);
  const last = randomElement(lastNames);
  return `${first} ${last}`;
};

export const generateRandomCity = () => {
  return randomElement(cities);
};

export const generateRandomProduct = (products) => {
  return randomElement(products);
};

// ============================================
// LOCALSTORAGE HELPERS
// ============================================
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// ============================================
// URL & QUERY PARAMS
// ============================================
export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

export const setQueryParam = (param, value) => {
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
};

export const removeQueryParam = (param) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(param);
  window.history.pushState({}, '', url);
};

export const getAllQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
};

// ============================================
// DOM UTILITIES
// ============================================
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

export const scrollToElement = (element, offset = 0) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;
  
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ============================================
// CLIPBOARD
// ============================================
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// ============================================
// DEVICE DETECTION
// ============================================
const MOBILE_UA_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const TABLET_UA_REGEX = /iPad|Android/i;

export const isMobile = () => {
  return MOBILE_UA_REGEX.test(navigator.userAgent);
};

export const isTablet = () => {
  return TABLET_UA_REGEX.test(navigator.userAgent) && !isMobile();
};

export const isDesktop = () => {
  return !isMobile() && !isTablet();
};

// ============================================
// NUMBER UTILITIES
// ============================================
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

export const round = (num, decimals = 0) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const randomRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// ============================================
// STARS RATING
// ============================================
export const generateStars = (rating, maxStars = 5) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: '★'.repeat(fullStars),
    half: hasHalfStar ? '⯨' : '',
    empty: '☆'.repeat(emptyStars),
    text: `${rating.toFixed(1)} out of ${maxStars}`
  };
};

// ============================================
// ANIMATION HELPERS
// ============================================
export const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const value = start + (end - start) * progress;
    callback(value);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

export const easeInOut = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// ============================================
// ID GENERATION
// ============================================
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateShortId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// ============================================
// COLOR UTILITIES
// ============================================
const HEX_COLOR_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

export const hexToRgb = (hex) => {
  const result = HEX_COLOR_REGEX.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// ============================================
// SLEEP/DELAY
// ============================================
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const wait = sleep; // Alias

// ============================================
// EXPORT ALL AS DEFAULT
// ============================================
export default {
  isValidEmail,
  isValidCreditCard,
  validateForm,
  formatPrice,
  formatCurrency,
  calculatePercentage,
  calculateDiscount,
  formatDate,
  formatRelativeTime,
  getTimeRemaining,
  slugify,
  truncate,
  capitalize,
  capitalizeWords,
  escapeHtml,
  shuffle,
  groupBy,
  sortBy,
  unique,
  pluck,
  randomInt,
  randomFloat,
  randomElement,
  generateRandomName,
  generateRandomCity,
  generateRandomProduct,
  getFromStorage,
  saveToStorage,
  removeFromStorage,
  clearStorage,
  getQueryParam,
  setQueryParam,
  removeQueryParam,
  getAllQueryParams,
  scrollToTop,
  scrollToElement,
  debounce,
  throttle,
  copyToClipboard,
  isMobile,
  isTablet,
  isDesktop,
  clamp,
  round,
  randomRange,
  generateStars,
  animateValue,
  easeInOut,
  generateId,
  generateShortId,
  hexToRgb,
  rgbToHex,
  sleep,
  wait
};