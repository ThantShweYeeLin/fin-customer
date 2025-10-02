"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AddCustomer() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showSnackbar('Customer added successfully');
        reset(); // Clear form
        setTimeout(() => {
          router.push('/v2/customer/list');
        }, 1500);
      } else {
        const error = await response.json();
        showSnackbar(error.error || 'Failed to add customer', 'error');
      }
    } catch (error) {
      showSnackbar('Error adding customer', 'error');
      console.error('Error adding customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
            Add New Customer
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
                  {isSubmitting ? 'Adding...' : 'Add Customer'}
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