/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import storyReducer, { ACTION_TYPES } from '../stories';

describe('storyReducer', () => {
  const initialState = {
    isError: false,
    isLoading: false,
    stories: {},
    storiesOrderById: [],
    totalStoriesByStatus: {},
    totalPages: null,
  };

  it(`should update stories state when ${ACTION_TYPES.TRASH_STORY} is called`, () => {
    const result = storyReducer(
      {
        ...initialState,
        storiesOrderById: [94, 65, 78, 12],
        stories: {
          94: { id: 94, status: 'draft', title: 'my test story 1' },
          65: { id: 65, status: 'publish', title: 'my test story 2' },
          78: { id: 78, status: 'draft', title: 'my test story 3' },
          12: { id: 12, status: 'draft', title: 'my test story 4' },
        },
        totalStoriesByStatus: {
          all: 44,
          draft: 40,
          publish: 4,
        },
        totalPages: 4,
      },
      {
        type: ACTION_TYPES.TRASH_STORY,
        payload: {
          id: 65,
          storyStatus: 'publish',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isError: false,
      storiesOrderById: [94, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
      totalStoriesByStatus: {
        all: 43,
        draft: 40,
        publish: 3,
      },
      totalPages: 4,
    });
  });

  it(`should update stories state when ${ACTION_TYPES.DUPLICATE_STORY} is called`, () => {
    const result = storyReducer(
      {
        ...initialState,
        storiesOrderById: [94, 65, 78, 12],
        stories: {
          94: { id: 94, status: 'draft', title: 'my test story 1' },
          65: { id: 65, status: 'publish', title: 'my test story 2' },
          78: { id: 78, status: 'draft', title: 'my test story 3' },
          12: { id: 12, status: 'draft', title: 'my test story 4' },
        },
        totalStoriesByStatus: {
          all: 44,
          draft: 40,
          publish: 4,
        },
        totalPages: 4,
      },
      {
        type: ACTION_TYPES.DUPLICATE_STORY,
        payload: { id: 95, status: 'draft', title: 'my test story 1 - copy' },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isError: false,
      storiesOrderById: [95, 94, 65, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        95: { id: 95, status: 'draft', title: 'my test story 1 - copy' },
        65: { id: 65, status: 'publish', title: 'my test story 2' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
      totalStoriesByStatus: {
        all: 45,
        draft: 41,
        publish: 4,
      },
      totalPages: 4,
    });
  });

  it(`should update stories state when ${ACTION_TYPES.FETCH_STORIES_SUCCESS} is called`, () => {
    const result = storyReducer(initialState, {
      type: ACTION_TYPES.FETCH_STORIES_SUCCESS,
      payload: {
        page: 1,
        stories: [
          { id: 94, status: 'draft', title: 'my test story 1' },
          { id: 65, status: 'publish', title: 'my test story 2' },
          { id: 78, status: 'draft', title: 'my test story 3' },
          { id: 12, status: 'draft', title: 'my test story 4' },
        ],
        totalStoriesByStatus: {
          all: 44,
          draft: 40,
          publish: 4,
        },
        totalPages: 4,
      },
    });

    expect(result).toMatchObject({
      ...initialState,
      isError: false,
      storiesOrderById: [94, 65, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        65: { id: 65, status: 'publish', title: 'my test story 2' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
      totalStoriesByStatus: {
        all: 44,
        draft: 40,
        publish: 4,
      },
      totalPages: 4,
      allPagesFetched: false,
    });
  });

  it(`should update stories state when ${ACTION_TYPES.FETCH_STORIES_SUCCESS} is called and maintain order from existing state`, () => {
    const result = storyReducer(
      { ...initialState, storiesOrderById: [55, 99, 10, 3] },
      {
        type: ACTION_TYPES.FETCH_STORIES_SUCCESS,
        payload: {
          page: 2,
          stories: [
            { id: 94, status: 'draft', title: 'my test story 1' },
            { id: 65, status: 'publish', title: 'my test story 2' },
            { id: 78, status: 'draft', title: 'my test story 3' },
            { id: 12, status: 'draft', title: 'my test story 4' },
          ],
          totalStoriesByStatus: {
            all: 18,
            draft: 14,
            publish: 4,
          },
          totalPages: 2,
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      storiesOrderById: [55, 99, 10, 3, 94, 65, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        65: { id: 65, status: 'publish', title: 'my test story 2' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
      totalStoriesByStatus: {
        all: 18,
        draft: 14,
        publish: 4,
      },
      totalPages: 2,
      allPagesFetched: true,
    });
  });

  it(`should update isLoading when ${ACTION_TYPES.LOADING_STORIES} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.LOADING_STORIES,
        payload: true,
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should update isError when ${ACTION_TYPES.FETCH_STORIES_FAILURE} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.FETCH_STORIES_FAILURE,
        payload: true,
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isError: true,
    });
  });

  it(`should update stories state when ${ACTION_TYPES.UPDATE_STORY} is called`, () => {
    const result = storyReducer(
      {
        ...initialState,
        stories: {
          94: { id: 94, status: 'draft', title: 'my test story 1' },
          65: { id: 65, status: 'publish', title: 'my test story 2' },
          78: { id: 78, status: 'draft', title: 'my test story 3' },
          12: { id: 12, status: 'draft', title: 'my test story 4' },
        },
      },
      {
        type: ACTION_TYPES.UPDATE_STORY,
        payload: { id: 65, status: 'publish', title: 'new title for story' },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        65: { id: 65, status: 'publish', title: 'new title for story' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
    });
  });
});
