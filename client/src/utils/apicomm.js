const axios = require('axios');

export const books = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 20000,
});
export const setAuthToken = (token) => {
  if (token) {
    books.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else delete books.defaults.headers.common.Authorization;
};
export const loginRequest = (data) =>
  new Promise((resolve, reject) => {
    const payload = {
      email: data.get('email'),
      password: data.get('password'),
    };
    console.log(payload);
    books
      .post('/users/login', payload)
      .then((response) => {
        console.log(response.data);
        const { token } = response.data;

        //set JWT token to local
        if (data.get('rememberMe')) localStorage.setItem('token', token);
        else sessionStorage.setItem('token', token);

        //set token to axios common header
        setAuthToken(token);
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
export const signupRequest = (data) =>
  new Promise((resolve, reject) => {
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      passwordConfirm: data.get('confirmpassword'),
    };

    books
      .post(`/users/signup`, payload)
      .then((response) => {
        console.log(response.data);
        const { token } = response.data;

        //set JWT token to local
        if (data.get('rememberMe')) localStorage.setItem('token', token);
        else sessionStorage.setItem('token', token);

        //set token to axios common header
        setAuthToken(token);
        resolve();
      })
      .catch((err) => {
        console.log(err);
        console.log('recevied response with error');
        reject(err.response.data.errors);
      });
  });
export const forgorPasswordRequest = (body) => {
  return new Promise((resolve, reject) => {
    body.resetURL = `${window.location.origin}/resetPassword`;
    books
      .post(`users/forgotPassword`, body)
      .then((response) => {
        console.log(response.data);
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};
export const resetPasswordRequest = (resetToken, data) => {
  return new Promise((resolve, reject) => {
    const payload = {
      password: data.get('password'),
      passwordConfirm: data.get('confirmpassword'),
    };
    books
      .patch(`/users/resetPassword/${resetToken}`, payload)
      .then((response) => {
        console.log(response.data);
        // const { token } = response.data;

        // //set JWT token to local
        // if (data.get('rememberMe')) localStorage.setItem('token', token);
        // else sessionStorage.setItem('token', token);

        // //set token to axios common header
        // setAuthToken(token);
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};

export const getUserRequest = () => {
  return new Promise((resolve, reject) => {
    console.log('getUserRequest');
    books
      .get(`/users/Details`)
      .then((response) => {
        console.log(response.data);
        resolve(response.data.data.user);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};

export const getBooksRequest = () => {
  return new Promise((resolve, reject) => {
    console.log('getBooksRequest');
    books
      .get(`/books`)
      .then((response) => {
        console.log(response.data);
        resolve(response.data.data.books);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};
export const getMyBooksRequest = () => {
  return new Promise((resolve, reject) => {
    console.log('getMyBooksRequest');
    books
      .get(`/books/getMyBooks`)
      .then((response) => {
        console.log(response.data);
        resolve(response.data.data.books);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};
export const addBookRequest = (bookFormData) => {
  return new Promise((resolve, reject) => {
    console.log('addBookRequest');
    books
      .post(`/books`, bookFormData)
      .then((response) => {
        console.log(response.data);
        resolve(response.data.data.books);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};

export const getBookDetailRequest = (bookid) => {
  return new Promise((resolve, reject) => {
    console.log('getBookDetail');
    books
      .get(`/books/${bookid}`)
      .then((response) => {
        console.log(response.data);
        resolve(response.data.data.book);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};
export const deleteBookRequest = (bookid) => {
  return new Promise((resolve, reject) => {
    console.log('delete Book');
    books
      .delete(`/books/${bookid}`)
      .then((response) => {
        console.log(response.data);
        resolve(response.data.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};
