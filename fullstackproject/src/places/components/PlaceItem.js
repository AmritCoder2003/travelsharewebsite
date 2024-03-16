import React, { useState ,useContext} from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import './PlaceItem.css';
import { AuthContext } from '../../shared/context/auth-context';
import Map from '../../shared/components/UIElements/Map';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
const PlaceItem = props => {
  
  const auth=useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  }
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  }
  const confirmDeleteHandler = async() => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try{
      const response = await fetch(`http://localhost:5000/api/places/${props.id}`, {
        method: 'DELETE'
      });   
      const responseData = await response.json();
      if(!response.ok){
        throw new Error(responseData.message);
      }
      console.log(responseData);
      props.onDelete(props.id); 
      isLoading(false);
    }
    catch(err){
      console.error("Error deleting place:", err);
      setError(err.message);
      setIsLoading(false);
    }
  }
  return (
    <React.Fragment>

     <ErrorModal error={error} onClear={() => setError(null)} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
      show={showConfirmModal}
      onCancel={cancelDeleteHandler}
       header="Are you sure" footerClass="place-item__modal-actions" footer={
        <React.Fragment>
          <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
        </React.Fragment>
      } >
        
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {auth.userId===props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {auth.userId===props.creatorId && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
