const sortOption = {};
class generateData {
  constructor(size, tableData) {
    this.size = size || 2000;
    this.data = [];
    this.sortKey = null;
    this.sortDir = null;
    this.tableData = tableData
  }
  dataModel(index) {
    return this.tableData[index];
  }
  getObjectAt(index) {
    if (index < 0 || index > this.size) {
      return undefined;
    }
    if (this.data[index] === undefined) {
      this.data[index] = this.dataModel(index);
    }
    return this.data[index];
  }
  getAll() {
    if (this.data.length < this.size) {
      for (let i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this.data.slice();
  }

  getSize() {
    return this.size;
  }
  getSortAsc(sortKey) {
    sortOption.sortKey = sortKey;
    sortOption.sortDir = 'ASC';
    return this.data.sort(this.sort);
  }
  getSortDesc(sortKey) {
    sortOption.sortKey = sortKey;
    sortOption.sortDir = 'DESC';
    return this.data.sort(this.sort);
  }
  sort(optionA, optionB) {
    let valueA = optionA[sortOption.sortKey]
    let valueB = optionB[sortOption.sortKey]

    if (typeof valueA === 'string' || typeof valueB === 'string') {
      valueA = valueA ? valueA.toUpperCase() : '';
      valueB = valueB ? valueB.toUpperCase() : '';
    }
    
    let sortVal = 0;
    if (valueA > valueB) {
      sortVal = 1;
    }
    if (valueA < valueB) {
      sortVal = -1;
    }
    if (sortVal !== 0 && sortOption.sortDir === 'DESC') {
      return sortVal * (-1);
    }
    return sortVal;
  }
}
export default generateData;
