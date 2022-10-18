import React from 'react'

interface IFilterButtonProps
{

	filter:string,
	callback:( filter:string ) => void,
	className:string,
	closeButton?:boolean
}

export default function FilterButton( data:IFilterButtonProps )
{

	return (
		<button className={ data.className + " rounded-pill d-flex flex-row" } onClick={ () => data.callback( data.filter ) } type="button">
			<div>{data.filter}</div>
			{ data.closeButton &&
				<button className="btn-close" aria-label="Close"/>
			}
		</button>
	)
}
