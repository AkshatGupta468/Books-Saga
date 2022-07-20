import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  ImageList,
  InputAdornment,
  Paper,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@mui/material';
import Puller from './puller';
import React, { useContext, useEffect, useState } from 'react';
import { addBookRequest, getMyBooksRequest } from '../utils/apicomm';
import BookCard from './bookcard';
import EnterForm from './enterform';

import { SnackContext } from '../App';
import { useNavigate } from 'react-router-dom';

const defaultFormState = {
  name: {
    error: false,
    displayname: 'Title',
    helpertext: '',
  },
  author: {
    error: false,
    helpertext: '',
    displayname: 'Author',
  },
  location: {
    error: false,
    helperText: '',
    displayname: 'Location',
  },
  about: {
    error: false,
    helperText: '',
    displayname: 'About',
  },
  price: {
    type: 'Number',
    displayname: 'Price',
    error: false,
    helperText: '',
  },
  contact: {
    type: 'Number',
    displayname: 'Mobile. No',
    error: false,
    helperText: '',
  },
};

export const Sell = () => {
  const [booksData, setBooksData] = useState(null);
  const navigate = useNavigate();
  const [formState, setFormState] = useState(defaultFormState);
  const [Snack, setSnack] = useContext(SnackContext);
  const [AddBook, setAddBook] = useState(false);
  const changeHandler = (key) => {
    setFormState((prev) => {
      const newstate = {
        ...prev,
      };
      newstate[key].error = false;
      newstate[key].helpertext = '';
      return newstate;
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const bookFormData = new FormData(event.currentTarget);
    addBookRequest(bookFormData)
      .then(() => {
        console.log('added Book');
        setAddBook(false);
        setSnack({ isopen: true, message: 'Book Added Successfully' });
        navigate('/Sell');
      })
      .catch((errors) => {
        Object.keys(errors).forEach((key) => {
          setFormState((oldState) => {
            const newState = {
              ...oldState,
            };
            console.log(newState);
            newState[key].error = true;
            newState[key].helpertext = errors[key].message;
            return newState;
          });
        });
        console.log('Error catched Form State is');
        console.log(formState);
      });
    console.log('Done handle Submit');
  };
  useEffect(() => {
    getMyBooksRequest()
      .then((books) => {
        console.log(books);
        setBooksData(books);
      })
      .catch(() => {});
  }, []);
  return (
    <React.Fragment>
      <Container sx={{ p: 1 }}>
        <Box>
          <Button
            variant="contained"
            onClick={() => {
              setAddBook(true);
            }}
          >
            Add Book
          </Button>
          <SwipeableDrawer
            open={AddBook}
            anchor="right"
            swipeAreaWidth={15}
            ModalProps={{
              keepMounted: true,
            }}
            onClose={() => {
              setAddBook(false);
            }}
            onOpen={() => {
              setAddBook(true);
            }}
          >
            <EnterForm
              pagename="Add a Book"
              buttonname="Add"
              handleSubmit={handleSubmit}
            >
              {Object.keys(defaultFormState).map((key) => {
                return (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={key}
                    key={key}
                    label={defaultFormState[key].displayname || key}
                    name={key}
                    autoComplete={defaultFormState[key].displayname || key}
                    autoFocus
                    type={formState[key].type || 'String'}
                    onChange={() => {
                      changeHandler(key);
                    }}
                    error={formState[key].error}
                    helperText={formState[key].helpertext}
                    variant="filled"
                  />
                );
              })}
              {/* <Button type="file" variant="contained">
          Add Image
          
        </Button> */}
              <React.Fragment>
                <input
                  color="primary"
                  accept="image/*"
                  type="file"
                  name="photo"
                  //   onChange={onChange}

                  id="icon-button-file"
                  // style={{ display: 'none' }}
                />
                <label htmlFor="icon-button-file"></label>
              </React.Fragment>
            </EnterForm>
            <Puller />
          </SwipeableDrawer>
        </Box>
        <Card sx={{ p: 2, mt: 2 }}>
          <Typography variant="h5">Your Books</Typography>
          <Box sx={{ pb: 2, m: 2 }}>
            <Divider />
          </Box>
          <Grid
            container
            spacing={3}
            justifyContent="space-around"
            columns={{ xs: 1, sm: 8, md: 12 }}
          >
            {booksData && !booksData.length && (
              <Box height={200}>
                <Typography variant="body1" sx={{ verticalAlign: 'middle' }}>
                  You Have not Added any books yet!
                </Typography>
              </Box>
            )}
            {booksData &&
              booksData.map((book) => {
                return (
                  <Grid item key={book._id}>
                    <BookCard book={book} />
                  </Grid>
                );
              })}
            {!booksData &&
              Array.from({ length: 6 }, (i) => {
                console.log(i);
                return (
                  <Grid item key={i}>
                    <Skeleton
                      variant="rectangular"
                      sx={{ height: { xs: 140 }, width: 350 }}
                    ></Skeleton>
                  </Grid>
                );
              })}
          </Grid>
        </Card>
      </Container>
    </React.Fragment>
  );
};
