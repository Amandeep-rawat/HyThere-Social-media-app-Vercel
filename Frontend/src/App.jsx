import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './Redux/socketSlice';
import { setOnlineUsers } from './Redux/chatSlice';
import { setLikeNotification } from './Redux/RTnotification';

import MainLayout from './components/layouts/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const Router = createBrowserRouter([
    {
      path: '/',
      element: <ProtectedRoute><MainLayout /></ProtectedRoute> ,
      children: [
        { path: '/', element: <ProtectedRoute> <Home /></ProtectedRoute> },
        { path: '/profile/:id', element: <ProtectedRoute> <Profile /></ProtectedRoute> },
        { path: '/profile/edit', element: <ProtectedRoute><EditProfile /></ProtectedRoute>  },
        { path: '/chat', element:<ProtectedRoute><ChatPage /></ProtectedRoute>  },
      ],
    },
    { path: '/signup', element: <SignUp /> },
    { path: '/login', element: <LogIn /> },
  ]);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socketIo);

  useEffect(() => {
    let socketIo;

    if (user) {
      socketIo = io(import.meta.env.VITE_URL, {
        query: { userId: user?._id },
        transports: ['websocket'],
      });
      dispatch(setSocket(socketIo));

      // Listening to socket events
      socketIo.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketIo.on('notification', (notification) => {
        console.log("notification aer ",notification);
        dispatch(setLikeNotification(notification));
      });
    }

    return () => {
      // Cleanup on unmount or when user changes
      if (socketIo) {
        socketIo.off('getOnlineUsers');
        socketIo.off('notification');
        socketIo.close();
        dispatch(setSocket(null));
      }
    };
  }, [user, dispatch]);

  return <RouterProvider router={Router} />;
};

export default App;
