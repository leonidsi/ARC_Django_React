import React from 'react';
import { Switch, Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    const { url, isSuperAdmin } = this.props;
    if (isSuperAdmin) {
      return (
        <Switch>
          <Route
            exact
            path={`${url}/`}
            component={asyncComponent(() => import('../dashboard'))}
          />
          <Route
            exact
            path={`${url}/projects`}
            component={asyncComponent(() => import('../Projects/ProjectsList'))}
          />
          <Route
            exact
            path={`${url}/projects/add`}
            component={asyncComponent(() => import('../Projects/AddNewProject'))}
          />
          <Route
            exact
            path={`${url}/projects/edit/:id`}
            component={asyncComponent(() => import('../Projects/EditProject'))}
          />
          <Route
            exact
            path={`${url}/projects/:id`}
            component={asyncComponent(() => import('../Projects/EditProject'))}
          />
          <Route
            exact
            path={`${url}/clients`}
            component={asyncComponent(() => import('../Clients/ClientsList'))}
          />
          <Route
            exact
            path={`${url}/clients/add`}
            component={asyncComponent(() => import('../Clients/AddNewClient'))}
          />
          <Route
            exact
            path={`${url}/clients/edit/:id`}
            component={asyncComponent(() => import('../Clients/EditClient'))}
          />
          <Route
            exact
            path={`${url}/contracts`}
            component={asyncComponent(() => import('../Contracts/ContractsList'))}
          />
          <Route
            exact
            path={`${url}/contracts/add`}
            component={asyncComponent(() => import('../Contracts/AddNewContract'))}
          />
          <Route
            exact
            path={`${url}/contracts/edit/:id`}
            component={asyncComponent(() => import('../Contracts/EditContract'))}
          />
          <Route
            exact
            path={`${url}/users`}
            component={asyncComponent(() => import('../Users/UserList'))}
          />
          <Route
            exact
            path={`${url}/users/add`}
            component={asyncComponent(() => import('../Users/AddNewUser'))}
          />
          <Route
            exact
            path={`${url}/users/edit/:id`}
            component={asyncComponent(() => import('../Users/EditUser'))}
          />
          <Route
            exact
            path={`${url}/blankPage`}
            component={asyncComponent(() => import('../blankPage'))}
          />
          <Route
            exact
            path={`${url}/project_managers`}
            component={asyncComponent(() => import('../ProjectManagers/ProjectManagersList'))}
          />
          <Route
            exact
            path={`${url}/project_managers/add`}
            component={asyncComponent(() => import('../ProjectManagers/AddNewManager'))}
          />
          <Route
            exact
            path={`${url}/project_managers/edit/:id`}
            component={asyncComponent(() => import('../ProjectManagers/EditManager'))}
          />
          <Route
            exact
            path={`${url}/sales_executives`}
            component={asyncComponent(() => import('../SalesExecutives/SalesExecutivesList'))}
          />
          <Route
            exact
            path={`${url}/sales_executives/add`}
            component={asyncComponent(() => import('../SalesExecutives/AddNewManager'))}
          />
          <Route
            exact
            path={`${url}/sales_executives/edit/:id`}
            component={asyncComponent(() => import('../SalesExecutives/EditManager'))}
          />
          <Route
            exact
            path={`${url}/relationship_managers`}
            component={asyncComponent(() => import('../RelationshipManagers/RelationshipManagersList'))}
          />
          <Route
            exact
            path={`${url}/relationship_managers/add`}
            component={asyncComponent(() => import('../RelationshipManagers/AddNewManager'))}
          />
          <Route
            exact
            path={`${url}/relationship_managers/edit/:id`}
            component={asyncComponent(() => import('../RelationshipManagers/EditManager'))}
          />
          <Route
            exact
            path={`${url}/consultants`}
            component={asyncComponent(() => import('../Consultants/ConsultantsList'))}
          />
          <Route
            exact
            path={`${url}/consultants/add`}
            component={asyncComponent(() => import('../Consultants/AddNewConsultant'))}
          />
          <Route
            exact
            path={`${url}/consultants/edit/:id`}
            component={asyncComponent(() => import('../Consultants/EditConsultant'))}
          />
          
          <Route
            exact
            path={`${url}/project_types`}
            component={asyncComponent(() => import('../ProjectTypes/ProjectTypesList'))}
          />
          <Route
            exact
            path={`${url}/project_types/add`}
            component={asyncComponent(() => import('../ProjectTypes/AddNewType'))}
          />
          <Route
            exact
            path={`${url}/project_types/edit/:id`}
            component={asyncComponent(() => import('../ProjectTypes/EditType'))}
          />
          <Route
            exact
            path={`${url}/project_status`}
            component={asyncComponent(() => import('../ProjectStatus/ProjectStatusList'))}
          />
          <Route
            exact
            path={`${url}/project_status/add`}
            component={asyncComponent(() => import('../ProjectStatus/AddNewStatus'))}
          />
          <Route
            exact
            path={`${url}/project_status/edit/:id`}
            component={asyncComponent(() => import('../ProjectStatus/EditStatus'))}
          />
          <Route
            exact
            path={`${url}/other_providers`}
            component={asyncComponent(() => import('../OtherProviders/OtherProvidersList'))}
          />
          <Route
            exact
            path={`${url}/other_providers/add`}
            component={asyncComponent(() => import('../OtherProviders/AddNewProvider'))}
          />
          <Route
            exact
            path={`${url}/other_providers/edit/:id`}
            component={asyncComponent(() => import('../OtherProviders/EditProvider'))}
          />
          <Route
            exact
            path={`${url}/how_found_pyx`}
            component={asyncComponent(() => import('../HowFoundPyx/PyxList'))}
          />
          <Route
            exact
            path={`${url}/how_found_pyx/add`}
            component={asyncComponent(() => import('../HowFoundPyx/AddNewPyx'))}
          />
          <Route
            exact
            path={`${url}/how_found_pyx/edit/:id`}
            component={asyncComponent(() => import('../HowFoundPyx/EditPyx'))}
          />
          <Route
            exact
            path={`${url}/naics_codes`}
            component={asyncComponent(() => import('../NaicsCodes/NaicsCodesList'))}
          />
          <Route
            exact
            path={`${url}/naics_codes/add`}
            component={asyncComponent(() => import('../NaicsCodes/AddNewNaicsCodes'))}
          />
          <Route
            exact
            path={`${url}/naics_codes/edit/:id`}
            component={asyncComponent(() => import('../NaicsCodes/EditCode'))}
          />
          <Route
            exact
            path={`${url}/help_desk`}
            component={asyncComponent(() => import('../HelpDesk/ProjectsList'))}
          />
          <Route
            exact
            path={`${url}/help_desk/edit/:id`}
            component={asyncComponent(() => import('../HelpDesk/EditProject'))}
          />
          <Route
            exact
            path={`${url}/history`}
            component={asyncComponent(() => import('../Histories/HistoryList'))}
          />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route
            exact
            path={`${url}/`}
            component={asyncComponent(() => import('../dashboard'))}
          />
          <Route
            exact
            path={`${url}/projects`}
            component={asyncComponent(() => import('../Projects/ProjectsList'))}
          />
          <Route
            exact
            path={`${url}/projects/add`}
            component={asyncComponent(() => import('../Projects/AddNewProject'))}
          />
          <Route
            exact
            path={`${url}/projects/edit/:id`}
            component={asyncComponent(() => import('../Projects/EditProject'))}
          />
          <Route
            exact
            path={`${url}/projects/:id`}
            component={asyncComponent(() => import('../Projects/EditProject'))}
          />
          <Route
            exact
            path={`${url}/clients`}
            component={asyncComponent(() => import('../Clients/ClientsList'))}
          />
          <Route
            exact
            path={`${url}/clients/add`}
            component={asyncComponent(() => import('../Clients/AddNewClient'))}
          />
          <Route
            exact
            path={`${url}/clients/edit/:id`}
            component={asyncComponent(() => import('../Clients/EditClient'))}
          />
        </Switch>
      );
    }
    
  }
}

export default AppRouter;
