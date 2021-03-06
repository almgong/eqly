import { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

import SplitIndividuallyForm from "../SplitIndividuallyForm";
import WaysTable from '../WaysTable';
import NewWayForm from '../NewWayForm';

const SplitIndividually = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  const [modalWayKey, setModalWayKey] = useState(null);
  const onRowClick = (wayKey) => {
    setModalOpen(true);
    setModalWayKey(wayKey);
  }

  // ways is in form: { 'way-key': [{ amount: <number> }, ...], ... }
  const [ways, setWays] = useState({});
  const onNewWayFormSubmit = (wayKey, wayInfo) => {
    setWays({ ...ways, [wayKey]: wayInfo});
    setModalOpen(false);
    setModalWayKey(null);
  };

  const [formValues, setFormValues] = useState({ tipRate: 15, taxRate: 7.25 });

  return (
    <React.Fragment>
      <h4>Split individually</h4>

      <SplitIndividuallyForm values={formValues} onChange={setFormValues} />

      <hr />

      <h5>Ways</h5>

      <Button className="mb-3" color="primary" onClick={() => setModalOpen(true)}>+ Add way</Button>

      <WaysTable ways={ways} taxRate={formValues.taxRate} tipRate={formValues.tipRate} onRowClick={onRowClick} />

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader>Add a new way</ModalHeader>
        <ModalBody>
          <NewWayForm onSubmit={onNewWayFormSubmit} onCancel={toggleModal} defaultWayKey={modalWayKey} defaultWayInfos={modalWayKey ? ways[modalWayKey] : null} />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default SplitIndividually;
