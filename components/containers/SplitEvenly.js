import { useState } from 'react';
import SplitEvenlyForm from '../SplitEvenlyForm';

const SplitEvenly = () => {
  const [formValues, setFormValues] = useState({ totalAmount: 0, numWays: 1 });
  const formIsValid = formValues.totalAmount >= 0 && formValues.numWays > 0;

  return (
    <React.Fragment>
      <h4>Split evenly</h4>
      <SplitEvenlyForm values={formValues} onChange={setFormValues} />

      {formIsValid ?
        <div>Each way pays: <span className="text-danger">${(formValues.totalAmount / formValues.numWays).toFixed(2)}</span></div>
        :
        <div>Invalid values supplied.</div>
      }
    </React.Fragment>
  );
}

export default SplitEvenly;
