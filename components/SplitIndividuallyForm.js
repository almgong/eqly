import {
  Form,
  FormGroup,
  Label,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup
} from 'reactstrap';

const SplitIndividuallyForm = ({ values, onChange }) => {
  const onTaxRateChange = (e) => {
    const newTaxRate = e.target.value || '';
    onChange({ ...values, taxRate: newTaxRate });
  };

  const onTipRateChange = (e) => {
    const newTipRate = e.target.value || '';
    onChange({ ...values, tipRate: newTipRate });
  };

  return (
    <React.Fragment>
      <Form>
        <FormGroup>
          <Label for="tax_rate">Tax rate</Label>
          <InputGroup>
            <Input value={values.taxRate} onChange={onTaxRateChange} type="number" id="tax_rate" name="tax_rate" />
            <InputGroupAddon addonType="append">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label for="tip_rate">Tip rate</Label>
          <InputGroup>
            <Input value={values.tipRate} onChange={onTipRateChange} type="number" id="tip_rate" name="tip_rate" />
            <InputGroupAddon addonType="append">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

export default SplitIndividuallyForm;
