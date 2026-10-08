# HandyHub — API Endpoints

Base URL: `/api/v1`

These routes are mounted in `src/app.ts` and each one has a controller and service handler.

---

## Health

| Method | Path | Who can call it |
|---|---|---|
| GET | `/` | Public |

---

## Auth — `/api/v1/auth`

| Method | Path | Who can call it |
|---|---|---|
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/verify-email` | Public |
| POST | `/api/v1/auth/login` | Public |
| GET | `/api/v1/auth/me` | Customer, technician, admin |
| POST | `/api/v1/auth/refresh-token` | Cookie |
| POST | `/api/v1/auth/logout` | Public |
| POST | `/api/v1/auth/forgot-password` | Public |
| POST | `/api/v1/auth/reset-password` | Public |
| POST | `/api/v1/auth/google` | Public |

---

## Users — `/api/v1/users`

| Method | Path | Who can call it |
|---|---|---|
| PATCH | `/api/v1/users/profile-image` | Logged-in user + file |

---

## Appointments — `/api/v1/appointment`

| Method | Path | Who can call it |
|---|---|---|
| POST | `/api/v1/appointment/book-appointment` | Customer |
| POST | `/api/v1/appointment/pay-appointment` | Customer |
| POST | `/api/v1/appointment/cancel-appointment` | Customer, admin |
| GET | `/api/v1/appointment/book-appointment/payment/callback` | bKash redirect |
| PATCH | `/api/v1/appointment/update-status/:appointmentId` | Technician |
| GET | `/api/v1/appointment/my-appointments` | Customer |
| GET | `/api/v1/appointment/doctor-appointments` | Technician |
| GET | `/api/v1/appointment/all-appointments` | Admin |
| GET | `/api/v1/appointment/:appointmentId` | Customer, technician, admin |

---

## Technician — `/api/v1/techinician`

| Method | Path | Who can call it |
|---|---|---|
| POST | `/api/v1/techinician/apply-as-techinician` | Public (multipart) |
| POST | `/api/v1/techinician/apply-as-techinician/verify-email` | Public |
| POST | `/api/v1/techinician/approve-techinician` | Admin |
| GET | `/api/v1/techinician/all-techinician` | Admin |

---

## Schedule — `/api/v1/schedule`

| Method | Path | Who can call it |
|---|---|---|
| POST | `/api/v1/schedule/create-schedule` | Technician |
| GET | `/api/v1/schedule/my-schedules` | Technician |
| GET | `/api/v1/schedule/all-schedules` | Admin |
| GET | `/api/v1/schedule/todays-schedule` | Public |
| PATCH | `/api/v1/schedule/update-schedule/:scheduleId` | Technician |
| PATCH | `/api/v1/schedule/publish-schedule/:scheduleId` | Technician |
| GET | `/api/v1/schedule/:scheduleId` | Technician, admin |
| DELETE | `/api/v1/schedule/:scheduleId` | Technician |

---

## Analytics — `/api/v1/analytics`

| Method | Path | Who can call it |
|---|---|---|
| GET | `/api/v1/analytics/customer-analytics` | Customer |
| GET | `/api/v1/analytics/techician-analytics` | Technician |
| GET | `/api/v1/analytics/admin-analytics` | Admin |
