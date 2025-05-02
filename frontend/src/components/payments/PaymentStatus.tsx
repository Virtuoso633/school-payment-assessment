// src/components/payments/PaymentStatus.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Paper, Typography, Box, Chip, CircularProgress, Divider,
  Table, TableBody, TableRow, TableCell, Alert
} from '@mui/material';
import { paymentService } from '../../services/payment.service';

interface TransactionStatus {
  status: string;
  payment_time?: string;
  transaction_amount?: number;
  payment_mode?: string;
  bank_reference?: string;
}

const PaymentStatus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (id) {
          setLoading(true);
          const data = await paymentService.getTransactionStatus(id);
          setStatus(data);
          setError(null);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load transaction status');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();
  }, [id]);
  
  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Transaction Details
      </Typography>
      
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="h6" mr={2}>
              Status:
            </Typography>
            <Chip 
              label={status?.status || 'PENDING'} 
              color={getStatusColor(status?.status) as any}
              size="medium"
            />
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Transaction ID
                </TableCell>
                <TableCell>{id}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Amount
                </TableCell>
                <TableCell>
                  {status?.transaction_amount 
                    ? `₹${status.transaction_amount.toFixed(2)}` 
                    : 'Not available'}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Payment Method
                </TableCell>
                <TableCell>{status?.payment_mode || 'Not available'}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Bank Reference
                </TableCell>
                <TableCell>{status?.bank_reference || 'Not available'}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Payment Date
                </TableCell>
                <TableCell>
                  {status?.payment_time 
                    ? new Date(status.payment_time).toLocaleString() 
                    : 'Not available'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </Paper>
  );
};

export default PaymentStatus;