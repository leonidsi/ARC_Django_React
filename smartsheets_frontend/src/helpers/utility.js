import { Map } from 'immutable';

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
  console.log(user, user.userRoles)
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
  console.log(88,user)
  return user
}
export function mapManager(am) {
  am.fullname = `${am.user.firstname} ${am.user.lastname}`
  am.username = am.user.username
  am.key = am.id
  return am
}

export function mapProject(project) {
  if (project.accountManager) {
    project.accountManagerName = `${project.accountManager.user.firstname} ${project.accountManager.user.lastname}`
  }

  if (project.relationshipManager) {
    project.relationshipManagerName = `${project.relationshipManager.user.firstname} ${project.relationshipManager.user.lastname}`
  }

  if (project.projectManager) {
    project.projectManagerName = `${project.projectManager.user.firstname} ${project.projectManager.user.lastname}`
  }

  if (project.consultant) {
    project.consultantName = `${project.consultant.user.firstname} ${project.consultant.user.lastname}`
  }

  if (project.client) {
    project.clientName = project.client.name
  }

  if (project.projectType) {
    project.projectTypeName = project.projectType.name
  }
  
  return project
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

export function generateCSVFile (rows, columns, fileName) {
  let CR = getOS() === 'Win' ? '\r\n' : '\n'
  let data = columns.join(', ') + CR

  rows.forEach(item => {
    const values = columns.map(c => replaceComma(item[c] || ' '))
    data += values.join(',') + CR
  })
  
  if (navigator.msSaveBlob) { // IE 10+
    var blob = new Blob([data],{type: 'text/csvcharset=utf-8'})
    navigator.msSaveBlob(blob, 'csvname.csv')
  } else {
    let csvContent = data
    const encodedUri = encodeURIComponent(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/csvcharset=utf-8,%EF%BB%BF' + encodedUri)
    link.setAttribute('download', fileName)
    document.body.appendChild(link) // Required for FF
    link.click()
    link.remove()
  }
}