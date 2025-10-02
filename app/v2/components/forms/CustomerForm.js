"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CustomerForm({ onSubmit, customer = null, onCancel }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (customer) {
      // Format date for input field
      const formattedDate = customer.dateOfBirth 
        ? new Date(customer.dateOfBirth).toISOString().split('T')[0]
        : '';
      
      reset({
        name: customer.name || '',
        dateOfBirth: formattedDate,
        memberNumber: customer.memberNumber || '',
        interests: customer.interests || ''
      });
    } else {
      reset({
        name: '',
        dateOfBirth: '',
        memberNumber: '',
        interests: ''
      });
    }
  }, [customer, reset]);

  const submitHandler = (data) => {
    if (customer) {
      data._id = customer._id;
    }
    onSubmit(data);
  };

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
        {customer ? 'Edit Customer' : 'Add New Customer'}
      </Typography>
      
      <form onSubmit={handleSubmit(submitHandler)}>
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
              onClick={onCancel}
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              {customer ? 'Update' : 'Add'} Customer
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}