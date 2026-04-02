# Frontend-Backend Integration Guide

## Quick Integration Steps

Your backend is running on: **http://localhost:3001**

### Step 1: Add API Script to HTML

Add this before the closing `</body>` tag in `pharmamedicine.html`:

```html
<script src="api.js"></script>
```

### Step 2: Update Authentication (Line ~130 in your HTML)

Replace the `handleSubmit` function in `AuthPage` component:

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        try {
            let response;
            if (isSignUp) {
                response = await authAPI.register(
                    formData.email,
                    formData.password,
                    formData.name
                );
            } else {
                response = await authAPI.login(
                    formData.email,
                    formData.password
                );
            }
            onLogin(response.user);
        } catch (error) {
            setErrors({ general: error.message });
        }
    }
};
```

### Step 3: Load Medicines from Backend (Line ~220)

In `Dashboard` component, replace mock data with API calls:

```javascript
const [medicines, setMedicines] = useState([]);
const [patients, setPatients] = useState([]);
const [suppliers, setSuppliers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
        try {
            const [medsData, patientsData, suppliersData] = await Promise.all([
                medicinesAPI.getAll(),
                patientsAPI.getAll(),
                suppliersAPI.getAll()
            ]);
            setMedicines(medsData);
            setPatients(patientsData);
            setSuppliers(suppliersData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
}, []);
```

### Step 4: Update Medicine CRUD Operations

In `InventoryManagement` component:

```javascript
const handleAddMedicine = async (medicineData) => {
    try {
        const newMedicine = await medicinesAPI.create({
            name: medicineData.name,
            category: medicineData.category,
            manufacturer: medicineData.supplier,
            supplier_id: null,
            quantity_in_stock: medicineData.quantity,
            unit: 'units',
            reorder_level: 10,
            unit_price: medicineData.price,
            selling_price: medicineData.price,
            batch_number: medicineData.batchNumber,
            manufacturing_date: '2024-01-01',
            expiry_date: medicineData.expiryDate
        });
        setMedicines([...medicines, newMedicine]);
        setShowAddForm(false);
    } catch (error) {
        alert('Failed to add medicine: ' + error.message);
    }
};

const handleDeleteMedicine = async (id) => {
    try {
        await medicinesAPI.delete(id);
        setMedicines(medicines.filter(med => med.id !== id));
    } catch (error) {
        alert('Failed to delete medicine: ' + error.message);
    }
};
```

### Step 5: Update Patient Operations

In `PatientManagement` component:

```javascript
const handleAddPatient = async (patientData) => {
    try {
        const newPatient = await patientsAPI.create({
            first_name: patientData.name.split(' ')[0],
            last_name: patientData.name.split(' ').slice(1).join(' '),
            date_of_birth: '1990-01-01',
            gender: 'other',
            phone: patientData.phone,
            email: patientData.email,
            address: patientData.address
        });
        setPatients([...patients, newPatient]);
        setShowAddForm(false);
    } catch (error) {
        alert('Failed to add patient: ' + error.message);
    }
};
```

### Step 6: Update Logout

In `Dashboard` header logout button:

```javascript
<button
    onClick={() => {
        authAPI.logout();
        setIsAuthenticated(false);
    }}
    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
    title="Logout"
>
    <i data-lucide="log-out" className="w-6 h-6"></i>
</button>
```

## Testing the Integration

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Open Frontend:**
   - Open `pharmamedicine.html` in browser
   - Or use Live Server extension in VS Code

3. **Create Test User:**
   - Click "Sign Up"
   - Email: test@pharma.com
   - Password: test123
   - Name: Test User

4. **Test Features:**
   - Add a medicine
   - Add a patient
   - View expired medicines
   - Check notifications

## API Endpoints Reference

- **Auth:** POST /api/auth/register, POST /api/auth/login
- **Medicines:** GET/POST/PUT/DELETE /api/medicines
- **Patients:** GET/POST/PUT/DELETE /api/patients
- **Suppliers:** GET/POST/PUT/DELETE /api/suppliers
- **Prescriptions:** GET/POST /api/prescriptions
- **Alerts:** GET /api/alerts

## Common Issues

1. **CORS Error:** Backend already has CORS enabled
2. **401 Unauthorized:** Token expired, login again
3. **Connection Refused:** Make sure backend is running on port 3001

## Data Mapping

Your frontend uses different field names than the backend. Here's the mapping:

| Frontend | Backend |
|----------|---------|
| name | name |
| quantity | quantity_in_stock |
| price | selling_price |
| expiryDate | expiry_date |
| batchNumber | batch_number |
| supplier | manufacturer |

The `api.js` file handles these transformations automatically.
