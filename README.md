# fuel-pass-frontend

A modern, responsive Next.js frontend application for managing fuel orders in aviation operations. Built with TypeScript, Tailwind CSS, and state-of-the-art development practices.
🚀 Features
Role-Based Access Control: Separate interfaces for Aircraft Operators and Operations Managers
Real-time Order Management: Create, view, and update fuel orders with live status tracking
Responsive Design: Mobile-first approach with Tailwind CSS
Type Safety: Full TypeScript implementation with Zod validation
State Management: Zustand for efficient client-side state management
Authentication: JWT-based authentication with HTTP-only cookies
Toast Notifications: User-friendly feedback with react-hot-toast
Form Validation: Comprehensive form validation with react-hook-form and Zod
🛠️ Tech Stack
Framework: Next.js 15.5.3 (App Router)
Language: TypeScript
Styling: Tailwind CSS
State Management: Zustand
Form Handling: React Hook Form + Zod
HTTP Client: Axios
Icons: Lucide React
Notifications: React Hot Toast
Date Handling: date-fns
📋 Prerequisites
Before you begin, ensure you have the following installed:
Node.js (v18.0 or higher)
npm (v8.0 or higher) or yarn
Git
🚀 Getting Started
1. Clone the Repository
   
   git clone https://github.com/ZaidSultan10/fuel-pass-frontend.git
   cd fuel-pass-frontend
   
3. Install Dependencies

   npm install --legacy-peer-deps
   
5. Environment Configuration
Create a .env.local file in the root directory:

7. Start the Development Server
The application will be available at http://localhost:3000
8. Build for Production
📁 Project Structure
�� Authentication & Authorization
The application supports two user roles:
Aircraft Operator
Submit new fuel orders
View their own orders
Limited to order creation functionality
Operations Manager
View all fuel orders
Update order statuses
Access dashboard with statistics
Filter and search orders
📱 User Interface
Dashboard
Statistics Cards: Total orders, pending, confirmed, and completed orders
Recent Orders: Latest 5 orders with quick actions
Role-based Access: Different views based on user permissions
Order Management
Order Form: Comprehensive form for creating new fuel orders
Order List: Paginated list with filtering and search capabilities
Order Details: Detailed view with status update functionality
Responsive Design
Mobile-first approach
Tablet and desktop optimized
Touch-friendly interface
🔧 API Integration
The frontend integrates with a Spring Boot backend:
Base URL: http://localhost:8080
Authentication: JWT tokens with HTTP-only cookies
Endpoints: RESTful API for all operations
Error Handling: Comprehensive error handling with user feedback
🎨 Styling & Theming
Tailwind CSS: Utility-first CSS framework
Custom Components: Reusable UI components
Responsive Design: Mobile-first responsive layout
Dark Mode Ready: Prepared for dark mode implementation
📊 State Management
Auth Store (Zustand)
User authentication state
Login/logout functionality
Role-based access control
Persistent storage
Fuel Order Store (Zustand)
Order data management
CRUD operations
Filtering and pagination
Statistics tracking
🧪 Development
Available Scripts
Code Quality
ESLint: Code linting and style enforcement
TypeScript: Static type checking
Prettier: Code formatting
Husky: Git hooks for quality assurance
�� Deployment
Vercel (Recommended)
Connect your GitHub repository to Vercel
Configure environment variables
Deploy automatically on push to main branch
Other Platforms
The application can be deployed to any platform that supports Next.js:
Netlify
AWS Amplify
Railway
DigitalOcean App Platform
🔧 Configuration
Environment Variables
Variable	Description	Default
NEXT_PUBLIC_API_URL	Backend API URL	http://localhost:8080
PORT	Development server port	3000
Next.js Configuration
The project uses Next.js 15.5.3 with:
App Router (recommended)
Turbopack for faster development
TypeScript support
Tailwind CSS integration
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
🆘 Support
If you encounter any issues or have questions:
Check the Issues page
Create a new issue with detailed information
Contact the development team
🔄 Backend Integration
This frontend is designed to work with a Spring Boot backend. Ensure the backend is running on the configured API URL before starting the frontend.
Backend Requirements
Spring Boot 3.x
PostgreSQL database
JWT authentication
CORS configuration for frontend domain
📈 Performance
Lazy Loading: Components and routes are lazy-loaded
Image Optimization: Next.js automatic image optimization
Code Splitting: Automatic code splitting for optimal bundle sizes
Caching: Efficient caching strategies for API calls
�� Security
HTTP-Only Cookies: Secure token storage
CORS Configuration: Proper cross-origin resource sharing
Input Validation: Client and server-side validation
XSS Protection: Built-in Next.js security features
Built with ❤️ using Next.js and modern web technologies
