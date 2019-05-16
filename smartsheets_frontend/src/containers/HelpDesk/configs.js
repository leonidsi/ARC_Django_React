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
    render: object => renderCell(object, 'TextCell', 'client.name')
  },
  {
    title: "Project Name",
    key: 'name',
    render: object => {
      let value = _.get(object, 'name');
      let href = `/dashboard/projects/${_.get(object, 'id')}`;
      return LinkCell(value, href);
    }
  },
  {
    title: "Survey ID",
    key: 'survey_id',
    render: object => renderCell(object, 'TextCell', 'survey_id')
  },
  {
    title: "Project Manager",
    key: 'projectManagerName',
    render: object => renderCell(object, 'TextCell', 'projectManager.user.firstname', 'projectManager.user.lastname')
  },
];
const sortColumns = [
  { ...columns[0], sorter: true },
  { ...columns[1], sorter: true },
  { ...columns[2], sorter: true },
  { ...columns[3], sorter: true },
];
const tableInfo = {
    title: 'Sortable Table',
    value: 'sortView',
    columns: clone(sortColumns)
  };
export { columns, tableInfo };
