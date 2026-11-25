/**
 * Google Apps Script (Code.gs) untuk Google Sheet OHU SIS-1
 * Spreadsheet ID: 1EUURTiEpuX9cmlAtNeKyme_ani_spxQh-6eI5Jt_zlw
 * Format: 52 Lajur Data (A:AZ) + Lajur ke-53 Rekod_Link (BA - Formula Automatik)
 */

const SPREADSHEET_ID = "1EUURTiEpuX9cmlAtNeKyme_ani_spxQh-6eI5Jt_zlw";
const SHEET_NAME = "Sheet1";

function normalizeIc(val) {
  return String(val || "").replace(/^'/, "").trim().toUpperCase();
}

function normalizeDateStr(val, tz) {
  if (!val) return "";
  if (Object.prototype.toString.call(val) === "[object Date]" && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, tz || "Asia/Kuala_Lumpur", "dd/MM/yyyy");
  }
  return String(val).trim();
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const targetIc = normalizeIc(params.ic || "");
    const targetDate = String(params.date || "").trim();
    const targetNo = String(params.no || "").trim();

    if (!targetIc && !targetNo) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "Parameter 'ic' dan 'date' diperlukan." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const tz = ss.getSpreadsheetTimeZone() || "Asia/Kuala_Lumpur";
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "Tiada rekod dalam Google Sheet." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const displayValues = sheet.getRange(2, 1, lastRow - 1, 52).getDisplayValues();
    let matchedRow = null;
    let matchedSheetRow = -1;

    for (let i = displayValues.length - 1; i >= 0; i--) {
      const r = displayValues[i];
      const rowNo = String(r[0] || "").trim();
      const rowDate = normalizeDateStr(r[1], tz);
      const rowIc = normalizeIc(r[8]);

      const icMatch = !targetIc || rowIc === targetIc || rowIc.indexOf(targetIc) === 0;
      const dateMatch = !targetDate || rowDate === targetDate;
      const noMatch = !targetNo || rowNo === targetNo;

      if (icMatch && dateMatch && noMatch) {
        matchedRow = r;
        matchedSheetRow = i + 2;
        break;
      }
    }

    if (!matchedRow) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "Rekod tidak dijumpai bagi IC dan Tarikh tersebut." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        ok: true,
        rowNumber: matchedRow[0],
        sheetRowIndex: matchedSheetRow,
        row: matchedRow
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const row = Array.isArray(payload.row) ? payload.row.slice(0, 52) : null;
    if (!row || row.length !== 52) {
      throw new Error("Format data tidak sah: memerlukan 52 lajur data.");
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Count populated rows in Column A (NO) so formula spill in BA never shifts row index
    const colA = sheet.getRange("A:A").getDisplayValues();
    let lastDataRow = 1;
    for (let i = colA.length - 1; i >= 0; i--) {
      if (String(colA[i][0] || "").trim() !== "") {
        lastDataRow = i + 1;
        break;
      }
    }

    if (payload.action === "update" && payload.targetNo) {
      for (let r = 2; r <= lastDataRow; r++) {
        if (String(colA[r - 1][0]).trim() === String(payload.targetNo).trim()) {
          row[0] = payload.targetNo;
          sheet.getRange(r, 1, 1, 52).setValues([row]);
          return ContentService.createTextOutput(
            JSON.stringify({ ok: true, updated: true, rowNumber: payload.targetNo })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    const nextNo = lastDataRow >= 1 ? lastDataRow : 1;
    row[0] = nextNo;

    sheet.getRange(lastDataRow + 1, 1, 1, 52).setValues([row]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, rowNumber: nextNo })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
