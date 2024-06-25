import { Autocomplete, Box, Grid, Skeleton, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooksRequest, setAuthToken } from '../utils/apicomm';
import { ErrorHandler } from '../utils/errorhandler';
import BookCard from './bookcard';

import { UserContext } from '../App';

export const Buy = () => {
  const [booksData, setBooksData] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [bookTags, setBookTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  useEffect(() => {
    setAuthToken(
      window.sessionStorage.getItem('token') ||
        window.localStorage.getItem('token')
    );

    getBooksRequest()
      .then((data) => {
        console.log(data);
        setBooksData(data.books);
        setBookTags(data.schema.tags.enum);
      })
      .catch((errors) => {
        console.log(errors);
        ErrorHandler(errors, navigate);
      });
  }, [navigate]);
  return (
    <React.Fragment>
      <Box sx={{ width: 1 / 2 }}>
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={(event,value, reason, details) => {
            getBooksRequest(value)
            .then((data) => {
              console.log(data);
              setBooksData(data.books);
            })
            .catch((errors) => {
              console.log(errors);
              ErrorHandler(errors, navigate);
            });
          }}
          options={bookTags}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label="Search by Tags"
              placeholder={bookTags[0]}
            />
          )}
        />
      </Box>
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
                  <BookCard book={book} key={book._id} />
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
