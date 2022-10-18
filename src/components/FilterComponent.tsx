import React from 'react'

import * as APIAccess from '../services/PokemonAPIAccess'
import FilterButton from './FilterButton'

function addFilter( array:string[], filter:string ):string[]
{
	
	if( array.includes( filter ) )
		return array
	
	return [ ...array, filter ]
}

export interface IFilterComponentProps
{

    onUpdate: () => void
}

export interface IFilterComponentHandle
{
    
    activateFilter: ( newFilter:string ) => void,
    fitsFilter: ( elementfilter:string[] ) => boolean
}

export const FilterComponent = React.forwardRef<IFilterComponentHandle,IFilterComponentProps>( ( props, ref ) =>
{

	const [state, setState] = React.useState<"initial" | "loading" | "finished" | "error">( "initial" );

	const [filters, setFilters] = React.useState<APIAccess.IPokemonType[]>( new Array<APIAccess.IPokemonType>() );
	const [activeFilters, setActiveFilters] = React.useState<string[]>( new Array<string>() );

    React.useImperativeHandle( ref, () => ( {
        //add a element to the active filters
         activateFilter: ( newFilter:string ) => {

            setActiveFilters( addFilter( activeFilters, newFilter ) )
        },
        //compare elements with filter
        fitsFilter: ( elementfilter:string[] ) => {

            if( activeFilters.length <= 0 )
                return true

            var treffer = 0
            activeFilters.forEach( ( filter ) => {
    
                if( elementfilter.includes( filter ) )
                    treffer += 1 
            } )

            if( treffer === activeFilters.length )
                return true
            
            return false
        }
    } ) )

	React.useEffect( () => {

		if( state === "initial" )
		{
			
			setState( "loading" )

			APIAccess.getTypeListAsync()
			.then( ( ( result ) => {

				setFilters( result )
                setState( "finished" )
			} ) )
            .catch( ( reason ) => {

                setState( "error" )
            } )
		}
	}, [state] )

    React.useEffect( () => {

        props.onUpdate()
    }, [activeFilters] )


    return ( <div className="row sticky-top">
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
    </div> )
} )