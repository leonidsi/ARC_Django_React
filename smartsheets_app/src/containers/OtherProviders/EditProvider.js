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
import otherProvidersAction from '../../redux/other_providers/actions';

const { getOtherProvider, updateOtherProvider } = otherProvidersAction;

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

class EditProvider extends React.Component {
  state = {
    singleProvider: {}
  }
  constructor(props) {
    super(props)
    const { getOtherProvider } = props
    const postData = { index: props.match.params.id }
    getOtherProvider({ postData })
  }
  componentWillReceiveProps(props) {
    const { singleProvider } = props
    this.setState({ singleProvider: Object.assign({}, singleProvider) })
  }
  handleInputChange = (type, val) => {
    const { singleProvider } = this.state
    singleProvider[type] = val
    this.setState({ singleProvider })
  }
  handleSubmit = () => {
    const { name } = this.state.singleProvider;
    if ( name.length > 0) {
        this.submitUpdateRequest();
    }
  }
  submitUpdateRequest = () => {
    const { updateOtherProvider, match } = this.props
    const { singleProvider } = this.state
    singleProvider.id = parseInt(match.params.id, 10)
    updateOtherProvider({ postData: singleProvider })
  }
  render() {
    const { singleProvider } = this.state
    return (
      <LayoutContentWrapper>
        <PageHeader>Edit Provider</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Provider Name"
          >
            <Input 
            placeholder="Input New Provider Name"
            value={singleProvider.name}
            onChange = { (e)=> this.handleInputChange('name', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button size='default' type="primary" onClick={() => this.handleSubmit()}>
              Save
            </Button>
            <Link to="../../other_providers">
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

EditProvider.propTypes = {
    getProjectType: PropTypes.func,
    updateProjectType: PropTypes.func,
    singleProvider: PropTypes.object,
}

export default connect(
    state => ({
        singleProvider: state.OtherProviders.singleProvider
    }),
    { getOtherProvider, updateOtherProvider }
)(EditProvider);
