import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert, Paper, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  FormControlLabel, Checkbox, Grid, IconButton, Snackbar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosPrivate } from '../api/axios';

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get('/api/admin/locations');
      setLocations(response.data.locations || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError('Could not load locations data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpenModal = (location = null) => {
    setEditingLocation(location);
    if (location) {
      // Prefill form for editing
      Object.keys(location).forEach(key => setValue(key, location[key]));
    } else {
      // Reset form for creating new
      reset({ name: '', city: '', address: '', description: '', rating: 5.0, hasFreeParking: false, hasWellnessCenter: false });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingLocation(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      if (editingLocation) {
        // Update existing location
        await axiosPrivate.put(`/api/admin/locations/${editingLocation.id}`, data);
        setSuccessMsg('Location updated successfully!');
      } else {
        // Create new location
        await axiosPrivate.post('/api/admin/locations', data);
        setSuccessMsg('Location created successfully!');
      }
      handleCloseModal();
      fetchLocations(); // Refresh grid
    } catch (err) {
      console.error('Save failed:', err);
      setError(err.response?.data?.message || 'Failed to save location.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    
    try {
      await axiosPrivate.delete(`/api/admin/locations/${id}`);
      setSuccessMsg('Location deleted successfully!');
      fetchLocations();
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Failed to delete location.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Hotel Name', flex: 1, minWidth: 200 },
    { field: 'city', headerName: 'City', width: 130 },
    { field: 'rating', headerName: 'Rating', width: 100, type: 'number' },
    { 
      field: 'hasFreeParking', 
      headerName: 'Parking', 
      width: 100, 
      type: 'boolean',
      valueGetter: (params) => params.value ? 'Yes' : 'No'
    },
    { 
      field: 'hasWellnessCenter', 
      headerName: 'Wellness', 
      width: 100, 
      type: 'boolean',
      valueGetter: (params) => params.value ? 'Yes' : 'No'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpenModal(params.row)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Manage Locations
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()}
        >
          Add Location
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper elevation={3} sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={locations}
          columns={columns}
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Create / Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Hotel Name"
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  {...register('city', { required: 'City is required' })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rating (1.0 - 5.0)"
                  type="number"
                  inputProps={{ step: "0.1", min: "1", max: "5" }}
                  {...register('rating', { 
                    required: 'Rating is required',
                    min: 1, max: 5
                  })}
                  error={!!errors.rating}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  {...register('address', { required: 'Address is required' })}
                  error={!!errors.address}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  {...register('description')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox {...register('hasFreeParking')} defaultChecked={editingLocation?.hasFreeParking} />}
                  label="Free Parking"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox {...register('hasWellnessCenter')} defaultChecked={editingLocation?.hasWellnessCenter} />}
                  label="Wellness Center"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Location'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg('')}>
        <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminLocations;