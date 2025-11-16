# 🎯 PM Tracker - Project Management SaaS Intelligence Platform

**Specialized competitive intelligence platform for tracking Trello, Monday.com, and ClickUp.**

Monitor pricing changes, feature releases, integrations, and product updates across the leading project management tools.

---

## 🎨 Platform Focus

**Industry:** Project Management SaaS  
**Competitors Tracked:** Trello, Monday.com, ClickUp  
**Key Monitoring Areas:**
- 💰 Pricing strategy changes
- ⚡ Feature releases & product updates
- 🔗 Integration announcements
- 📚 Case studies & customer success stories
- 🎓 Webinars & educational content

---

## ⚡ Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Seed Competitors
```bash
cd backend
# Add your MongoDB, Redis, Gemini API key to .env

# Seed the PM competitors
node scripts/seedCompetitors.js
```

**Output:**
```
✅ Successfully added competitors:
📊 Trello  
📊 Monday.com
📊 ClickUp
```

### 3. Test Scraping
```bash
node scripts/testScraping.js
```

This will verify all RSS feeds and websites are accessible.

### 4. Start Everything
```bash
# Terminal 1: Backend API
npm run dev

# Terminal 2: Workers
node startWorkers.js

# Terminal 3: Frontend
cd ../frontend
npm run dev
```

---

## 📊 What Gets Monitored

### Trello
- **Pricing:** `https://trello.com/pricing`
- **Enterprise:** `https://trello.com/enterprise`
- **Blog RSS:** `https://blog.trello.com/feed` via RSS feed
  
### Monday.com
- **Pricing:** `https://monday.com/pricing`
- **Product:** `https://monday.com/product`
- **Blog RSS:** `https://monday.com/blog/feed/` via RSS feed

### ClickUp
- **Pricing:** `https://clickup.com/pricing`
- **Features:** `https://clickup.com/features`
- **Blog RSS:** `https://clickup.com/blog/feed/` via RSS feed

---

## 🤖 AI Classification Categories

Updates are automatically classified into:

1. **Pricing** 🔴 Critical Impact
   - Price changes, new tiers, discounts

2. **Feature Release** 🟠 High Impact
   - New features, major updates, capabilities

3. **Integration** 🟠 High Impact
   - New tool integrations, API updates

4. **Product Update** 🟡 Medium Impact
   - UI improvements, minor updates, bug fixes

5. **Case Study** 🟢 Low Impact
   - Customer success stories

6. **Webinar** 🟢 Low Impact
   - Educational content, training

7. **Blog Post** 🟢 Low Impact
   - General content marketing

---
