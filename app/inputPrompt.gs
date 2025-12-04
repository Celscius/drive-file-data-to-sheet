const text = {
    title: 'loads file attributes from files on google drive to google sheet',
    message: 'put your google drive directory here:'
}

/**
 * get input text from prompt
 * @param {function} [SpreadsheetApp.getUi()] - ui instance for spreadsheet
 * @returns {Object} - { success: boolean, message: string, url: string|null }
 */
function getUserInputPrompt(ui) {
    if (!ui || ui === null) {
        throw new Error('you need to use UI instance of the active spreadsheet')
    }

    // Display a prompt dialog
    const response = ui.prompt(
        text.title, // Title of the dialog
        text.message, // Message displayed in the dialog
        ui.ButtonSet.OK_CANCEL // Buttons available in the dialog
    );

    // Check which button the user clicked
    if (response.getSelectedButton() == ui.Button.OK) {
        // If the user clicked OK, get the entered text
        const text = response.getResponseText();
        return { success: true, message: 'input received',url: text }
    }

    // if user click cancel 
    else if (response.getSelectedButton() == ui.Button.CANCEL) {
        return { success: false, message: "Input was cancelled.", url: null}
    } else {
        return { success: false, message: 'The dialog was closed without action.', url: null }
    }
}
