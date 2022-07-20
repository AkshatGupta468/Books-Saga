import { useRoutes } from 'react-router-dom';
import App from '../App';
import BookDetails from '../components/bookDetail';
import { Buy } from '../components/buy';
import Forgotpassword from '../components/forgotpassword';
import Login from '../components/login';
import Profile from '../components/profile';
import ResetPassword from '../components/resetpassword';
import { Sell } from '../components/sell';
import Signup from '../components/signup';
import { Welcome } from '../components/welcome';

export default function AppRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '',
          element: <Welcome />,
        },
        {
          path: 'log-in',
          element: <Login />,
        },
        {
          path: '/sign-up',
          element: <Signup />,
        },
        {
          path: '/forgot-password',
          element: <Forgotpassword />,
        },
        {
          path: '/resetPassword/:resetToken',
          element: <ResetPassword />,
        },
        {
          path: '/Buy',
          element: <Buy />,
        },
        {
          path: '/Sell',
          element: <Sell />,
        },
        {
          path: 'Profile',
          element: <Profile />,
        },
        {
          path: 'books/:bookid',
          element: <BookDetails />,
        },
        // {
        //   path: '*',
        //   element:
        // },
      ],
    },
  ]);
}
