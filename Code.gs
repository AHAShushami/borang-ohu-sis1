/**
 * Google Apps Script (Code.gs) untuk Google Sheet OHU SIS-1
 * Spreadsheet ID: 1EUURTiEpuX9cmlAtNeKyme_ani_spxQh-6eI5Jt_zlw
 * Format: 52 Lajur (FORMAT OHU SIS GDRIVE WEHU SHEET 1)
 */

const SPREADSHEET_ID = "1EUURTiEpuX9cmlAtNeKyme_ani_spxQh-6eI5Jt_zlw";
const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const row = payload.row;
    if (!Array.isArray(row) || row.length !== 52) {
      throw new Error("Format data tidak sah: memerlukan 52 lajur.");
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    const lastRow = sheet.getLastRow();
    const nextNo = lastRow >= 1 ? lastRow : 1;
    row[0] = nextNo;

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, rowNumber: nextNo })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
