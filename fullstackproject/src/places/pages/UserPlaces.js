import React,{useState, useEffect} from 'react'
import PlaceList from '../components/PlaceList'
import { useParams } from 'react-router-dom'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const UserPlaces = () => {
    const userId = useParams().userId;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [loadedPlaces, setLoadedPlaces] = useState();
    useEffect(()=>{
      setIsLoading(true);
      const sendRequest=async()=>{
        try{
          const response=await fetch(`http://localhost:5000/api/places/user/${userId}`);
          const responseData=await response.json();
          if(!response.ok){
            throw new Error(responseData.message);
          }
          setIsLoading(false);
          setLoadedPlaces(responseData.places);
        }catch(err){
          console.log(err);
          setError(err.message);
          setIsLoading(false);
        }
      };
      sendRequest();
    },[userId]);
    const errorHandler=()=>{
      setError(null);
    }
    const placeDeletedHandler=(deletedPlaceId)=>{
      setLoadedPlaces(prevPlaces=>
        prevPlaces.filter(place=>place.id!==deletedPlaceId));
    }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
}

export default UserPlaces;