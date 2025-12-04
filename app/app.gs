// Get the UI instance of the active spreadsheet
const ui = SpreadsheetApp.getUi();

async function app() {
  try{
    let inputPrompt
    let sheetHandler
    let driveHandler

    let sheetConfig = {}

    // diplay input prompt on google sheet
    inputPrompt = getUserInputPrompt(ui)
    if(!inputPrompt.success){ return Logger.log(receive.message)}
    
    // check google drive directory
    driveHandler = new DriveHandler(inputPrompt.url)
    const found = await driveHandler.getFileAttributes()
    
    if(!found.success){ return ui.alert('Failed',found.message, ui.ButtonSet.OK); }

    sheetConfig = {
      sheetName: 'Sheet1',
      data: found.data
    }
      
    sheetHandler = new SheetHandler(sheetConfig)
    const result = await sheetHandler.createSheetRows()
      
    // show success dialog box with message if create rows success
    ui.alert('Success',result.message, ui.ButtonSet.OK);
  }catch (err){
    Logger.log(err);
    ui.alert('Failed', `eror: ${err}`, ui.ButtonSet.OK);
  }
}
