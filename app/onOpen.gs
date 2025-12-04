function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('files')
    .addItem('Files', 'app')
    .addToUi();
}
