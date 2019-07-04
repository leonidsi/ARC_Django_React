import clone from 'clone';
import _ from 'lodash';
import { DateCell, ImageCell, LinkCell, TextCell } from '../../config/TableView/helperCells';

const renderCell = (object, type, key, key2, href) => {
  let value = _.get(object, key);
  let value2 = '';
  if (key2) {
    value2 = _.get(object, key2);
    if (value2) {
      value = `${value} ${value2}`
    }
  }
  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(value);
    case 'LinkCell':
      return LinkCell(value, href);
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: "Client",
    key: 'clientName',
    render: object => renderCell(object, 'TextCell', 'clientName')
  },
  {
    title: "Project Name",
    key: 'name',
    render: object => renderCell(object, 'TextCell', 'name')
  },
  {
    title: "Survey ID",
    key: 'survey_id',
    render: object => renderCell(object, 'TextCell', 'survey_id')
  },
  {
    title: "Project Type",
    key: 'projectTypeName',
    render: object => renderCell(object, 'TextCell', 'projectTypeName')
  },
  {
    title: "Sales Executive",
    key: 'accountManagerName',
    render: object => renderCell(object, 'TextCell', 'accountManagerName')
  },
  {
    title: "Relationship Manager",
    key: 'relationshipManagerName',
    render: object => renderCell(object, 'TextCell', 'relationshipManagerName')
  },
  {
    title: "Project Manager",
    key: 'projectManagerName',
    render: object => renderCell(object, 'TextCell', 'projectManagerName')
  },
  {
    title: "Consultant",
    key: 'consultantName',
    render: object => renderCell(object, 'TextCell', 'consultantName')
  },
  {
    title: "Revenue",
    key: 'revenue',
    render: object => renderCell(object, 'TextCell', 'revenue')
  },
];
const sortColumns = [
  { ...columns[0], sorter: true },
  { ...columns[1], sorter: true },
  { ...columns[2], sorter: true },
  { ...columns[3], sorter: true },
  { ...columns[4], sorter: true },  
  { ...columns[5], sorter: true },
  { ...columns[6], sorter: true },
  { ...columns[7], sorter: true },
];
const tableInfo = {
    title: 'Sortable Table',
    value: 'sortView',
    columns: clone(sortColumns)
  };
export { columns, tableInfo };
