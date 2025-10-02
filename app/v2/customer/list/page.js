"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function CustomerListPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

  // DataGrid columns configuration
  const columns = [
    { field: "memberNumber", headerName: "Member #", width: 120 },
    { field: "name", headerName: "Name", width: 200 },
    { 
      field: "dateOfBirth", 
      headerName: "Date of Birth", 
      width: 150,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      }
    },
    { field: "interests", headerName: "Interests", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="info"
            onClick={() => router.push(`/v2/customer/detail/${params.row._id}`)}
            size="small"
            title="View Details"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => router.push(`/v2/customer/edit/${params.row._id}`)}
            size="small"
            title="Edit Customer"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
            size="small"
            title="Delete Customer"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Fetch customers from API
  async function fetchCustomers() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/customer/`);
      if (response.ok) {
        const data = await response.json();
        const customersWithId = data.map((customer) => ({
          ...customer,
          id: customer._id, // DataGrid requires 'id' field
        }));
        setCustomers(customersWithId);
      } else {
        showSnackbar('Failed to fetch customers', 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching customers', 'error');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle delete action
  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`${API_BASE}/customer/${customerId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          showSnackbar('Customer deleted successfully');
          fetchCustomers();
        } else {
          const error = await response.json();
          showSnackbar(error.error || 'Failed to delete customer', 'error');
        }
      } catch (error) {
        showSnackbar('Error deleting customer', 'error');
        console.error('Error deleting customer:', error);
      }
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <main>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Customer List
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/v2/customer/add')}
            color="primary"
          >
            Add New Customer
          </Button>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Total Customers: {customers.length}
        </Typography>

        {/* Customer Data Grid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={customers}
            columns={columns}
            loading={loading}
            slots={{
              toolbar: GridToolbar,
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            onRowClick={(params) => {
              router.push(`/v2/customer/detail/${params.row._id}`);
            }}
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
          />
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </main>
  );
}