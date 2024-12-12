const makeSlug = (name: String) => {
    //converting name to lower case then spaces replacing with '-' 
    //removing other special chars
    return name.trim().toLowerCase().replace(/[ \/\&]/g, '-') // replacing spaces with - 
      .replace(/[^\w-]+/g, '') // removing special chars
      .replace(/(\-)\1+/ig, (str, match) => { // removing duplicate consecutive '-'
        return match[0];
      });
  }
  
  
  
  const fileNameHelper = (fileName: string) => {
  
    let [fileOriginalName, fileExtension] = fileName.split('.');
  
    // Remove spaces and special characters from the fileOriginalName
    fileOriginalName = makeSlug(fileOriginalName);
  
    // Get the current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
  
    // Get the current time and format it (HHmmss)
    const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '');
  
    // Construct the unique filename with date and time
    const uniqueFileName = `${formattedDate}_${formattedTime}_${fileOriginalName}.${fileExtension}`;
  
    return uniqueFileName;
  };
  
 
  
  
  
  
  export { makeSlug, fileNameHelper};
  
  
  