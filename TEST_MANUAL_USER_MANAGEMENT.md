# 🧪 Test Plan - Admin User Management

## Environment Setup

**Current Status**:
- ✅ Dev server running: `http://localhost:3000`
- ✅ Firebase connected to project: `almacenmercedes-461d2`
- ✅ Security rules deployed
- ✅ Components compiled without errors

## Test Scenarios

### Test 1: User Creation - Basic Flow ✅ (Ready)

**Prerequisites**:
- Admin logged in at `http://localhost:3000/admin/dashboard`
- UserManagement component visible with existing users table

**Steps**:
1. Click "Nuevo Usuario" button
2. Enter email: `testuser1@gmail.com`
3. Enter password: `password123`
4. Select role: "Despacho"
5. Click "Crear Usuario"

**Expected Results**:
- ✅ Success message appears: "✅ Usuario creado exitosamente"
- ✅ Form clears and closes
- ✅ Admin remains on dashboard (NO redirect to login)
- ✅ New user appears in table with:
  - Email: testuser1@gmail.com
  - Role: Despacho (blue badge)
  - Estado: Activo (green badge)
  - Creado: Today's date
  - Delete button available

**What This Verifies**:
- Firebase Auth user creation works
- Role data saves to Realtime Database
- Security rules allow admin to read `/users`
- Admin session persists after creating user

---

### Test 2: Admin Role Creation

**Prerequisites**:
- Admin logged in and previous user (testuser1@gmail.com) visible

**Steps**:
1. Click "Nuevo Usuario" button
2. Enter email: `adminuser2@gmail.com`
3. Enter password: `password456`
4. Select role: "Administrador"
5. Click "Crear Usuario"

**Expected Results**:
- ✅ New admin user appears in table
- ✅ Role shown as "Administrador" (red badge)
- ✅ Admin user can create other users (future test)

**What This Verifies**:
- Both roles can be created
- Role selection works correctly

---

### Test 3: Validation - Duplicate Email

**Prerequisites**:
- At least one user exists (testuser1@gmail.com)

**Steps**:
1. Click "Nuevo Usuario"
2. Enter email: `testuser1@gmail.com` (existing)
3. Enter password: `password789`
4. Click "Crear Usuario"

**Expected Results**:
- ✅ Error message: "❌ El email ya está registrado"
- ✅ User NOT created
- ✅ Table count remains same

**What This Verifies**:
- Firebase Auth prevents duplicate emails
- Error handling works correctly

---

### Test 4: Validation - Weak Password

**Prerequisites**:
- Admin on user creation form

**Steps**:
1. Enter email: `weakpass@gmail.com`
2. Enter password: `123` (less than 6 characters)
3. Click "Crear Usuario"

**Expected Results**:
- ✅ Error message: "❌ La contraseña es muy débil"
- ✅ User NOT created

**What This Verifies**:
- Firebase Auth password validation
- Error messages display properly

---

### Test 5: User Deletion

**Prerequisites**:
- At least one test user exists (not admin users)
- Current count shows in header

**Steps**:
1. Find a test user in table (e.g., testuser1@gmail.com)
2. Click the red trash icon in "Acciones" column
3. Confirm deletion if prompted

**Expected Results**:
- ✅ User removed from table
- ✅ Count decreases by 1
- ✅ Message indicates successful deletion
- ✅ Admin remains logged in

**What This Verifies**:
- User deletion works
- Table updates in real-time

---

### Test 6: Form Cancellation

**Prerequisites**:
- Admin on dashboard

**Steps**:
1. Click "Nuevo Usuario"
2. Fill some fields
3. Click "Cancelar"

**Expected Results**:
- ✅ Form closes
- ✅ Form data clears
- ✅ No new user created

**What This Verifies**:
- Cancel button works
- Form properly resets

---

### Test 7: Tab Navigation

**Prerequisites**:
- Admin on dashboard with users tab active

**Steps**:
1. Click "📦 Inventario" tab
2. Verify inventory section loads
3. Click "Usuarios" tab again
4. Verify users section loads

**Expected Results**:
- ✅ Tab switching works smoothly
- ✅ Both sections render correctly
- ✅ No data loss

**What This Verifies**:
- Tab navigation component works
- Content switches properly

---

## Integration Tests

### Test 8: New User Login ✅ (Verify After Creation)

**Prerequisites**:
- A test user has been created (e.g., testuser1@gmail.com / password123)

**Steps**:
1. Logout from admin account
2. Navigate to `http://localhost:3000/login`
3. Enter email: `testuser1@gmail.com`
4. Enter password: `password123`
5. Click "Iniciar Sesión"

**Expected Results**:
- ✅ User logs in successfully
- ✅ Redirect to appropriate dashboard based on role
- ✅ User role loads correctly

**What This Verifies**:
- Newly created users can authenticate
- Role system works end-to-end
- Login flow recognizes new users

---

### Test 9: Dispatch User Permissions ✅ (Verify Role)

**Prerequisites**:
- Logged in as a "Despacho" role user

**Steps**:
1. Look for User Management tab/section
2. Try to access `http://localhost:3000/admin/dashboard`

**Expected Results**:
- ✅ User cannot access admin dashboard
- ✅ Dispatch users don't see User Management section
- ✅ Appropriate permission denied message (if applicable)

**What This Verifies**:
- Role-based access control works
- Dispatch users can't manage other users

---

## Manual Testing Checklist

```
DATABASE & RULES:
- [ ] Firebase rules deployed successfully
- [ ] Database shows /users path with created users
- [ ] Admin role visible in database for each user
- [ ] Email and createdAt fields present

UI COMPONENTS:
- [ ] "Nuevo Usuario" button visible and clickable
- [ ] Form appears when button clicked
- [ ] All form inputs render (email, password, role)
- [ ] Form buttons work (Crear Usuario, Cancelar)
- [ ] Users table displays with all columns
- [ ] Table shows count of registered users
- [ ] Role badges show correct colors (Admin=red, Despacho=blue)
- [ ] Status badges show as green (Activo)
- [ ] Delete buttons visible for each user
- [ ] Tab navigation works

DATA FLOW:
- [ ] Creating user -> appears in table immediately
- [ ] No redirect to login after user creation
- [ ] Admin stays logged in after creating users
- [ ] Form clears after successful creation
- [ ] Success message displays
- [ ] Error messages display for invalid inputs
- [ ] User count updates correctly

AUTHENTICATION:
- [ ] Newly created users can login
- [ ] Passwords work correctly
- [ ] Wrong credentials rejected
- [ ] User roles load after login
```

## Browser Console Checks

When testing, check browser DevTools console for:

✅ **Good Signs**:
```
[AuthContext] Setting up onAuthStateChanged listener
[AuthContext] onAuthStateChanged callback: [user object]
[AuthContext] Getting role for user: [uid]
[AuthContext] Role received: admin/dispatch
Error cargando usuarios: (should NOT appear after fixes)
```

❌ **Problems** (Should NOT See):
```
Permission denied (means rules not deployed)
"Unexpected JSX syntax" errors
"Adjacent JSX elements must be wrapped" errors
```

## Performance Metrics

**Expected**:
- User creation: < 2 seconds
- Table update: < 1 second
- Tab switching: Instant (no reload)
- Form load: < 500ms

## Cleanup After Testing

To clean up test users:
1. Stay logged in as admin
2. Delete each test user created during testing
3. Verify count decreases
4. No cleanup needed in database (Firebase handles cascade)

---

## Success Criteria ✅

The implementation is working correctly if:

1. ✅ Admin creates a new user → User appears in table
2. ✅ Admin stays on dashboard → No login redirect
3. ✅ Both roles work → Admin and Dispatch can be selected
4. ✅ New users can login → Created users authenticate
5. ✅ Errors handled → Duplicate emails and weak passwords rejected
6. ✅ UI is professional → Styling and layout look polished
7. ✅ Security rules work → Only admins can read /users path

---

**Test Status**: 🟢 Ready for Manual Testing  
**Last Updated**: October 16, 2026  
**Next Phase**: Deploy to Netlify
