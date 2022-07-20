import { Paper, Typography } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../App';

export default function Profile() {
  const [user] = useContext(UserContext);
  return (
    <Paper>
      <Typography>{user.name}</Typography>
      <Typography>{user.email}</Typography>
      <Typography>{user.role}</Typography>
    </Paper>
  );
}
