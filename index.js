import "./stylesheets/javascript-table.css";
import TableRenderer from "./controllers/controller.tableRenderer";

export default class Table {
  constructor(tableDivId, tableData, options, onChangeCheckkbox) {
    try {
      if (!tableDivId || typeof tableDivId !== "string") {
        console.error(
          new Error("element where you want to render table is not available")
        );
      } else if (
        tableData === undefined ||
        tableData === null ||
        typeof tableData !== "object" ||
        Array.isArray(tableData) ||
        !Object.prototype.hasOwnProperty.call(tableData, "columns") ||
        !Object.prototype.hasOwnProperty.call(tableData, "data") ||
        !Array.isArray(tableData.columns) ||
        !Array.isArray(tableData.data)
      ) {
        console.error(
          new Error(
            "table data which you want to render is not available or is in invalid format"
          )
        );
      } else if (
        options === "" ||
        options === 0 ||
        options === false ||
        (options && typeof options !== "object") ||
        (options && Array.isArray(options))
      ) {
        console.error(new Error("please provide option data in proper format"));
      } else if (
        onChangeCheckkbox === "" ||
        onChangeCheckkbox === 0 ||
        onChangeCheckkbox === false ||
        (onChangeCheckkbox && typeof onChangeCheckkbox !== "function")
      ) {
        console.error(new Error("handle checkbox callback is invalid"));
      } else {
        const tableInstance = new TableRenderer(
          tableDivId,
          tableData,
          options &&
          Object.prototype.hasOwnProperty.call(options, "perPageLimit") &&
          options.perPageLimit !== undefined
            ? options.perPageLimit
            : tableData.data.length <= 10
            ? tableData.data.length
            : 10,
          options &&
          Object.prototype.hasOwnProperty.call(
            options,
            "visiblecheckboxStatus"
          ) &&
          options.visiblecheckboxStatus !== undefined
            ? options.visiblecheckboxStatus
            : true,
          options &&
          Object.prototype.hasOwnProperty.call(options, "tableClasses") &&
          options.tableClasses !== undefined
            ? options.tableClasses
            : {
                table: "ticket-tabel",
                tableParent: "tickets-tabel",
                parentClass: "all-support-ticket-tabel",
              },
          options &&
          Object.prototype.hasOwnProperty.call(options, "showingLine") &&
          options.showingLine !== undefined
            ? options.showingLine
            : "Showing %start% to %end% of %total% Tickets",
          options &&
          Object.prototype.hasOwnProperty.call(options, "dark") &&
          options.dark !== undefined
            ? options.dark
            : false,
          onChangeCheckkbox &&
          onChangeCheckkbox !== undefined &&
          typeof onChangeCheckkbox === "function"
            ? onChangeCheckkbox
            : (data) => {}
        );
        if (document.getElementById(tableDivId)) {
          tableInstance.render();
        } else {
          window.addEventListener("DOMContentLoaded", (event) => {
            tableInstance.render();
          });
        }
        window.checkAllBoxes = (e) => {
          tableInstance.checkAllBoxes(e);
        };
        window.onChangeParentCheckbox = (e, index) =>
          tableInstance.onChangeParentCheckbox(e, index);
        window.navigatePage = (target, e, i) =>
          tableInstance.navigatePage(target, e, i);
        window.handleChange = (e) => tableInstance.handleChange(e);
        window.onSearchChange = (e) => tableInstance.onSearchChange(e);
        window.sortTable = (sortkey, e, sortVal) =>
          tableInstance.sortTable(sortkey, e, sortVal);
        window.handleChecked = (e, index) =>
          tableInstance.handleChecked(e, index);
        window.toggleColumnSelect = (e) => tableInstance.toggleColumnSelect(e);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
