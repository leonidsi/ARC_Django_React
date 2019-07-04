import { Map } from 'immutable';
import XLSX from 'xlsx'

export function clearToken() {
  localStorage.removeItem('id_token');
  localStorage.removeItem('userId');  
}

export function getToken() {
  try {
    const idToken = localStorage.getItem('id_token');
    const userId = localStorage.getItem('userId');
    return new Map({ idToken, userId });
  } catch (err) {
    clearToken();
    return new Map();
  }
}

export function timeDifference(givenTime) {
  givenTime = new Date(givenTime);
  const milliseconds = new Date().getTime() - givenTime.getTime();
  const numberEnding = number => {
    return number > 1 ? 's' : '';
  };
  const number = num => num > 9 ? '' + num : '0' + num;
  const getTime = () => {
    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      const month = number(givenTime.getUTCMonth() + 1);
      const day = number(givenTime.getUTCDate());
      const year = givenTime.getUTCFullYear() % 100;
      return `${day}-${month}-${year}`;
    }
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      if (days < 28) {
        return days + ' day' + numberEnding(days);
      } else {
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const month = months[givenTime.getUTCMonth()];
        const day = number(givenTime.getUTCDate());
        return `${day} ${month}`;
      }
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return `${hours} hour${numberEnding(hours)} ago`;
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return `${minutes} minute${numberEnding(minutes)} ago`;
    }
    return 'a few seconds ago';
  };
  return getTime();
}

export function mapUser(user) {
  user.isSuperAdmin = false
  if (user.userRoles && user.userRoles.length > 0) {
    user.role = user.userRoles[0].name
    user.roleId = user.userRoles[0].id
    if (user.userRoles.find(role => role.name === 'Super Admin' && role.id === 10000)) {
      user.isSuperAdmin = true
    }
  } else {
    user.role = null
    user.roleId = null
  }
  // delete user.userRoles
  user.fullname = `${user.firstname} ${user.lastname}`
  user.key = user.id
  return user
}
export function mapManager(am) {
  am.fullname = `${am.user.firstname} ${am.user.lastname}`
  am.username = am.user.username
  am.key = am.id
  return am
}

export function mapProject(project) {
  if (project.account_mgr_id) {
    project.accountManagerName = `${project.account_mgr_id.user_id.firstname} ${project.account_mgr_id.user_id.lastname}`
  }

  if (project.relationshipManager) {
    project.relationshipManagerName = `${project.relationship_mgr_id.user_id.firstname} ${project.relationship_mgr_id.user_id.lastname}`
  }

  if (project.project_mgr_id) {
    project.projectManagerName = `${project.project_mgr_id.user_id.firstname} ${project.project_mgr_id.user_id.lastname}`
  }

  if (project.consultant_id) {
    project.consultantName = `${project.consultant_id.user_id.firstname} ${project.consultant_id.user_id.lastname}`
  }

  if (project.client_id) {
    project.clientName = project.client_id.name
  }

  if (project.project_type_id) {
    project.projectTypeName = project.project_type_id.name
  }
  
  return project
}

export function mapClient(client) {
  if (client.naicsCode1) {
    client.naicsCode1Name = client.naicsCode1.name
  }
  if (client.naicsCode2) {
    client.naicsCode2Name = client.naicsCode2.name
  }
  return client
}

export function mapContract(contract) {
  if (contract.client_id) {
    contract.clientName = contract.client_id.name
  }
  if (contract.sales_rep_id) {
    contract.salesRepName = `${contract.sales_rep_id.user_id.firstname} ${contract.sales_rep_id.user_id.lastname}`
  }
  if (contract.relationship_manager_id) {
    contract.relationshipManagerName = `${contract.relationship_manager_id.user_id.firstname} ${contract.relationship_manager_id.user_id.lastname}`
  }
  return contract
}

export function getOS() {
  const OS_Name = navigator.appVersion
  if (OS_Name.indexOf("Win") !== -1) {
    return "Win"
  } else if (OS_Name.indexOf("Mac") !== -1) {
    return "Mac"
  } else if (OS_Name.indexOf("X11") !== -1) {
    return "X11"
  } else if (OS_Name.indexOf("Linux") !== -1) {
    return "Linux"
  } else if (OS_Name.indexOf("SunOS") !== -1) {
    return "SunOS"
  } else {
    return "Win"
  }
}

const replaceComma = str => `${str}`.replace(/,/g, ' ')

export function generateXLSXFile (rows, columns, fileName) {
  let xlsx_data = []
  xlsx_data.push(columns)

  rows.forEach(item => {
    const values = columns.map(c => replaceComma(item[c] || ' '))
    xlsx_data.push(values)
  })

  var ws = XLSX.utils.aoa_to_sheet(xlsx_data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet");

  XLSX.writeFile(wb, fileName);
}