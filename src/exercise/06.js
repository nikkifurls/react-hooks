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
  const [status, setStatus] = React.useState(states.idle);
  const [pokemon, setPokemon] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!pokemonName || '' === pokemonName) {
      return;
    }
    setStatus(states.pending);
    fetchPokemon(pokemonName)
      .then(
        pokemonData => {
          setPokemon(pokemonData);
          setStatus(states.resolved);
        },
      )
      .catch(
        error => {
          setError(error);
          setStatus(states.rejected);
        },
      )
  }, [pokemonName]);

  switch (status) {
    case states.idle: {
      return 'Submit a pokemon';
    }
    case states.pending: {
      return <PokemonInfoFallback name={pokemonName} />
    }
    case states.resolved: {
      return <PokemonDataView pokemon={pokemon} />;
    }
    case states.rejected: {
      return (
        <div role="alert">
          There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
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
