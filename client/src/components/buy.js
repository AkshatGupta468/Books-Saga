import styled from '@emotion/styled';
import { Box, Grid, Paper, Skeleton } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBooksRequest,
  getUserRequest,
  setAuthToken,
} from '../utils/apicomm';
import { ErrorHandler } from '../utils/errorhandler';
import BookCard from './bookcard';

import { UserContext } from '../App';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const Buy = () => {
  const [booksData, setBooksData] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  useEffect(() => {
    setAuthToken(
      window.sessionStorage.getItem('token') ||
        window.localStorage.getItem('token')
    );

    getBooksRequest()
      .then((books) => {
        console.log(books);
        setBooksData(books);
      })
      .catch((errors) => {
        console.log(errors);
        ErrorHandler(errors, navigate);
      });
  }, [navigate]);
  return (
    <React.Fragment>
      <Box sx={{ p: 1 }}>
        <Grid
          container
          spacing={3}
          justifyContent="space-around"
          columns={{ xs: 1, sm: 8, md: 12 }}
        >
          {booksData &&
            booksData.map((book) => {
              return (
                <Grid item key={book._id}>
                  <BookCard book={book} />
                </Grid>
              );
            })}
          {!booksData &&
            Array.from({ length: 6 }, () => {
              return (
                <Grid item>
                  <Skeleton
                    variant="rectangular"
                    sx={{ height: { xs: 140 }, width: 350 }}
                  ></Skeleton>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </React.Fragment>
  );
};
