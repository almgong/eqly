import { Table } from 'reactstrap';

// this component may benefit from bring memoized
const WaysTable = ({ ways, taxRate, tipRate, onRowClick }) => {
  // preprocess
  let totalSum = 0;
  const rows = Object.keys(ways).map((wayKey) => {
    const sum = ways[wayKey].reduce((acc, wayInfo) => acc + wayInfo.amount, 0);
    const tax = sum * (taxRate / 100);
    const tipPreTax = sum * (tipRate / 100);
    const finalSum = sum + tax + tipPreTax;

    totalSum += finalSum;

    return {
      wayKey,
      sum,
      tax,
      tipPreTax,
      finalSum
    };
  });

  return (
    <React.Fragment>
      <div className="mb-2">The total calculated cost is ${totalSum.toFixed(2)}. Please verify that this is correct.</div>
      <Table hover striped>
        <thead>
          <tr>
            <th>Way</th>
            <th>Total amount</th>
            <th>Tax</th>
            <th>Tip (pre-tax)</th>
            <th>Amount to pay</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.wayKey} onClick={() => onRowClick(row.wayKey)}>
              <td>{row.wayKey}</td>
              <td className="text-danger">${row.sum.toFixed(2)}</td>
              <td className="text-danger">${row.tax.toFixed(2)}</td>
              <td className="text-danger">${row.tipPreTax.toFixed(2)}</td>
              <td className="text-danger">${row.finalSum.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default WaysTable;
