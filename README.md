# 🏥 PharmaCare Inventory System

A smart, modern, and intuitive inventory management dashboard built specifically for pharmacies to prevent stockouts, manage expiry dates, and handle emergency medicine requests.

---

## 🛑 Problem Statement (PS)
Small to medium-sized pharmacies face significant challenges in managing their daily inventory:
1. **Financial Loss from Expired Stock:** Medicines often expire unnoticed on the shelves, leading to direct financial losses and potential regulatory issues.
2. **Critical Stockouts:** Running out of life-saving or fast-moving medicines means turning patients away and losing revenue.
3. **Emergency Sourcing:** When a pharmacy runs out of a critical drug, pharmacists waste time calling nearby competitors to borrow stock. There is no unified way to request emergency supplies instantly.

## 💡 Proposed Solution
**PharmaCare Inventory** is a specialized SaaS dashboard that modernizes pharmacy operations:
- **Proactive Alerts:** Automatically flags low-stock items and medicines expiring within 30 days.
- **Visual Analytics:** Provides an instant overview of the pharmacy's health through interactive charts (Inventory Status & Weekly Activity).
- **Emergency Community Network:** A built-in feature that locates nearby peer pharmacies and allows the user to send instant, itemized emergency medicine requests when stock critically runs out.

---

## ✨ Key Features
- **📊 Real-time Dashboard:** View Total Medicines, Inventory Value, Low Stock, and Expired counts at a glance. Visualized with `Recharts`.
- **🚨 Emergency Nearby Requests:** Locate nearby pharmacies within a 2km radius and send itemized requests (Medicine Name, Quantity) for emergency stock.
- **📅 Expiry Tracker:** Automatically categorizes medicines into "Safe", "Expiring Soon", and "Expired" with dynamic color-coding.
- **📦 Low Stock & Supplier Management:** Highlights items below their reorder level and provides one-click access to supplier contact information to place a restock order.
- **🔐 Secure Authentication:** Powered by Firebase Authentication to keep pharmacy data secure.
- **📱 Responsive UI:** A modern, gradient-styled, glass-card interface that works seamlessly on both desktop computers and mobile devices.

---

## 🛠️ Methodology & Tech Stack
This project was built using modern, fast, and scalable web technologies:

- **Frontend Framework:** `React.js` (using Vite for lightning-fast HMR)
- **Styling:** Custom Vanilla CSS with CSS Variables for consistent theming and responsive media queries.
- **Data Visualization:** `Recharts` for interactive Pie and Bar charts.
- **Backend / Authentication:** `Firebase Authentication` (Email/Password) and `Firestore` (for user profiles).
- **State Management:** React Context API (`InventoryContext`) for global state handling without prop drilling.

---

## 🚀 How to Run (Local Development)

Follow these steps to run the application on your local machine:

1. **Clone the repository:**
   ```bash
   git clone [your-repo-link]
   cd inventory_pharmacy
   ```

2. **Install Dependencies:**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Configure Firebase (Optional but Recommended):**
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable Email/Password Authentication and Firestore.
   - Replace the configuration in `src/firebase.js` with your own Firebase config keys.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **View in Browser:**
   Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 👨‍⚕️ How to Use (User Guide)

1. **Register/Login:** Create a new pharmacy account with your Store Name and details. The app will securely log you in.
2. **Dashboard Overview:** Upon login, check your top metric cards and the interactive charts to assess your daily status.
3. **Manage Inventory:** Navigate to the `Inventory` tab to see all stock. (Sample data is pre-loaded for demonstration).
4. **Emergency Requests:** 
   - Go to `Low Stock Alerts`.
   - Click the red `🚨 Emergency – Find Nearby Store` button.
   - Select a nearby pharmacy, click `Request Medicine`, and fill out the itemized form to simulate an emergency restock request.
5. **Clear Expired Stock:** Navigate to the `Expiry Tracker` to identify and remove any medicines highlighted in red.
