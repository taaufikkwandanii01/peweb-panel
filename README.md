# Admin Panel - Next.js Application

Modern, responsive, and feature-rich admin panel built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- ✅ **Authentication System**
  - Login with role selection (Admin/Developer)
  - Register with password strength validation
  - Password reset functionality
  - Form validation and error handling

- ✅ **Dashboard Views**
  - Admin Dashboard with statistics and activity tracking
  - Developer Dashboard with project management
  - Responsive grid layouts
  - Real-time data visualization

- ✅ **User Management**
  - Complete CRUD operations
  - Advanced filtering and search
  - Bulk actions support
  - Pagination
  - Role-based access control

- ✅ **Profile Management**
  - Editable user profiles
  - Password change functionality
  - Avatar management
  - Social links integration

- ✅ **UI Components**
  - Reusable Button component with variants
  - Input component with validation
  - CardResetPassword for password recovery
  - Responsive Navbar with notifications
  - Collapsible Sidebar
  - Professional Footer

- ✅ **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimized
  - Touch-friendly interfaces
  - Smooth animations and transitions

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── users/
│   ├── developer/
│   │   ├── dashboard/
│   │   └── profile/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── fragments/
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── layouts/
│   │   └── MainLayouts.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── CardResetPassword.tsx
│   └── views/
│       ├── Admin/
│       ├── Developer/
│       └── Auth/
└── (context, lib, utils folders for future expansion)
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (useState, useEffect)
- **Routing:** Next.js Navigation
- **Icons:** SVG (Heroicons style)

## 📦 Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Component Usage

### Button Component

```tsx
import Button from '@/components/ui/Button';

<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `fullWidth`: boolean

### Input Component

```tsx
import Input from '@/components/ui/Input';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Error message"
  required
  fullWidth
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `fullWidth`: boolean

### CardResetPassword Component

```tsx
import CardResetPassword from '@/components/ui/CardResetPassword';

<CardResetPassword
  onSubmit={async (email) => {
    // Handle password reset
  }}
  onCancel={() => {
    // Handle cancel
  }}
/>
```

## 🎯 Key Features Implementation

### Role-Based Authentication

The login page includes role selection between Admin and Developer:
- Different dashboards for each role
- Role-specific navigation items
- Conditional rendering based on user role

### Responsive Design

- Mobile: Single column layout, hamburger menu
- Tablet: 2-column grid, collapsible sidebar
- Desktop: Multi-column layout, persistent sidebar

### Form Validation

All forms include:
- Real-time validation
- Error messages
- Success feedback
- Loading states

### Table with Advanced Features

Users table includes:
- Search functionality
- Multiple filters (role, status)
- Sorting capabilities
- Bulk selection
- Pagination
- Action buttons (view, edit, delete)

## 🎨 Customization

### Colors

Update Tailwind colors in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... add more shades
        }
      }
    }
  }
}
```

### Components

All components are fully customizable through props and className overrides.

## 📱 Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔐 Security Best Practices

- Password strength validation
- Input sanitization
- Protected routes (ready for implementation)
- CSRF protection ready
- Secure password handling

## 🚀 Production Build

```bash
npm run build
npm start
```

## 📝 Future Enhancements

- [ ] Add authentication with JWT
- [ ] Implement real API integration
- [ ] Add state management (Redux/Zustand)
- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics
- [ ] Real-time notifications
- [ ] File upload functionality
- [ ] Export to PDF/Excel

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by Your Team

---

**Note:** This is a frontend template. For production use, implement proper backend authentication and API integration.
