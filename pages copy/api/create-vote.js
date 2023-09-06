const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

export default async function handler(req, res) {
  const guest = req.body

  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    if (guest.id == -1) {
      const lastRow = await sheet.getRows({ limit: 1, offset: sheet.rowCount - 3 });
      const lastID = lastRow.length > 0 ? parseInt(lastRow[0].id) : 0;
      const nextID = lastID + 1;

      // Update the guest object with the auto-incremented ID
      guest.id = nextID;
      await sheet.addRow(guest);
    } else {
      await sheet.loadCells();

      const rowList = sheet.getRows();
      const rows = [];

      for (const row of rowList) {
        const cellValue = row.getCell(0).value; // Assuming the first column is index 0

        if (cellValue === targetValue) {
          rows.push(row);
        }
      }
      if (rows.length > 0) {
        let rowToUpdate = rows[0];
        rowToUpdate.nama_tamu = guest.nama_tamu;
        rowToUpdate.asal_tamu = guest.asal_tamu;
        rowToUpdate.jumlah_datang = guest.jumlah_datang;
        // console.log(rowToUpdate.id);
        const rowNumber = parseInt(guest.id) + 1;
        guest.selisih = `=D${rowNumber}-E${rowNumber}`;

        // Save the changes to the Google Sheet
        await guest.save();
      } else {
        const lastRow = await sheet.getRows({ limit: 1, offset: sheet.rowCount - 3 });
        const lastID = lastRow.length > 0 ? parseInt(lastRow[0].id) : 0;
        const nextID = lastID + 1;

        // Update the guest object with the auto-incremented ID
        guest.id = nextID;
        const rowNumber = parseInt(guest.id) + 1;
        rowToUpdate.selisih = `=D${rowNumber}-E${rowNumber}`;
        await sheet.addRow(guest);
      }

    }

    res.status(200).json({ message: 'A ok!', total: '', data: {} });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
