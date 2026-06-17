# TODO - Add JWT (Approach A: custom JWT + Spring Security filter)

- [x] Update backend dependencies in `EmployeeManagmentSystem/build.gradle` (jjwt + Spring Security web)
- [x] Add JWT settings to `EmployeeManagmentSystem/src/main/resources/application.properties`
- [x] Create `JwtService` (generate/validate token)
- [x] Create `JwtAuthFilter` (reads `Authorization: Bearer ...`)
- [x] Create `SecurityConfig` (permit auth endpoints, require JWT for others)

- [ ] Update `AuthService.login` to generate token
- [ ] Update `AuthController.login` to return `token`
- [ ] Update frontend `frontend/src/lib/auth.js` to store/get token
- [ ] Update frontend `frontend/src/api/client.js` to attach `Authorization` header
- [ ] Update `frontend/src/pages/Login.jsx` to save token from login response
- [ ] Ensure `ProtectedRoute.jsx` uses token-based `isAuthenticated()`
- [x] Run backend build/test (gradle)

- [x] Validate end-to-end: login -> token stored -> protected API succeeds with header

