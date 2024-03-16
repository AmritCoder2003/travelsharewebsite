import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_REQUIRE , VALIDATOR_MINLENGTH} from '../../shared/util/validators'
import './UpdatePlace.css'
import Card from '../../shared/components/UIElements/Card'
import { useForm } from '../../shared/hooks/form-hook'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../shared/context/auth-context'
const UpdatePlace = (Props) => {
    const placeId = useParams().placeId;
    const [loadedPlace, setLoadedPlace] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const Navigate=useNavigate();
    const Auth=useContext(AuthContext);
    const [formState,inputHandler,setFormData]=useForm(
        {
            title: {
                value:'',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    );
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/places/${placeId}`);
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            } catch (err) {
                setError(err.message);
            }
            setIsLoading(false);
        };
        fetchPlace();
    }, [placeId, setFormData,]);
  
    const placeUpdateSubmitHandler =async (event) => {
        event.preventDefault();
        try{
            const response=await fetch(`http://localhost:5000/api/places/${placeId}`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    title:formState.inputs.title.value,
                    description:formState.inputs.description.value
                })
            });
            const responseData=await response.json();
            if(!response.ok){
                throw new Error(responseData.message);
            }
            Navigate(`/users/${Auth.userId}`);
        }catch(err){
            setError(err.message);
        }
    }
    if (!loadedPlace && !error) {
        return (
            <div className='center' >
              <Card>
                <h2>Could not find place!</h2>
              </Card>
            </div>
        );
    }
   
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
     {!isLoading && loadedPlace &&
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={formState.inputs.title.value}
          initialValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 character)."
          onInput={inputHandler}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
        />

        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>}
    </React.Fragment>
  );
}

export default UpdatePlace