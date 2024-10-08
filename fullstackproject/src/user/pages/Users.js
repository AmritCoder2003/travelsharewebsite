import React,{useEffect,useState} from 'react'
import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
const Users =() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();
  useEffect(()=>{
    const sendRequest=async()=>{
      setIsLoading(true);
      try{
        const response=await fetch('https://travelsharewebsite.onrender.com/api/users');
        const responseData=await response.json();
        if(!response.ok){
          throw new Error(responseData.message);
        }
        setLoadedUsers(responseData.users);
        setIsLoading(false);
      }catch(err){
        console.log(err);
        setError(err.message);  
        setIsLoading(false);
      }
    };
    sendRequest();
  },[]);
  const errorHandler=()=>{
    setError(null);
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler}/>
      {isLoading && (
        <div className="center">
          <LoadingSpinner/>
        </div>
        )}
    {!isLoading && loadedUsers && <UsersList items={  loadedUsers} />}
    </React.Fragment>
  )
}

export default Users
