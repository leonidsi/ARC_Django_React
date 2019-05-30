import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Form from '../../components/uielements/form';
import Checkbox from '../../components/uielements/checkbox';
import Input from '../../components/uielements/input';
import PageHeader from '../../components/utility/pageHeader';
import DatePicker from '../../components/uielements/datePicker';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Select, { SelectOption } from '../../components/uielements/select';
import Button from '../../components/uielements/button';
import styles from '../../config/FormElements/form-styles'
import clientsActions from '../../redux/clients/actions';
import naicsCodesActions from '../../redux/naics_codes/actions';

const { getClient, updateClient } = clientsActions;
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
const dateFormatList = ["MM-DD-YYYY", "MM-DD-YY", "MM/DD/YYYY", "MM/DD/YY", "MM.DD.YYYY", "MM.DD.YY", "MMM DD YYYY", "MMM DD YY"];

class EditClient extends React.Component {
  state = {
    singleClient: {}
  }
  constructor(props) {
    super(props)
    const { getClient } = props
    const postData = { index: props.match.params.id }
    getClient({ postData })
  }
  componentWillMount() {
    const { fetchNaicsCodes } = this.props
    fetchNaicsCodes()
  }
  componentWillReceiveProps(props) {
    const { singleClient } = props
    this.setState({ singleClient: Object.assign({}, singleClient) })
  }
  handleInputChange = (type, val) => {
    const { singleClient } = this.state
    singleClient[type] = val
    this.setState({ singleClient })
  }

  handleSubmit = () => {
    const { name } = this.state.singleClient;
    if ( name.length > 0) {
        this.submitUpdateRequest();
    }
  }
  submitUpdateRequest = () => {
    const { updateClient, match } = this.props
    const { singleClient } = this.state
    singleClient.id = parseInt(match.params.id, 10)
    updateClient({ postData: singleClient })
  }
  render() {
    const { singleClient } = this.state
    const { naicsCodesList, loading } = this.props
    return (
      <LayoutContentWrapper>
        <PageHeader>Edit Client</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Client Name"
          >
            <Input 
            placeholder="Input New Client Name"
            value={singleClient.name}
            onChange = { (e)=> this.handleInputChange('name', e.target.value) }
            id="error"  
            />
          </FormItem>
          <FormItem
              style={styles.formItemMargin}
              {...formItemLayout}
              label="Naici Codes 1"
            >
              <Select showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              size="large" value={singleClient.naics_code1_id} onChange={(value, label) => this.handleInputChange('naiciCode1', value)}>
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
              <Select showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              size="large" value={singleClient.naics_code2_id} onChange={(value, label) => this.handleInputChange('naiciCode2', value)}>
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
            <DatePicker
              value={singleClient.dateJoinedPyx ? moment(singleClient.dateJoinedPyx, 'YYYY-MM-DD'): null}
              onChange={(date, dateString) => this.handleInputChange('dateJoinedPyx', dateString)}
              format={dateFormatList}
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Date Left Pyx"
          >
            <DatePicker
              value={singleClient.dateLeftPyx ? moment(singleClient.dateLeftPyx, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => this.handleInputChange('dateLeftPyx', dateString)}
              format={dateFormatList}
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="SNP 500"
          >
            <Checkbox
              onChange={(e) => this.handleInputChange('snp_500', e.target.checked? true : false)}
              checked={singleClient.snp_500}
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Fortune Level"
          >
            <Input
              value={singleClient.fortune_level}
              onChange = { (e)=> this.handleInputChange('fortune_level', e.target.value) }
              id="error"
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Enterprise"
          >
            <Checkbox
              onChange={(e) => this.handleInputChange('enterprise', e.target.checked? true : false)}
              checked={singleClient.enterprise}
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Great Place Most Admired"
          >
            <Checkbox
              onChange={(e) => this.handleInputChange('greatplace_mostadmired', e.target.checked? true : false, )}
              checked={singleClient.greatplace_mostadmired}
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
              Save
            </Button>
            <Link to="../../clients">
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

EditClient.propTypes = {
  naicsCodesList: PropTypes.array,
  getClient: PropTypes.func,
  updateClient: PropTypes.func,
  singleClient: PropTypes.object,
  fetchNaicsCodes: PropTypes.func
}

export default connect(
    state => ({
      singleClient: state.Clients.singleClient,
      loading: state.Clients.loading,
      naicsCodesList: state.NaicsCodes.naicsCodesList,
    }),
    { getClient, updateClient,  fetchNaicsCodes }
)(EditClient);
