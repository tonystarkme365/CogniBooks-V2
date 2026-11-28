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
      freePrompts: [
        { id: 1, title: "Investor Pitch Deck Outline", preview: "Write a 10-slide pitch deck outline for a Series A startup. Include: problem statement, market size, solution, business model, traction, team, competition, financials, and ask. Make each slide actionable with specific slide-by-slide copy." },
        { id: 2, title: "Customer Persona Generator", preview: "Create a detailed buyer persona for my AI productivity tool. Include demographics, psychographics, pain points, goals, objections, preferred channels, and a day-in-the-life narrative." },
        { id: 3, title: "SWOT Analysis Framework", preview: "Conduct a SWOT analysis for my e-commerce business competing against Amazon. Give me 5 specific items per quadrant with actionable mitigation strategies for each weakness and threat." },
      ],
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
      freePrompts: [
        { id: 1, title: "Self-Review Draft", preview: "Write a comprehensive self-performance review. I'm a Senior Product Manager. Highlight: shipped 3 major features, mentored 2 junior PMs, improved NPS by 15 points. Use executive tone with metrics." },
        { id: 2, title: "Promotion Request Email", preview: "Draft an email to my director requesting promotion to Director of Product. Include: business impact, leadership evidence, market salary data, and a clear ask for the next review cycle." },
        { id: 3, title: "Difficult Conversation Script", preview: "Script for telling a direct report they're not getting promoted. Empathetic but clear. Include specific development areas, 30/60/90 plan, and next steps." },
      ],
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
      freePrompts: [
        { id: 1, title: "Thesis Statement Builder", preview: "Help me write a thesis statement for an argumentative essay on 'AI in higher education'. Take a clear stance, make it debatable, and include three supporting arguments." },
        { id: 2, title: "Literature Review Outline", preview: "Create a 5-source literature review outline for a psychology paper on sleep and academic performance. Include themes, gaps, and synthesis points." },
        { id: 3, title: "Exam Study Schedule", preview: "Generate a 7-day exam prep schedule for a college biology midterm. Include active recall, spaced repetition, and practice questions for cell biology and genetics." },
      ],
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
      freePrompts: [
        { id: 1, title: "Weekly Meal Plan", preview: "Create a 5-day family dinner plan (4 people, $60 budget). Include kid-friendly recipes, grocery list grouped by aisle, and 15-minute prep options for busy weeknights." },
        { id: 2, title: "Homework Helper", preview: "Explain long division to a 4th grader. Use simple language, a step-by-step example with 84 ÷ 6, and 3 practice problems with answers." },
        { id: 3, title: "Behavior Chart System", preview: "Design a positive reinforcement chart for a 6-year-old. Include specific behaviors to track, reward tiers, and a weekly review template." },
      ],
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
      freePrompts: [
        { id: 1, title: "Closet Declutter Plan", preview: "Create a weekend closet declutter schedule. Saturday: sort by category. Sunday: donate/sell/toss decisions. Include decision rules (keep if worn in 12 months)." },
        { id: 2, title: "Budget-Friendly Meal Prep", preview: "Plan 5 lunches under $30 total. Include recipes, shopping list, storage instructions, and reheating guide for office microwave." },
        { id: 3, title: "Side Hustle Ideas", preview: "List 5 side hustle ideas for a full-time teacher with evenings and weekends free. Include startup cost, time commitment, and first 3 steps for each." },
      ],
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
