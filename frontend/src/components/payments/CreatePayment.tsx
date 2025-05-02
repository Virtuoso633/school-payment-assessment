// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import {
//   Box, Button, TextField, Typography, Alert, Paper,
//   FormControl, InputLabel, Select, MenuItem
// } from '@mui/material';
// import { paymentService } from '../../services/payment.service';


// interface CreatePaymentFormValues {
//   school_id: string;
//   student_name: string;
//   student_id: string;
//   student_email: string;
//   amount: string;
// }

// const CreatePaymentSchema = Yup.object().shape({
//   school_id: Yup.string().required('School is required'),
//   student_name: Yup.string().required('Student name is required'),
//   student_id: Yup.string().required('Student ID is required'),
//   student_email: Yup.string().email('Invalid email').required('Student email is required'),
//   amount: Yup.number()
//     .typeError('Amount must be a number')
//     .positive('Amount must be positive')
//     .required('Amount is required'),
// });

// const CreatePayment: React.FC = () => {
//   const [error, setError] = useState<string | null>(null);
//   const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

//   const initialValues: CreatePaymentFormValues = {
//     school_id: '',
//     student_name: '',
//     student_id: '',
//     student_email: '',
//     amount: '',
//   };

//   const handleSubmit = async (values: CreatePaymentFormValues) => {
//     try {
//       setError(null);

//       const response = await paymentService.createPayment({
//         school_id: values.school_id,
//         student_info: {
//           name: values.student_name,
//           id: values.student_id,
//           email: values.student_email,
//         },
//         amount: parseFloat(values.amount),
//         callback_url: `${window.location.origin}/dashboard/transactions`,
//       });

//       setPaymentUrl(response.paymentRedirectUrl);
//     } catch (err: any) {
//       console.error('Payment creation error:', err);
//       const errorMessage = err.response?.data?.message ||
//         'Failed to create payment. Please try again.';
//       setError(errorMessage);
//     }
//   };

//   const [schools, setSchools] = useState<string[]>([]);
//   const [loadingSchools, setLoadingSchools] = useState(true);
//   const [schoolError, setSchoolError] = useState<string | null>(null);


//   useEffect(() => {
//     setLoadingSchools(true);
//     fetch('/schools') // Change to your backend endpoint if needed
//       .then(res => res.json())
//       .then(data => {
//         // If backend returns array of objects, extract only the id
//         setSchools(data.map((school: any) => school.id || school._id || school.school_id));
//         setLoadingSchools(false);
//       })
//       .catch(() => {
//         setSchoolError('Failed to load schools');
//         setLoadingSchools(false);
//       });
//   }, []);

//   return (
//     <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
//       <Typography variant="h5" component="h1" gutterBottom>
//         Create Payment
//       </Typography>
//       {(error || schoolError) && <Alert severity="error" sx={{ mb: 2 }}>{error || schoolError}</Alert>}
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       {paymentUrl ? (
//         <Box textAlign="center">
//           <Alert severity="success" sx={{ mb: 3 }}>
//             Payment initiated successfully!
//           </Alert>

//           <Typography paragraph>
//             Click the button below to proceed to the payment gateway:
//           </Typography>

//           <Button
//             variant="contained"
//             color="primary"
//             href={paymentUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             sx={{ mb: 2 }}
//           >
//             Proceed to Payment
//           </Button>

//           <Button
//             variant="outlined"
//             onClick={() => setPaymentUrl(null)}
//           >
//             Create Another Payment
//           </Button>
//         </Box>
//       ) : (
//         <Formik
//           initialValues={initialValues}
//           validationSchema={CreatePaymentSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, touched, errors, values, setFieldValue }) => (
//             <Form>
//               <Box mb={4}>
//               <FormControl fullWidth error={touched.school_id && !!errors.school_id}>
//                 <InputLabel id="school-select-label">Select School</InputLabel>
//                 <Select
//                   labelId="school-select-label"
//                   name="school_id"
//                   value={values.school_id}
//                   label="Select School"
//                   onChange={e => setFieldValue('school_id', e.target.value)}
//                 >
//                   <MenuItem value="">
//                     <em>Select a school</em>
//                   </MenuItem>
//                   {loadingSchools ? (
//                     <MenuItem disabled>Loading...</MenuItem>
//                   ) : (
//                     schools.map(schoolId => (
//                       <MenuItem key={schoolId} value={schoolId}>
//                         {schoolId}
//                       </MenuItem>
//                     ))
//                   )}
//                 </Select>
//                 <ErrorMessage name="school_id" render={(errorMsg) => (
//                   <div style={{ color: '#d32f2f', marginTop: 4, fontSize: 14 }}>{errorMsg}</div>
//                 )} />
//               </FormControl>
//               </Box>

//               <Box mb={4}>
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   name="student_name"
//                   label="Student Name"
//                   error={touched.student_name && !!errors.student_name}
//                   helperText={<ErrorMessage name="student_name" />}
//                 />
//               </Box>

//               <Box mb={4}>
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   name="student_id"
//                   label="Student ID"
//                   error={touched.student_id && !!errors.student_id}
//                   helperText={<ErrorMessage name="student_id" />}
//                 />
//               </Box>

//               <Box mb={4}>
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   name="student_email"
//                   label="Student Email"
//                   error={touched.student_email && !!errors.student_email}
//                   helperText={<ErrorMessage name="student_email" />}
//                 />
//               </Box>

//               <Box mb={4}>
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   name="amount"
//                   label="Amount"
//                   error={touched.amount && !!errors.amount}
//                   helperText={<ErrorMessage name="amount" />}
//                 />
//               </Box>

//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Creating Payment...' : 'Create Payment'}
//               </Button>
//             </Form>
//           )}
//         </Formik>
//       )}
//     </Paper>
//   );
// };

// export default CreatePayment;


import React, { useState } from 'react';
import {
  Paper, Typography, TextField, Button, Box, Alert
} from '@mui/material';
import { paymentService } from '../../services/payment.service';

const DEFAULT_CALLBACK_URL = "http://localhost:3000/dashboard/transactions";

const CreatePayment: React.FC = () => {
  const [form, setForm] = useState({
    school_id: '',
    name: '',
    student_id: '',
    email: '',
    amount: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPaymentUrl(null);

    try {
      const payload = {
        school_id: form.school_id,
        student_info: {
          name: form.name,
          id: form.student_id,
          email: form.email,
        },
        amount: Number(form.amount),
        callback_url: DEFAULT_CALLBACK_URL,
      };
      const response = await paymentService.createPayment(payload);
      setSuccess('Payment created successfully!');
      setPaymentUrl(response.paymentRedirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create payment');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create Payment
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {paymentUrl && (
        <Box textAlign="center" mb={2}>
          <Button
            variant="contained"
            color="primary"
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Proceed to Payment
          </Button>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="School ID"
          name="school_id"
          value={form.school_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Student Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Student ID"
          name="student_id"
          value={form.student_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Student Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
          required
        />
        {/* Hidden callback_url field for clarity (optional) */}
        <input type="hidden" name="callback_url" value={DEFAULT_CALLBACK_URL} />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Payment
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreatePayment;