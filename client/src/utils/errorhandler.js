export const ErrorHandler = (errors, navigate) => {
  console.log('ErrorHandler');
  if (errors.misc) {
    console.log('ErrorHandler: misc error');
    console.log(errors.misc);
    switch (errors.misc.name) {
      case 'INVALID_TOKEN':
        navigate(`/Error/TOKEN ERROR/${errors.misc.message}`);
        break;
      case 'NOT_LOGGED_IN':
        navigate('/');
        break;
      case 'BOOK_NOT_FOUND':
        navigate('/Buy');
        break;
      default:
        break;
    }
    delete errors.misc;
  }
};
