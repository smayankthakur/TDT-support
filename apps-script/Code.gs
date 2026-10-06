/**
 * The Divine Tarot – Support Desk
 * Google Apps Script (bound to the Google Sheet)
 *
 * Receives tickets posted by /api/support (Next.js route), then:
 *   1. Appends a row to the "Tickets" sheet
 *   2. Saves screenshots to a Drive folder and links them in the row
 *   3. Emails the admin with the ticket details + screenshots attached
 *   4. Sends a confirmation email to the customer
 *
 * Returns JSON { status: 'success' } (what the Next.js route expects).
 */

// Google account that owns this script: its Sheet stores the tickets, its Drive
// stores the screenshots, and its Gmail sends the emails. Deploy from this account.
var OWNER_ACCOUNT = 'dev.thedivinetarot111@gmail.com';
// Inbox that receives the "New Support Ticket" alerts (customers' replies go here too).
var ADMIN_EMAIL   = 'thedivinetarotsupport@gmail.com';
var FROM_NAME     = 'The Divine Tarot Support';
var SHEET_NAME    = 'Tickets';
var DRIVE_FOLDER  = 'Divine Tarot Support Screenshots';
var SEND_AUTOREPLY = true;

var ISSUE_LABELS = {
  login_after_sub: 'Cannot access premium after subscribing',
  billing:         'Billing / Double Charge',
  technical:       'Technical Error / Bug',
  other:           'Other Inquiry'
};

var HEADERS = [
  'Ticket ID', 'Timestamp', 'Name', 'Email', 'Phone', 'Issue Type',
  'Description', 'Payment Screenshot', 'Error Screenshot', 'Status'
];

function doPost(e) {
  try {
    var raw  = (e && e.postData && e.postData.contents) || '{}';
    var data = JSON.parse(raw);

    var name        = String(data.name || '').trim();
    var email       = String(data.email || '').trim();
    var phone       = String(data.phone || '').trim();
    var issue       = String(data.issue || 'other');
    var description = String(data.description || '').trim();

    if (!name || !email || !description) {
      return respond_({ status: 'error', message: 'Missing required fields' });
    }

    var ticketId   = makeTicketId_();
    var timestamp  = new Date();
    var issueLabel = ISSUE_LABELS[issue] || issue;

    // Save screenshots (data URLs) to Drive
    var paymentFile = saveScreenshot_(data.paymentScreenshot, ticketId + '-payment');
    var errorFile   = saveScreenshot_(data.errorScreenshot,   ticketId + '-error');

    // Append to sheet
    var sheet = getSheet_();
    sheet.appendRow([
      ticketId,
      timestamp,
      name,
      email,
      phone,
      issueLabel,
      description,
      paymentFile ? paymentFile.getUrl() : '',
      errorFile   ? errorFile.getUrl()   : '',
      'Open'
    ]);

    // Notify admin
    sendAdminEmail_(ticketId, timestamp, name, email, phone, issueLabel, description, paymentFile, errorFile);

    // Confirm to customer
    if (SEND_AUTOREPLY) sendCustomerEmail_(ticketId, name, email, issueLabel);

    return respond_({ status: 'success', ticketId: ticketId });
  } catch (err) {
    Logger.log('doPost error: ' + err);
    return respond_({ status: 'error', message: String(err && err.message || err) });
  }
}

// Health check: open the web-app /exec URL in a browser.
// "runningAs" must show OWNER_ACCOUNT (dev.thedivinetarot111@gmail.com) – that is
// the account whose Gmail sends the mails and whose Sheet/Drive receive the tickets.
function doGet() {
  var me = Session.getEffectiveUser().getEmail();
  return respond_({
    status: 'ok',
    service: 'Divine Tarot Support',
    runningAs: me,
    correctAccount: me.toLowerCase() === OWNER_ACCOUNT.toLowerCase()
  });
}

/**
 * Run once from the editor (signed in as dev.thedivinetarot111@gmail.com).
 * Creates the "Tickets" tab and the Drive folder, grants permissions,
 * and logs where everything lives.
 */
function setup() {
  var me = Session.getEffectiveUser().getEmail();
  var sheet = getSheet_();
  var folder = getFolder_();
  Logger.log('Running as:   ' + me + (me.toLowerCase() === OWNER_ACCOUNT.toLowerCase() ? '  (correct)' : '  <-- WRONG ACCOUNT, should be ' + OWNER_ACCOUNT));
  Logger.log('Ticket sheet: ' + sheet.getParent().getUrl());
  Logger.log('Drive folder: ' + folder.getUrl() + '  (owner: ' + folder.getOwner().getEmail() + ')');
  Logger.log('Admin alerts: ' + ADMIN_EMAIL);
}

/* ---------- helpers ---------- */

function respond_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function makeTicketId_() {
  var d = new Date();
  var stamp = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyyMMdd');
  var rand  = Math.floor(1000 + Math.random() * 9000);
  return 'TDT-' + stamp + '-' + rand;
}

function getFolder_() {
  var it = DriveApp.getFoldersByName(DRIVE_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(DRIVE_FOLDER);
}

/** Accepts "data:image/png;base64,...." and returns a Drive File (or null). */
function saveScreenshot_(dataUrl, baseName) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  var m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  var mime  = m[1];
  var bytes = Utilities.base64Decode(m[2]);
  var ext   = (mime.split('/')[1] || 'png').replace('jpeg', 'jpg');
  var blob  = Utilities.newBlob(bytes, mime, baseName + '.' + ext);
  var file  = getFolder_().createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file;
}

function esc_(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function sendAdminEmail_(ticketId, ts, name, email, phone, issueLabel, description, paymentFile, errorFile) {
  var when = Utilities.formatDate(ts, 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a') + ' IST';
  var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  var html =
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0b0b0f;color:#e5e7eb;padding:24px;border-radius:12px">' +
      '<h2 style="color:#d4af37;margin:0 0 4px">New Support Ticket</h2>' +
      '<p style="color:#9ca3af;margin:0 0 20px">' + esc_(ticketId) + ' &middot; ' + esc_(when) + '</p>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px">' +
        row_('Name', name) +
        row_('Email', '<a href="mailto:' + esc_(email) + '" style="color:#d4af37">' + esc_(email) + '</a>') +
        (phone ? row_('Phone', phone) : '') +
        row_('Issue', issueLabel) +
        row_('Description', esc_(description)) +
        (paymentFile ? row_('Payment proof', '<a href="' + paymentFile.getUrl() + '" style="color:#d4af37">Open in Drive</a>') : '') +
        (errorFile   ? row_('Error screenshot', '<a href="' + errorFile.getUrl()   + '" style="color:#d4af37">Open in Drive</a>') : '') +
      '</table>' +
      '<p style="margin-top:24px"><a href="' + sheetUrl + '" style="background:#d4af37;color:#000;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Open ticket sheet</a></p>' +
    '</div>';

  var attachments = [];
  if (paymentFile) attachments.push(paymentFile.getBlob());
  if (errorFile)   attachments.push(errorFile.getBlob());

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    replyTo: email,
    name: FROM_NAME,
    subject: '[' + ticketId + '] ' + issueLabel + ' – ' + name,
    htmlBody: html,
    attachments: attachments
  });
}

function row_(label, valueHtml) {
  return '<tr>' +
    '<td style="padding:8px 10px;border-bottom:1px solid #1f2937;color:#9ca3af;width:140px;vertical-align:top">' + label + '</td>' +
    '<td style="padding:8px 10px;border-bottom:1px solid #1f2937">' + valueHtml + '</td>' +
  '</tr>';
}

function sendCustomerEmail_(ticketId, name, email, issueLabel) {
  var html =
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0b0b0f;color:#e5e7eb;padding:24px;border-radius:12px">' +
      '<h2 style="color:#d4af37;margin:0 0 12px">We received your request</h2>' +
      '<p>Hi ' + esc_(name) + ',</p>' +
      '<p>Thank you for contacting The Divine Tarot support. Your ticket <b style="color:#d4af37">' + esc_(ticketId) + '</b> ' +
      '(' + esc_(issueLabel) + ') has been logged. We usually restore access or reply within <b>24 hours</b>.</p>' +
      '<p>If you need to add anything, just reply to this email.</p>' +
      '<p style="color:#9ca3af;font-size:12px;margin-top:24px">The Divine Tarot &middot; thedivinetarotonline.com</p>' +
    '</div>';

  MailApp.sendEmail({
    to: email,
    replyTo: ADMIN_EMAIL,
    name: FROM_NAME,
    subject: 'Your support ticket ' + ticketId + ' – The Divine Tarot',
    htmlBody: html
  });
}

/** Run this once from the editor to grant permissions and verify the flow. */
function testTicket() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        email: ADMIN_EMAIL,
        phone: '',
        issue: 'login_after_sub',
        description: 'This is a test ticket from the Apps Script editor.',
        paymentScreenshot: null,
        errorScreenshot: null
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}
