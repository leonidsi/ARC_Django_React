import clone from 'clone';
import { DateCell, ImageCell, LinkCell, TextCell } from '../../config/TableView/helperCells';

const renderCell = (object, type, key) => {
  const value = object[key];
  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(value);
    case 'LinkCell':
      return LinkCell(value);
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: 'Username',
    key: 'username',
    width: '20%',
    render: object => renderCell(object, 'TextCell', 'username')
  },
  {
    title: 'First Name',
    key: 'firstname',
    width: '20%',
    render: object => renderCell(object, 'TextCell', 'firstname')
  },
  {
    title: 'Last Name',
    key: 'lastname',
    width: '20%',
    render: object => renderCell(object, 'TextCell', 'lastname')
  },
  {
    title: 'Email',
    key: 'email',
    width: '20%',
    render: object => renderCell(object, 'TextCell', 'email')
  },
  {
    title: 'Role',
    key: 'role',
    width:'20%',
    render: object => renderCell(object, 'TextCell', 'role')
  },
  {
    title: 'Smartsheet Code',
    key: 'smartsheetCode',
    width:'20%',
    render: object => renderCell(object, 'TextCell', 'smartsheetCode')
  },
];
const sortColumns = [
  { ...columns[0], sorter: true },
  { ...columns[1], sorter: true },
  { ...columns[2], sorter: true },
  { ...columns[3], sorter: true },
  { ...columns[4], sorter: true },
  { ...columns[5], sorter: false },
];
const tableInfo = {
    title: 'Sortable Table',
    value: 'sortView',
    columns: clone(sortColumns)
  };
export { columns, tableInfo };
