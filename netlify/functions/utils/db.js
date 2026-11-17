import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'netlify', 'data', 'orders.json');
const PRODUCTS = [
  { id: 1, title: 'AI Arsenal for Entrepreneurs', price: 29.99, pdfPath: 'AI Arsenal for Entrepreneurs.pdf', pages: 156 },
  { id: 2, title: 'Promotion-Ready with AI Prompts', price: 27.99, pdfPath: 'Promotion-Ready With AI Prompts.pdf', pages: 134 },
  { id: 3, title: 'The P.A.C.E Academic Writing Toolkit', price: 24.99, pdfPath: 'The P.A.C.E Academic Writing Toolkit.pdf', pages: 142 },
  { id: 4, title: 'The Invisible Assistant', price: 24.99, pdfPath: 'The Invisible Assistant.pdf', pages: 118 },
  { id: 5, title: 'The Sovereign Sanctuary', price: 24.99, pdfPath: 'The Sovereign Sanctuary.pdf', pages: 128 },
];

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
}

function readDB() {
  ensureDB();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function writeDB(data) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getProduct(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

export function getAllProducts() {
  return PRODUCTS;
}

export function createOrder({ productId, email, name, amount, provider }) {
  const orders = readDB();
  const order = {
    id: crypto.randomUUID(),
    productId: parseInt(productId),
    email,
    name,
    amount: parseFloat(amount),
    provider,
    status: 'pending',
    paymentId: null,
    createdAt: Date.now(),
    completedAt: null,
  };
  orders.push(order);
  writeDB(orders);
  return order;
}

export function getOrder(id) {
  const orders = readDB();
  return orders.find(o => o.id === id);
}

export function getOrderByPaymentId(paymentId) {
  const orders = readDB();
  return orders.find(o => o.paymentId === paymentId);
}

export function updateOrder(id, updates) {
  const orders = readDB();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...updates };
  writeDB(orders);
  return orders[idx];
}

export function getOrdersByEmail(email) {
  const orders = readDB();
  return orders.filter(o => o.email === email);
}

export function getAllOrders() {
  return readDB();
}