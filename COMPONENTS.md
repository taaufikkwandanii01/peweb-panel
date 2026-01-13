# Components Documentation

## UI Components

### Button Component

A versatile button component with multiple variants, sizes, and states.

#### Import
```tsx
import Button from '@/components/ui/Button';
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'danger' \| 'success' \| 'outline' | 'primary' | Button style variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| isLoading | boolean | false | Shows loading spinner |
| fullWidth | boolean | false | Makes button full width |
| disabled | boolean | false | Disables the button |
| children | ReactNode | required | Button content |

#### Examples

```tsx
// Primary button
<Button variant="primary" size="md">
  Save Changes
</Button>

// Loading button
<Button variant="primary" isLoading={true}>
  Submitting...
</Button>

// Full width button
<Button variant="success" fullWidth>
  Create Account
</Button>

// Outline button
<Button variant="outline" size="sm">
  Cancel
</Button>
```

---

### Input Component

A comprehensive input component with validation, icons, and password visibility toggle.

#### Import
```tsx
import Input from '@/components/ui/Input';
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Input label |
| error | string | - | Error message to display |
| helperText | string | - | Helper text below input |
| leftIcon | ReactNode | - | Icon on the left side |
| rightIcon | ReactNode | - | Icon on the right side |
| fullWidth | boolean | false | Makes input full width |
| type | string | 'text' | Input type (text, email, password, etc.) |

#### Examples

```tsx
// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
/>

// Input with error
<Input
  label="Username"
  error="Username is required"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// Password input with icon
<Input
  label="Password"
  type="password"
  leftIcon={<LockIcon />}
  helperText="Must be at least 8 characters"
/>

// Input with left icon
<Input
  label="Search"
  placeholder="Search users..."
  leftIcon={
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  }
/>
```

---

### CardResetPassword Component

A complete password reset card with email validation and success state.

#### Import
```tsx
import CardResetPassword from '@/components/ui/CardResetPassword';
```

#### Props
| Prop | Type | Description |
|------|------|-------------|
| onSubmit | (email: string) => Promise<void> | Function called when form is submitted |
| onCancel | () => void | Optional function called when cancel is clicked |

#### Example

```tsx
<CardResetPassword
  onSubmit={async (email) => {
    // Call your API to send reset email
    await sendPasswordResetEmail(email);
  }}
  onCancel={() => {
    // Navigate back to login
    router.push('/auth/login');
  }}
/>
```

---

## Layout Components

### Navbar Component

Top navigation bar with user profile, notifications, and role indicator.

#### Import
```tsx
import Navbar from '@/components/fragments/Navbar';
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| userRole | 'admin' \| 'developer' | 'admin' | Current user role |
| userName | string | 'User' | User's display name |
| onLogout | () => void | - | Logout handler function |
| onToggleSidebar | () => void | - | Sidebar toggle handler |

#### Example

```tsx
<Navbar
  userRole="admin"
  userName="John Doe"
  onLogout={() => {
    // Handle logout
    router.push('/auth/login');
  }}
  onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
/>
```

---

### Sidebar Component

Collapsible sidebar navigation with role-based menu items.

#### Import
```tsx
import Sidebar from '@/components/fragments/Sidebar';
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| userRole | 'admin' \| 'developer' | required | Current user role |
| isOpen | boolean | true | Sidebar open state |
| onClose | () => void | - | Close handler for mobile |

#### Example

```tsx
<Sidebar
  userRole="admin"
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
/>
```

---

### Footer Component

Application footer with links and social media icons.

#### Import
```tsx
import Footer from '@/components/fragments/Footer';
```

#### Example

```tsx
<Footer />
```

---

### MainLayouts Component

Complete page layout combining Navbar, Sidebar, and Footer.

#### Import
```tsx
import MainLayouts from '@/components/layouts/MainLayouts';
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Page content |
| userRole | 'admin' \| 'developer' | required | Current user role |
| userName | string | 'User' | User's display name |
| showSidebar | boolean | true | Show/hide sidebar |
| showFooter | boolean | true | Show/hide footer |

#### Example

```tsx
<MainLayouts userRole="admin" userName="John Doe">
  <YourPageContent />
</MainLayouts>
```

---

## View Components

### Login View

Complete login page with role selection and form validation.

#### Import
```tsx
import LoginView from '@/components/views/Auth/Login';
```

#### Features
- Role selection (Admin/Developer)
- Email and password validation
- Remember me checkbox
- Password reset link
- Loading states

---

### Register View

Registration page with password strength indicator.

#### Import
```tsx
import RegisterView from '@/components/views/Auth/Register';
```

#### Features
- Role selection
- Password strength validation
- Confirm password validation
- Terms and conditions checkbox
- Real-time validation

---

### Dashboard Views

#### Admin Dashboard
```tsx
import AdminDashboard from '@/components/views/Admin/Dashboard/Index';
```

#### Developer Dashboard
```tsx
import DeveloperDashboard from '@/components/views/Developer/Dashboard/Index';
```

---

### Profile Views

#### Admin Profile
```tsx
import AdminProfile from '@/components/views/Admin/Profile/Index';
```

#### Developer Profile
```tsx
import DeveloperProfile from '@/components/views/Developer/Profile/Index';
```

---

### Users Table

Complete user management with filtering and pagination.

#### Import
```tsx
import AdminUsers from '@/components/views/Admin/Users/Index';
```

#### Features
- Search by name or email
- Filter by role and status
- Bulk selection and actions
- Pagination
- Edit, view, delete actions
- Responsive table design

---

## Styling Guidelines

### Tailwind CSS Classes

Common utility classes used in this project:

```tsx
// Colors
bg-blue-600    // Primary button background
text-gray-900  // Primary text color
border-gray-300 // Border color

// Spacing
px-4 py-2      // Padding horizontal & vertical
mb-4           // Margin bottom
gap-4          // Gap between flex items

// Responsive
sm:text-lg     // Small screens and up
md:grid-cols-2 // Medium screens and up
lg:px-8        // Large screens and up

// States
hover:bg-blue-700
focus:ring-2
active:bg-blue-800
disabled:opacity-50
```

### Custom Animations

```tsx
// Fade in
className="animate-fade-in"

// Slide in
className="animate-slide-in"

// Spin (loading)
className="animate-spin"
```

---

## Best Practices

1. **Component Structure**
   - Keep components small and focused
   - Use TypeScript interfaces for props
   - Add proper prop validation

2. **Styling**
   - Use Tailwind utility classes
   - Maintain consistent spacing
   - Follow mobile-first approach

3. **State Management**
   - Use useState for local state
   - Consider context for global state
   - Keep state close to where it's used

4. **Performance**
   - Use React.memo for expensive components
   - Implement proper loading states
   - Optimize images and assets

5. **Accessibility**
   - Add proper ARIA labels
   - Ensure keyboard navigation
   - Maintain color contrast ratios

---

## Common Patterns

### Form Handling

```tsx
const [formData, setFormData] = useState({
  email: '',
  password: '',
});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form submission
};
```

### Error Handling

```tsx
const [error, setError] = useState('');

try {
  // API call
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}
```

### Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await performAction();
  } finally {
    setIsLoading(false);
  }
};
```

---

For more examples and usage, check the actual component implementations in the `src/components` directory.
