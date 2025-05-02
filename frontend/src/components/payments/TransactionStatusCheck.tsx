import React, { useState } from 'react';
import {
  Paper, Typography, TextField, Button, Box,
  CircularProgress, Alert, Divider, Chip
} from '@mui/material';
import { paymentService } from '../../services/payment.service';

interface TransactionStatus {
  status: string;
  payment_time?: string;
  transaction_amount?: number;
  payment_mode?: string;
  bank_reference?: string;
}

const TransactionStatusCheck: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<TransactionStatus | null>(null);

  const handleOrderIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderId(event.target.value);
    setStatus(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (!orderId.trim()) {
      setError('Please enter a valid Order ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.getTransactionStatus(orderId.trim());
      setStatus(result);
      setError(null);
    } catch (err: any) {
      setStatus(null);
      setError(err.response?.data?.message || 'Failed to retrieve transaction status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusValue?: string) => {
    switch (statusValue?.toUpperCase()) {
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

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Check Transaction Status
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 2 }}>
        Enter your <strong>Custom Order ID</strong> to retrieve the current status of your transaction.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Custom Order ID"
          value={orderId}
          onChange={handleOrderIdChange}
          margin="normal"
          variant="outlined"
          placeholder="Enter custom order ID"
          error={!!error}
          helperText={error}
        />
        <Box mt={2} textAlign="center">
            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
                disabled={loading || !orderId.trim()}
            >
                {loading ? <CircularProgress size={24} /> : 'Check Status'}
            </Button>
            </Box>
        </form>
      {status && (
        <Box mt={4}>
          <Divider sx={{ mb: 3 }} />

          <Box textAlign="center" mb={3}>
            <Typography variant="h6" gutterBottom>
              Transaction Status:
            </Typography>
            <Chip
              label={status.status || 'UNKNOWN'}
              color={getStatusColor(status.status) as any}
              size="medium"
              sx={{ fontSize: '1.1rem', py: 2, px: 3 }}
            />
          </Box>

          {status.transaction_amount && (
            <Typography variant="body1" gutterBottom>
              <strong>Amount:</strong> ₹{status.transaction_amount.toFixed(2)}
            </Typography>
          )}

          {status.payment_mode && (
            <Typography variant="body1" gutterBottom>
              <strong>Payment Method:</strong> {status.payment_mode}
            </Typography>
          )}

          {status.bank_reference && (
            <Typography variant="body1" gutterBottom>
              <strong>Bank Reference:</strong> {status.bank_reference}
            </Typography>
          )}

          {status.payment_time && (
            <Typography variant="body1" gutterBottom>
              <strong>Payment Date:</strong> {new Date(status.payment_time).toLocaleString()}
            </Typography>
          )}

          {status.status === 'PENDING' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This transaction is still pending. Please check back later for updates.
            </Alert>
          )}

          {status.status === 'FAILED' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              This transaction has failed. Please contact support if you need assistance.
            </Alert>
          )}

          {status.status === 'SUCCESS' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Payment successful! Thank you for your payment.
            </Alert>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default TransactionStatusCheck;