// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon, // the function we call to get the pokemon info
  PokemonDataView, // the stuff we use to display the pokemon info
  PokemonInfoFallback, // the thing we show while we're loading the pokemon info
  PokemonForm
} from '../pokemon'

const states = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: states.idle,
    pokemon: null,
    error: null,
  });

  React.useEffect(() => {
    if (!pokemonName || '' === pokemonName) {
      return;
    }
    setState({
      status: states.pending,
      pokemon: null,
      error: null,
    });
    fetchPokemon(pokemonName)
      .then(
        pokemonData => {
          setState({
            status: states.resolved,
            pokemon: pokemonData,
            error: null,
          });
        },
      )
      .catch(
        error => {
          setState({
            status: states.rejected,
            pokemon: null,
            error: error,
          });
        },
      )
  }, [pokemonName]);

  switch (state.status) {
    case states.idle: {
      return 'Submit a pokemon';
    }
    case states.pending: {
      return <PokemonInfoFallback name={pokemonName} />
    }
    case states.resolved: {
      return <PokemonDataView pokemon={state.pokemon} />;
    }
    case states.rejected: {
      return (
        <div role="alert">
          There was an error: <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
        </div>
      );
    }
    default: {
      return 'Submit a pokemon';
    }
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
