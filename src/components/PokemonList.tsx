import React, { RefObject } from 'react'

import * as APIAccess from "../services/PokemonAPIAccess"

import * as FilterComponent from './FilterComponent'
import FilterButton from "./FilterButton";

export interface IPokemonListProps
{

    filterHandler: RefObject<FilterComponent.IFilterComponentHandle>
}

export interface IPokemonListHandler
{
    
    forceUpdate: () => void
}

//export function PokemonList( props:IPokemonListProps )
export const PokemonList = React.forwardRef<IPokemonListHandler,IPokemonListProps>( ( props, ref ) =>
{
	const [state, setState] = React.useState<"initial" | "loading" | "finished" | "error">( "initial" );
	const [update, doUpdate] = React.useState<boolean>( false );

	const [PokemonListe, setPokemonListe] = React.useState<APIAccess.IPokemon[]>( new Array<APIAccess.IPokemon>( 150 ) );
    
    React.useImperativeHandle( ref, () => ( {
        
        forceUpdate: () => {

           doUpdate( !update )
       }
   } ) )

	React.useEffect( () => {

		if( state === "initial" )
		{
			
			setState( "loading" )

			APIAccess.getListAsync( 150, ( pokemons ) => {
				
				setPokemonListe( pokemons.slice() )
			} ).then( ( result ) => {

				setState( "finished" )
			} )
		}
	}, [state] )

    return (<div className="row">
        <div className="container-fluid bg-dark px-5">
            { ( state !== "initial" && state !== "error" ) &&
                <div className="row gx-5">
                    { PokemonListe.map( ( element, index ) => {

                        if( props.filterHandler.current?.fitsFilter( element.types ) )
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
                                                <FilterButton filter={type} callback={ ( filter ) => props.filterHandler.current?.activateFilter( filter ) } className="btn btn-primary"/>
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
    </div> )
} )
