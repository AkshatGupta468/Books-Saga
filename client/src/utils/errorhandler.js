const { useNavigate } = require('react-router-dom');

export const ErrorHandler = (errors) => {
  if (errors.misc) {
    switch (errors.misc.name) {
      case 'INVALID_TOKEN':
        console.log('asdfadfasf');
        window.location.replace(`/Error/TOKEN ERROR/${errors.misc.message}`);
        delete errors.misc;
        break;
    }
  }
};
