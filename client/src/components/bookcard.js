import {
  Avatar,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import cfgraph from '../cfgraph.png';
import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';

const Img = styled('img')({
  // margin: 'auto',
  // display: 'block',
  // maxWidth: '100%',
  // maxHeight: '100%',
  overflow: 'hidden',
});

export default function BookCard({ book }) {
  return (
    <React.Fragment>
      <ButtonBase component={RouterLink} to={`/books/${book._id}`}>
        <Paper
          sx={{
            margin: 'auto',
            maxWidth: 500,
            flexGrow: 1,
            boxShadow: '4',
            userSelect: 'none',
            overflow: 'hidden',
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            columns={{ xs: 18 }}
          >
            <Grid item xs={6}>
              <CardMedia
                component="img"
                sx={{
                  height: { xs: '145px' },
                  width: { xs: '110px' },
                }}
                height="145"
                width="110"
                alt="BookImage"
                src={`data:image/jpeg;base64,${book.image}`}
              ></CardMedia>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="column"
              columns={{ xs: 18 }}
              // spacing={5}
              sx={{
                pt: 2,
                pl: 2,
                pr: 1,
                height: { xs: '145px' },
                width: { xs: '245px' },
              }}
              justifyContent="space-between"
            >
              <Grid
                item
                xs={3}
                sx={{ borderBottom: '1px solid blue', width: 'auto' }}
              >
                <Typography
                  noWrap={true}
                  // align="justify"
                  variant="bookname"
                  component="div"
                >
                  {book.name.length < 25
                    ? book.name
                    : book.name.substring(0, 25) + '...'}
                </Typography>
              </Grid>
              <Grid item xs={7} display="block">
                <Typography variant="body2">{book.about}</Typography>
              </Grid>
              <Grid item xs={1}>
                {book.tags.map((tag) => {
                  tag = tag.toLowerCase();
                  return <Chip label={tag} size="small" variant="outlined" />;
                })}
                <Typography
                  sx={{ cursor: 'pointer' }}
                  variant="body2"
                ></Typography>
              </Grid>
              <Grid
                item
                xs={2}
                // sx={{ backgroundColor: 'red' }}
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="subtitle2" color="text.secondary">
                    {book.author}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" component="div">
                    ₹{book.price}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </ButtonBase>
    </React.Fragment>
  );
}
