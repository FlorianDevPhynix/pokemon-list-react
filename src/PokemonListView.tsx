import React, { useState, useEffect, useMemo } from "react"

import { getListAsync, getTypeListAsync, IPokemon, IPokemonType } from "./PokemonAPIAccess";

import FilterButton from "./FilterButton";

/*type State = {
	
	typefilter: string[];
	
	images: IPokemon[];
};*/

function addFilter( array:string[], filter:string ):string[]
{
	
	if( array.includes( filter ) )
		return array
	
	return [ ...array, filter ]
}

function filterList( PokemonListe:IPokemon[], activeFilters:string[] ):IPokemon[]
{
	
	if( activeFilters.length <= 0 )
	{

		return PokemonListe
	} else
	{

		return PokemonListe.filter( ( pokemon ) => {
		
			var treffer = 0
			activeFilters.forEach( ( filter ) => {
	
				if( pokemon.types.includes( filter ) )
					treffer += 1 
			} )

			if( treffer > 0 && treffer === activeFilters.length )
				return true
			return false
		} )
	}
}

export default function PokemonListView()
{

	const [state, setState] = useState<"initial" | "loading" | "finished" | "error">( "initial" );

	const [filters, setFilters] = useState<IPokemonType[]>( new Array<IPokemonType>() );
	const [activeFilters, setActiveFilters] = useState<string[]>( new Array<string>() );

	const [PokemonListe, setPokemonListe] = useState<IPokemon[]>( new Array<IPokemon>( 150 ) );
	const [filteredList, setFilteredList] = useState<IPokemon[]>( new Array<IPokemon>( 150 ) );

	useEffect( () => {

		if( state === "initial" )
		{
			
			setState( "loading" )

			getTypeListAsync()
			.then( ( ( result ) => {

				setFilters( result )
			} ) )

			getListAsync( 150, ( pokemons ) => {
				
				setPokemonListe( pokemons.slice() )
			} ).then( ( result ) => {

				setState( "finished" )
			} )
		}
	}, [state] )

	/*useEffect( () => {

		if( state !== "initial" && state !== "error" )
		{
			console.log( "filtering" )
			setFilteredList( filterList( PokemonListe, activeFilters ) )
		}
	}, [activeFilters, PokemonListe, state] )*/
 
	return (
		<div className="container-fluid">
			<div className="row sticky-top">
				<div className="container-fluid py-3">
					<div className="d-flex flex-row justify-content-center align-items-center flex-wrap" role="group" aria-label="Filter Liste">
						{ filters.map<JSX.Element | null>( ( type, index ) => {

							if( activeFilters.includes( type.name ) )
								return null

							return <div className="p-1"  key={index}>
								<FilterButton className="btn btn-outline-secondary" filter={type.name} callback={ ( filter ) => setActiveFilters( addFilter( activeFilters, filter ) ) }/>
							</div>
						} ) }
					</div>
				</div>
				<div className="container-fluid">
					<div className="d-flex flex-row justify-content-center align-items-center flex-wrap" role="group" aria-label="Aktive Filter">
						{ activeFilters.map<JSX.Element>( ( type, index ) => {

							return <div className="border-top border-secondary py-3 px-1" key={index}>
									<FilterButton className="btn btn-outline-primary" filter={type} callback={ ( filter ) => setActiveFilters( activeFilters.filter( filter => filter !== type ) ) }/>
							</div>
						} ) }
					</div>
				</div>
			</div>
			<div className="row">
				<div className="container-fluid bg-dark px-5">
					{ ( state !== "initial" && state !== "error" ) &&
						<div className="row gx-5">
							{ PokemonListe.map( ( element, index ) => {

								var treffer = 0
								activeFilters.forEach( ( filter ) => {
						
									if( element.types.includes( filter ) )
										treffer += 1 
								} )
					
								if( treffer === activeFilters.length )
									return ( <div className="text-white bg-dark col-xs-5 col-sm-4 col-md-3 col-xl-2 p-3" key={element.id}>
										<div className="card h-100 bg-secondary">
											<img src={element.sprites.dream_world} alt={element.name + " image"} className="card-img-top rounded h-50 p-3"/>
											<div className="card-body px-2 d-flex flex-column justify-content-end align-items-center">
												<h5 className="card-title text-center">{element.name} <small className="fs-6">({element.id})</small></h5>
												<ul className="list-group list-group-flush">
													<li className="list-group-item fs-6 bg-secondary text-center">Höhe: {Math.round( ( element.height * 0.1 ) * 100 ) / 100} m</li>
													<li className="list-group-item fs-6 bg-secondary text-center">Gewicht: {Math.round( ( element.weight * 0.1 ) * 100 ) / 100} Kg</li>
												</ul>
											</div>
											<div className="card-footer d-flex flex-row justify-content-center align-items-center">
												{ element.types.map<JSX.Element>( ( type ) => {
			
													return ( <div className="d-inline p-1">
														<FilterButton filter={type} callback={ ( filter ) => setActiveFilters( addFilter( activeFilters, filter ) ) } className="btn btn-primary"/>
													</div> )
												} ) }
											</div>
										</div>
									</div> )
								return null
							} ) }
						</div>
					}
					{ state === "loading" &&
						<div className="bg-dark d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					}
					{ state === "error" &&
						<div className="bg-dark d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
							<p className="text-primary text-center" role="status">Error</p>
						</div>
					}
				</div>
			</div>
			<div className="row row-auto"></div>
		</div>
	)
}