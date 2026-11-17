// ============================================
// COGNIBOOKS - ANALYTICS & TRACKING SYSTEM
// ============================================
// Handles visitor tracking, sales recording, and live activity

import CONFIG from './config.js';
import { getFromStorage, saveToStorage, generateRandomName, generateRandomCity, randomElement, randomInt } from './utils.js';

// ============================================
// ANALYTICS DATA STRUCTURE
// ============================================
const ANALYTICS_KEY = 'cognibooks_analytics';
const ACTIVITY_KEY = 'cognibooks_activity';
const VISITOR_KEY = 'cognibooks_visitor';

// ============================================
// INITIALIZE ANALYTICS
// ============================================
export const initAnalytics = () => {
  // Check if localStorage persistence is enabled
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (useLocalStorage) {
    // Load existing data or create new
    const analytics = getFromStorage(ANALYTICS_KEY) || {
      totalViews: CONFIG.defaultStats.totalViews,
      totalSales: CONFIG.defaultStats.totalSales,
      conversionRate: CONFIG.defaultStats.conversionRate,
      visitors: {},
      sales: [],
      lastUpdated: new Date().toISOString()
    };
    
    return analytics;
  } else {
    // Return baseline dummy data only
    return {
      totalViews: CONFIG.defaultStats.totalViews,
      totalSales: CONFIG.defaultStats.totalSales,
      conversionRate: CONFIG.defaultStats.conversionRate,
      visitors: {},
      sales: [],
      lastUpdated: new Date().toISOString()
    };
  }
};

// ============================================
// VISITOR TRACKING
// ============================================
export const trackVisitor = () => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  // Check if visitor is new (using session)
  const isNewVisitor = !sessionStorage.getItem(VISITOR_KEY);
  
  if (isNewVisitor) {
    sessionStorage.setItem(VISITOR_KEY, 'true');
    
    if (useLocalStorage) {
      const analytics = initAnalytics();
      analytics.totalViews += 1;
      analytics.lastUpdated = new Date().toISOString();
      saveToStorage(ANALYTICS_KEY, analytics);
    }
  }
  
  return !isNewVisitor;
};

// ============================================
// SALES TRACKING
// ============================================
export const trackSale = (saleData) => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  const sale = {
    id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    productId: saleData.productId,
    productTitle: saleData.productTitle,
    amount: saleData.amount,
    timestamp: new Date().toISOString(),
    ...saleData
  };
  
  if (useLocalStorage) {
    const analytics = initAnalytics();
    analytics.totalSales += 1;
    analytics.sales.push(sale);
    analytics.conversionRate = ((analytics.totalSales / analytics.totalViews) * 100).toFixed(1);
    analytics.lastUpdated = new Date().toISOString();
    saveToStorage(ANALYTICS_KEY, analytics);
    
    // Add to activity feed
    addActivity({
      type: 'purchase',
      productTitle: saleData.productTitle,
      location: generateRandomCity(),
      timestamp: new Date().toISOString()
    });
  }
  
  return sale;
};

// ============================================
// GET STATISTICS
// ============================================
export const getStats = () => {
  const analytics = initAnalytics();
  
  return {
    totalViews: analytics.totalViews,
    totalSales: analytics.totalSales,
    totalProducts: CONFIG.products.length,
    conversionRate: analytics.conversionRate,
    averageRating: CONFIG.defaultStats.averageRating,
    activeViewers: getActiveViewers()
  };
};

// ============================================
// LIVE VIEWERS COUNTER
// ============================================
let viewersCount = CONFIG.defaultStats.activeViewers;

export const getActiveViewers = () => {
  return viewersCount;
};

export const updateActiveViewers = () => {
  // Simulate realistic viewer fluctuation
  const change = randomInt(-2, 3);
  viewersCount = Math.max(3, Math.min(25, viewersCount + change));
  return viewersCount;
};

// Start auto-updating viewers count
export const startViewersTracking = (callback, interval = 7000) => {
  const intervalId = setInterval(() => {
    const count = updateActiveViewers();
    if (callback) callback(count);
  }, interval);
  
  return intervalId;
};

// ============================================
// ACTIVITY FEED
// ============================================
export const getActivityFeed = () => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (useLocalStorage) {
    const activities = getFromStorage(ACTIVITY_KEY) || [];
    return activities;
  } else {
    // Return dummy activity feed
    return generateDummyActivities(5);
  }
};

export const addActivity = (activity) => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (!useLocalStorage) return;
  
  const activities = getFromStorage(ACTIVITY_KEY) || [];
  
  activities.unshift({
    id: `activity-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...activity
  });
  
  // Keep only last 20 activities
  const trimmedActivities = activities.slice(0, 20);
  saveToStorage(ACTIVITY_KEY, trimmedActivities);
};

// ============================================
// GENERATE DUMMY ACTIVITIES
// ============================================
const generateDummyActivities = (count = 5) => {
  const activities = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const minutesAgo = randomInt(1, 45);
    const timestamp = new Date(now - minutesAgo * 60 * 1000);
    
    const product = randomElement(CONFIG.products);
    
    activities.push({
      id: `dummy-activity-${i}`,
      type: 'purchase',
      name: generateRandomName(),
      productTitle: product.title,
      location: generateRandomCity(),
      timestamp: timestamp.toISOString()
    });
  }
  
  return activities;
};

// ============================================
// PRODUCT VIEW TRACKING
// ============================================
export const trackProductView = (productId) => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (!useLocalStorage) return;
  
  const viewKey = `product_views_${productId}`;
  const views = getFromStorage(viewKey, 0);
  saveToStorage(viewKey, views + 1);
};

export const getProductViews = (productId) => {
  const viewKey = `product_views_${productId}`;
  const realViews = getFromStorage(viewKey, 0);
  const baseViews = randomInt(50, 200); // Dummy baseline
  return realViews + baseViews;
};

// ============================================
// CONVERSION TRACKING
// ============================================
export const trackConversion = (eventName, data = {}) => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (!useLocalStorage) return;
  
  const conversions = getFromStorage('conversions', []);
  conversions.push({
    event: eventName,
    timestamp: new Date().toISOString(),
    ...data
  });
  
  saveToStorage('conversions', conversions.slice(-100)); // Keep last 100
};

// ============================================
// COUPON USAGE TRACKING
// ============================================
export const trackCouponUsage = (couponCode) => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (!useLocalStorage) return;
  
  const couponKey = `coupon_${couponCode}`;
  const usage = getFromStorage(couponKey, 0);
  saveToStorage(couponKey, usage + 1);
};

export const getCouponUsage = (couponCode) => {
  const couponKey = `coupon_${couponCode}`;
  return getFromStorage(couponKey, 0);
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  initAnalytics,
  trackVisitor,
  trackSale,
  getStats,
  getActiveViewers,
  updateActiveViewers,
  startViewersTracking,
  getActivityFeed,
  addActivity,
  trackProductView,
  getProductViews,
  trackConversion,
  trackCouponUsage,
  getCouponUsage
};
