
# javascript-table


## Summary

javascript-table is a versatile JavaScript package designed to simplify the process of creating interactive tables from data sets. Built with core JavaScript, it offers compatibility with any JavaScript library, providing flexibility and ease of integration into various projects.

## Key Features

- Search across columns
- Row selection
- Sorting 
- Pagination
- Works with any library in Javascript
- Works with just Javascript

## Example

```
import Table from "javascript-table";

const idOfHTMLElement = "my-tickets-table"; // html id of the table parent where the table will be rendered.

const columns = [
  {
    label: "ID",
    key: "index",
  },
  {
    label: "Requester Name",
    key: "requesterName",
  },
  {
    label: "Subjects",
    key: "subject",
  }
]

const data = [
  {
    index: "#27",
    requesterName: "Rodney Artichoke",
    subject: "I need help with aading a New Contact...."
  },
  {
    index: "#39",
    requesterName: "Chaplain Mondover",
    subject: "I need help with aading a New Contact data to be pre...",
  },
  {
    index: "#47",
    requesterName: "Rodney Artichoke",
    subject: "Mobile Campaign"
  },
  {
    index: "#52",
    requesterName: "Inverness McKenzie",
    subject: "Service related announcements"
  },
  {
    index: "#87",
    requesterName: "Douglas Lyphe",
    subject: "I need help with aading a New Contact...."
  },
  {
    index: "#92",
    requesterName: "Theodore Handle",
    subject: "Adding a payment methods"
  },
  {
    index: "#27",
    requesterName: "Rodney Artichoke",
    subject: "I need help with aading a New Contact...."
  }
]

const perPageLimit = 5; // Shows 5 rows per page. By default 10

const visiblecheckboxStatus = true; // Shows checkboxes in rows. By default true

const cssClasses = {
  table: "ticket-tabel", // CSS class for table. You can add your own class as per your css changes
  tableParent: "tickets-tabel", // CSS class for the immidiate parent of Table
  parentClass: "all-support-ticket-tabel", // CSS class for main parent
};

const showingLine = "Showing %start% to %end% of %total% Tickets" // It will render a line above table with given text

const dark = true; // Dark theme

const options = {
  perPageLimit,
  visiblecheckboxStatus,
  tableClasses: cssClasses,
  showingLine,
  dark
};

const table = new Table(idOfHTMLElement, {
    columns: columns,
    data: data
  },
  options
);

```