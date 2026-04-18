import { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, CircularProgress, Alert 
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { axiosPrivate } from '../api/axios';
import GroupIcon from '@mui/icons-material/Group';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f'];

// Reusable animated Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 3, 
      display: 'flex', 
      alignItems: 'center', 
      height: '100%',
      borderRadius: 3,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
      }
    }}
  >
    <Box sx={{ 
      backgroundColor: `${color}15`, 
      p: 2.5, 
      borderRadius: '50%', 
      display: 'flex', 
      mr: 3 
    }}>
      {icon}
    </Box>
    <Box>
      <Typography color="text.secondary" variant="subtitle1" fontWeight="medium" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" fontWeight="bold" sx={{ color: color }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/api/admin/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Could not load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  if (!data) return null;

  return (
    <Container maxWidth="xl" sx={{ mt: 6, mb: 10 }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor your hotel's performance, reservations, and user metrics in real-time.
        </Typography>
      </Box>

      {/* 4 Summary Stat Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Total Reservations" 
            value={data.summary.totalReservations} 
            icon={<EventAvailableIcon sx={{ color: '#1976d2', fontSize: 45 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Active Bookings" 
            value={data.summary.activeReservations} 
            icon={<EventAvailableIcon sx={{ color: '#2e7d32', fontSize: 45 }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Cancelled" 
            value={data.summary.cancelledReservations} 
            icon={<CancelIcon sx={{ color: '#d32f2f', fontSize: 45 }} />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Total Registered Users" 
            value={data.summary.totalUsers} 
            icon={<GroupIcon sx={{ color: '#ed6c02', fontSize: 45 }} />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 4, height: 450, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
              Reservations Trend (Monthly)
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={data.reservationsByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#1976d2" 
                  name="Reservations" 
                  radius={[6, 6, 0, 0]}
                  barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 4, height: 450, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              Bookings by Location
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={data.reservationsByLocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3} 
                  dataKey="count"
                  stroke="none"
                >
                  {data.reservationsByLocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                {/* Replaced messy text labels with a clean vertical Legend */}
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default AdminDashboard;