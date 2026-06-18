## TODO — Login/Logout timestamps in `users` table (same user table)

### Step 1: Backend model updates
- [ ] Update `EmployeeManagmentSystem/src/main/java/model/User.java` to add:
  - `lastLogin` mapped to `last_login`
  - `lastLogout` mapped to `last_logout`

### Step 2: Backend login updates
- [ ] Update `EmployeeManagmentSystem/src/main/java/service/AuthService.java` so on successful login it sets `user.lastLogin = now` and saves the user.

### Step 3: Add logout endpoint
- [ ] Add `POST /api/auth/logout` endpoint in `EmployeeManagmentSystem/src/main/java/controller/AuthController.java`.
- [ ] Implement logic in `AuthService` to set `lastLogout = now` for the authenticated user (using token-derived `userId` from `SecurityContext`).

### Step 4: Ensure auth-protection in security config
- [ ] Confirm `/api/auth/logout` is **not** in `permitAll` and is handled by `.anyRequest().authenticated()`.

### Step 5: Frontend logout updates
- [ ] Update the frontend logout function (currently only clears localStorage in `frontend/src/lib/auth.js`) to also call `POST /api/auth/logout` before clearing.

### Step 6: Test
- [ ] Run backend; perform login; verify DB columns updated.
- [ ] Trigger logout; verify `last_logout` updated.
