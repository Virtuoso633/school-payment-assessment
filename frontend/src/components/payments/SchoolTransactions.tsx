import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Paper, Typography, Alert, 
  Select, MenuItem, FormControl, InputLabel, Button,
  SelectChangeEvent, Fade
} from '@mui/material';
import TransactionList from './TransactionList';

const SchoolTransactions: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<string>(schoolId || '');
  const [schools, setSchools] = useState<{ id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/schools')
      .then(res => res.json())
      .then(data => {
        setSchools(data.map((school: any) => ({
          id: school.id || school._id || school.school_id
        })));
        setLoading(false);
      })
      .catch(() => {
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

  const handleSchoolChange = (event: SelectChangeEvent) => {
    const newSchoolId = event.target.value as string;
    setSelectedSchool(newSchoolId);
    if (newSchoolId) {
      navigate(`/dashboard/school-transactions/${newSchoolId}`);
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
        <FormControl fullWidth>
          <InputLabel id="school-select-label">Select School</InputLabel>
          <Select
            labelId="school-select-label"
            value={selectedSchool}
            onChange={handleSchoolChange}
            label="Select School"
          >
            <MenuItem value="">
              <em>Select a school</em>
            </MenuItem>
            {schools.map((school) => (
              <MenuItem key={school.id} value={school.id}>
                {school.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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