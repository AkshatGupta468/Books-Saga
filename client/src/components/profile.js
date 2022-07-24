import { Paper, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { useContext } from 'react';
import { UserContext } from '../App';

export default function Profile() {
  const [user] = useContext(UserContext);
  return (
    <Paper sx={{backgroundColor:'red'}}>
      <Typography>{user.name}</Typography>
      <Typography>{user.email}</Typography>
      <Typography>{user.role}</Typography>
    </Paper>
  );
}
