import "./stylesheets/javascript-table.css";
import TableRenderer from "./controllers/controller.tableRenderer";

export default class Table {
  constructor(tableDivId, tableData, options) {
    if (
      tableDivId !== undefined &&
      tableData !== undefined &&
      (!options || (options && typeof options === "object" && options !== null))
    ) {
      const tableInstance = new TableRenderer(
        tableDivId,
        tableData,
        options &&
        Object.prototype.hasOwnProperty.call(options, "perPageLimit") &&
        options.perPageLimit !== undefined
          ? options.perPageLimit
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
          : false
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
    } else {
      throw new Error("render element and table data not available or invalid");
    }
  }
}
