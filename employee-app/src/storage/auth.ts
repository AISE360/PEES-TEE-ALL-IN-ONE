// Simple in-memory auth store for Employee App demo
// Persists across screens without AsyncStorage — reset on app restart

export type AuthUser = {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  phone: string;
};

// Demo user roster — mirrors mockDB seed
const DEMO_USERS: Record<string, AuthUser> = {
  "EMP00001": { id: "u_admin",      name: "Admin",         role: "ADMIN",      employeeId: "EMP00001", phone: "9999999999" },
  "EMP00125": { id: "u_hr",         name: "Rajesh Kumar",  role: "HR",         employeeId: "EMP00125", phone: "8888888888" },
  "EMP00126": { id: "u_supervisor", name: "Priya Nair",    role: "SUPERVISOR", employeeId: "EMP00126", phone: "7777777777" },
  "9999999999": { id: "u_admin",    name: "Admin",         role: "ADMIN",      employeeId: "EMP00001", phone: "9999999999" },
  "8888888888": { id: "u_hr",       name: "Rajesh Kumar",  role: "HR",         employeeId: "EMP00125", phone: "8888888888" },
  "7777777777": { id: "u_supervisor", name: "Priya Nair",  role: "SUPERVISOR", employeeId: "EMP00126", phone: "7777777777" },
};

let _currentUser: AuthUser | null = null;

/** Attempt login — returns user if credentials match demo roster, null otherwise */
export function attemptLogin(identifier: string, password: string): AuthUser | null {
  const clean = identifier.trim();
  const user = DEMO_USERS[clean];
  if (!user) return null;
  if (password !== "password123" && password !== "demo123") return null;
  return user;
}

/** Set the current session user after MFA verification */
export function setCurrentUser(user: AuthUser): void {
  _currentUser = user;
}

/** Get the currently logged-in user */
export function getCurrentUser(): AuthUser | null {
  return _currentUser;
}

/** Clear session on logout */
export function clearSession(): void {
  _currentUser = null;
}
