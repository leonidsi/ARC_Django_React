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
      if ((key === 'naicsCode1' || key === 'naicsCode2') && value) {
        return TextCell(`${value.code} - ${value.name}`)
      } else if (key === 'enterprise' || key === 'greatplace_mostadmired') {
        return TextCell(value ? 'YES' : 'NO');
      }
      return TextCell(value);
    }
  }
};

const columns = [
  {
    title: 'Client',
    key: 'name',
    render: object => renderCell(object, 'TextCell', 'name')
  },
  // {
  //   title: 'Naici Code 1',
  //   key: 'naicsCode1',
  //   render: object => renderCell(object, 'TextCell', 'naicsCode1')
  // },
  // {
  //   title: 'Naici Code 2',
  //   key: 'naicsCode2',
  //   render: object => renderCell(object, 'TextCell', 'naicsCode2')
  // },
  {
    title: 'Date joined pyx',
    key: 'date_joined_pyx',
    render: object => renderCell(object, 'TextCell', 'date_joined_pyx')
  },
  {
    title: 'Date left pyx',
    key: 'date_left_pyx',
    render: object => renderCell(object, 'TextCell', 'date_left_pyx')
  },
  // {
  //   title: 'Created date',
  //   key: 'createdDate',
  //   render: object => renderCell(object, 'DateCell', 'createdDate')
  // },
  // {
  //   title: 'SNP 500',
  //   key: 'snp_500',
  //   render: object => renderCell(object, 'TextCell', 'snp_500')
  // },
  // {
  //   title: 'Fortune Level',
  //   key: 'fortune_level',
  //   render: object => renderCell(object, 'TextCell', 'fortune_level')
  // },
  {
    title: 'Enterprise',
    key: 'enterprise',
    render: object => renderCell(object, 'TextCell', 'enterprise')
  },
  // {
  //   title: 'Greate Place Most Admired',
  //   key: 'greatplace_mostadmired',
  //   render: object => renderCell(object, 'TextCell', 'greatplace_mostadmired')
  // },
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
  { ...columns[1], sorter: (a, b) => cmp(a.date_joined_pyx, b.date_joined_pyx) },
  { ...columns[2], sorter: (a, b) => cmp(a.date_left_pyx, b.date_left_pyx) },
  { ...columns[3], sorter: true },
  // { ...columns[4], sorter: true },
  // { ...columns[5], sorter: true },
  // { ...columns[6], sorter: true },
  // { ...columns[7], sorter: true },
  // { ...columns[8], sorter: true },
  // { ...columns[9], sorter: true },
];
const tableInfo = {
    title: 'Sortable Table',
    value: 'sortView',
    columns: clone(sortColumns)
  };
export { columns, tableInfo };
