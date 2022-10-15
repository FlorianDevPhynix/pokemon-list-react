import React from 'react';

import PokemonListView from './PokemonListView';

function App() {
	return (
		<div className="bg-dark text-white" style={{ overflow: "hidden" }}>
			<header className="py-3 mb-4 border-bottom">
				<nav className="d-flex flex-wrap justify-content-center py-2">
					<a href="/" className="d-flex align-items-center text-decoration-none">
						<span className="fs-4">Pokemon Liste</span>
					</a>
				</nav>
			</header>
			<main>
				<PokemonListView/>
			</main>
		</div>
	);
}

export default App;
