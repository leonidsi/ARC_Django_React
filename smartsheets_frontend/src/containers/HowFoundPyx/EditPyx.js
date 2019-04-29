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
import howFoundPyxAction from '../../redux/how_found_pyx/actions';

const { getHowFoundPyx, updateHowFoundPyx } = howFoundPyxAction;

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

class EditPyx extends React.Component {
  state = {
    singlePyx: {}
  }
  constructor(props) {
    super(props)
    const { getHowFoundPyx } = props
    const postData = { index: props.match.params.id }
    getHowFoundPyx({ postData })
  }
  componentWillReceiveProps(props) {
    const { singlePyx } = props
    this.setState({ singlePyx: Object.assign({}, singlePyx) })
  }
  handleInputChange = (type, val) => {
    const { singlePyx } = this.state
    singlePyx[type] = val
    this.setState({ singlePyx })
  }
  handleSubmit = () => {
    const { name } = this.state.singlePyx;
    if ( name.length > 0) {
      this.submitUpdateRequest();
    }
  }
  submitUpdateRequest = () => {
    const { updateHowFoundPyx, match } = this.props
    const { singlePyx } = this.state
    singlePyx.id = parseInt(match.params.id, 10)
    updateHowFoundPyx({ postData: singlePyx })
  }
  render() {
    const { singlePyx } = this.state
    return (
      <LayoutContentWrapper>
        <PageHeader>Edit Pyx</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="How Found Pyx"
          >
            <Input 
            placeholder="Input Pyx"
            value={singlePyx.name}
            onChange = { (e)=> this.handleInputChange('name', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button size='default' type="primary" onClick={() => this.handleSubmit()}>
              Save
            </Button>
            <Link to="../../how_found_pyx">
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

EditPyx.propTypes = {
    getHowFoundPyx: PropTypes.func,
    updateHowFoundPyx: PropTypes.func,
    singlePyx: PropTypes.object
}

export default connect(
    state => ({
        singlePyx: state.HowFoundPyx.singlePyx
    }),
    { getHowFoundPyx, updateHowFoundPyx }
)(EditPyx);
