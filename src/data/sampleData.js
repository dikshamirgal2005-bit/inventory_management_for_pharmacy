export const CATEGORIES = [
  'Antibiotics',
  'Analgesics',
  'Antacids',
  'Antihistamines',
  'Vitamins & Supplements',
  'Antidiabetics',
  'Cardiovascular',
  'Antipyretics',
  'Antiseptics',
  'Cough & Cold',
];

export const UNITS = ['Tablets', 'Capsules', 'Syrup (ml)', 'Injection (ml)', 'Cream (g)', 'Drops (ml)', 'Powder (g)'];

export const sampleSuppliers = [
  { id: 's1', name: 'MedLine Distributors',   contact: 'Rahul Sharma',  phone: '9812345678', email: 'rahul@medline.com',   address: 'Mumbai, MH' },
  { id: 's2', name: 'PharmaCo Wholesale',      contact: 'Priya Nair',    phone: '9823456789', email: 'priya@pharmaco.in',   address: 'Delhi, DL' },
  { id: 's3', name: 'HealthBridge Supplies',   contact: 'Amit Gupta',    phone: '9834567890', email: 'amit@healthbridge.co',address: 'Pune, MH' },
  { id: 's4', name: 'GenMed Pvt Ltd',          contact: 'Sneha Reddy',   phone: '9845678901', email: 'sneha@genmed.com',    address: 'Hyderabad, TS' },
  { id: 's5', name: 'CureLine Pharmaceuticals',contact: 'Vikram Iyer',   phone: '9856789012', email: 'vikram@cureline.in',  address: 'Chennai, TN' },
];

const today = new Date();
const fmtDate = (daysFromNow) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

export const sampleMedicines = [
  { id: 'm1',  name: 'Amoxicillin 500mg',     category: 'Antibiotics',           qty: 250, unit: 'Capsules',      price: 12.5,  reorderLevel: 100, expiryDate: fmtDate(180), supplier: 'MedLine Distributors',    batchNo: 'BT2024001' },
  { id: 'm2',  name: 'Paracetamol 500mg',      category: 'Analgesics',            qty: 40,  unit: 'Tablets',       price: 2.0,   reorderLevel: 100, expiryDate: fmtDate(20),  supplier: 'PharmaCo Wholesale',      batchNo: 'BT2024002' },
  { id: 'm3',  name: 'Pantoprazole 40mg',      category: 'Antacids',             qty: 180, unit: 'Tablets',       price: 8.0,   reorderLevel: 80,  expiryDate: fmtDate(365), supplier: 'HealthBridge Supplies',   batchNo: 'BT2024003' },
  { id: 'm4',  name: 'Cetirizine 10mg',        category: 'Antihistamines',        qty: 60,  unit: 'Tablets',       price: 5.5,   reorderLevel: 70,  expiryDate: fmtDate(240), supplier: 'GenMed Pvt Ltd',          batchNo: 'BT2024004' },
  { id: 'm5',  name: 'Vitamin C 500mg',        category: 'Vitamins & Supplements',qty: 30,  unit: 'Tablets',       price: 6.0,   reorderLevel: 50,  expiryDate: fmtDate(12),  supplier: 'CureLine Pharmaceuticals',batchNo: 'BT2024005' },
  { id: 'm6',  name: 'Metformin 500mg',        category: 'Antidiabetics',         qty: 340, unit: 'Tablets',       price: 4.5,   reorderLevel: 100, expiryDate: fmtDate(300), supplier: 'MedLine Distributors',    batchNo: 'BT2024006' },
  { id: 'm7',  name: 'Atorvastatin 10mg',      category: 'Cardiovascular',        qty: 200, unit: 'Tablets',       price: 15.0,  reorderLevel: 80,  expiryDate: fmtDate(400), supplier: 'PharmaCo Wholesale',      batchNo: 'BT2024007' },
  { id: 'm8',  name: 'Ibuprofen 400mg',        category: 'Analgesics',            qty: 25,  unit: 'Tablets',       price: 3.5,   reorderLevel: 80,  expiryDate: fmtDate(-10), supplier: 'HealthBridge Supplies',   batchNo: 'BT2024008' },
  { id: 'm9',  name: 'Azithromycin 250mg',     category: 'Antibiotics',           qty: 90,  unit: 'Tablets',       price: 22.0,  reorderLevel: 60,  expiryDate: fmtDate(150), supplier: 'GenMed Pvt Ltd',          batchNo: 'BT2024009' },
  { id: 'm10', name: 'Dextromethorphan Syrup', category: 'Cough & Cold',          qty: 45,  unit: 'Syrup (ml)',    price: 55.0,  reorderLevel: 50,  expiryDate: fmtDate(90),  supplier: 'CureLine Pharmaceuticals',batchNo: 'BT2024010' },
  { id: 'm11', name: 'Ranitidine 150mg',       category: 'Antacids',             qty: 20,  unit: 'Tablets',       price: 6.5,   reorderLevel: 60,  expiryDate: fmtDate(25),  supplier: 'MedLine Distributors',    batchNo: 'BT2024011' },
  { id: 'm12', name: 'Losartan 50mg',          category: 'Cardiovascular',        qty: 160, unit: 'Tablets',       price: 18.0,  reorderLevel: 70,  expiryDate: fmtDate(500), supplier: 'PharmaCo Wholesale',      batchNo: 'BT2024012' },
  { id: 'm13', name: 'Dolo 650',               category: 'Antipyretics',          qty: 500, unit: 'Tablets',       price: 1.5,   reorderLevel: 120, expiryDate: fmtDate(200), supplier: 'HealthBridge Supplies',   batchNo: 'BT2024013' },
  { id: 'm14', name: 'Betadine Solution',      category: 'Antiseptics',           qty: 50,  unit: 'Drops (ml)',    price: 35.0,  reorderLevel: 30,  expiryDate: fmtDate(730), supplier: 'GenMed Pvt Ltd',          batchNo: 'BT2024014' },
  { id: 'm15', name: 'Multivitamin Complex',   category: 'Vitamins & Supplements',qty: 80,  unit: 'Tablets',       price: 120.0, reorderLevel: 40,  expiryDate: fmtDate(18),  supplier: 'CureLine Pharmaceuticals',batchNo: 'BT2024015' },
  { id: 'm16', name: 'Fexofenadine 120mg',     category: 'Antihistamines',        qty: 110, unit: 'Tablets',       price: 9.0,   reorderLevel: 60,  expiryDate: fmtDate(280), supplier: 'MedLine Distributors',    batchNo: 'BT2024016' },
  { id: 'm17', name: 'Glibenclamide 5mg',      category: 'Antidiabetics',         qty: 15,  unit: 'Tablets',       price: 7.0,   reorderLevel: 60,  expiryDate: fmtDate(360), supplier: 'PharmaCo Wholesale',      batchNo: 'BT2024017' },
  { id: 'm18', name: 'Ampiclox 500mg',         category: 'Antibiotics',           qty: 75,  unit: 'Capsules',      price: 28.0,  reorderLevel: 50,  expiryDate: fmtDate(120), supplier: 'HealthBridge Supplies',   batchNo: 'BT2024018' },
  { id: 'm19', name: 'Salbutamol Inhaler',     category: 'Cough & Cold',          qty: 22,  unit: 'Injection (ml)',price: 180.0, reorderLevel: 20,  expiryDate: fmtDate(600), supplier: 'GenMed Pvt Ltd',          batchNo: 'BT2024019' },
  { id: 'm20', name: 'Calendula Cream',        category: 'Antiseptics',           qty: 38,  unit: 'Cream (g)',     price: 45.0,  reorderLevel: 20,  expiryDate: fmtDate(900), supplier: 'CureLine Pharmaceuticals',batchNo: 'BT2024020' },
];
