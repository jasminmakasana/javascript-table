import { sortEnum } from "../constants";

export default class TableRenderer {
  constructor(
    tableDivId,
    valueFromData,
    perPageLimit,
    visiblecheckboxStatus,
    tableClasses,
    showingLine,
    dark,
    onChangeCheckkbox
  ) {
    this.data = valueFromData.data;
    this.displayData = valueFromData.data;
    this.perPageLimit = perPageLimit;
    this.noOfRecordPerPage = perPageLimit;
    this.columns = valueFromData.columns;
    this.totalPages = "";
    this.currentPage = 0;
    this.searchKey = "";
    this.sortType = sortEnum.NONE;
    this.sortKey = "";
    this.isAllChecked = false;
    this.visibleCheckbox = visiblecheckboxStatus;
    this.tableClasses = tableClasses;
    this.showingLine = showingLine;
    this.dark = dark;
    this.tableDivId = tableDivId;
    this.sendCheckboxContentCallback = onChangeCheckkbox;

    this.paginationRef = document.createElement("div");
    this.paginationRef.className = "pagination";
    window.addEventListener("DOMContentLoaded", (event) => {
      this.render();
      this.tableBodyData();
      this.tableHeader();
    });
  }

  tableBodyData() {
    const { displayData, perPageLimit, currentPage, columns, visibleCheckbox } =
      this;
    const length = displayData.length;
    const cLength = columns.length;
    const tableBodyElement = document.getElementById("info-table-Body");
    if (length > 0) {
      tableBodyElement.innerHTML = "";
      if (tableBodyElement) {
        for (let i = 0; i < length; i++) {
          if (
            i >= currentPage * perPageLimit &&
            i <= currentPage * perPageLimit + (perPageLimit - 1)
          ) {
            const tableBodyRowElement = document.createElement("tr");
            tableBodyRowElement.setAttribute(
              "class",
              displayData[i].checkStatus ? "checked-row" : ""
            );
            if (visibleCheckbox === true) {
              const tdCheckboxElement = document.createElement("td");
              const tdInputElement = document.createElement("input");
              tdInputElement.setAttribute("type", "checkbox");
              tdInputElement.setAttribute("id", `checkbox-${i}`);
              tdInputElement.setAttribute("class", "checkbox");
              tdInputElement.setAttribute(
                "onchange",
                `onChangeParentCheckbox(event, ${i})`
              );
              tdInputElement.checked = displayData[i].checkStatus;
              tdCheckboxElement.appendChild(tdInputElement);
              tableBodyRowElement.appendChild(tdCheckboxElement);
            }
            const row = displayData[i];
            for (let j = 0; j < cLength; j++) {
              const column = columns[j];
              if (!column.isRemoved) {
                let key = column.key;
                if (column.isCaseInsensitive) {
                  key = key.toLowerCase();
                }
                if (column.renderCallback) {
                  const jsx = column.renderCallback(row[key], row);
                  const tdElemnt = document.createElement("td");
                  tdElemnt.appendChild(jsx);
                  tableBodyRowElement.appendChild(tdElemnt);
                } else {
                  const tablebodyDataElement = document.createElement("td");
                  tablebodyDataElement.innerText = row[key];
                  tableBodyRowElement.appendChild(tablebodyDataElement);
                }
              }
            }
            tableBodyElement.appendChild(tableBodyRowElement);
          }
        }
      } else {
        console.error("element not found");
      }
    } else {
      const tableBodyRowElement = document.createElement("tr");
      tableBodyRowElement.setAttribute("colspan", cLength);
      tableBodyRowElement.setAttribute("style", `text-align: center;`);
      tableBodyRowElement.innerText = "There is no data";
      tableBodyElement.innerHTML = "";
      tableBodyElement.appendChild(tableBodyRowElement);
    }
  }

  calculateTotalPages(displayData) {
    const { perPageLimit } = this;
    let indexOfLastData = Math.ceil(displayData.length / perPageLimit);
    this.totalPages = indexOfLastData;
  }

  tableHeader() {
    const { sortType, sortKey, columns, visibleCheckbox, displayData } = this;
    const length = columns.length;
    const tableHeadElement = document.getElementById("info-table-header");
    if (tableHeadElement) {
      const tableHeadRowElement = document.createElement("tr");
      if (visibleCheckbox === true && displayData.length > 0) {
        const thCheckboxElement = document.createElement("th");
        const thInputElement = document.createElement("input");
        thInputElement.setAttribute("type", "checkbox");
        thInputElement.setAttribute("class", "checkbox");
        thInputElement.setAttribute("onchange", "checkAllBoxes(event)");
        thInputElement.checked = this.isAllChecked;
        thCheckboxElement.appendChild(thInputElement);
        tableHeadRowElement.appendChild(thCheckboxElement);
      }
      for (let i = 0; i < length; i++) {
        const item = columns[i];
        let icon = "sort-none";
        let onClickSortType = sortEnum.ASCENDING;
        if (sortType === sortEnum.ASCENDING && sortKey === item.key) {
          icon = "sort-ascending";
          onClickSortType = sortEnum.DESCENDING;
        } else if (sortType === sortEnum.DESCENDING && sortKey === item.key) {
          icon = "sort-descending";
          onClickSortType = sortEnum.ASCENDING;
        }
        if (!item.isRemoved) {
          const thDataElement = document.createElement("th");
          thDataElement.innerText = item.label;
          const thSpanElement = document.createElement("span");
          thSpanElement.setAttribute(
            "onclick",
            `sortTable('${item.key}', event, ${onClickSortType})`
          );
          thSpanElement.setAttribute("class", `sort-icon ${icon}`);
          thDataElement.appendChild(thSpanElement);
          tableHeadRowElement.appendChild(thDataElement);
        }
      }
      tableHeadElement.innerHTML = "";
      tableHeadElement.appendChild(tableHeadRowElement);
    }
  }

  checkAllBoxes(e) {
    const checked = e.target.checked;
    const { displayData } = this;
    for (let j = 0; j < displayData.length; j++) {
      displayData[j].checkStatus = checked;
    }
    this.isAllChecked = checked;
    this.sendCheckboxContentCallback(displayData);
    this.tableBodyData();
    this.tableHeader();
  }

  onChangeParentCheckbox(e, index) {
    const { displayData } = this;
    const checked = e.target.checked;
    let status = false;
    let countCheckedCheckbox = 0;
    const isCheckedData = [];
    displayData[index].checkStatus = checked;
    for (let j = 0; j < displayData.length; j++) {
      if (displayData[j].checkStatus === true) {
        isCheckedData.push(displayData[j]);
        countCheckedCheckbox++;
      } else {
        countCheckedCheckbox--;
      }
    }
    if (countCheckedCheckbox === displayData.length) {
      status = true;
    } else {
      status = false;
    }
    this.isAllChecked = status;
    this.sendCheckboxContentCallback(isCheckedData);
    this.tableBodyData();
  }

  peginationOfTable() {
    if (!this.totalPages) {
      this.calculateTotalPages(this.displayData);
    }
    const { currentPage, totalPages, displayData } = this;
    // let rows = document.createElement("ul");
    let rows = [];
    if (displayData.length > 0) {
      for (let i = 0; i < totalPages; i++) {
        // let li = document.createElement("li");
        // li.classList.add("page-item");
        // let a = document.createElement("a");
        // if (currentPage === i) {
        //   a.classList.add("page-link", "active");
        // } else {
        //   a.classList.add("page-link", "deactive");
        // }
        // a.setAttribute("href", "#");
        // a.innerHTML = i + 1;
        // li.appendChild(a);
        // let navigatePage = this.navigatePage.bind(this);
        // li.addEventListener("click", (e) => console.log("hi"));
        // console.log(li);
        // rows.appendChild(li);
        rows.push(
          `<li class="page-item">
              <a
                class="${
                  currentPage === i ? "page-link active" : "page-link deactive"
                }"
                href="#"
                onclick="navigatePage('btn-click', event, ${i})"
              >
                ${i + 1}
              </a>
            </li>`
        );
      }
      return `<div class="pagination">
          <ul>
    <li class="prev-next-btn">
          <a
            class="${
              currentPage === 0 ? "page-link desable" : "page-link enable"
            }"
            onclick="navigatePage('pre', event, '')"
          >
            Previous
          </a>
          </li>
${rows.join("")} 
<li class="prev-next-btn">
        <a
          class="${
            currentPage === this.totalPages - 1
              ? "page-link desable"
              : "page-link enable"
          }"
          onclick="navigatePage('next', event, '')"
        >
          Next
        </a>
        </li>
     </ul>
        </div>`;
    }
  }

  navigatePage(target, e, i = null) {
    let { totalPages, currentPage } = this;
    e.preventDefault();
    switch (target) {
      case "pre":
        if (currentPage !== 0) {
          currentPage = currentPage - 1;
        }
        break;
      case "next":
        if (currentPage !== totalPages - 1) {
          currentPage = currentPage + 1;
        }
        break;
      case "btn-click":
        currentPage = i;
        break;
    }
    this.currentPage = currentPage;
    this.setCurrentPageIntoView();
    this.render();
    this.tableBodyData();
    this.tableHeader();
  }

  setCurrentPageIntoView() {
    const { currentPage } = this;
    let scrollLeft = currentPage * 28;
    if (this.paginationRef) {
      this.paginationRef.scrollLeft = scrollLeft;
    }
  }

  handleChange(e) {
    const { displayData } = this;
    const totalData = displayData.length;
    let totalPages = 1;
    let perPageLimit = totalData;
    if (e.target.value !== "all") {
      totalPages = Math.ceil(totalData / e.target.value);
      perPageLimit = e.target.value;
    }
    this.perPageLimit = Number(perPageLimit);
    this.totalPages = totalPages;
    this.currentPage = 0;
    this.render();
    this.tableBodyData();
    this.tableHeader();
  }

  onSearchChange(e) {
    const { value } = e.target;
    this.searchKey = value;
    this.currentPage = 0;
    this.sortType = sortEnum.NONE;
    this.sortKey = "";
    this.isAllChecked = false;
    const { data, columns } = this;
    var queryResult = [];
    if (data.length > 0) {
      if (value.trim()) {
        for (let i = 0; i < data.length; i++) {
          let row = data[i];
          for (let j = 0; j < columns.length; j++) {
            let colData = columns[j].key;
            if (row[colData]) {
              if (
                row[colData].toLowerCase().indexOf(value) !== -1 ||
                row[colData].indexOf(value) !== -1
              ) {
                queryResult.push(data[i]);
                break;
              }
            }
          }
        }
      } else {
        queryResult = data;
      }
      this.displayData = queryResult;
      this.calculateTotalPages(queryResult);
      this.tableBodyData();
    }
  }

  displayShowPageLimit() {
    const { noOfRecordPerPage, displayData, perPageLimit } = this;
    let pageData = [];
    let i = noOfRecordPerPage;
    while (i <= displayData.length) {
      pageData.push(
        `<option ${
          i === perPageLimit ? 'selected="selected"' : ""
        } value="${i}">${i}</option>`
      );
      i = i + noOfRecordPerPage;
    }
    pageData.push('<option value="all">All</option>');
    return pageData.join("");
  }

  sortTable(sortkey, e, sortVal) {
    this.sortType = sortVal;
    this.sortKey = sortkey;
    e.preventDefault();
    const data = this.data;
    if (sortVal === sortEnum.ASCENDING) {
      data.sort((a, b) => {
        if (a[sortkey] && b[sortkey]) {
          return a[sortkey].localeCompare(b[sortkey]);
        }
        return 0;
      });
    } else if (sortVal === sortEnum.DESCENDING) {
      data
        .sort((a, b) => {
          if (a[sortkey] && b[sortkey]) {
            return a[sortkey].localeCompare(b[sortkey]);
          }
          return 0;
        })
        .reverse();
    }
    this.displayData = data;
    this.tableBodyData();
    this.tableHeader();
  }

  renderColumns() {
    const { columns } = this;
    const retData = [];
    if (columns) {
      for (let i = 0; i < columns.length; i++) {
        const item = columns[i];
        retData.push(
          `<label class="option" for="${item.key}">
            <input
              id="${item.key}"
              ${!item.isRemoved ? "checked" : ""}
              type="checkbox"
              onchange="handleChecked(event, ${i})"
              class="column-select-dropdown"
            />
            ${item.label}
          </label>`
        );
      }
    }
    return retData.join("");
  }

  handleChecked(e, index) {
    const { columns } = this;
    const { checked } = e.target;
    columns[index].isRemoved = !checked;
    this.tableBodyData();
    this.tableHeader();
  }

  toggleColumnSelect(event) {
    if (event.target.id && event.target.id === "select-column-field") {
      document
        .getElementById("column-dropdown-list")
        .classList.remove("showColumnSelect");
    } else if (
      !(
        event.target.classList.length &&
        event.target.classList.contains("column-select-dropdown")
      )
    ) {
      document
        .getElementById("column-dropdown-list")
        .classList.add("showColumnSelect");
    }
  }

  renderTableUpdate() {
    const tableElement = document.getElementById("info-table-element");
    if (tableElement) {
      tableElement.innerHTML = `<table class="data-table">
      <thead>
        <tr>${this.tableHeader()}</tr>
      </thead>
      <tbody>${this.tableBodyData()}</tbody>
    </table>`;
    }
  }

  render() {
    if (this.searchKey) {
      document.getElementById("search-bar").focus();
    }
    const { displayData, perPageLimit, currentPage } = this;
    let { tableClasses, showingLine, dark } = this;
    let startIndex = perPageLimit * currentPage + 1;
    let endIndex = perPageLimit * (currentPage + 1);
    if (endIndex > displayData.length) {
      endIndex = displayData.length;
    }
    if (showingLine) {
      showingLine = showingLine.replace("%start%", startIndex);
      showingLine = showingLine.replace("%end%", endIndex);
      showingLine = showingLine.replace("%total%", displayData.length);
    }

    const parentClass = `${tableClasses.parentClass} custom-table ${
      dark ? "dark" : ""
    }`;
    const tableParentClass = `${tableClasses.tableParent} data-table-parent`;

    const tableHTML = `
            <div class="${parentClass}">
              <div class="toolbar">
              <div class="toolbar-left-part">
              <div class="showing">${showingLine}</div>
              <div class="showby">
              <div class="page-number">
              <label>Show</label>
              <select onchange="handleChange(event)" class="form-control">
                ${this.displayShowPageLimit()}
              </select>
              </div>
              <div class="entries-dropdown">
              <span>entries per page</span>
              <div class="multiselect">
              <div
                class="form-control select-label" id="select-column-field"
                onclick="toggleColumnSelect(event)"
              >
                Select columns <i class="arrow down"></i>
              </div>
              <div
              class="border options showColumnSelect"
              id="column-dropdown-list"
            >
              ${this.renderColumns()}
            </div>
            </div>
           
           
          </div>
          </div>
          
          </div>
          <div class="toolbar-right-part">
          <form class="filter-search-control">
          <input type="search" placeholder="Search..." id="search-bar" oninput="onSearchChange(event)" value="${
            this.searchKey
          }">
          <button type="submit">Search</button>
        </form>
        </div>
        </div>
        <div class="${tableParentClass}" id="info-table-element">
          <table class="data-table">
            <thead id="info-table-header">
            </thead>
            <tbody id="info-table-Body"></tbody>
          </table>
        </div>
          ${this.peginationOfTable()}
      </div>
    `;
    let tableBody = document.createElement("div");
    tableBody.setAttribute("id", `table${Math.random()}`);
    tableBody.innerHTML = tableHTML;
    tableBody.appendChild(this.paginationRef);
    document.getElementById(this.tableDivId).innerHTML = "";
    document.getElementById(this.tableDivId).appendChild(tableBody);
    document.body.setAttribute("onclick", "toggleColumnSelect(event)");
  }
}
