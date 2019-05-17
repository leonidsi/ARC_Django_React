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
import projectTypesActions from '../../redux/project_types/actions';

const { getProjectType, updateProjectType } = projectTypesActions;

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

class EditType extends React.Component {
  state = {
      errorStatus: 1
  }
  constructor(props) {
    super(props)
    const { getProjectType } = props   
    const postData = { index: props.match.params.id }
    getProjectType({ postData })
  }
  componentWillReceiveProps(props) {
    const { singleType } = props
    this.setState({ singleType: Object.assign({}, singleType) })
  }
  handleInputChange = (name) => {
    const singleType = { name }
    this.setState({ singleType })
    this.setState({ errorStatus: 1 })
  }
  handleSubmit = () => {
    let { name } = this.state.singleType
    const typeNameTrimmed = name.replace(/\s/g, '')
    const errorStatus = typeNameTrimmed.length
    if ( errorStatus < 1) {
        this.setState({ errorStatus })        
    }
    else {
        this.submitUpdateRequest();
    }
  }
  submitUpdateRequest = () => {
    const { updateProjectType, match } = this.props
    const { singleType } = this.state
    singleType.id = parseInt(match.params.id, 10)
    updateProjectType({ postData: singleType })
  }
  render() {
    const { errorStatus, singleType } = this.state
    const { loading } = this.props

    return (
      <LayoutContentWrapper>
        <PageHeader>Edit Project Type</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Project Type Name"
            validateStatus={ errorStatus > 0 ? "" : "error" }
            ref={(input) => { this.newTypeInput = input; }}  
            help={ errorStatus > 0 ? "" : "Project Type Name" }
          >
            {
              this.props.singleType !== undefined && (
                  <Input 
                  placeholder="Input New Project Type"
                  value={singleType.name}
                  onChange = { (e)=> this.handleInputChange(e.target.value) }
                  id="error"  
                  />
              )
            }
          </FormItem>
          <FormItem {...tailFormItemLayout}>
                <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
                  Save
                </Button>
                <Link to="../../project_types">
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

EditType.propTypes = {
  singleType: PropTypes.array,
  getProjectType: PropTypes.func,
  updateProjectType: PropTypes.func
}

export default connect(
    state => ({
      singleType: state.ProjectTypes.singleType,
      loading: state.ProjectTypes.loading        
    }),
    { getProjectType, updateProjectType }
  )(EditType);
