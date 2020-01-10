import { useState } from 'react';
import {
  Button,
  Input,
  Table
} from 'reactstrap';

export default function BulkEditWaysForm({ ways, onSubmit, onCancel }) {
  const [cloneOfWays, setCloneOfWays] = useState(JSON.parse(JSON.stringify(ways)));
  let waySelections = {};

  const onWayChange = (wayKey, checked) => {
    if (checked) {
      waySelections[wayKey] = true;
    } else {
      delete waySelections[wayKey];
    }
  };

  const onDeleteClick = () => {
    const newCloneOfWays = {};
    Object.keys(cloneOfWays).forEach((wayKey) => {
      if (!waySelections[wayKey]) {
        newCloneOfWays[wayKey] = cloneOfWays[wayKey];
      }
    });

    setCloneOfWays(newCloneOfWays);
    waySelections = {};
  };

  const onMergeClick = () => {
    const wayKeys = Object.keys(waySelections).sort();

    if (wayKeys.length > 1) {
      const destinationKey = wayKeys.splice(0, 1)[0];

      const newCloneOfWays = { ...cloneOfWays };
      wayKeys.forEach((wayKey) => {
        const wayInfo = newCloneOfWays[wayKey];
        newCloneOfWays[destinationKey] = newCloneOfWays[destinationKey].concat(wayInfo);
        delete newCloneOfWays[wayKey];
      });

      setCloneOfWays(newCloneOfWays);
    }

    waySelections = {};
  };
  const onSubmitClick = () => onSubmit(cloneOfWays);

  return (
    <React.Fragment>
      <Button color="success" className="mr-2" onClick={onMergeClick}>Merge</Button>
      <Button color="danger" onClick={onDeleteClick}>Delete</Button>
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>Way</th>
          </tr>
        </thead>
        <tbody>
        {Object.keys(cloneOfWays).sort().map((wayKey) => (
          <tr key={wayKey}>
            <td>
              <Input onChange={(e) => onWayChange(wayKey, e.target.checked)} type="checkbox" style={{ postion: 'initial', marginLeft: 0 }} />
            </td>
            <td>{wayKey}</td>
          </tr>
        ))}
        </tbody>
      </Table>

      <hr />

      <Button className="mr-2" color="primary" onClick={onSubmitClick}>Submit</Button>
      <Button color="secondary" onClick={onCancel}>Cancel</Button>
    </React.Fragment>
  );
};
