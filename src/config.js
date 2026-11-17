// ============================================
// COGNIBOOKS – MASTER CONFIG
// ============================================
export const CONFIG = {
  storeName: "CogniBooks",
  tagline: "Master AI. Transform Your Life.",
  description: "Premium curated ChatGPT prompt collections for professionals who want to unlock AI's full potential",
  contact: { email: "support@cognibooks.com" },

  // PAYMENT CONFIG
  // Client-side checkout now uses PaymentSection (PayBis + Transak → USDC on Polygon)
  // No Crossmint SDK needed; funds go directly to wallet address
  payment: {
    walletAddress: "0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53",
    network: "polygon",
    currency: "USDC",
    providers: ["paybis", "transak"],
  },

  products: [
    {
      id: 1,
      title: "AI Arsenal for Entrepreneurs",
      slug: "ai-arsenal-for-entrepreneurs",
      subtitle: "500+ Battle-Tested Prompts for Business Growth",
      description: "Transform your entrepreneurial journey with AI. 500+ expertly crafted prompts covering business strategy, marketing, sales, product development, fundraising, and growth hacking.",
      price: 29.99, originalPrice: 49.99, discount: 40,
      category: "Business", audience: "Entrepreneurs & Business Owners",
      cover: "/AI Arsenal for Entrepreneurs.webp",
      pdfFile: "/ebooks/AI Arsenal for Entrepreneurs.pdf",
      bestseller: true, stock: 3, rating: 4.9, reviewCount: 127, pages: 156, format: "PDF",
      features: ["500+ battle-tested ChatGPT prompts","Business strategy & planning","Marketing & sales automation","Product development frameworks","Fundraising & pitch deck creation","Team management & hiring","Growth hacking strategies","Market research & competitor analysis","Financial modeling & projections","Crisis management scenarios"],
      benefits: ["Save 20+ hours per week on routine tasks","Generate investor-ready pitch decks in minutes","Create marketing campaigns that convert","Make data-driven decisions faster"]
    },
    {
      id: 2,
      title: "Promotion-Ready with AI Prompts",
      slug: "promotion-ready-with-ai-prompts",
      subtitle: "400+ Career-Accelerating Prompts for Professionals",
      description: "Climb the corporate ladder faster with AI as your career coach. 400+ prompts for performance reviews, executive communication, and leading high-impact projects.",
      price: 27.99, originalPrice: 44.99, discount: 38,
      category: "Career", audience: "Career Professionals & Managers",
      cover: "/Promotion-Ready With AI Prompts.webp",
      pdfFile: "/ebooks/Promotion-Ready With AI Prompts.pdf",
      bestseller: true, stock: 7, rating: 4.8, reviewCount: 94, pages: 134, format: "PDF",
      features: ["400+ career-accelerating prompts","Performance review preparation","Executive communication templates","Leadership & management prompts","Negotiation & conflict resolution","Professional networking strategies","Personal branding & LinkedIn optimization","Meeting facilitation & presentations","Strategic thinking frameworks","Stakeholder management"],
      benefits: ["Stand out in performance reviews","Communicate like a C-level executive","Lead projects that get noticed","Build a reputation as a problem-solver"]
    },
    {
      id: 3,
      title: "The P.A.C.E Academic Writing Toolkit",
      slug: "the-pace-academic-writing-toolkit",
      subtitle: "450+ Research & Writing Prompts for Students",
      description: "Excel academically with your AI-powered study companion. 450+ prompts for research, essay writing, exam preparation, and critical thinking.",
      price: 24.99, originalPrice: 39.99, discount: 38,
      category: "Education", audience: "Students & Academics",
      cover: "/The P.A.C.E Academic Writing Toolkit.webp",
      pdfFile: "/ebooks/The P.A.C.E Academic Writing Toolkit.pdf",
      bestseller: false, stock: 12, rating: 4.9, reviewCount: 156, pages: 142, format: "PDF",
      features: ["450+ academic excellence prompts","Research & literature review","Essay structure & thesis development","Citation & bibliography formatting","Exam preparation & study strategies","Critical thinking & analysis","Scientific writing & lab reports","Presentation & oral defense prep","Time management for students","Subject-specific prompts (STEM, humanities)"],
      benefits: ["Cut research time by 60%","Write A+ essays with confidence","Master any subject faster","Ace exams with smart study strategies"]
    },
    {
      id: 4,
      title: "The Invisible Assistant",
      slug: "the-invisible-assistant",
      subtitle: "350+ Life-Management Prompts for Parents",
      description: "Parenting is the hardest job in the world — until now. 350+ prompts for meal planning, homework help, behavior management, and family activities.",
      price: 24.99, originalPrice: 39.99, discount: 38,
      category: "Family", audience: "Parents & Caregivers",
      cover: "/The Invisible Assistant.webp",
      pdfFile: "/ebooks/The Invisible Assistant.pdf",
      bestseller: false, stock: 15, rating: 4.8, reviewCount: 83, pages: 118, format: "PDF",
      features: ["350+ parenting & family prompts","Meal planning & nutrition","Homework help (all grade levels)","Behavior management strategies","Age-appropriate activities","Birthday party & event planning","Health & wellness guidance","Bedtime routines & sleep solutions","Travel planning with kids","Emergency preparedness"],
      benefits: ["Reduce daily stress and decision fatigue","Create memorable family experiences","Help kids succeed academically","Master work-life balance"]
    },
    {
      id: 5,
      title: "The Sovereign Sanctuary",
      slug: "the-sovereign-sanctuary",
      subtitle: "400+ Home & Life Optimization Prompts",
      description: "Transform your home into your sanctuary. 400+ prompts for home organization, budget management, healthy cooking, creative projects, and personal growth.",
      price: 24.99, originalPrice: 39.99, discount: 38,
      category: "Lifestyle", audience: "Homemakers & Life Optimizers",
      cover: "/The Sovereign Sanctuary.webp",
      pdfFile: "/ebooks/The Sovereign Sanctuary.pdf",
      bestseller: false, stock: 18, rating: 4.7, reviewCount: 71, pages: 128, format: "PDF",
      features: ["400+ home & life optimization prompts","Home organization & decluttering","Budget & financial management","Healthy meal planning & recipes","DIY & creative projects","Self-care & personal wellness","Side hustle & income ideas","Garden & home improvement","Sustainable living practices","Personal development & growth"],
      benefits: ["Create a home you're proud of","Master your finances and budget","Discover new income opportunities","Prioritize self-care without guilt"]
    }
  ],

  coupons: [
    { code: "COGNIBOOKS20", discount: 20, type: "percentage", active: true },
    { code: "SAVE10", discount: 10, type: "percentage", active: true }
  ],

  trustBadges: [
    { icon: "🔒", text: "256-bit SSL" },
    { icon: "⚡", text: "Instant Download" },
    { icon: "✅", text: "30-Day Guarantee" },
    { icon: "🏆", text: "Premium Quality" },
    { icon: "🌍", text: "Worldwide Access" }
  ],

  admin: { username: "admin", password: "cogni2024!secure" },
  defaultStats: {
    totalViews: 14391,
    totalSales: 2847,
    conversionRate: '19.8',
    averageRating: 4.86,
    activeViewers: 42
  },
  defaultReviews: [],
  features: {
    showLiveViewers: true,
    showRecentActivity: true,
    enableCoupons: true,
    localStorage: true
  },

  getProductById(id) {
    const productId = Number(id);
    if (!Number.isInteger(productId)) return undefined;
    return this.products.find(p => p.id === productId);
  },
  validateCoupon(code) {
    if (typeof code !== 'string') return null;
    const normalizedCode = code.trim().toUpperCase();
    return this.coupons.find(c => c.code.toUpperCase() === normalizedCode && c.active) || null;
  },
  calculateDiscount(price, coupon) {
    if (!coupon) return 0;
    return coupon.type === "percentage" ? (price * coupon.discount) / 100 : coupon.discount;
  }
};

export default CONFIG;
