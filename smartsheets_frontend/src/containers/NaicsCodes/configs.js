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
    title: "Naics Code",
    key: 'code',
    width: '30%',
    render: object => renderCell(object, 'TextCell', 'code')
  },
  {
    title: "Naics Name",
    key: 'name',
    width: '30%',
    render: object => renderCell(object, 'TextCell', 'name')
  }
];
const sortColumns = [
  { ...columns[0], sorter: true },
  { ...columns[1], sorter: true },
];
const tableInfo = {
    title: 'Sortable Table',
    value: 'sortView',
    columns: clone(sortColumns)
  };
export { columns, tableInfo };
