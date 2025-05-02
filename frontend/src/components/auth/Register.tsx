// src/components/auth/Register.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const initialValues: RegisterFormValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  };
  
  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setError(null);
      await register(values.username, values.password, values.email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Register
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            <Box mb={3}>
            <Field
              as={TextField}
              fullWidth
              name="username"
              label="Username"
              error={touched.username && !!errors.username}
              helperText={<ErrorMessage name="username" />}
              size="medium"  // Change from "large" to "medium"
              InputProps={{ style: { fontSize: '1.2rem' } }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              sx={{ mb: 3 }}
            />
            </Box>
            
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                type="email"
                error={touched.email && !!errors.email}
                helperText={<ErrorMessage name="email" />}
                size="medium"  // Add this
                InputProps={{ style: { fontSize: '1.2rem' } }}  // Add this
                InputLabelProps={{ style: { fontSize: '1.2rem' } }}  // Add this
                sx={{ mb: 3 }}  // Add more margin
              />
            </Box>
            
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                name="password"
                label="Password"
                type="password"
                error={touched.password && !!errors.password}
                helperText={<ErrorMessage name="password" />}
                size="medium"  // Add this
                InputProps={{ style: { fontSize: '1.2rem' } }}  // Add this
                InputLabelProps={{ style: { fontSize: '1.2rem' } }}  // Add this
                sx={{ mb: 3 }}  // Add more margin
              />
            </Box>
            
            <Box mb={4}>
              <Field
                as={TextField}
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                error={touched.confirmPassword && !!errors.confirmPassword}
                helperText={<ErrorMessage name="confirmPassword" />}
                size="medium"  // Add this
                InputProps={{ style: { fontSize: '1.2rem' } }}  // Add this
                InputLabelProps={{ style: { fontSize: '1.2rem' } }}  // Add this
                sx={{ mb: 3 }}  // Add more margin
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
            
            <Box mt={3} textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Button
                  color="primary"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;