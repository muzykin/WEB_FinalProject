import { Card, CardContent, Typography, CardActions, Button, Grid, Chip, Box } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SpaIcon from '@mui/icons-material/Spa';
import StarIcon from '@mui/icons-material/Star';

const RoomCard = ({ room, onReserve }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {room.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {room.location.name} - {room.location.city}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StarIcon sx={{ color: '#faaf00', mr: 0.5 }} />
          <Typography variant="body2">{room.location.rating}</Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {room.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip label={`${room.capacity} Guests`} size="small" color="primary" variant="outlined" />
          <Chip label={room.type} size="small" variant="outlined" />
          {room.location.hasFreeParking && (
            <Chip icon={<LocalParkingIcon />} label="Free Parking" size="small" color="success" variant="outlined" />
          )}
          {room.location.hasWellnessCenter && (
            <Chip icon={<SpaIcon />} label="Wellness Center" size="small" color="info" variant="outlined" />
          )}
        </Box>

        <Typography variant="h6" color="primary">
          ${room.pricePerNight} / night
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="large" fullWidth variant="contained" onClick={() => onReserve(room)}>
          Reserve Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default RoomCard;