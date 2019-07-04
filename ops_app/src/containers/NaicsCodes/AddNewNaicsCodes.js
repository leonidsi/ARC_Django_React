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
import naicsCodesAction from '../../redux/naics_codes/actions';

const { insertNaicsCodes } = naicsCodesAction;

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

class AddNewNaicsCodes extends React.Component {
  state = {
    singleCode: {}
  }
  handleInputChange = (type, val) => {
    const { singleCode } = this.state
    singleCode[type] = val
    this.setState({ singleCode })
  }

  handleSubmit = () => {
    const { name } = this.state.singleCode;
    if ( name.length > 0) {
        this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertNaicsCodes } = this.props
    const { singleCode } = this.state
    insertNaicsCodes({ postData: singleCode })
  }
  render() {
    const { singleCode } = this.state
    const { loading } = this.props

    return (
      <LayoutContentWrapper>
        <PageHeader>New Naics Code</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Naics Code"
          >
            <Input 
            placeholder="Input New Naics Code"
            value={singleCode.code}
            onChange = { (e)=> this.handleInputChange('code', e.target.value) }
            id="error"  
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Naics Code Name"
          >
            <Input 
            placeholder="Input New Naics Code Name"
            value={singleCode.name}
            onChange = { (e)=> this.handleInputChange('name', e.target.value) }
            id="error"  
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
              Save
            </Button>
            <Link to="../naics_codes">
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

AddNewNaicsCodes.propTypes = {
  insertNaicsCodes: PropTypes.func,
}

export default connect(
    state => ({
      loading: state.NaicsCodes.loading
    }),
    { insertNaicsCodes }
)(AddNewNaicsCodes);
