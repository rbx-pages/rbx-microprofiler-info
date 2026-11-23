import SiteConfig from "./SiteConfig";
import { ITagDataRoot_JSON } from "./TagInfoData/TagDataClasses";
import { TagDataRootMeta } from "./TagInfoData/TagDataProcessing";
import test_dataJsonStr from "./TagInfoData/tests/testBuilder";


/**
 * Loading data for testing.
 */
async function mockLoadTagData() {
  let test_dataJson = JSON.parse(test_dataJsonStr.build())

  return test_dataJson
}

/**
 * Load data from GitHub
 */
async function fetchLoadTagData() {
  console.log("Fetching TagData...")

  let result = await fetch(SiteConfig.fetchTagDataJSON_URL)
  let resultJSON = await result.json()
  return resultJSON
}
async function fetchLoadMetadataForTagData() {
  console.log("Fetching Metadata...")
  let result = await fetch(SiteConfig.fetchTagDataMetadataJSON_URL)
  let resultJSON = await result.json()
  return resultJSON
}



const Loader_TagData = {
  /**
   * When things like these fields are being set
   * They're invisible but control pass-through conditions
   * They should receive a helper, that says if their intended async "data/isLoaded" setter, ever did a thing or not.
   * Or a Promise.race thing that complains if it took too long. As these give hints.
   */
  isLoaded: false,

  data: null as ITagDataRoot_JSON | null,

  /**
   * Metadata
   */
  metadataHolder: new TagDataRootMeta(),


  /**
   * This is where we store the loading task at.
   * It could also get replaced with a different Promise.
   */
  loadTaskPromise: null as Promise<ITagDataRoot_JSON> | null,

  /**
   * This will fetch the Tag Data and load it.
   * Can be called as many times, but only one load task may exist.
   */
  async LoadTagDataJSON_Async(b_mockLoad: boolean = false) {
    if (this.loadTaskPromise) {
      throw new Error("Called loading twice!")
      // Here I would prefer if we actually cancelled it and started a new one
    }
      

    let loadingTask = async function() {
      try {
        let data = undefined

        if (b_mockLoad)
          data = await mockLoadTagData()
        else
          data = await fetchLoadTagData()

        Loader_TagData.data = data

        // do post-processing
        if (b_mockLoad)
          Loader_TagData.metadataHolder = new TagDataRootMeta(Loader_TagData.data!)
        else {
          // Load pre-built metadata for Tag Data.
          let newMetadata = new TagDataRootMeta()
          let fetchedMetadata = await fetchLoadMetadataForTagData()
          newMetadata.fromJSON(fetchedMetadata)
          Loader_TagData.metadataHolder = newMetadata
        }
        

        // Set before return
        Loader_TagData.isLoaded = true

        return data
      } catch(err) {
        Loader_TagData.loadTaskPromise = null
        throw err;
      }
    }

    // Store
    this.loadTaskPromise = loadingTask()


    // Helper... eh...
    /*(async function() {
      let security = await Loader_TagData.loadTask

      if (Loader_TagData.isLoaded == false) {
        console.error("load task finished, but isLoaded returned false.")
      }
    })();*/

    let helperPromise = (async function() {
      window.setTimeout(function() {
        if (Loader_TagData.isLoaded == false) {
          console.warn("Loading took longer than expected")
        }
      }, 5000)
    })()

    // Now, it would be cool if there's a cancel for "helperPromise"
    Promise.race([helperPromise, this.loadTaskPromise])

    
    return this.loadTaskPromise
  },

  
  /**
   * Retrieve data
   */
  /*GetData() {
    if (!this.isLoaded)
      throw new Error("Data is not loaded yet!")

    return this.data
  },*/

  /**
   * Trap wait loading
   */
  async WaitForLoad() {
    // This loading here is based on "isLoaded" instead of the promise.
    // The reason for that, is because in case "loadTaskPromise" gets replaced
    //
    // Although it should still be possible to await for the new one as well
    // Instead of doing setTimeout
    while (!this.isLoaded) {
      await new Promise((resolve, reject) => setTimeout(resolve, 0))

      // WARNING: To avoid an infinite loop in case the promise disappers
      // or errors, we place this here.
      if (!this.loadTaskPromise)
        throw new Error("Loading failed!")


      /*try {

      } catch {
        
      }*/
    }

    // Once loaded
    return true
  }
}


export default Loader_TagData;