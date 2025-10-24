# WordForge 🔥

**Forge your vocabulary, one week at a time.**

WordForge is a web application designed to help English learners systematically expand their vocabulary through weekly curated lists of phrases, idioms, collocations, and other linguistic expressions. The app combines AI-powered content generation with gamification to create an engaging, achievement-driven learning experience.

---

## 📖 Project Overview

### The Problem

English learners often struggle to:

- Find high-quality, varied vocabulary resources
- Stay consistent with vocabulary learning
- Track their progress and feel a sense of achievement
- Use new vocabulary in real conversations

### The Solution

WordForge delivers:

- **Weekly vocabulary lists** automatically generated every Monday
- **6 diverse items per week** including phrases, idioms, collocations, phrasal verbs, fixed expressions, binomials, proverbs, discourse markers, and register-specific vocabulary
- **Checkbox system** to mark when vocabulary is used in real life
- **Achievement tracking** with streaks and progress visualization
- **Smart AI generation** that avoids repetition and provides fresh examples

---

## ✨ Key Features

### Core Features (MVP)

- [ ] **Weekly Vocabulary Generation**
  - Automated Monday delivery of 6 vocabulary items
  - AI-powered generation using Google Gemini API
  - Each item includes: term, definition, example sentence, and category tag
- [ ] **Interactive Learning Interface**
  - Clean, card-based UI for each vocabulary item
  - Checkboxes to mark items as "used"
  - Category tags (formal, casual, business, academic)
- [ ] **Progress Tracking**
  - Visual progress indicators
  - Weekly completion percentage
  - Usage streak counter
- [ ] **Smart Content Management**
  - Avoids immediate repetition of vocabulary items
  - Can reintroduce items with new examples after time
  - Stores learning history

### Future Enhancements (Post-MVP)

- [ ] Difficulty level selection (intermediate/advanced)
- [ ] Personal notes for each vocabulary item
- [ ] Review mode with spaced repetition
- [ ] Export to PDF functionality
- [ ] Email notifications for weekly lists
- [ ] Mobile responsive design
- [ ] Dark mode
- [ ] Multi-language interface support
- [ ] Social sharing of achievements
- [ ] Custom vocabulary list creation

---

## 🏗️ Technical Architecture

### Tech Stack

**Frontend**

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

**Backend**

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **Prisma** - ORM for database management

**AI Integration**

- **Google Gemini API** - Free tier for vocabulary generation
  - 5 requests/minute, 25 requests/day
  - Perfect for weekly generation

**Infrastructure**

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** (optional) - Reverse proxy for production

---

## 📊 Data Model (Preliminary)

### Core Entities

**User**

```typescript
{
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences: {
    difficultyLevel: 'intermediate' | 'advanced';
    emailNotifications: boolean;
  }
}
```

**VocabularyItem**

```typescript
{
  id: string
  term: string
  type: 'phrase' | 'idiom' | 'collocation' | 'phrasal_verb' | 'fixed_expression' | 'binomial' | 'proverb' | 'discourse_marker' | 'register_specific'
  definition: string
  exampleSentence: string
  contextTags: string[] // ['formal', 'business', 'casual', etc.]
  createdAt: Date
}
```

**WeeklyList**

```typescript
{
  id: string
  weekStartDate: Date
  items: VocabularyItem[] // 6 items
  userId: string
  generatedAt: Date
}
```

**UserProgress**

```typescript
{
  id: string
  userId: string
  vocabularyItemId: string
  weeklyListId: string
  isUsed: boolean
  usedAt?: Date
  notes?: string
}
```

---

## 🎯 Development Roadmap

### Phase 1: Foundation (Week 1-2)

- [x] Project naming and concept definition
- [ ] Set up project repository structure
- [ ] Configure Docker and Docker Compose
- [ ] Initialize NestJS backend
- [ ] Initialize Vue 3 frontend
- [ ] Set up PostgreSQL with Prisma
- [ ] Basic project documentation

### Phase 2: Core Backend (Week 3-4)

- [ ] Implement Gemini API integration
- [ ] Create vocabulary generation service
- [ ] Build vocabulary items endpoint
- [ ] Implement weekly list generation logic
- [ ] Set up cron job for Monday generation
- [ ] Create user progress tracking endpoints
- [ ] Write unit tests for core services

### Phase 3: Frontend Development (Week 5-6)

- [ ] Design UI/UX mockups
- [ ] Build vocabulary card component
- [ ] Create weekly list view
- [ ] Implement checkbox interaction
- [ ] Build progress dashboard
- [ ] Add streak counter visualization
- [ ] Implement local storage for offline progress

### Phase 4: Integration & Polish (Week 7-8)

- [ ] Connect frontend to backend API
- [ ] Implement authentication (optional for MVP)
- [ ] Add error handling and loading states
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] User testing and feedback collection

### Phase 5: Deployment (Week 9)

- [ ] Set up production environment
- [ ] Configure CI/CD pipeline
- [ ] Deploy to cloud platform (e.g., DigitalOcean, AWS, Railway)
- [ ] Set up monitoring and logging
- [ ] Create user documentation

### Phase 6: Post-Launch Iteration

- [ ] Gather user feedback
- [ ] Implement priority enhancements
- [ ] Add analytics tracking
- [ ] Expand vocabulary database
- [ ] Consider monetization options (premium features)

---

## 🚀 Getting Started (For Development)

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Google Cloud account (for Gemini API)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wordforge.git
cd wordforge

# Set up environment variables
cp .env.example .env
# Add your Gemini API key to .env

# Start with Docker Compose
docker-compose up -d

# Backend will be available at http://localhost:3000
# Frontend will be available at http://localhost:5173
```

### Environment Variables

```env
# Backend
DATABASE_URL="postgresql://user:password@localhost:5432/wordforge"
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000

# Frontend
VITE_API_URL="http://localhost:3000"
```

---

## 🎨 Design Principles

### User Experience

- **Simplicity First** - Clean, uncluttered interface
- **Achievement-Oriented** - Visual feedback for progress
- **Low Friction** - One-click checkbox interaction
- **Informative** - Clear examples and context

### Content Quality

- **Diverse Categories** - Mix of vocabulary types each week
- **Practical Examples** - Real-world usage scenarios
- **Contextual Learning** - Tags indicate appropriate usage contexts
- **Progressive Difficulty** - Can scale with user level

---

## 📝 API Endpoints (Planned)

### Vocabulary

- `GET /api/vocabulary/weekly` - Get current week's list
- `GET /api/vocabulary/history` - Get past weeks
- `POST /api/vocabulary/generate` - Manually trigger generation (admin)

### Progress

- `POST /api/progress/mark-used` - Mark vocabulary as used
- `GET /api/progress/stats` - Get user statistics
- `GET /api/progress/streak` - Get current streak

### User

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/preferences` - Update preferences

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Google Gemini API for AI-powered vocabulary generation
- The English learning community for inspiration
- All contributors and testers

---

## 📞 Contact

Project Creator - [Your Name]

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

Project Link: [https://github.com/yourusername/wordforge](https://github.com/yourusername/wordforge)

---

**Happy Forging! 🔥📚**
