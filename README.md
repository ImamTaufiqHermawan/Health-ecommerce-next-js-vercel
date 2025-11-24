# Health E-Commerce - Next.js Full Stack Application

Complete health e-commerce platform built with Next.js 14, ready for Vercel deployment. Features include AI chatbot, Midtrans payment gateway, product management, and user authentication.

## Features

- **Full Stack Next.js** - App Router architecture
- **Authentication** - JWT-based with bcrypt password hashing
- **Product Management** - CRUD operations with image upload
- **Shopping Cart** - Persistent cart with user sessions
- **AI Chatbot** - Google Gemini integration for health recommendations
- **Payment Gateway** - Midtrans Snap integration
- **Image Upload** - Cloudinary integration
- **API Documentation** - Swagger UI
- **Responsive Design** - Tailwind CSS + Ant Design
- **Database** - MongoDB with Mongoose ODM

## Project Structure

```
final-project-health-ecommerce/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes (Backend)
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── products/           # Product endpoints
│   │   │   ├── cart/               # Cart endpoints
│   │   │   ├── orders/             # Order endpoints
│   │   │   ├── external/           # External API integrations
│   │   │   │   ├── ai/             # AI chatbot
│   │   │   │   └── payment/        # Midtrans payment
│   │   │   ├── upload/             # Image upload
│   │   │   └── health/             # Health check
│   │   ├── api-docs/               # Swagger documentation
│   │   ├── layout.js               # Root layout
│   │   ├── page.js                 # Home page
│   │   └── globals.css             # Global styles
│   ├── components/                 # React components
│   │   ├── AppContent.js           # Main app wrapper
│   │   ├── Navbar.js               # Navigation bar
│   │   ├── Footer.js               # Footer
│   │   └── AIChatbot.js            # AI chatbot component
│   ├── context/                    # React Context providers
│   │   ├── AuthContext.js          # Authentication context
│   │   └── CartContext.js          # Shopping cart context
│   ├── lib/                        # Utilities and configs
│   │   ├── database.js             # MongoDB connection
│   │   ├── auth.js                 # JWT authentication
│   │   ├── apiResponse.js          # API response helpers
│   │   ├── validation.js           # Input validation
│   │   ├── cloudinary.js           # Cloudinary config
│   │   └── swagger.js              # Swagger configuration
│   ├── models/                     # Mongoose models
│   │   ├── User.js                 # User model
│   │   ├── Product.js              # Product model
│   │   └── Order.js                # Order model
│   └── services/                   # External services
│       ├── aiService.js            # Google Gemini AI
│       └── midtransService.js      # Midtrans payment
├── scripts/                        # Database seeding scripts
│   └── seed.js                     # Seed products
├── postman/                        # Postman collection
├── .env.example                    # Environment variables template
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS config
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Installation

### Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account (for cloud database)
- Cloudinary account (for image storage)
- Midtrans account (for payment gateway)
- Google AI API key (for chatbot)

### 1. Clone and Install

```powershell
cd final-project-health-ecommerce
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health-ecommerce

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Google Gemini AI
GOOGLE_AI_API_KEY=AIza...your-key-here

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_IS_PRODUCTION=false

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Next.js Public Variables
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
```

### 3. Get API Keys

#### MongoDB Atlas

1. Visit https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Replace `<username>` and `<password>` in connection string

#### Cloudinary

1. Sign up at https://cloudinary.com/
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

#### Midtrans (Payment)

1. Register at https://dashboard.sandbox.midtrans.com/
2. Go to Settings → Access Keys
3. Copy Server Key and Client Key

#### Google Gemini AI

1. Visit https://ai.google.dev/
2. Get API key
3. Enable Gemini API

### 4. Seed Database (Optional)

```powershell
npm run seed
```

### 5. Run Development Server

```powershell
npm run dev
```

Open http://localhost:3000

## API Endpoints

### Authentication

```
POST   /api/auth/register    # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/profile      # Get user profile (protected)
PUT    /api/auth/profile      # Update profile (protected)
```

### Products

```
GET    /api/products          # Get all products (with filters)
POST   /api/products          # Create product (admin only)
GET    /api/products/[id]     # Get product by ID
PUT    /api/products/[id]     # Update product (admin only)
DELETE /api/products/[id]     # Delete product (admin only)
```

### Cart

```
GET    /api/cart              # Get user cart
POST   /api/cart              # Add item to cart
PUT    /api/cart/[productId]  # Update cart item quantity
DELETE /api/cart/[productId]  # Remove item from cart
```

### Orders

```
GET    /api/orders            # Get user orders
GET    /api/orders/[orderId]  # Get order detail
```

### External Integrations

```
POST   /api/external/ai/ask           # AI chatbot
POST   /api/external/payment/create   # Create payment
POST   /api/external/payment/webhook  # Payment webhook
```

### Other

```
GET    /api/health            # Health check
POST   /api/upload            # Upload image to Cloudinary
```

## API Documentation

Access Swagger UI documentation at:

```
http://localhost:3000/api-docs
```

## Testing with Postman

Import the Postman collection from `postman/Health-E-Commerce-API.postman_collection.json`

**Quick Test Flow:**

1. Register user → Token auto-saved
2. Login → Get auth token
3. Get products → Browse products
4. Add to cart → Add items
5. Create payment → Get Midtrans token
6. Complete payment → Update order status

## Deployment to Vercel

### 1. Push to GitHub

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/health-ecommerce.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com/
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add all variables from `.env.local`:

```
MONGODB_URI
JWT_SECRET
GOOGLE_AI_API_KEY
MIDTRANS_SERVER_KEY
MIDTRANS_CLIENT_KEY
MIDTRANS_IS_PRODUCTION
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_API_URL (set to your Vercel URL)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
```

### 4. Deploy

Click "Deploy" and wait for build to complete.

## Default Users

After seeding, default admin account:

```
Email: admin@example.com
Password: Admin123!
Role: admin
```

Default user account:

```
Email: user@example.com
Password: User123!
Role: user
```

## Tech Stack

**Frontend:**

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Ant Design
- React Query

**Backend (API Routes):**

- Next.js API Routes
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt

**External Services:**

- Google Gemini AI (Chatbot)
- Midtrans (Payment)
- Cloudinary (Images)

## Features Breakdown

### 1. Authentication System

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access (user/admin)

### 2. Product Management

- CRUD operations
- Image upload to Cloudinary
- Category filtering
- Search functionality
- Pagination

### 3. Shopping Cart

- Add/remove items
- Update quantities
- Persistent cart with user
- Real-time price calculation

### 4. Payment Integration

- Midtrans Snap payment
- Multiple payment methods
- Webhook for status updates
- Order tracking

### 5. AI Chatbot

- Google Gemini integration
- Health product recommendations
- Natural language processing
- Context-aware responses

## Troubleshooting

### MongoDB Connection Error

```
Error: MONGODB_URI is not defined
```

**Solution:** Ensure `.env.local` exists and `MONGODB_URI` is set

### Midtrans Payment Error

```
Error: Midtrans authentication failed
```

**Solution:** Check `MIDTRANS_SERVER_KEY` in `.env.local`

### Image Upload Error

```
Error: Cloudinary configuration error
```

**Solution:** Verify all Cloudinary credentials in `.env.local`

### AI Chatbot Not Working

```
Error: AI service not configured
```

**Solution:** Add valid `GOOGLE_AI_API_KEY` to `.env.local`

## Support

For issues and questions:

- Create an issue on GitHub
- Email: support@healthcommerce.com

## License

MIT License - feel free to use for learning and commercial projects

## Contributors

- Pusbang Talenta Digital

---

Built with Next.js
