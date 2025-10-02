"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditCustomer() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const router = useRouter();
  const params = useParams();
  const customerId = params.id;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch customer data
  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`${API_BASE}/customer/${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
        
        // Format date for input field and populate form
        const formattedDate = data.dateOfBirth 
          ? new Date(data.dateOfBirth).toISOString().split('T')[0]
          : '';
        
        reset({
          name: data.name || '',
          dateOfBirth: formattedDate,
          memberNumber: data.memberNumber || '',
          interests: data.interests || ''
        });
      } else {
        showSnackbar('Customer not found', 'error');
        router.push('/v2/customer/list');
      }
    } catch (error) {
      showSnackbar('Error fetching customer', 'error');
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/customer/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showSnackbar('Customer updated successfully');
        setTimeout(() => {
          router.push('/v2/customer/list');
        }, 1500);
      } else {
        const error = await response.json();
        showSnackbar(error.error || 'Failed to update customer', 'error');
      }
    } catch (error) {
      showSnackbar('Error updating customer', 'error');
      console.error('Error updating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Customer not found
        </Typography>
        <Button onClick={() => router.push('/v2/customer/list')} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <main>
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/v2/customer/list')}
            sx={{ mr: 2 }}
          >
            Back to List
          </Button>
          <Typography variant="h4" component="h1">
            Edit Customer
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="Name"
                fullWidth
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("dateOfBirth", { required: "Date of birth is required" })}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
              />
              
              <TextField
                label="Member Number"
                type="number"
                fullWidth
                {...register("memberNumber", { 
                  required: "Member number is required",
                  min: { value: 1, message: "Member number must be positive" }
                })}
                error={!!errors.memberNumber}
                helperText={errors.memberNumber?.message}
              />
              
              <TextField
                label="Interests"
                fullWidth
                multiline
                rows={3}
                placeholder="e.g., movies, football, gym, gaming"
                {...register("interests")}
                error={!!errors.interests}
                helperText={errors.interests?.message || "Separate interests with commas"}
              />
              
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  onClick={() => router.push('/v2/customer/list')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Customer'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>

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