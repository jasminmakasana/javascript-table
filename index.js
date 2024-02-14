import "./stylesheets/javascript-table.css";
import TableRenderer from "./controllers/controller.tableRenderer";

export default class Table {
  constructor(tableDivId, tableData, options, onChangeCheckkbox) {
    try {
      if (
        tableDivId !== undefined &&
        typeof tableDivId === "string" &&
        tableData !== undefined &&
        tableData !== null &&
        typeof tableData === "object" &&
        !Array.isArray(tableData) &&
        Object.prototype.hasOwnProperty.call(tableData, "columns") &&
        Object.prototype.hasOwnProperty.call(tableData, "data") &&
        Array.isArray(tableData.columns) &&
        Array.isArray(tableData.data) &&
        (!options ||
          (options &&
            typeof options === "object" &&
            !Array.isArray(options) &&
            options !== null)) &&
        !onChangeCheckkbox &&
        typeof onChangeCheckkbox === "function"
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
      } else {
        if (tableDivId && typeof tableDivId !== "string") {
          console.error(
            Error("element where you want to render table is not available")
          );
        } else if (
          tableData &&
          typeof tableData !== "object" &&
          Array.isArray(tableData) &&
          !(
            Object.prototype.hasOwnProperty.call(tableData, "columns") &&
            Object.prototype.hasOwnProperty.call(tableData, "data") &&
            Array.isArray(tableData.columns) &&
            Array.isArray(tableData.data)
          )
        ) {
          console.error(
            Error(
              "table data which you want to render is not available or is in invalid format"
            )
          );
        } else if (options && typeof options !== "object" && options === null) {
          console.error(Error("please provide option data in proper format"));
        } else if (typeof onChangeCheckkbox !== "function") {
          console.error(Error("handle checkbox callback is invalid"));
        } else {
          console.error(Error("something went wrong"));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
