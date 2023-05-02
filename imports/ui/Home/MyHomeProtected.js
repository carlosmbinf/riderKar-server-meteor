import { useTracker } from 'meteor/react-meteor-data'
import Formulario from '../login/Login'
import Home from './Home'
import React from 'react';
import { Meteor } from 'meteor/meteor';
import LoginPage from '../login';





// Here we see the real benefit of hooks vs. containers
export const MyProtectedPage = () => {
 
  const currentUser = useTracker(() => Meteor.user(), []);
  
    return <div>{currentUser?<Home/>:<LoginPage/>}</div>
  
    

}