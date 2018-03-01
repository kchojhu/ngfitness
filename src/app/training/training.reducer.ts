import {SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, START_TRAINING, STOP_TRAINING, TrainingActions} from './training.actions';
import {Exercise} from './exercise.model';

export interface State {
  availableExercises: Exercise[];
  finishedExercies: Exercise[];
  activeTraining: Exercise;
}

// export interface State extends fromRoot.State {
//   training: TrainingState;
// }

const initialState: State = {
  availableExercises: [],
  finishedExercies: [],
  activeTraining: null
};

export function trainingReducer(state: State = initialState, action: TrainingActions): State {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercies: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: {...state.availableExercises.find(ex => ex.id === action.payload)}
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null
      };
    default:
      return state;
  }
}

export const getAvailableTrainings = (state: State) => state.availableExercises;
export const getFinishedTrainings = (state: State) => state.finishedExercies;
export const getActiveTraining = (state: State) => state.activeTraining;
export const isTraining = (state: State) => state.activeTraining !== null;
