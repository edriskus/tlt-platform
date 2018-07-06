import { Action } from '@ngrx/store';
import { Post } from './post';

export const GLOBAL_TAG: string = 'glo,bal';

export const UPDATE = 'UPDATE';
export const RESET = 'RESET';

const initialState = 0;

export class TagPostsState {
  public posts?: Array<Post>;
  public page?: number;
  public size?: number;
  public scrollY?: number = 0;
  constructor(
  ) {}
}

export interface PostsState {
  [key: string]: TagPostsState
}

export function postsReducer(state: PostsState = {}, action: PostsActions) {
  let tag = (<UpdatePostsAction>action).tag;
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        [tag]: {
          ...(state[tag] || {}),
          ...(<UpdatePostsAction>action).payload
        }
      };

    case RESET:
      return {};

    default:
      return state;
  }
}

export class UpdatePostsAction implements Action {
  public type = UPDATE;
  constructor(
    public payload: TagPostsState,
    public tag: string = GLOBAL_TAG
  ) {

  }
}

export class ResetPostsAction implements Action {
  public type = RESET;
  public tag = GLOBAL_TAG;
  constructor() {}
}


export type PostsActions = (UpdatePostsAction | ResetPostsAction)
