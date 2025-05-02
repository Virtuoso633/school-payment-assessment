import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Paper, Typography, Alert, 
  Select, MenuItem, FormControl, InputLabel, Button,
  SelectChangeEvent, Fade, TextField, CircularProgress, Autocomplete
} from '@mui/material';
import TransactionList from './TransactionList';
import api from '../../services/api';

const SchoolTransactions: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<string>(schoolId || '');
  const [schools, setSchools] = useState<{ id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setLoading(true);
    // Use your api service instead of fetch for consistency
    api.get('/schools')
      .then((response: { data: any[] }) => {
        const schoolData = response.data.map((school: any) => ({
          id: school.id || school._id || school.school_id
        }));
        setSchools(schoolData);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Error loading schools:', err);
        setError('Failed to load schools');
        setLoading(false);
      });
  }, []);

  // Animate on school change
  useEffect(() => {
    setShowList(false);
    const timeout = setTimeout(() => setShowList(true), 200); // 200ms fade out/in
    return () => clearTimeout(timeout);
  }, [selectedSchool]);

  const handleSchoolChange = (event: React.SyntheticEvent, newValue: string | null) => {
    const newSchoolId = newValue || '';
    setSelectedSchool(newSchoolId);
    
    if (newSchoolId) {
      navigate(`/dashboard/school-transactions/${newSchoolId}`);
    } else {
      navigate(`/dashboard/school-transactions`);
    }
  };

  const handleViewAll = () => {
    navigate('/dashboard/transactions');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          School Transactions
        </Typography>
        <Button variant="outlined" color="primary" onClick={handleViewAll}>
          View All Transactions
        </Button>
      </Box>

      <Box mb={3}>
        <Autocomplete
          value={selectedSchool}
          onChange={handleSchoolChange}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={schools.map(school => school.id)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Select School" 
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          loading={loading}
          freeSolo
          filterOptions={(options, params) => {
            const filtered = options.filter(option => 
              option.toLowerCase().includes(params.inputValue.toLowerCase())
            );
            return filtered;
          }}
        />
        {error && <Alert severity="error">{error}</Alert>}
      </Box>

      {selectedSchool ? (
        <Fade in={showList} timeout={400}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Showing transactions for school: <strong>{selectedSchool}</strong>
            </Typography>
            <TransactionList schoolFilter={[selectedSchool]} />
          </Box>
        </Fade>
      ) : (
        <Alert severity="info">Please select a school to view its transactions.</Alert>
      )}
    </Paper>
  );
};

export default SchoolTransactions;