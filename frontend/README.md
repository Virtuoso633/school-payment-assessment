# School Payment Assessment Frontend

This project is the frontend for the School Payment Assessment system, built with [Create React App](https://github.com/facebook/create-react-app).

## Live Demo

[Frontend on Vercel](https://your-vercel-app-url.vercel.app)  
[Backend API](https://35.154.69.40)

---

## Project Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Virtuoso633/school-payment-assessment.git
   cd school-payment-assessment/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the `frontend` directory:

   ```
   API_URL=https://35.154.69.40
   ```

4. **Run the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Pages & Functionality

### 1. **Login/Register**
- **Path:** `/login`, `/register`
- **Function:** User authentication using JWT. Required for accessing payment and transaction features.

### 2. **Dashboard**
- **Path:** `/dashboard`
- **Function:** Overview of recent transactions and quick links to create payments or view transaction history.

### 3. **Create Payment**
- **Path:** `/dashboard/create-payment`
- **Function:**  
  - Enter `school_id`, student name, student ID, student email, and amount.
  - The `callback_url` is set by default.
  - On submit, creates a new payment and redirects to the payment gateway.

### 4. **Transactions List**
- **Path:** `/dashboard/transactions`
- **Function:**  
  - View all transactions.
  - Filter by status, school, date range, and search by order ID.
  - Sort by any column.
  - Pagination supported.

### 5. **School Transactions**
- **Path:** `/dashboard/transactions/school`
- **Function:**  
  - Select a school by `school_id` to view transactions for that school.
  - Same filtering and sorting as the main transactions page.

### 6. **Transaction Details**
- **Path:** `/dashboard/transaction/:order_id`
- **Function:**  
  - View detailed information about a specific transaction.

---

## Screenshots

> _Add screenshots of each main page here for clarity._

- **Login Page:**  
  ![Login Screenshot](screenshots/login.png)

- **Dashboard:**  
  ![Dashboard Screenshot](screenshots/dashboard.png)

- **Create Payment:**  
  ![Create Payment Screenshot](screenshots/create-payment.png)

- **Transactions List:**  
  ![Transactions Screenshot](screenshots/transactions.png)

---

## API Integration

- All API requests are made to the backend at:  
  `https://35.154.69.40`
- See the [backend README](../backend/README.md) for full API documentation.

---

## Deployment

This app is deployed on Vercel:  
[https://your-vercel-app-url.vercel.app](https://your-vercel-app-url.vercel.app)

---

## License

MIT
