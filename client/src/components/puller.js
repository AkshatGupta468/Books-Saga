import styled from '@emotion/styled';
import { Box } from '@mui/system';
import { grey } from '@mui/material/colors';

const Puller = styled(Box)(({ theme }) => ({
    width: 6,
    height: 30,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    left: 8,
    top: 'calc(50% - 15px)',
  }));
export default Puller;