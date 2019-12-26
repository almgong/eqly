import {
  Form,
  FormGroup,
  Label,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup
} from 'reactstrap';

const SplitEvenlyForm = ({ values, onChange }) => {
  const onTotalAmountChange = (e) => {
    let newAmount;
    if (e.target.value) {
      newAmount = Number(e.target.value);
    }

    onChange({ ...values, totalAmount: newAmount });
  };

  const onNumWaysChange = (e) => {
    let newNumWays;
    if (e.target.value) {
      newNumWays = Number(e.target.value);
    }

    onChange({ ...values, numWays: newNumWays });
  };

  return (
    <React.Fragment>
      <Form>
        <FormGroup>
          <Label for="amount">Total amount</Label>
          <InputGroup>
            <InputGroupAddon addonType="append">
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <Input value={values.totalAmount} onChange={onTotalAmountChange} type="number" id="amount" name="amount" />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label for="num_ways">Number of ways to split</Label>
          <Input value={values.numWays} onChange={onNumWaysChange} type="number" id="num_ways" name="num_ways" />
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

export default SplitEvenlyForm;
