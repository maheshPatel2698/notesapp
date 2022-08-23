import { SET_NOTES, UPDATE_NOTE, VIEW_NOTE, UPDATE_IMAGE } from "./action.type"


const NotesReducer = (state, action) => {
    switch (action.type) {
        case SET_NOTES:
            return action.payload === null ?
                { ...state, NoteItem: null }
                :
                { ...state, NoteItem: action.payload }
                ;

        case VIEW_NOTE:
            return {
                ...state,
                note: action.payload
            };
        case UPDATE_NOTE:
            return {
                ...state,
                NoteToUpdate: action.payload,
                NoteToUpdateKey: action.key
            };
        case UPDATE_IMAGE:
            return {
                ...state,
                ImageToUpdateKey: action.key
            };
        default:
            return state
    }
}
export default NotesReducer;