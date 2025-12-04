/**
 * Class to handle writing data to a Google Spreadsheet.
 */

class SheetHandler {
    constructor(config = {}) {
        /**
         * @param {Object} config - Configuration options
         * @param {string} [config.sheetName='Sheet1'] - Name of the target sheet
         * @param {boolean} [config.clearSheet=false] - Whether to clear data (excluding headers)
         * @param {Array<string>} [config.columns] - Custom column headers
         */

        // the default name for sheet is sheet1 if not declared
        this.sheetName = config.sheetName || 'Sheet1';
        if (typeof this.sheetName !== 'string' || this.sheetName.trim() === '') {
            throw new Error('sheetName must be a non-empty string');
        }

        this.data = config.data
        if (!this.data || this.data.length === 0) {
            throw new Error('no data received for sheet')
        }

        this.columns = config.columns || [
            'id', 'file_name', 'owner', 'date_created', 'last_updated', 'file_type', 'url', 'file_description'
        ];

        if (!Array.isArray(this.columns) || this.columns.length === 0) {
            throw new Error('columns must be a non-empty array');
        }

        // this for handling sheet api 
        this.sheet = null;
        this.ui = null
    }

    /**
     * main function
     */
    async createSheetRows() {
        try {
            this._validateSheet()
            this._validateData()
            await this._clearRows()
            await this._createColumnHeaders()
            await this._createRows()

            return { success: true, message: `create rows for ${this.data.length} files success`}
        } catch (err) {
            Logger.log(err)
            return { success: false, message: err }
        }
    }

    /**
     * Checks if the target sheet exists.
     * @returns {Object} - { success: boolean, message: string }
     */
    _validateSheet() {
        this.sheet = SpreadsheetApp.getActive().getSheetByName(this.sheetName);

        if (!this.sheet) {
            throw new Error(`sheet with name ${this.sheetName} not found`)
        }
        return { success: true, message: `sheet with name ${this.sheetName} found` };
    }

    /**
     * Validates the input data in form of array against the expected column count.
     * @param {Array<Array>} data - Array of arrays containing row data
     * @returns {Object} - { success: boolean, message: string }
     */
    _validateData() {
        if (!this.data || this.data.length === 0) {
            throw new Error('data is null')
        }
        if (!this.data.every(row => row.length === this.columns.length)) {
            return this.handleError(new Error('Data rows do not match column count'), true);
        }
        return { success: true, message: 'data is valid' };

    }
    /**
     * Clears the data range (including column headers) 
     * @returns {Object} - { success: boolean, message: string }
     */
    _clearRows() {
        this.sheet.clear();
        return { success: true, message: 'clear sheet success' };
    }
    /**
     * create column headers
     * @returns {Object} - { success: boolean, message: string }
     */
    _createColumnHeaders() {
        this.sheet.getRange(1, 1, 1, this.columns.length).setValues([this.columns]);
        return { success: true, message: 'creating column headers successful' };
    }
    /**
     * create row for google sheet
     * @return {object} - { success: boolean, message: string}
     */
    async _createRows() {
        this.sheet.getRange(2, 1, this.data.length, this.data[0].length).setValues(this.data);
        return { success: true, message: `creating row for file attributes success`}
    }

    /**
     * Handles errors by logging and alerting.
     * @param {Error} err - The error object
     * @returns {Object} - { success: boolean, message: string }
     */
    handleError(err) {
        Logger.log(err)
        return { success: false, message: err.message};
    }
}
