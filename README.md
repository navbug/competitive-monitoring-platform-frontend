# 🎯 PM Tracker - Project Management SaaS Intelligence Platform

**Specialized competitive intelligence platform for tracking Trello, Monday.com, and ClickUp.**

Monitor pricing changes, feature releases, integrations, and product updates across the leading project management tools.

---

## 🎨 Platform Focus

**Industry:** Project Management SaaS  
**Competitors Tracked:** Trello, Monday.com, ClickUp (more can be added)

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

### 2. Environment Variables

**Backend `.env`:**
```env
MONGODB_URI
REDIS_URL
JWT_SECRET
JWT_EXPIRE
GEMINI_API_KEY
PORT
NODE_ENV
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL
```

### 3. Seed Competitors
```bash
cd backend

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

### 4. Test Scraping
```bash
node scripts/testScraping.js
```

This will verify all RSS feeds and websites are accessible.

### 5. Start Everything
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


## 🏗️ Architecture & Approach

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐                   
│                      USER (Browser)                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/REST API Calls
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              BACKEND (Render)                               │
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Express    │◄────────┤   start.js   │                  │
│  │   Server     │         │  (Launcher)  │                  │
│  │  (Port 5000) │         └──────────────┘                  │
│  └──────┬───────┘                │                          │
│         │                        │                          │
│         │                  ┌─────▼──────┐                   │
│         │                  │  Workers   │                   │
│         │                  │(Background)│                   │
│         │                  └─────┬──────┘                   │
│         │                        │                          │
│    ┌────▼────────────────────────▼─────┐                    │
│    │        Bull Queue System          │                    │
│    │  - scraperQueue                   │                    │
│    │  - classificationQueue            │                    │
│    │  - trendQueue                     │                    │
│    └────┬──────────────────────────────┘                    │
└─────────┼───────────────────────────────────────────────────┘
          │
          │ Redis Connection
          │
┌─────────▼─────────────────────────────────────────────────┐
│              REDIS Cloud                                  │
│        Job Queue + Caching                                │
└───────────────────────────────────────────────────────────┘
          │
          │ MongoDB Connection
          │
┌─────────▼─────────────────────────────────────────────────┐
│           MONGODB ATLAS                                   │
│     Collections:                                          │
│     - users (authentication)                              │
│     - competitors (Trello..,)                             │
│     - updates (scraped content)                           │
│     - trends (AI-detected patterns)                       │
└───────────────────────────────────────────────────────────┘
          │
          │ API Calls
          │
┌─────────▼─────────────────────────────────────────────────┐
│           GOOGLE GEMINI AI                                │
│     Content Classification & Analysis                     │
└───────────────────────────────────────────────────────────┘
          │
          │ HTTP Requests
          │
┌─────────▼─────────────────────────────────────────────────┐
│         COMPETITOR WEBSITES                               │
└───────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
START: Cron Scheduler Triggers
         │
         ▼
┌────────────────────────┐
│  Scraper Scheduler     │ Every 5 min/hourly/6 hours
│  (schedulers/          │ Based on competitor.frequency
│   scraperScheduler.js) │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Create Scraper Jobs   │ For each active competitor:
│                        │ - Queue website pages
│                        │ - Queue RSS feeds
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│   Bull Queue (Redis)   │ Jobs stored in Redis
│   - scraperQueue       │ Workers pick them up
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Scraper Worker        │ workers/scraperWorker.js
│  (Background Process)  │ Processes jobs one by one
└────────┬───────────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼ 
┌─────────────┐   ┌──────────────┐
│  RSS Feed   │   │   Website    │
│  Scraping   │   │   Scraping   │
└──────┬──────┘   └──────┬───────┘ 
       │                 │
       ▼                 ▼
┌────────────────────────────┐
│  scraperService.js         │ 
│  - scrapeRSSFeed()         │ Uses rss-parser
│  - scrapeWebpage()         │ Uses cheerio/axios
│  - checkForChanges()       │ Content comparison
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│     Duplicate Check        │ Check if update exists:
│                            │ - By source URL
│                            │ - By title + competitor
└────────┬───────────────────┘
         │
    Is Duplicate?
         │
    ┌────┴─────┐
    │          │
  YES         NO
    │          │
    ▼          ▼
  SKIP    ┌─────────────────┐
          │  Create Update  │ Store in MongoDB
          │  Record in DB   │ updates collection
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Queue for AI    │ Add to classificationQueue
          │ Classification  │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Classification  │ workers/
          │ Worker          │ classificationWorker.js
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Gemini AI       │ services/geminiService.js
          │ classifyUpdate()│
          └────────┬────────┘
                   │
            ┌──────┴──────┐
            │             │
        SUCCESS        FAIL
            │             │
            ▼             ▼
      ┌─────────┐   ┌──────────────┐
      │ AI      │   │ Fallback     │
      │ Result  │   │ Rule-based   │
      └────┬────┘   └──────┬───────┘
           │               │
           └───────┬───────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Update Record   │ Add classification:
          │ with            │ - category
          │ Classification  │ - impactLevel
          └────────┬────────┘ - tags, sentiment
                   │
            Is High/Critical Impact?
                   │
              ┌────┴─────┐
              │          │
             YES        NO
              │          │
              ▼          ▼
     ┌──────────────┐  DONE
     │ Queue        │
     │ Notification │
     └──────┬───────┘
            │
            ▼
     ┌──────────────┐
     │ Notification │ Users get alerted
     │ Sent         │ based on preferences
     └──────────────┘

PARALLEL PROCESS:

┌────────────────────────────┐
│  Trend Scheduler           │ Every 6 hours
│  (schedulers/              │
│   trendScheduler.js)       │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Fetch Recent Updates      │ Last 7 days
│                            │ Group by category
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Gemini AI                 │ analyzeTrends()
│  Pattern Detection         │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Create/Update             │ Store patterns in
│  Trend Records             │ trends collection
└────────────────────────────┘

USER ACCESSES FRONTEND:

┌────────────────────────────┐
│  User Opens Browser        │ Website URL
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Login/Register            │ JWT authentication
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Dashboard Loads           │ Fetches data via API:
│                            │ GET /api/competitors
│                            │ GET /api/updates
│                            │ GET /api/trends
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  React Components          │ Display data:
│  Render                    │ - Charts (Recharts)
│                            │ - Tables
│                            │ - Cards
└────────────────────────────┘
```

---

## 🎯 Key Technical Decisions

### 1. **Queue-Based Architecture with Bull + Redis**
**Decision:** Use Bull queues for asynchronous job processing instead of direct API calls.

**Reasons:**
- **Scalability:** Separate scraping from API responses
- **Retry Logic:** Automatic retries with backoff for failed scrapes
- **Priority Queuing:** High-priority competitors scraped first
- **Job Persistence:** Redis ensures no jobs lost during crashes

### 2. **Dual Data Source Strategy: RSS + Web Scraping**
**Decision:** Combine RSS feeds with website scraping for comprehensive coverage.

**Reasons:**
- **RSS Feeds:** Fast, structured, reliable for blog content
- **Web Scraping:** Required for pricing pages
- **Redundancy:** If one source fails, other still works
- **Different Update Types:** RSS catches blog posts, scraping catches pricing changes

### 3. **AI Classification**
**Decision:** Use Gemini AI for classification.

**Reasons:**
- **Cost:** Free AI tool available, used Gemini 2.5 Flash
- **Reliability:** If AI fails, ensuring platform doesn't break
- **PM-Specific:** Custom prompts trained for PM tool updates

### 4. **Duplicate Prevention**
**Decision:** Multiple-layer duplicate detection system.

**Problem:** RSS feeds can return same items repeatedly, causing database bloat.

### 5. **Flexible Frequency Scheduling**
**Decision:** Multiple cron schedules (5min, 10min, 30min, hourly, 6h, 12h, daily) instead of single fixed schedule.

**Reasons:**
- **Testing:** Fast intervals (5-30min) for development
- **Production:** Slower intervals (6h-daily) to avoid rate limits
- **Priority-Based:** High-priority competitors checked more often

### 6. **Frontend State Management: React Context + Custom Hooks**
**Decision:** Use React Context for auth + custom hooks for data fetching.

**Reasons:**
- **Simplicity:** Auth is the only global state needed
- **Hooks:** `useCompetitors` encapsulates fetching logic
- **Less Boilerplate:** No Redux actions/reducers
- **Project Size:** Medium-sized project doesn't need much complexity

---

## 🚀 Key Features

### 1. **Real-time Monitoring**
- Automated scraping every 5-30 minutes
- RSS feed parsing for instant updates
- Website change detection

### 2. **AI-Powered Classification**
- Google Gemini 2.5 Flash integration
- PM-specific prompts and training
- Automatic fallback to rule-based system

### 3. **Trend Detection**
- AI-driven pattern analysis
- Emerging trend identification

### 5. **Side-by-Side Comparison**
- Compare pricing changes across competitors

### 6. **Comprehensive Dashboard**
- Activity timeline charts
- Category distribution
- Recent updates feed
- Stats overview

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update preferences

### Competitors
- `GET /api/competitors` - List all
- `GET /api/competitors/:id` - Get single
- `POST /api/competitors` - Create
- `PUT /api/competitors/:id` - Update
- `DELETE /api/competitors/:id` - Delete
- `GET /api/competitors/:id/stats` - Get statistics

### Updates
- `GET /api/updates` - List with filters
- `GET /api/updates/:id` - Get single
- `PUT /api/updates/:id/status` - Mark as reviewed
- `GET /api/updates/stats/overview` - Get statistics
- `DELETE /api/updates/:id` - Delete

### Trends
- `GET /api/trends` - List all trends
- `GET /api/trends/:id` - Get single
- `PUT /api/trends/:id` - Update status
- `DELETE /api/trends/:id` - Delete

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all read

---

**Built by Naveen Bugalia**
