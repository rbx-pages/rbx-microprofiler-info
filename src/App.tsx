import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as ReactSplitPane from "react-split-pane";

const SplitPane = ReactSplitPane.SplitPane
const Pane = ReactSplitPane.Pane


import TagSearchField from "./js/UI/Components/TagExplorer/TagSearchField";
import { TagList } from "./js/UI/Components/TagExplorer/TagListing";
import { TagView } from "./js/UI/Components/TagExplorer/TagView";
import Loader_TagData from "./js/modules/Storage_TagData";
import LoadingOverlay from "./js/UI/Components/LoadingOverlay";
import useHookWaitLoad from "./js/UI/Hooks/useWaitLoad";
import { ITagSearchFilters, TagSearching } from "./js/modules/TagSearching";
import TagSearchFilterButton from "./js/UI/Components/TagExplorer/TagFilterButton";
import TagFilterDialog from "./js/UI/Components/TagExplorer/TagFilterDialog";
import { TagEntrySelectionData } from "./js/UI/Components/TagExplorer/TagListEntry";
import { ITagSelectionRequestData, TagExplorerContextProvider } from "./js/UI/Contexts/TagExplorerContext";
import { ITagDataRoot_JSON } from "./js/modules/TagInfoData/TagDataClasses";
import { GetEntryFromTagDataRoot_Lookup } from "./js/UI/Helpers/SiteHelper";
import TagFilterDialog_Modal from "./js/UI/Components/TagExplorer/TagFilterDialog_Modal";
import useSiteSettingsContext from "./js/UI/Hooks/useSiteSettingsContext";
import SiteConfig from "./js/modules/SiteConfig";


// We have to fetch the tags
//const _MOCK_TEST = true // for testing
const _MOCK_TEST = false

Loader_TagData.LoadTagDataJSON_Async(_MOCK_TEST);
// Loading wait is done later.


/**
 * Notes:
 * useReducer is basically like useState, but you can make your different "set value behavior" variants
 */


/**
 * A static promise, so that the promise below doesn't always create a new one
 * We just need this one promise here, unless there's some kind of built-in refreshing
 * Then you'd want to have an overriding promise.
 */
const staticLoadTagData_promise = Loader_TagData.WaitForLoad()


/**
 * 
 */
function App() {

  // "Bootstrapper" for loading Tag Data
  let [bIsTagDataLoaded, showLoading] = useHookWaitLoad(
    staticLoadTagData_promise
  )


  //let [searchQuery, setSearchQuery] = useState("")
  //let searchRef = useRef<SearchRef>(null)

  // For other optimization, useMemo...


  // Take in settings
  let settingsContext = useSiteSettingsContext()
  
  /**
   * This area does the head for the searching.
   * We own the filtered results like that.
   * search query is in here, in case of more than one query
   */
  const defaultFilters: ITagSearchFilters = {
    //query: searchQuery, // start off with whatever there is already
    query: "", // "undefined" errors
    b_searchDesc: false,
    b_onlyWithLabels: false,

    arr_onlyTagGroups: [],
    arr_onlySearchTags: [],
  }
  let [searchFilters, setSearchFilters] = useState<ITagSearchFilters>(defaultFilters)

  // Had to move this stuff here...
  let [filterOpen, setFilterOpen] = useState(false)
  let onFilterClick = function() {
      setFilterOpen(!filterOpen) // Toggle
  }


  // Defined function that closes the Filter Modal
  function closeFilterModal() {
      setFilterOpen(false)
  }

  function func_resetFilter() {
    let newFilters = {
      ...defaultFilters
    }
    newFilters.query = searchFilters.query

    setSearchFilters(newFilters)
  }


  let filteredTagResults = useMemo(function() {
    if (Loader_TagData.data === null)
      return undefined;

    // Search through the Tag Root Data and return results
    return TagSearching.SearchTagRoot(
      Loader_TagData.data,
      searchFilters
    )
  }, [searchFilters.query, searchFilters, bIsTagDataLoaded])


  const func_filterSubmit = function(draftFilters: ITagSearchFilters) {
    //console.log("Filter changed!", draftFilters)

    // We received filter changes, now we can apply them
    setSearchFilters(draftFilters)
  }
  // So it's just there once
  const filterDialogDock = (
    <div className="app_inner">
      <h2>Search Filters</h2>
      <TagFilterDialog
        filterSettings={searchFilters}
        onChange={func_filterSubmit}
      />
    </div>
  )

  // Is the filter changed in some important way?
  let b_showFilterChanged = useMemo(function() {
    if (searchFilters.b_onlyWithLabels || searchFilters.b_searchDesc)
      return true

    if (searchFilters.arr_onlyTagGroups && 
      searchFilters.arr_onlyTagGroups?.length > 0) {
      return true
    }
    if (searchFilters.arr_onlySearchTags && 
      searchFilters.arr_onlySearchTags?.length > 0) {
      return true
    }
    return false
  }, [searchFilters])

  /**
   * Whether the filter should dock on-screen instead of an overlaying UI.
   */
  let b_dockFilter = settingsContext.siteSettings.b_preferDockFilters

  // Get from URI Parameters
  //let startingSelectionData = useGetEntryFromSearchParams() ?? {}
  /*useEffect(function() {
    setSelectedEntry(startingSelectionData)
  }, [])*/

  // Do based on dependencies
  useEffect(function() {
    const params = new URLSearchParams(window.location.search);
    const uri_nameUID = params.get("NameUID");
    const uri_entryType = params.get("entryType")

    let startingTagDataRef = GetEntryFromTagDataRoot_Lookup(
        uri_entryType as keyof ITagDataRoot_JSON,
        uri_nameUID ?? "",
    )

    //console.log(uri_nameUID, startingTagDataRef)

    setSelectedEntry({
        entryType: uri_entryType ?? "",
        tagDataRef: startingTagDataRef,
    })
  }, [bIsTagDataLoaded])
  // Goal is that this runs once
  // Or bIsTagDataLoaded to compensate for networking delay


  // State usage
  // When we navigate backwards or forwards.
  useEffect(() => {
      // Event listener stuff
      function handlePopState(event: PopStateEvent) {
          //console.log("Backwards/Forwards Nav");
          //console.log(event.state);
          console.log(event)

          let lookupTagRef = GetEntryFromTagDataRoot_Lookup(
            event.state.entryType as keyof ITagDataRoot_JSON,
            event.state.NameUID ?? "",
          )

          setSelectedEntry({
            entryType: event.state.entryType,
            tagDataRef: lookupTagRef,
          })
      }

      window.addEventListener("popstate", handlePopState);

      return () => {
          window.removeEventListener("popstate", handlePopState);
      };
  }, []);
  // const [selectionHistory, setSelectionHistory] = useState<TagEntrySelectionData[]>([])


  // Current selected entry
  let [selectedEntry, setSelectedEntry] = useState<TagEntrySelectionData>()

  // Important callback
  let onListEntrySelected = useCallback(function(inputData: ITagSelectionRequestData) {
    //console.log(inputData)

    // Retrieve data
    let available_tagDataRef = inputData.tagDataRef
    if (available_tagDataRef === undefined) {
      available_tagDataRef = GetEntryFromTagDataRoot_Lookup(
        inputData.entryType,
        inputData.nameUID,
      )
    }
    
    // Compose
    let selectionData: TagEntrySelectionData = {
      entryType: inputData.entryType,
      tagDataRef: available_tagDataRef
    }

    //console.log(Loader_TagData.data![selectionData.entryType as any][selectionData.tagDataRef.NameUID])

    /*setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("NameUID", selectionData.tagDataRef?.NameUID!);
      next.set("entryType", inputData.entryType!);
      return next;
    });*/
    
    

    // Push invisibly into the history.
    window.history.pushState(
        {
            entryType: selectionData.entryType,
            NameUID: selectionData.tagDataRef?.NameUID
        },
        "",
        window.location.href
    );

    // Change title after push back.
    document.title = `${SiteConfig.SiteTitle} - ${selectionData.tagDataRef?.NameUID}`

    setSelectedEntry(selectionData)
  }, [setSelectedEntry])
  
  
  //const tagList_Node = undefined

  return <>
  <div id="app_wrapper">

    {/* Loading Overlay */}
    <LoadingOverlay show={showLoading}/>


    {/* A context provider */ }
    <TagExplorerContextProvider
      onListEntrySelected={onListEntrySelected}
    >
    
    {/* App Main Content */}
    {/* Note that content should be put under SplitPane
        other things may break it
    */}
    <SplitPane direction="horizontal">

      <Pane minSize={100} defaultSize={300}>
        <div className="multi-row-container">

          <div id="tag_search_container" className="">
            <div className="app_inner">

              {/* Search field container */}
              <div className="flex searchFieldContainer">
                {/* Search field */}
                <TagSearchField
                  id="tagSearchField"
                  query={searchFilters.query}
                  //onQueryChange={(value) => setSearchQuery(value)}
                  onQueryChange={(value) => setSearchFilters({
                    ...searchFilters,
                    query: value
                  })}
                  //searchRef={searchRef}
                />
                {/* Tag Filter Button */}
                <TagSearchFilterButton
                  onClick={onFilterClick}
                  showFilterIndicator={b_showFilterChanged}
                />
              </div>

            </div>

            {/* Listing Container */}
            <TagList
              query={searchFilters.query}
              resultsTagData={filteredTagResults ?? undefined}

              onListEntrySelected={onListEntrySelected}
              selectedEntryRef={selectedEntry}
            />
          </div>

        {
            (b_dockFilter && filterOpen) && (<div>
              {filterDialogDock}
            </div>)
          }
        </div>
      </Pane>

      {
        // A place where the filter can be docked at as well
        // Filter Docking
        /*(b_dockFilter && filterOpen) && (<Pane minSize={50} defaultSize={200}>
          {filterDialog}
        </Pane>)*/
        // DOESN'T WORK WITH THIS PANE SYSTEM!
        // Would have to dock it on the other pane
      }

      {/* Results Container */}
      <Pane minSize={100}>
        <div id="tag_result_container" className="app_inner">
          <TagView
            entryType={selectedEntry?.entryType}
            tagDataRef={selectedEntry?.tagDataRef}
          />
        </div>
      </Pane>

    </SplitPane>


    {/* Filter Dialog */}
      {
          (!b_dockFilter && filterOpen &&
          /*<ModalLocalOpen
              onModalClose={closeFilterModal}

              extraProps={{
                  title: "Search Filters"
              }}
          >
              {filterDialog}
          </ModalLocalOpen>*/
          <TagFilterDialog_Modal
            searchFilters={searchFilters}
            funcTransmitFilters={func_filterSubmit}
            closeFilterModal={closeFilterModal}
            b_SubmitBtn={false}

            onClearBtnClicked={func_resetFilter}
          />
          )
      }

      {/* Filter Dialog */}
      {/*

          (filterOpen &&
          <ModalPortalOpen

              extraProps={{
                  title: `${testingState}`
              }}
          >
              <button onClick={function() {
                  setTestingState(testingState + 1)
              }}></button>
          </ModalPortalOpen>
          )
      */}

    </TagExplorerContextProvider>
  </div>
  </>
}


export default App;