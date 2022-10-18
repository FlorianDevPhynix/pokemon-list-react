import React from "react"

import * as APIAccess from "../services/PokemonAPIAccess"

import * as FilterComponent from './FilterComponent'
import * as PokemonList from "./PokemonList";

export default function PokemonListView()
{

	const filterHandler = React.useRef<FilterComponent.IFilterComponentHandle>(null);
	const listHandler = React.useRef<PokemonList.IPokemonListHandler>(null);
 
	return (
		<div className="container-fluid">
			<FilterComponent.FilterComponent onUpdate={ () => listHandler.current?.forceUpdate() } ref={filterHandler}/>
			<PokemonList.PokemonList filterHandler={filterHandler} ref={listHandler}/>
			<div className="row row-auto"></div>
		</div>
	)
}