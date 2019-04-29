import React, { Component } from 'react';
import ImageCellView from './imageCell';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon, Input, Popconfirm } from 'antd';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #797979 !important;
`;

const DateCell = data => {
  if (data && new Date(data) instanceof Date && !isNaN(new Date(data).valueOf())) 
    return <p>{new Date(data).toLocaleDateString()}</p>
  return <p></p>
}
const ImageCell = src => <ImageCellView src={src} />;
const LinkCell = (link, href) => <p><StyledLink to={href ? href : '#'}>{link}</StyledLink></p>;
const TextCell = text => <p>{text}</p>;

class EditableCell extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.check = this.check.bind(this);
    this.edit = this.edit.bind(this);
    this.state = {
      value: this.props.value,
      editable: false,
    };
  }
  handleChange(event) {
    const value = event.target.value;
    this.setState({ value });
  }
  check() {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(
        this.state.value,
        this.props.columnsKey,
        this.props.index,
      );
    }
  }
  edit() {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="isoEditData">
        {editable
          ? <div className="isoEditDataWrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon type="check" className="isoEditIcon" onClick={this.check} />
            </div>
          : <p className="isoDataWrapper">
              {value || ' '}
              <Icon type="edit" className="isoEditIcon" onClick={this.edit} />
            </p>}
      </div>
    );
  }
}
class DeleteCell extends Component {
  render() {
    const { index, onDeleteCell } = this.props;
    return (
      <Popconfirm
        title="Sure to delete?"
        okText="DELETE"
        cancelText="No"
        onConfirm={() => onDeleteCell(index)}
      >
      <div style={{ display: 'flex', alignItems: 'center'}}>
        <i className="ion-ios-trash-outline" style={{ color: "rgb(247, 93, 129)", fontSize: "18px", marginRight: "10px" }} />      
        <a style={{ color: "rgb(247, 93, 129)", fontSize: "12px" }}>
          Delete
        </a>
      </div>
      </Popconfirm>
    );
  }
}
class EditCell extends Component {
  render() {
    const { index, target } = this.props;
    return (
      <Link to={`${target}/edit/${index.id}`}>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <i className="ion-edit" style={{ color: "#4482FF", fontSize: "18px", marginRight: "10px" }} />      
          <div style={{ color: "#4482FF", fontSize: "12px" }}>
            Edit
          </div>
        </div>
      </Link>
    );
  }
}

class ExportCell extends Component {
  render() {
    const { onExportCell } = this.props;
    return (
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={onExportCell}>
        <i className="ion-ios-cloud-download" style={{ fontSize: "18px", marginRight: "10px" }} />      
        <a style={{ fontSize: "12px", color: 'grey' }}>
          Export
        </a>
      </div>
    );
  }
}

export { DateCell, EditCell, ImageCell, LinkCell, TextCell, EditableCell, DeleteCell, ExportCell };
