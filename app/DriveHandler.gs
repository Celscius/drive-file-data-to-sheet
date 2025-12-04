class DriveHandler{
  constructor(url){
    this.url = url
    if(!url){ throw new Error('you need to put url here')}

    this.directoryId = null
    this.folder = null
    this.files = null
    this.data = []
    
    this.rootDirectory = 'https://drive.google.com/drive/u/0/my-drive'
    this.googleDriveIdRegex = /(?<=folders\/)[^?\/]*/;
    this.validGoogleDriveRegex = /https?:\/\/(?:www\.)?drive\.google\.com\/[^\s]*/

  }

  async getFileAttributes(){
    try{
        this._isValidUrl()
        this._getDirectoryIdFromUrl()
        this._isValidGoogleDriveDirectory()
        this._isFileExist()
        await this._retrieveFileAttributes()

      return this._handleSuccess('getting file attributes success', this.data)
    }catch(err){
      return this._handleError(err)
    }
  }

  _isValidUrl(){
      if (!this.url || typeof this.url !== 'string') { throw new Error('invalid url')}

      const isValidUrl = this.url.match(this.validGoogleDriveRegex);
      if (!isValidUrl){ throw new Error('this is not valid google drive url') }
      
      return this._handleSuccess('url is valid')
  }
  _getDirectoryIdFromUrl(){
      let id 
     
      // if url match root directory then return root directory id
      if (this.url == this.rootDirectory) {
        const root = DriveApp.getRootFolder().getId();
        this.directoryId = root
        
        return this._handleSuccess('found root directory')
      }

      id = this.url.match(this.googleDriveIdRegex);
      if(!id){ throw new Error('id not found in url') }
      
      this.directoryId = id[0]
      
      return this._handleSuccess('found google drive directory id', this.directoryId)
  }

  _isValidGoogleDriveDirectory(){
    try{
      this.folder = DriveApp.getFolderById(this.directoryId);
      return this._handleSuccess('google drive directory is valid') 
    }catch(err){
      Logger.log(err)
      // this for handling if directory id is not valid in google drive directory
      throw new Error('is not valid google drive directory')
    }
    
  }
  _isFileExist(){
    this.files = this.folder.getFiles();
    if(!this.files.hasNext()){ throw new Error('no file found on directory')}
      this.files
    
    return this._handleSuccess('file exist on directory') 
  }

  async _retrieveFileAttributes(){
    while (this.files.hasNext()) {
      const file = this.files.next();
      
      this.data.push([
        file.getId(),
        file.getName(),
        file.getOwner().getName(),
        file.getDateCreated(),
        file.getLastUpdated(),
        file.getMimeType(),
        file.getUrl(),
        file.getDescription(),
        ])
      }
        
      return this._handleSuccess(`success geting file attribut for ${this.data}`, this.data)
  }

   /**
    * Handles errors by logging and alerting.
    * @param {message} string - the text when operation success
    * @param {data} string or null - wheter to show data after successful operation or returning void
    * @returns {Object} - { success: boolean, message: string, data: string || null }
    */
  _handleSuccess(message, data){
      return { success: true, message: message, data: data || null}
  }
  /**
   * Handles errors by logging and returning object
   * @param {Err} erorr - The error object
   * @returns {Object} - { success: boolean, message: string, data: null }
   */
  _handleError(err) {
    Logger.log(err);
    return { success: false, message: err.message, data: null };
  }
}
