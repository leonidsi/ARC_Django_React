import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Form from '../../components/uielements/form';
import Input from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import PageHeader from '../../components/utility/pageHeader';
import DatePicker from '../../components/uielements/datePicker';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Select, { SelectOption } from '../../components/uielements/select';
import Button from '../../components/uielements/button';
import styles from '../../config/FormElements/form-styles'
import clientsActions from '../../redux/clients/actions';
import naicsCodesActions from '../../redux/naics_codes/actions';

const { insertClient } = clientsActions;
const { fetchNaicsCodes } = naicsCodesActions;

const Option = SelectOption;
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

class AddNewClient extends React.Component {
  state = {
    singleClient: {}
  }
  componentWillMount() {
    const { fetchNaicsCodes } = this.props
    fetchNaicsCodes()
  }
  handleInputChange = (type, val) => {
    const { singleClient } = this.state
    singleClient[type] = val
    this.setState({ singleClient })
  }
  handleSubmit = () => {
    const { name } = this.state.singleClient;
    if ( name.length > 0) {
        this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertClient } = this.props
    const { singleClient } = this.state
    insertClient({ postData: singleClient })
  }
  render() {
    const { naicsCodesList, loading } = this.props
    return (
      <LayoutContentWrapper>
        <PageHeader>New Client</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Client Name"
          >
            <Input 
            placeholder="Input New Client Name"
            onChange = { (e)=> this.handleInputChange('name', e.target.value) }
            id="error"  
            />
          </FormItem>
          <FormItem
              style={styles.formItemMargin}
              {...formItemLayout}
              label="Naici Codes 1"
            >
              <Select
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                size="large" defaultValue="" onChange={(value, label) => this.handleInputChange('naics_code1_id', value)}>
                  <Option value="">Please choose a code</Option>
                  {
                    naicsCodesList !== undefined &&
                    naicsCodesList.sort((a, b) =>{
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    }).map((item, i) => {
                        return <Option key={`option${i}`} value={item.id}>{item.code} - {item.name}</Option>
                      })                 
                  }
              </Select>
          </FormItem>
          <FormItem
              style={styles.formItemMargin}
              {...formItemLayout}
              label="Naici Codes 2"
            >
              <Select
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              size="large" defaultValue="" onChange={(value, label) => this.handleInputChange('naics_code2_id', value)}>
                  <Option value="">Please choose a code</Option>
                  {
                    naicsCodesList !== undefined &&
                    naicsCodesList.map((item, i) => {
                        return <Option key={`option${i}`} value={item.id}>{item.code} - {item.name}</Option>
                      })                 
                  }
              </Select>
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Date Joined Pyx"
          >
            <DatePicker onChange={(date, dateString) => this.handleInputChange('dateJoinedPyx', dateString)} format="MM-DD-YYYY"/>
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Date Left Pyx"
          >
            <DatePicker onChange={(date, dateString) => this.handleInputChange('dateLeftPyx', dateString)} format="MM-DD-YYYY"/>
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="SNP 500"
          >
            <Input
            placeholder="Input SNP 500"
            onChange = { (e)=> this.handleInputChange('snp_500', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Fortune Level"
          >
            <Input
            placeholder="Input Fortune Level"
            onChange = { (e)=> this.handleInputChange('fortune_level', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Enterprise"
          >
            <Checkbox onChange={(e) => this.handleInputChange('enterprise', e.target.checked? true : false)} />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Great Place Most Admired"
          >
            <Checkbox onChange={(e) => this.handleInputChange('greatplace_mostadmired', e.target.checked? true : false, )} />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
              Save
            </Button>
            <Link to="../clients">
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

AddNewClient.propTypes = {
  naicsCodesList: PropTypes.array,
  insertClient: PropTypes.func,
  fetchNaicsCodes: PropTypes.func
}

export default connect(
    state => ({
      naicsCodesList: state.NaicsCodes.naicsCodesList,
      loading: state.Clients.loading
    }),
    { insertClient, fetchNaicsCodes }
)(AddNewClient);
