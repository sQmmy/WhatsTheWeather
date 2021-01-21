const initialState = { favoriteCitiesIds: [] };

function favCities(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case "SAVE_CITY": //Ajout d'une ville aux favoris
      nextState = {
        ...state,
        favoriteCitiesIds: [...state.favoriteCitiesIds, action.value],
      };
      return nextState || state;
    case "POP_CITY": //Retrait d'une ville des favoris
      nextState = {
        ...state,
        favoriteCitiesIds: state.favoriteCitiesIds.filter(
          (id) => id !== action.value
        ),
      };
      return nextState || state;
    case "RESTORE_APP":
      return initialState;
    default:
      return state;
  }
}

export default favCities;
