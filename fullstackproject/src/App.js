import './App.css';
import React,{useState,useCallback} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
const App = () => {
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [userId,setUserId]=useState(null);
  const login=useCallback((uid)=>{
    setIsLoggedIn(true);
    setUserId(uid);
    console.log(uid,"uid");
  },[]);
  const logout=useCallback(()=>{
    setIsLoggedIn(false);
    setUserId(null);
  },[]);
 
   return (
    <AuthContext.Provider value={{isLoggedIn:isLoggedIn,userId:userId,login:login,logout:logout}}>
      <Router>
        <MainNavigation />
        <main>
        <Routes>
          <Route path="/" exact element={<Users />} />
          <Route path="/:userId/places" exact element={<UserPlaces />} />
          <Route path="/places/new" exact element={<NewPlace/>}/>
          <Route path="/places/:placeId" exact element={<UpdatePlace/>}/>
          <Route path="/auth" element={<Auth/>} />
        </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
