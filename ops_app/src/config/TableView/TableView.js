import React, { Component } from 'react';
import clone from 'clone';
import TableWrapper from './antTable.style';
import { DeleteCell, EditCell, ExportCell } from './helperCells';

export class TableView extends Component {
  constructor(props) {
    super(props);
    const { tableInfo, target, editCellShown, deleteCellShown, exportCell } = this.props;
    this.state = {
      columns: this.createcolumns(clone(tableInfo.columns), target, editCellShown, deleteCellShown, exportCell),      
    };
  }
  createcolumns = (columns, target, editCellShown, deleteCellShown, exportCell) => {
    const deleteColumn = {
      title: 'Delete',
      dataIndex: 'Delete',
      render: (text, record, index) => {
        if (record.role && record.role === "Account Owner") {
          return null
        } else 
          return <DeleteCell index={record} onDeleteCell={this.onDeleteCell} />
      }
    };
    const editColumn = {
      title: 'Edit',
      dataIndex: 'Edit',
      render: (text, record, index) => {
        if (record.role && record.role === "Account Owner") {
          return null
        } else 
          return <EditCell index={record} target={target} />
      }
    };
    const exportColumn = {
      title: 'Export',
      dataIndex: 'Export',
      render: (text, record) => {
        return <ExportCell onExportCell={() => {this.props.exportCell(record);}} />
      }
    };
    if (editCellShown !== false)
      columns.push(editColumn);
    if (deleteCellShown !== false)
      columns.push(deleteColumn);
    if (exportCell) {
      columns.push(exportColumn);
    }    
    return columns;
  }
  onDeleteCell = index => {
    this.props.deleteCell(index);    
  };
  onChange = (pagination, filters, sorter) => {
    const { dataList } = this.props;   
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        dataList.getSortAsc(sorter.columnKey);
      } else {
        dataList.getSortDesc(sorter.columnKey);
      }
      this.setState({ dataList: dataList.getAll() });
    }
  }
  render() {
    const { columns } = this.state;
    const { dataList } = this.props
    return (
      <TableWrapper
        columns={columns}
        onChange={this.onChange}
        dataSource={dataList.getAll()}
        className="isoSortingTable"
        pagination={{ pageSizeOptions: ['10', '25', '100', '500'], showSizeChanger: true, pageSize: 100 }}
        // scroll={{ y: 240 }}
      />
    );
  }
}
