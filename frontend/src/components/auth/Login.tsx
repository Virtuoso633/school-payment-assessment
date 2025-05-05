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
      console.log('Attempting login with:', values.username);
      
      // Add a direct API test to debug
      try {
        const response = await fetch('https://35.154.69.40/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: values.username, password: values.password }),
          mode: 'cors',
          credentials: 'include'
        });
        
        // Fix the Headers iteration issue
        const headerObj: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headerObj[key] = value;
        });
        
        console.log('Raw fetch response:', {
          status: response.status,
          statusText: response.statusText,
          headers: headerObj
        });
      } catch (fetchError) {
        console.error('Direct fetch error:', fetchError);
      }
      
      // Regular login
      await login(values.username, values.password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error details:', err);
      // More detailed error message with debugging info
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(`${errorMessage} (Status: ${err.response?.status || 'unknown'}, Type: ${err.name}, Message: ${err.message})`);
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
                size="medium"
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
                size="medium"
                InputProps={{ style: { fontSize: '1.2rem' } }}
                InputLabelProps={{ style: { fontSize: '1.2rem' } }}
                sx={{ mb: 3 }}
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