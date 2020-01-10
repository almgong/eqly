import { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

import SplitIndividuallyForm from "../SplitIndividuallyForm";
import WaysTable from '../WaysTable';
import NewWayForm from '../NewWayForm';
import ReceiptScanner from '../ReceiptScanner';
import BulkEditWaysForm from '../BulkEditWaysForm';

const SplitIndividually = () => {
  const [wayModalOpen, setWayModalOpen] = useState(false);
  const toggleWayModal = () => setWayModalOpen(!wayModalOpen);

  const [modalWayKey, setModalWayKey] = useState(null);
  const onRowClick = (wayKey) => {
    setWayModalOpen(true);
    setModalWayKey(wayKey);
  }

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const toggleBulkModal = () => setBulkModalOpen(!bulkModalOpen);

  // ways is in form: { 'way-key': [{ amount: <number> }, ...], ... }
  const [ways, setWays] = useState({});
  const onNewWayFormSubmit = (wayKey, wayInfo) => {
    setWays({ ...ways, [wayKey]: wayInfo});
    setWayModalOpen(false);
    setModalWayKey(null);
  };

  const [formValues, setFormValues] = useState({ tipRate: 15, taxRate: 7.25 });

  const onWaysUpdate = (newWays) => {
    setWays({ ...ways, ...newWays });
  };

  const onBulkEditWaysFormSubmit = (newWays) => {
    setWays(newWays);
    setBulkModalOpen(false);
  };

  return (
    <React.Fragment>
      <h4>Split individually</h4>

      <SplitIndividuallyForm values={formValues} onChange={setFormValues} />

      <hr />

      <h5>Ways</h5>

      <Button className="mb-3 mr-2" color="primary" onClick={toggleWayModal}>+ Add way</Button>
      <Button className="mb-3 mr-2" color="info" onClick={toggleBulkModal}>Bulk edit</Button>
      <ReceiptScanner onReceiptScan={onWaysUpdate} />

      <WaysTable ways={ways} taxRate={formValues.taxRate} tipRate={formValues.tipRate} onRowClick={onRowClick} />

      <Modal isOpen={wayModalOpen} toggle={toggleWayModal}>
        <ModalHeader toggle={toggleWayModal}>Add a new way</ModalHeader>
        <ModalBody>
          <NewWayForm onSubmit={onNewWayFormSubmit} onCancel={toggleWayModal} defaultWayKey={modalWayKey} defaultWayInfos={modalWayKey ? ways[modalWayKey] : null} />
        </ModalBody>
      </Modal>

      <Modal isOpen={bulkModalOpen} toggle={toggleBulkModal}>
        <ModalHeader toggle={toggleBulkModal}>Bulk edit ways</ModalHeader>
        <ModalBody>
          <BulkEditWaysForm ways={ways} onSubmit={onBulkEditWaysFormSubmit} onCancel={toggleBulkModal} />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default SplitIndividually;
