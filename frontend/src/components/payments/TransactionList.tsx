import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Grid from '@mui/material/Grid'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, CircularProgress, TablePagination,
  MenuItem, FormControl, InputLabel, OutlinedInput, TextField,
  IconButton, FormControlLabel, Checkbox,
  Card, CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { paymentService } from '../../services/payment.service';

interface TransactionListProps {
  schoolFilter?: string[]; // Optional prop for pre-selecting school filters
}

interface Transaction {
  custom_order_id: string;
  collect_id?: string;
  school_id: string;
  gateway?: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  payment_time: string;
}

// Available status options for filtering
const STATUS_OPTIONS = ['SUCCESS', 'PENDING', 'FAILED', 'ALL'];

// Define school ID options (you might want to fetch these from an API)
const SCHOOL_ID_OPTIONS = [
  'school12345',
  'school54321',
  '65b0e6293e9f76a9694d84b4',
  'st_marys_001'
];

// Animated TableRow for hover effect
const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'transform 0.15s cubic-bezier(.4,2,.6,1), box-shadow 0.15s',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[4],
    zIndex: 1,
  },
}));

const TransactionList: React.FC<TransactionListProps> = ({ schoolFilter = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // States for data and loading
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // States for pagination
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '0', 10));
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(searchParams.get('limit') || '10', 10)
  );
  const [total, setTotal] = useState(0);
  
  // States for sorting
  const [sortField, setSortField] = useState<string>(
    searchParams.get('sort') || 'payment_time'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('order') as 'asc' | 'desc') || 'desc'
  );
  
  // States for filtering
  const [statusFilter, setStatusFilter] = useState<string[]>(
    searchParams.get('status')?.split(',') || []
  );
  const [schoolFilterState, setSchoolFilterState] = useState<string[]>(schoolFilter);
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('search') || ''
  );
  const [startDate, setStartDate] = useState<Date | null>(
    searchParams.get('startDate') ? new Date(searchParams.get('startDate') as string) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    searchParams.get('endDate') ? new Date(searchParams.get('endDate') as string) : null
  );
  
  // State for filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Update URL parameters whenever filters/pagination change
  useEffect(() => {
    const params: Record<string, string> = {};
    
    if (page > 0) params.page = page.toString();
    if (rowsPerPage !== 10) params.limit = rowsPerPage.toString();
    if (sortField !== 'payment_time') params.sort = sortField;
    if (sortOrder !== 'desc') params.order = sortOrder;
    if (statusFilter.length > 0) params.status = statusFilter.join(',');
    if (schoolFilterState.length > 0) params.school = schoolFilterState.join(',');
    if (searchTerm) params.search = searchTerm;
    if (startDate) params.startDate = startDate.toISOString().split('T')[0];
    if (endDate) params.endDate = endDate.toISOString().split('T')[0];
    
    setSearchParams(params);
  }, [page, rowsPerPage, sortField, sortOrder, statusFilter, schoolFilterState, searchTerm, startDate, endDate, setSearchParams]);

  // Fetch transactions with all the filter parameters
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Construct query parameters
      const params: Record<string, any> = {
        page: page + 1,
        limit: rowsPerPage,
        sort: sortField,
        order: sortOrder
      };

      // Add filters if they exist
      if (
        statusFilter.length > 0 &&
        !(statusFilter.length === 1 && statusFilter[0] === 'ALL')
      ) {
        params.status = statusFilter.join(',');
      }
      
      if (schoolFilterState.length > 0) {
        params.school_id = schoolFilterState.join(',');
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (startDate) {
        params.start_date = startDate.toISOString().split('T')[0];
      }
      
      if (endDate) {
        params.end_date = endDate.toISOString().split('T')[0];
      }
      
      let response;
      
      // If school filter is exactly one school, use the school-specific endpoint
      if (schoolFilterState.length === 1) {
        response = await paymentService.getSchoolTransactions(
          schoolFilterState[0], 
          page + 1, 
          rowsPerPage,
          params
        );
      } else {
        response = await paymentService.getTransactions(params);
      }
      
      setTransactions(response.data);
      setTotal(response.total);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortField, sortOrder, statusFilter, schoolFilterState, searchTerm, startDate, endDate]);
  
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new sort field
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent<string[]>) => {
    const values = event.target.value as string[];
    if (values.includes('ALL')) {
      setStatusFilter(['ALL']);
    } else {
      setStatusFilter(values.filter(v => v !== 'ALL'));
    }
  };
  
  // Handle school filter change  
  const handleSchoolFilterChange = (event: SelectChangeEvent<string[]>) => {
    setSchoolFilterState(event.target.value as string[]);
  };
  
  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle search submission
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchTransactions();
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setStatusFilter([]);
    setSchoolFilterState([]);
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
    setSortField('payment_time');
    setSortOrder('desc');
    setPage(0);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
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
  
  // Render the sort icon
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' 
      ? <ArrowUpIcon fontSize="small" />
      : <ArrowDownIcon fontSize="small" />;
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Transactions
        </Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<FilterIcon />}
            sx={{ mr: 1 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard/create-payment')}
          >
            Create New Payment
          </Button>
        </Box>
      </Box>
      
      {/* Filters Section */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Search Bar */}
              <Grid xs={12} md={4}>
                <form onSubmit={handleSearch}>
                  <TextField
                    fullWidth
                    label="Search transactions"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton type="submit" size="small">
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </form>
              </Grid>
              
              {/* Status Filter */}
              <Grid xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    multiple
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    input={<OutlinedInput label="Status" />}
                    renderValue={(selected) => (
                      (selected as string[]).join(', ')
                    )}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status} value={status}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={statusFilter.includes(status)} 
                              color={
                                status === 'SUCCESS' ? 'success' : 
                                status === 'PENDING' ? 'warning' :
                                status === 'FAILED' ? 'error' : 'primary'
                              }
                            />
                          }
                          label={status}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* School Filter */}
              <Grid xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="school-filter-label">School</InputLabel>
                  <Select
                    labelId="school-filter-label"
                    multiple
                    value={schoolFilterState}
                    onChange={handleSchoolFilterChange}
                    input={<OutlinedInput label="School" />}
                    renderValue={(selected) => (
                      (selected as string[]).join(', ')
                    )}
                  >
                    {SCHOOL_ID_OPTIONS.map((school) => (
                      <MenuItem key={school} value={school}>
                        <FormControlLabel
                          control={<Checkbox checked={schoolFilterState.includes(school)} />}
                          label={school}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Date Range Filters */}
              <Grid xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              {/* Reset Filters Button */}
              <Grid xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={handleResetFilters}
                  startIcon={<RefreshIcon />}
                >
                  Reset Filters
                </Button>
              </Grid>
              
              {/* Apply Filters Button */}
              <Grid xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={fetchTransactions}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleSort('custom_order_id')}
                  >
                    <Box display="flex" alignItems="center">
                      Order ID {renderSortIcon('custom_order_id')}
                    </Box>
                  </TableCell>
                  
                  <TableCell 
                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleSort('school_id')}
                  >
                    <Box display="flex" alignItems="center">
                      School ID {renderSortIcon('school_id')}
                    </Box>
                  </TableCell>
                  
                  <TableCell 
                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleSort('gateway')}
                  >
                    <Box display="flex" alignItems="center">
                      Gateway {renderSortIcon('gateway')}
                    </Box>
                  </TableCell>
                  
                  <TableCell 
                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleSort('order_amount')}
                  >
                    <Box display="flex" alignItems="center">
                      Order Amount {renderSortIcon('order_amount')}
                    </Box>
                  </TableCell>
                  
                  <TableCell 
                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleSort('transaction_amount')}
                  >
                    <Box display="flex" alignItems="center">
                      Trans. Amount {renderSortIcon('transaction_amount')}
                    </Box>
                  </TableCell>
                  
                  <TableCell 
                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleSort('status')}
                  >
                    <Box display="flex" alignItems="center">
                      Status {renderSortIcon('status')}
                    </Box>
                  </TableCell>
                  
                  <TableCell 
                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleSort('payment_time')}
                  >
                    <Box display="flex" alignItems="center">
                      Payment Date {renderSortIcon('payment_time')}
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <AnimatedTableRow key={transaction.custom_order_id}>
                      <TableCell>{transaction.custom_order_id}</TableCell>
                      <TableCell>{transaction.school_id}</TableCell>
                      <TableCell>{transaction.gateway || 'Edviron'}</TableCell>
                      <TableCell>
                        ₹{transaction.order_amount?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        ₹{transaction.transaction_amount?.toFixed(2) || transaction.order_amount?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.status || 'PENDING'} 
                          color={getStatusColor(transaction.status || 'PENDING') as any}
                          size="medium"
                        />
                      </TableCell>
                      <TableCell>
                        {transaction.payment_time 
                          ? new Date(transaction.payment_time).toLocaleString() 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/dashboard/transaction/${transaction.custom_order_id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </AnimatedTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1">No transactions found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default TransactionList;