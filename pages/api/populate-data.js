const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

export default async function handler(req, res) {

  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
    });
    await doc.loadInfo();
    // Get the first sheet (index 0)
    const sheet = doc.sheetsByIndex[0];

    // Load all rows from the sheet
    await sheet.loadCells();
    // Determine the number of rows and columns in the sheet
    const numRows = sheet.rowCount;
    const numCols = sheet.columnCount;

    // Create an array to store the data
    const data = [];

    // Loop through each row and column to collect the data
    let reachEnd = false;
    let rowIndex = 0;

    while (!reachEnd) {
      const rowData = [];
      if (rowIndex == sheet.rowCount) {
        reachEnd = true;
      } else {
        for (let col = 0; col < numCols; col++) {
          const cell = sheet.getCell(rowIndex, col);
          if (cell.value != null) {
            rowData.push(cell.value);
          }
        }
        rowIndex += 1;
        data.push(rowData);
      }
    }

    res.status(200).json({ message: 'A ok!', total: data.length, data: data });
  } catch (error) {
    res.status(500).json(error);
  }
}
