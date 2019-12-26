import { useState } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const NewWayForm = ({ onSubmit, onCancel, defaultWayKey, defaultWayInfos }) => {
  // TODO: can replace with default props later
  defaultWayKey = defaultWayKey || '';
  defaultWayInfos = defaultWayInfos || [{ amount: '' }];

  const [wayKey, setWayKey] = useState(defaultWayKey);
  const [wayInfos, setWayInfos] = useState(defaultWayInfos);

  const onAmountChange = (index, value) => {
    const newWays = [...wayInfos];

    if (value) {
      newWays[index].amount = Number(value);
    } else {
      newWays[index].amount = '';
    }

    setWayInfos(newWays);
  };

  const onAddAmountClick = () => {
    setWayInfos([...wayInfos, { amount: '' }]);
  };

  const invalidValues = !wayKey || wayInfos.some((wayInfo) => typeof wayInfo.amount !== 'number');

  return (
    <React.Fragment>
      <Form>
        <FormGroup>
          <Label for="way_key">Way identifier</Label>
          <Input value={wayKey} onChange={(e) => setWayKey(e.target.value || '')} type="text" id="way_key" name="way_key" />
        </FormGroup>

        {wayInfos.map((wayInfo, index) =>
          <FormGroup>
            <Label for={`amount-${index}`}>Amount</Label>
            <InputGroup>
              <InputGroupAddon addonType="append">
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <Input value={wayInfo.amount} onChange={(e) => onAmountChange(index, e.target.value)} type="number" id={`amount-${index}`} name={`amount-${index}`} />
            </InputGroup>
          </FormGroup>
        )}

        <Button onClick={onAddAmountClick} color="success" className="btn-block">
          <FontAwesomeIcon size="1x" icon={faPlusCircle} />
          Add amount
        </Button>
      </Form>

      <hr />

      <Button disabled={invalidValues} className="mr-2" color="primary" onClick={() => onSubmit(wayKey, wayInfos)}>Submit</Button>
      <Button color="secondary" onClick={onCancel}>Cancel</Button>
    </React.Fragment>
  );
};

export default NewWayForm;
