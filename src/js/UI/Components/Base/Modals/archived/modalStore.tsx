import NumericIdTracker from "../../../../../modules/Utils/NumericIdTracker";
import BaseReactSyncStore from "../../BaseReactSyncStore";
import { Props_ModalWrapperAdditional } from "../ModalWrapperWindow";



/**
 * A useSyncExternalStore
 * React uses reference snapshots, so the objects need to be different.
 * You can't directly mutate them, it needs to be a new object.
 * 
 * 
 * This also has another issue. Since this is an external store
 * and we're passing through React.ReactNode this is essentially really bad
 */


export type ModalStoreEntry_InputProps = {
    content: React.ReactNode;

    /**
     * Callback for when a modal closes.
     * Can be provided into portals.
     * Should be treated like a way of a modal being cancelled.
     */
    onModalClose?: Function

    /**
     * To which holder it should go. 
     */
    holderId?: string;


    /**
     * Extra Props for ModalWrapper
     */
    extraProps?: Props_ModalWrapperAdditional
}


export type ModalStoreEntry = ModalStoreEntry_InputProps & {
    id: string;
}

const listeners_Set = new Set<Function>();

export const _MODAL_GLOBAL_HOLDER_ID = "_global"


type ModalStoreData = {
  /**
   * holderId defines to which ModalHolder a modal has to go
   * ModalStoreEntry[] are the entries that are part of the holder
   */
  modalsRecord: Record<string, ModalStoreEntry[]>
  holdersIds?: string[],
}


class ModalStore extends BaseReactSyncStore<ModalStoreData> {
  private modalIdTracker = new NumericIdTracker();

  private makeModalEntry(props: ModalStoreEntry_InputProps) {
    let newId = this.modalIdTracker.createIdAsString()

    let modalEntry = {
      ...props,
      id: newId
    }

    return modalEntry
  }

  /**
   * Fallback to global ID if not ID have been provided.
   */
  private _processNormalizeHolderId(props: ModalStoreEntry_InputProps) {
    props.holderId = props.holderId ?? _MODAL_GLOBAL_HOLDER_ID

    return props.holderId
  }

  /**
   * Re-news the store data, so it creates new object references or something
   * because React external store needs this
   */
  private _refreshStoreData() {
    this.storeData = {
      ...this.storeData
    }
  }
  
  /**
   * 
   * @returns The internal id that represents this Modal.
   */
  public openModal(props: ModalStoreEntry_InputProps) {
    let modalEntry = this.makeModalEntry(props)
    let holderId = this._processNormalizeHolderId(props)
  
    // Insert entry
    //this.storeData.modalsRecord[holderId].push(modalEntry)
    this.storeData.modalsRecord[holderId] = [
      ...this.storeData.modalsRecord[holderId],
      modalEntry
    ]

    this._refreshStoreData()

    this.dispatchToListeners();
    return modalEntry.id
  }

  public openModalSingle(props: ModalStoreEntry_InputProps) {
    let holderId = this._processNormalizeHolderId(props)

    // Close all first.
    this.closeAllModals()

    let modalEntry = this.makeModalEntry(props)

    this.storeData.modalsRecord[holderId] = [
      modalEntry
    ]

    this._refreshStoreData()

    this.dispatchToListeners();
    return modalEntry.id
  }



  /**
   * Trigger all of a modal's hooks.
   */
  private _doModalCloseEntry(modal: ModalStoreEntry) {
    if (modal.onModalClose)
          modal.onModalClose()
  }


  private _findModalById(id: string) {
    let targetModal: ModalStoreEntry | undefined = undefined

    for (const [key, modals] of Object.entries(this.storeData.modalsRecord)) {
      const foundModal = modals.find(m => m.id === id);
      if (foundModal) {
        targetModal = foundModal
      }
    }

    return targetModal
  }


  public closeModalById(id: string) {
    //const modal = this.storeData.find(modal => modal.id === id)

    // Find the modal by id
    let targetModal = this._findModalById(id)

    if (targetModal === undefined)
      return new Error(`Modal with ID "${id}" was not found!`)

    // Trigger hooks
    this._doModalCloseEntry(targetModal)

    let holderId = targetModal.holderId ?? _MODAL_GLOBAL_HOLDER_ID
    
    // Remove entry
    this.storeData.modalsRecord[holderId] = this.storeData.modalsRecord[holderId].filter(
      targetModal => targetModal.id !== id
    )

    this._refreshStoreData()

    this.modalIdTracker.releaseIdFromString(targetModal.id)
    this.dispatchToListeners();
  }

  public closeAllModals(_holderId?: string) {
      let holderId = _holderId ?? _MODAL_GLOBAL_HOLDER_ID

      let _this = this
      this.storeData.modalsRecord[holderId].forEach(function(modal) {
        _this.closeModalById(modal.id)
      })

      // Reset
      this.storeData.modalsRecord[holderId] = [];

      this._refreshStoreData()

      // Dispatch an update
      this.dispatchToListeners();
  }


  /**
   * Update a Modal by ID, by triggering the listeners.
   * 
   * This will cause all current open modals to eventually re-render.
   */
  public updateModalById(id: string, updatedProps: ModalStoreEntry_InputProps) {
    let holderId = this._processNormalizeHolderId(updatedProps)

    let modalsOfHolder = this.storeData.modalsRecord[holderId]
    const indexInArray = modalsOfHolder.findIndex(modal => modal.id === id)

    if (indexInArray === -1) {
      return new Error(`id "${id}" was not found in holderId "${holderId}"`);
    }
    
    const updatedModal: ModalStoreEntry = {
      ...modalsOfHolder[indexInArray], // this modal?
      ...updatedProps,
      id,
    };

    this.storeData.modalsRecord[holderId] = [
      ...modalsOfHolder.slice(0, indexInArray),
      updatedModal,
      ...modalsOfHolder.slice(indexInArray + 1),
    ]

    //this.storeData.modalsRecord[holderId][indexInArray] = updatedModal

    //this._refreshStoreData()

    this.dispatchToListeners()
  }
}


let globalModalEntries: ModalStoreEntry[] = [];

let state = {
  modalsRecord: {
    [_MODAL_GLOBAL_HOLDER_ID]: globalModalEntries
  },
}

// Use as a global store.
let modalStore = new ModalStore(state)


// DEBUG
/*let _window: any = window
_window._DEBUG_MODAL_STORE = {
  classInstance: modalStore
}*/


export default modalStore