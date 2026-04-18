import { Card, CardContent, Typography, Button, Box, CardMedia, Chip, Divider } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SpaIcon from '@mui/icons-material/Spa';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Use local images from the public folder for 100% reliability
const getRoomImage = (type) => {
  const t = (type || '').toLowerCase();
  
  if (t.includes('suite') || t.includes('deluxe') || t.includes('executive')) {
    return '/room-suite.jpg';
  }
  if (t.includes('family')) {
    return '/room-family.jpg';
  }
  if (t.includes('studio') || t.includes('boutique')) {
    return '/room-studio.jpg';
  }
  
  // Standard / Default fallback
  return '/room-default.jpg';
};

const RoomCard = ({ room, onReserve }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Top Image Section - Now loading instantly from local files */}
      <CardMedia
        component="img"
        height="220"
        image={getRoomImage(room.type)}
        alt={room.name}
        // Fallback to the default image if a specific type image is missing from public folder
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = '/room-default.jpg';
        }}
        sx={{ objectFit: 'cover' }}
      />

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ lineHeight: 1.2 }}>
            {room.name}
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            ${room.pricePerNight}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" fontWeight="medium">
              {room.location.name}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            per night
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StarIcon sx={{ color: '#faaf00', mr: 0.5, fontSize: 18 }} />
          <Typography variant="body2" fontWeight="bold">{room.location.rating}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
          {room.description}
        </Typography>

        {/* Amenities Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Chip 
            icon={<PeopleIcon sx={{ fontSize: '14px !important' }} />} 
            label={`${room.capacity} Guests`} 
            size="small" 
            sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: 'primary.main', fontWeight: 'bold' }} 
          />
          <Chip label={room.type || 'Room'} size="small" variant="outlined" />
          {room.location.hasFreeParking && (
            <Chip icon={<LocalParkingIcon sx={{ fontSize: '14px !important' }} />} label="Parking" size="small" color="success" variant="outlined" />
          )}
          {room.location.hasWellnessCenter && (
            <Chip icon={<SpaIcon sx={{ fontSize: '14px !important' }} />} label="Spa" size="small" color="info" variant="outlined" />
          )}
        </Box>

        {/* Action Button */}
        <Button 
          variant="contained" 
          size="large" 
          fullWidth
          onClick={() => onReserve(room)}
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.5,
            boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)'
          }}
        >
          Reserve Room
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoomCard;