import { Container, Typography } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../App';

export default function Profile() {
  const [user] = useContext(UserContext);
  return (
    <Container maxWidth="sm">
      <Typography
        component="h1"
        variant="h3"
        align="center"
        color="text.primary"
        gutterBottom
        marginTop={10}
      >
        Hello, <> </>
        {user.name}
      </Typography>

      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        {
          'This Website provides you with a platform to Sell your Old Books or Buy it.'
        }
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        People collect a lot of books while pursuing their Education but some of
        them becomes useless to them after a while.
      </Typography>
    </Container>
  );
}
