"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BadgeIcon from "@mui/icons-material/Badge";
import InterestsIcon from "@mui/icons-material/Interests";
import ShareIcon from "@mui/icons-material/Share";

export default function CustomerDetail() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const router = useRouter();
  const params = useParams();
  const customerId = params.id;

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
      } else {
        showSnackbar('Customer not found', 'error');
        setTimeout(() => {
          router.push('/v2/customer/list');
        }, 2000);
      }
    } catch (error) {
      showSnackbar('Error fetching customer details', 'error');
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle delete customer
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE}/customer/${customerId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          showSnackbar('Customer deleted successfully');
          setTimeout(() => {
            router.push('/v2/customer/list');
          }, 1500);
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

  // Handle share customer details
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Customer: ${customer.name}`,
        text: `Customer Details - ${customer.name} (Member #${customer.memberNumber})`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showSnackbar('Link copied to clipboard');
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Parse interests into array
  const parseInterests = (interests) => {
    if (!interests) return [];
    return interests.split(',').map(interest => interest.trim()).filter(interest => interest.length > 0);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 2 }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 1 }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 1 }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
    </Box>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!customer) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Customer not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/v2/customer/list')} 
          sx={{ mt: 2 }}
        >
          Back to Customer List
        </Button>
      </Box>
    );
  }

  const customerAge = calculateAge(customer.dateOfBirth);
  const interestsList = parseInterests(customer.interests);

  return (
    <main>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Customer Details
          </Typography>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color="primary"
              onClick={handleShare}
              title="Share Customer"
            >
              <ShareIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => router.push(`/v2/customer/edit/${customerId}`)}
              title="Edit Customer"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={handleDelete}
              title="Delete Customer"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Info Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ p: 4 }}>
                {/* Customer Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 3,
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {customer.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {customer.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Member #{customer.memberNumber}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Customer Details */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Full Name
                        </Typography>
                        <Typography variant="body1">
                          {customer.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BadgeIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Member Number
                        </Typography>
                        <Typography variant="body1">
                          {customer.memberNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarTodayIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date of Birth
                        </Typography>
                        <Typography variant="body1">
                          {new Date(customer.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Age: {customerAge} years old
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <InterestsIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Interests
                        </Typography>
                        {interestsList.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {interestsList.map((interest, index) => (
                              <Chip
                                key={index}
                                label={interest}
                                variant="outlined"
                                color="primary"
                                size="small"
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No interests specified
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Side Info Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => router.push(`/v2/customer/edit/${customerId}`)}
                    fullWidth
                  >
                    Edit Customer
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    fullWidth
                  >
                    Delete Customer
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Customer Summary
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Member Since:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(customer.dateOfBirth).getFullYear()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Age:
                    </Typography>
                    <Typography variant="body2">
                      {customerAge} years
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Interests Count:
                    </Typography>
                    <Typography variant="body2">
                      {interestsList.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Record Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Customer ID:
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {customer._id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Record Version:
                    </Typography>
                    <Typography variant="body2">
                      v{customer.__v || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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