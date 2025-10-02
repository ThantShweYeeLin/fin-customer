"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerForm from "@/app/v2/components/forms/CustomerForm";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
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
      width: 160,
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
            onClick={() => handleEdit(params.row)}
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
      const response = await fetch(`/api/customer`);
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

  // Handle form submission (create or update)
  function handleCustomerFormSubmit(data) {
    if (editingCustomer) {
      // Update existing customer
      fetch(`/api/customer/${editingCustomer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(async (response) => {
        if (response.ok) {
          showSnackbar('Customer updated successfully');
          fetchCustomers();
          handleClose();
        } else {
          const error = await response.json();
          showSnackbar(error.error || 'Failed to update customer', 'error');
        }
      })
      .catch((error) => {
        showSnackbar('Error updating customer', 'error');
        console.error('Error updating customer:', error);
      });
    } else {
      // Create new customer
      fetch(`/api/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(async (response) => {
        if (response.ok) {
          showSnackbar('Customer added successfully');
          fetchCustomers();
          handleClose();
        } else {
          const error = await response.json();
          showSnackbar(error.error || 'Failed to add customer', 'error');
        }
      })
      .catch((error) => {
        showSnackbar('Error adding customer', 'error');
        console.error('Error adding customer:', error);
      });
    }
  }

  // Handle edit action
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setOpen(true);
  };

  // Handle delete action
  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`/api/customer/${customerId}`, {
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

  // Handle modal open for new customer
  const handleOpen = () => {
    setEditingCustomer(null);
    setOpen(true);
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setEditingCustomer(null);
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
            Customer Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={handleOpen}
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

        {/* Modal for Add/Edit Customer */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="customer-modal-title"
          aria-describedby="customer-modal-description"
        >
          <CustomerForm
            onSubmit={handleCustomerFormSubmit}
            customer={editingCustomer}
            onCancel={handleClose}
          />
        </Modal>

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