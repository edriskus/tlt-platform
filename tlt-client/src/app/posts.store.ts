import { Action } from '@ngrx/store';
import { Post } from './post';

export const UPDATE = 'UPDATE';
export const RESET = 'RESET';

const initialState = 0;

export class PostsState {
  public posts?: Array<Post>;
  public page?: number;
  public size?: number;
  public scrollY?: number = 0;
  constructor(
  ) {}
}

export function postsReducer(state: PostsState = new PostsState(), action: PostsActions) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        ...(<UpdatePostsAction>action).payload
      };

    case RESET:
      return new PostsState();

    default:
      return state;
  }
}

export class UpdatePostsAction implements Action {
  public type = UPDATE;
  constructor(
    public payload: PostsState
  ) {

  }
}

export class ResetPostsAction implements Action {
  public type = RESET;
  constructor() {}
}


export type PostsActions = (UpdatePostsAction | ResetPostsAction)
