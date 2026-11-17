// ============================================
// COGNIBOOKS - REVIEWS & RATING SYSTEM
// ============================================
// Manages customer reviews, ratings, and testimonials

import CONFIG from './config.js';
import { getFromStorage, saveToStorage, isValidEmail, formatRelativeTime, generateId } from './utils.js';

// ============================================
// STORAGE KEYS
// ============================================
const REVIEWS_KEY = 'cognibooks_reviews';
const HELPFUL_VOTES_KEY = 'cognibooks_helpful_votes';

// ============================================
// GET ALL REVIEWS
// ============================================
export const getAllReviews = () => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (useLocalStorage) {
    const userReviews = getFromStorage(REVIEWS_KEY, []);
    // Merge default reviews with user-submitted reviews
    return [...CONFIG.defaultReviews, ...userReviews];
  } else {
    // Return only default reviews
    return CONFIG.defaultReviews;
  }
};

// ============================================
// GET REVIEWS BY PRODUCT
// ============================================
export const getReviewsByProduct = (productId) => {
  const allReviews = getAllReviews();
  return allReviews.filter(review => review.productId === parseInt(productId));
};

// ============================================
// GET FEATURED REVIEWS (for homepage)
// ============================================
export const getFeaturedReviews = (limit = 6) => {
  const allReviews = getAllReviews();
  
  // Sort by rating (highest first) and helpful votes
  const sorted = allReviews
    .filter(r => r.rating >= 4)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.helpful || 0) - (a.helpful || 0);
    });
  
  return sorted.slice(0, limit);
};

// ============================================
// ADD NEW REVIEW
// ============================================
export const addReview = (reviewData) => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  // Validate required fields
  if (!reviewData.productId || !reviewData.name || !reviewData.rating || !reviewData.comment) {
    return {
      success: false,
      error: 'Missing required fields'
    };
  }
  
  // Validate email if provided
  if (reviewData.email && !isValidEmail(reviewData.email)) {
    return {
      success: false,
      error: 'Invalid email address'
    };
  }
  
  // Validate rating
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    return {
      success: false,
      error: 'Rating must be between 1 and 5'
    };
  }
  
  const newReview = {
    id: generateId('review'),
    productId: parseInt(reviewData.productId),
    name: reviewData.name,
    email: reviewData.email || '',
    rating: parseInt(reviewData.rating),
    title: reviewData.title || '',
    comment: reviewData.comment,
    date: new Date().toISOString(),
    verified: false, // User reviews are not verified by default
    helpful: 0,
    replies: []
  };
  
  if (useLocalStorage) {
    const userReviews = getFromStorage(REVIEWS_KEY, []);
    userReviews.push(newReview);
    saveToStorage(REVIEWS_KEY, userReviews);
    
    return {
      success: true,
      review: newReview
    };
  } else {
    return {
      success: false,
      error: 'Review submission is disabled (localStorage is off)'
    };
  }
};

// ============================================
// ADD OWNER REPLY TO REVIEW
// ============================================
export const addReply = (reviewId, replyText, ownerName = 'CogniBooks Team') => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (!useLocalStorage) {
    return {
      success: false,
      error: 'Replies are disabled (localStorage is off)'
    };
  }
  
  const userReviews = getFromStorage(REVIEWS_KEY, []);
  const reviewIndex = userReviews.findIndex(r => r.id === reviewId);
  
  if (reviewIndex === -1) {
    return {
      success: false,
      error: 'Review not found'
    };
  }
  
  const reply = {
    id: generateId('reply'),
    text: replyText,
    author: ownerName,
    date: new Date().toISOString(),
    isOwner: true
  };
  
  if (!userReviews[reviewIndex].replies) {
    userReviews[reviewIndex].replies = [];
  }
  
  userReviews[reviewIndex].replies.push(reply);
  saveToStorage(REVIEWS_KEY, userReviews);
  
  return {
    success: true,
    reply
  };
};

// ============================================
// VOTE REVIEW AS HELPFUL
// ============================================
export const voteHelpful = (reviewId) => {
  const useLocalStorage = CONFIG.features.localStorage;
  
  if (!useLocalStorage) return false;
  
  // Check if user already voted
  const votes = getFromStorage(HELPFUL_VOTES_KEY, []);
  if (votes.includes(reviewId)) {
    return false; // Already voted
  }
  
  // Find review and increment helpful count
  const allReviews = getAllReviews();
  const review = allReviews.find(r => r.id === reviewId);
  
  if (!review) return false;
  
  // If it's a user review, update it
  const userReviews = getFromStorage(REVIEWS_KEY, []);
  const userReviewIndex = userReviews.findIndex(r => r.id === reviewId);
  
  if (userReviewIndex !== -1) {
    userReviews[userReviewIndex].helpful = (userReviews[userReviewIndex].helpful || 0) + 1;
    saveToStorage(REVIEWS_KEY, userReviews);
  }
  
  // Record the vote
  votes.push(reviewId);
  saveToStorage(HELPFUL_VOTES_KEY, votes);
  
  return true;
};

// ============================================
// CALCULATE PRODUCT RATING
// ============================================
export const calculateProductRating = (productId) => {
  const reviews = getReviewsByProduct(productId);
  
  if (reviews.length === 0) {
    const product = CONFIG.getProductById(productId);
    return {
      average: product?.rating || 0,
      count: product?.reviewCount || 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    distribution[review.rating]++;
  });
  
  return {
    average: parseFloat(average.toFixed(1)),
    count: reviews.length,
    distribution
  };
};

// ============================================
// GET REVIEW STATISTICS
// ============================================
export const getReviewStats = () => {
  const allReviews = getAllReviews();
  
  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0
    ? allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : CONFIG.defaultStats.averageRating;
  
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allReviews.forEach(review => {
    ratingDistribution[review.rating]++;
  });
  
  const verifiedCount = allReviews.filter(r => r.verified).length;
  
  return {
    total: totalReviews,
    average: parseFloat(averageRating.toFixed(1)),
    distribution: ratingDistribution,
    verified: verifiedCount,
    percentage: {
      5: totalReviews > 0 ? Math.round((ratingDistribution[5] / totalReviews) * 100) : 0,
      4: totalReviews > 0 ? Math.round((ratingDistribution[4] / totalReviews) * 100) : 0,
      3: totalReviews > 0 ? Math.round((ratingDistribution[3] / totalReviews) * 100) : 0,
      2: totalReviews > 0 ? Math.round((ratingDistribution[2] / totalReviews) * 100) : 0,
      1: totalReviews > 0 ? Math.round((ratingDistribution[1] / totalReviews) * 100) : 0
    }
  };
};

// ============================================
// FILTER REVIEWS
// ============================================
export const filterReviews = (reviews, filters = {}) => {
  let filtered = [...reviews];
  
  // Filter by rating
  if (filters.rating) {
    filtered = filtered.filter(r => r.rating === filters.rating);
  }
  
  // Filter by verified
  if (filters.verified !== undefined) {
    filtered = filtered.filter(r => r.verified === filters.verified);
  }
  
  // Sort
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      default:
        break;
    }
  }
  
  return filtered;
};

// ============================================
// FORMAT REVIEW FOR DISPLAY
// ============================================
export const formatReview = (review) => {
  return {
    ...review,
    formattedDate: formatRelativeTime(review.date),
    starsHtml: '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
  };
};

// ============================================
// VALIDATE REVIEW DATA
// ============================================
export const validateReviewData = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Please select a rating between 1 and 5 stars';
  }
  
  if (!data.comment || data.comment.trim() === '') {
    errors.comment = 'Review comment is required';
  } else if (data.comment.length < 10) {
    errors.comment = 'Review must be at least 10 characters';
  }
  
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email address';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  getAllReviews,
  getReviewsByProduct,
  getFeaturedReviews,
  addReview,
  addReply,
  voteHelpful,
  calculateProductRating,
  getReviewStats,
  filterReviews,
  formatReview,
  validateReviewData
};
