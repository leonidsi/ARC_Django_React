import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Form from '../../components/uielements/form';
import Input from '../../components/uielements/input';
import PageHeader from '../../components/utility/pageHeader';
import DatePicker from '../../components/uielements/datePicker';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Select, { SelectOption } from '../../components/uielements/select';
import Button from '../../components/uielements/button';
import styles from '../../config/FormElements/form-styles';
import contractsActions from '../../redux/contracts/actions';
import clientsActions from '../../redux/clients/actions';
import accountMgrActions from '../../redux/account_mgrs/actions';
import relationshipMgrActions from '../../redux/relationship_mgrs/actions';

const { insertContract } = contractsActions;
const { fetchClients } = clientsActions;
const { fetchAccountMgrs } = accountMgrActions;
const { fetchRelationshipMgrs } = relationshipMgrActions;

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
const dateFormatList = ["MM-DD-YYYY", "MM/DD/YYYY", "MM.DD.YYYY", "MMM DD YYYY"];

class AddNewContract extends React.Component {
  state = {
    singleContract: {}
  }
  componentWillMount() {
    const { 
      fetchClients,
      fetchAccountMgrs,
      fetchRelationshipMgrs,
    } = this.props;    

    fetchClients()
    fetchAccountMgrs()
    fetchRelationshipMgrs()
  }
  handleInputChange = (type, val) => {
    const { singleContract } = this.state
    singleContract[type] = val
    this.setState({ singleContract })
  }
  handleSubmit = () => {
    console.log(72, this.state)
    const { name } = this.state.singleContract;
    if ( name.length > 0) {
        this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertContract } = this.props
    const { singleContract } = this.state
    insertContract({ postData: singleContract })
  }
  render() {
    const { 
      clientsList,
      accountMgrsList,
      relationshipMgrsList,
      loading 
    } = this.props
    return (
      <LayoutContentWrapper>
        <PageHeader>New Contract</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Contract Number"
          >
            <Input 
            placeholder="Input New Contract Number"
            onChange = { (e)=> this.handleInputChange('contract_number', e.target.value) }
            id="error"  
            />
          </FormItem>
          <FormItem
              style={styles.formItemMargin}
              {...formItemLayout}
              label="Client Name"
            >
              <Select
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                size="large" defaultValue="" onChange={(value, label) => this.handleInputChange('client_id', value)}>
                  <Option value="">Please choose a client</Option>
                  {
                    clientsList !== undefined &&
                    clientsList.sort((a, b) =>{
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    }).map((item, i) => {
                        return <Option key={`option${i}`} value={item.id}>{item.name}</Option>
                      })                 
                  }
              </Select>
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Contract Name"
          >
            <Input
            placeholder="Input Contract Name"
            onChange = { (e)=> this.handleInputChange('name', e.target.value) }
            id="error"
            />
          </FormItem>          
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Date Current Contract Signed"
          >
            <DatePicker onChange={(date, dateString) => this.handleInputChange('date_current_contract_signed', dateString)} format={dateFormatList}/>
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Current Contract Term (Years)"
          >
            <Input
            placeholder="Input Current Contract Term (Years)"
            onChange = { (e)=> this.handleInputChange('current_contract_term', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Total Contract Value"
          >
            <Input
            placeholder="Input Total Contract Value"
            onChange = { (e)=> this.handleInputChange('total_contract_value', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Contract Type"
          >
            <Input
            placeholder="Input Contract Type"
            onChange = { (e)=> this.handleInputChange('contract_type', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Extension of Contract"
          >
            <Input
            placeholder="Input Extension of Contract"
            onChange = { (e)=> this.handleInputChange('extension_contract', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Annual Subscription"
          >
            <Input
            placeholder="Input Annual Subscription"
            onChange = { (e)=> this.handleInputChange('annual_subscription', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem
              style={styles.formItemMargin}
              {...formItemLayout}
              label="Sales Rep"
            >
              <Select
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                size="large" defaultValue="" onChange={(value, label) => this.handleInputChange('sales_rep_id', value)}>
                  <Option value="">Please choose a Sales Rep</Option>
                  {
                    accountMgrsList !== undefined &&
                    accountMgrsList.sort((a, b) =>{
                      if(a.user.firstname < b.user.firstname) { return -1; }
                      if(a.user.firstname > b.user.firstname) { return 1; }
                      return 0;
                    }).map((item, i) => {
                        return <Option key={`option${i}`} value={item.id}>{`${item.user.firstname} ${item.user.lastname}`}</Option>
                      })                 
                  }
              </Select>
          </FormItem>
          <FormItem
              style={styles.formItemMargin}
              {...formItemLayout}
              label="Relationship Manager"
            >
              <Select
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                size="large" defaultValue="" onChange={(value, label) => this.handleInputChange('relationship_manager_id', value)}>
                  <Option value="">Please choose a Relationship Manager</Option>
                  {
                    relationshipMgrsList !== undefined &&
                    relationshipMgrsList.sort((a, b) =>{
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    }).map((item, i) => {
                        return <Option key={`option${i}`} value={item.id}>{item.name}</Option>
                      })                 
                  }
              </Select>
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Status"
          >
            <Input
            placeholder="Input Status"
            onChange = { (e)=> this.handleInputChange('status', e.target.value) }
            id="error"
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
              Save
            </Button>
            <Link to="../contracts">
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

AddNewContract.propTypes = {  
  insertContract: PropTypes.func,
  clientsList: PropTypes.array,
  fetchClients: PropTypes.func,
  accountMgrsList: PropTypes.array,
  fetchAccountMgrs: PropTypes.func,
  relationshipMgrsList: PropTypes.array,
  fetchRelationshipMgrs: PropTypes.func
}

export default connect(
    state => ({
      clientsList: state.Clients.clientsList,
      accountMgrsList: state.AccountMgrs.get('accountMgrsList').toJS(),
      relationshipMgrsList: state.RelationshipMgrs.relationshipMgrsList,
      loading: state.Contracts.loading
    }),
    { 
      insertContract, 
      fetchClients,
      fetchAccountMgrs,
      fetchRelationshipMgrs
    }
)(AddNewContract);
