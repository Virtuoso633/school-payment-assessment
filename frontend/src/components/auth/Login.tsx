// src/components/auth/Login.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const initialValues: LoginFormValues = {
    username: '',
    password: '',
  };
  
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setError(null);
      await login(values.username, values.password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error details:', err);
      // More detailed error message with debugging info
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(`${errorMessage} (Status: ${err.response?.status || 'unknown'})`);
    }
  };
  
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
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
                name="password"
                label="Password"
                type="password"
                error={touched.password && !!errors.password}
                size="medium"  // Use medium instead of large
                InputProps={{ style: { fontSize: '1.2rem' } }}  // Add this
                InputLabelProps={{ style: { fontSize: '1.2rem' } }}  // Add this
                sx={{ mb: 3 }}  // Fixed typo in sx prop
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don't have an account?{' '}
                <Button
                  color="primary"
                  size="small"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;