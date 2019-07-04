import clone from 'clone'
import _ from 'lodash'
import { DateCell, ImageCell, LinkCell, TextCell } from '../../config/TableView/helperCells';

const renderCell = (object, type, key) => {
  const value = _.get(object,key);
  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(value);
    case 'LinkCell':
      return LinkCell(value);
    default: {
      // if ((key === 'naicsCode1' || key === 'naicsCode2') && value) {
      //   return TextCell(`${value.code} - ${value.name}`)
      // } else if (key === 'enterprise' || key === 'greatplace_mostadmired') {
      //   return TextCell(value ? 'YES' : 'NO');
      // }
      return TextCell(value);
    }
  }
};

const columns = [
  {
    title: 'Contract Number',
    key: 'contract_number',
    render: object => renderCell(object, 'TextCell', 'contract_number')
  },
  {
    title: 'Client Name',
    key: 'clientName',
    render: object => renderCell(object, 'TextCell', 'clientName')
  },
  {
    title: 'Contract Name',
    key: 'name',
    render: object => renderCell(object, 'TextCell', 'name')
  },  
  {
    title: 'Date Current Contract Signed',
    key: 'date_current_contract_signed',
    render: object => renderCell(object, 'TextCell', 'date_current_contract_signed')
  },
  {
    title: 'Current Contract Term (Years)',
    key: 'current_contract_term',
    render: object => renderCell(object, 'TextCell', 'current_contract_term')
  },
  {
    title: 'Total Contract Value',
    key: 'total_contract_value',
    render: object => renderCell(object, 'TextCell', 'total_contract_value')
  },
  {
    title: 'Contract Type',
    key: 'contract_type',
    render: object => renderCell(object, 'TextCell', 'contract_type')
  },
  {
    title: 'Extension of Contract',
    key: 'extension_contract',
    render: object => renderCell(object, 'TextCell', 'extension_contract')
  },
  {
    title: 'Annual Subscription',
    key: 'annual_subscription',
    render: object => renderCell(object, 'TextCell', 'annual_subscription')
  },
  {
    title: 'Sales Rep',
    key: 'salesRepName',
    render: object => renderCell(object, 'TextCell', 'salesRepName')
  },
  {
    title: 'Relationship Manager',
    key: 'relationshipManagerName',
    render: object => renderCell(object, 'TextCell', 'relationshipManagerName')
  },
  {
    title: 'Status',
    key: 'status',
    render: object => renderCell(object, 'TextCell', 'status')
  }
];

function cmp(a, b) {
  if (!a) {
    return -1;
  } else if (!b) {
    return 1;
  } else {
    a = a.substring(6, 10) + a.substring(0, 6)
    b = b.substring(6, 10) + b.substring(0, 6)
    if (a<b) {
      return 1;
    } else if(a>b) {
      return -1;
    } else {
      return 0;
    }
  }  
}

const sortColumns = [
  { ...columns[0], sorter: true },
  { ...columns[1], sorter: true },
  { ...columns[2], sorter: true },
  { ...columns[3], sorter: (a, b) => cmp(a.date_current_contract_signed, b.date_current_contract_signed) },
  { ...columns[4], sorter: true },
  { ...columns[5], sorter: true },
  { ...columns[6], sorter: true },
  { ...columns[7], sorter: true },
  { ...columns[8], sorter: true },
  { ...columns[9], sorter: true },
  { ...columns[10], sorter: true },
  { ...columns[11], sorter: true },
];
const tableInfo = {
    title: 'Sortable Table',
    value: 'sortView',
    columns: clone(sortColumns)
  };
export { columns, tableInfo };
