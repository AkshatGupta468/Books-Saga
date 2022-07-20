import {
  Button,
  ButtonBase,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SnackContext, UserContext } from '../App';
import { deleteBookRequest, getBookDetailRequest } from '../utils/apicomm';
import { ErrorHandler } from '../utils/errorhandler';

export default function BookDetails() {
  const params = useParams();
  const [book, setBook] = useState(null);
  const [user, setUser] = useContext(UserContext);
  const [Snack, setSnack] = useContext(SnackContext);
  const [editBook, setEditBook] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log('Book Details Page', user);
    getBookDetailRequest(params.bookid)
      .then((book) => {
        setBook(book);
        console.log(book);
        console.log('Book detail fetched');
      })
      .catch((errors) => {
        ErrorHandler(errors, navigate);
        console.log('Book Detail not fetched');
      });
  }, [params.bookid, user, setUser, navigate]);
  const deleteBookHandler = () => {
    deleteBookRequest(params.bookid)
      .then((data) => {
        console.log(data);
        console.log('Book Deleted');
        setSnack({ isopen: true, message: 'Book Deleted Successfully' });
      })
      .catch((errors) => {
        ErrorHandler(errors);
        console.log('Book Not Deleted, Error Occured');
      });
  };
  const dialogCloseHandler = () => {
    setDeleteDialog(false);
  };
  return (
    <React.Fragment>
      <Dialog
        open={deleteDialog}
        onClose={dialogCloseHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You Sure You Want to Delete this Book? The book data cannot be
            recovered after deletion!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteBookHandler(book._id);
              dialogCloseHandler();
            }}
          >
            Yes,Delete
          </Button>
          <Button onClick={dialogCloseHandler} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Container sx={{ fontSize: '2rem' }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, md: 15 }}
          justifyContent="space-around"
          direction="row"
        >
          <Grid item xs={4} md={9}>
            {book ? (
              <ButtonBase>
                <CardMedia
                  component="img"
                  alt="Book Cover"
                  src={`data:image/jpeg;base64,${book.image}`}
                ></CardMedia>
              </ButtonBase>
            ) : (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{ height: { xs: 230 }, width: '100%' }}
              ></Skeleton>
            )}
          </Grid>
          <Grid
            container
            item
            xs={4}
            md={6}
            direction="column"
            spacing={{ xs: 3, md: 3 }}
            columns={{ xs: 4, md: 7 }}
            justifyContent="space-between"
          >
            <Grid item md={3}>
              {book ? (
                <React.Fragment>
                  <Typography variant="bookname">{book.name}</Typography>
                  <Typography variant="subtitle2">{book.author}</Typography>
                </React.Fragment>
              ) : (
                <>
                  <Skeleton
                    variant="text"
                    sx={{ height: { xs: 'bookname.fontSize' }, width: '100%' }}
                  ></Skeleton>
                  <Skeleton
                    variant="text"
                    sx={{ height: 'subtitle2', width: '10%' }}
                  ></Skeleton>
                </>
              )}
            </Grid>
            <Grid item md={3}>
              {book ? (
                <>
                  {user._id !== book.owner && (
                    <Button variant="contained">Buy at ₹{book.price}</Button>
                  )}
                  {user._id === book.owner && (
                    <React.Fragment>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setEditBook(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setDeleteDialog(true);
                        }}
                      >
                        Delete
                      </Button>
                    </React.Fragment>
                  )}
                </>
              ) : (
                <>
                  <Skeleton
                    variant="text"
                    sx={{ height: { xs: '2em' }, width: '40%' }}
                  ></Skeleton>
                </>
              )}
            </Grid>
            <Grid item md={3}>
              <Divider />
              {book ? (
                <Typography variant="h5" sx={{ pt: 2 }}>
                  Tags :
                  {book.tags.map((tag) => {
                    return (
                      <Chip
                        label={tag}
                        key={tag}
                        size="small"
                        variant="outlined"
                      />
                    );
                  })}
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ height: { xs: '2em' }, width: '100%' }}
                ></Skeleton>
              )}
            </Grid>
            <Grid item md={3}>
              <Divider />
              {book ? (
                <React.Fragment>
                  <Typography variant="h5" sx={{ pt: 2 }}>
                    About
                  </Typography>
                  <Typography variant="body2">{book.about}</Typography>
                </React.Fragment>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ height: { xs: '2em' }, width: '100%' }}
                ></Skeleton>
              )}
            </Grid>
            <Grid item md={3}>
              <Divider />
              {book ? (
                <>
                  <Typography variant="h5" sx={{ pt: 2 }}>
                    Location
                  </Typography>
                  <Typography variant="body2">{book.location}</Typography>
                </>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ height: { xs: '2em' }, width: '10%' }}
                ></Skeleton>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
