import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Form from '../../components/uielements/form';
import Input from '../../components/uielements/input';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Button from '../../components/uielements/button';
import styles from '../../config/FormElements/form-styles'
import projectStatusActions from '../../redux/project_status/actions';

const { insertProjectStatus, getProjectStatus, updateProjectStatus } = projectStatusActions;

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },         
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 5
    }
  }
};

class EditStatus extends React.Component {
  state = {
      newStatusName: '', 
      errorStatus: 1
  }
  constructor(props) {
    super(props)
    const { getProjectStatus } = props   
    const postData = { index: props.match.params.id }
    getProjectStatus({ postData })
  }
  handleInputChange = (name) => {
    const singleStatus = { name }
    this.setState({ singleStatus })
    this.setState({ errorStatus: 1 })
  }
  handleSubmit = () => {
    let { name } = this.state.singleStatus
    const statusNameTrimmed = name.replace(/\s/g, '')
    const errorStatus = statusNameTrimmed.length
    if ( errorStatus < 1) {
        this.setState({ errorStatus })        
    }
    else {
        this.submitUpdateRequest();
    }
  }
  componentWillReceiveProps(props) {
    const { singleStatus } = props
    this.setState({ singleStatus: Object.assign({}, singleStatus) })
  }
  submitUpdateRequest = () => {
    const { updateProjectStatus, match } = this.props
    const { singleStatus } = this.state
    singleStatus.id = parseInt(match.params.id, 10)
    updateProjectStatus({ postData: singleStatus })
  }
  render() {
    const { errorStatus, singleStatus } = this.state
    return (
      <LayoutContentWrapper>
        <PageHeader>Edit Project Status</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Project Status Name"
            validateStatus={ errorStatus > 0 ? "" : "error" }
            ref={(input) => { this.newStatusInput = input; }}  
            help={ errorStatus > 0 ? "" : "Project Status Name" }
          >
          {
            this.props.singleStatus !== undefined && (
              <Input 
                placeholder="Input New Project Status"
                value={singleStatus.name}
                onChange = { (e)=> this.handleInputChange(e.target.value) }
                id="error"  
              />
            )
          }
          </FormItem>
          <FormItem {...tailFormItemLayout}>
                <Button size='default' type="primary" onClick={() => this.handleSubmit()}>
                  Save
                </Button>
                <Link to="../../project_status">
                  <Button style={styles.marginBtn}>
                    Cancel
                  </Button>
                </Link>
          </FormItem>
        </Form>
        </Box>
      </LayoutContentWrapper>
    );
  }
}

EditStatus.propTypes = {
  singleStatus: PropTypes.array,
  insertProjectStatus: PropTypes.func,
  getProjectStatus: PropTypes.func,
  updateProjectStatus: PropTypes.func,  
}

export default connect(
    state => ({
      singleStatus: state.ProjectStatus.singleStatus
    }),
    { insertProjectStatus, getProjectStatus, updateProjectStatus }
  )(EditStatus);
