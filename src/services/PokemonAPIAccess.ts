const pokeapiUrl = "https://pokeapi.co/api/v2/";

export async function fetchAPIAsync<T>( endpoint:string )
{
	
	var response = await fetch( endpoint )
	if( !response.ok )
		throw new Error( "Error when fetching \"" + response.url + "\": " + response.statusText )
		
	return await response.json() as T
}

/*export function fetchAPI<T>( endpoint:string ) : Promise<T>
{
	
	return fetch( endpoint )
	.then( ( response ) => {

		if( !response.ok )
			throw new Error( "Error when fetching \"" + response.url + "\": " + response.statusText )

		return response.json() as Promise<T>
	} )
}*/

interface IPokemonList
{
	"count": number,
	"next": string,
	"previous": number,
	"results": [
		{
			name: string,	
			url: string
		}
	]
}

interface IPokemonResults
{

	"id": number,
	"name": string,
	"height": number,
	"order": number,
	"weight": number,
	"sprites": {
		"other": {
			"dream_world": {
				"front_default": string,
				"front_female": string
			},
			"home": {
				"front_default": string,
				"front_female": string,
				"front_shiny": string,
				"front_shiny_female": string
			},
			"official-artwork": {
				"front_default": string
			}
		}
	},
	"types": [
		{
			"slot": number,
			"type": IPokemonType
		}
	],
}

export interface IPokemon
{

	"id": number,
	"name": string,
	"height": number,
	"order": number,
	"weight": number,
	"sprites": {
		"official-artwork": string,
		"dream_world": string
	},
	"types": string[]
}

//Pokemon Type types
export interface IPokemonType
{
	
	"name": string,
	"url": string
}

interface IPokemonTypeList
{
	
	"count": number,
	"results": IPokemonType[]
}

export function getListAsync( maxItems:number, setter: ( ( pokemon:IPokemon[] ) => void ) ) : Promise<IPokemon[]>
{

	const task = new Promise<IPokemon[]>( async ( resolve, reject ) => {

		try {
			
			var data = await fetchAPIAsync<IPokemonList>( pokeapiUrl + "pokemon?limit=" + maxItems )
		} catch ( error )
		{
			
			reject( error )
			return
		}

		var pokemons:IPokemon[] = new Array<IPokemon>( data.results.length )
	
		for( let i = 0; i < data.results.length; i++ )
		{

			try {
			
				var result = await fetchAPIAsync<IPokemonResults>( data.results[i].url )

				//transfer matching keys
				var pokemon:IPokemon = {} as IPokemon
				Object.assign( pokemon, result )

				//transfer image URLs
				pokemon.sprites.dream_world = result.sprites.other.dream_world.front_default
				pokemon.sprites["official-artwork"] = result.sprites.other["official-artwork"].front_default

				//combine type names into string array
				pokemon.types = result.types.map<string>( ( value ) => {
					return value.type.name
				} )

				pokemons[i] = pokemon
				setter( pokemons )
			} catch ( error )
			{
				
				reject( error )
				return
			}
		}

		resolve( pokemons )
	} )
	
	return task
}

export function getTypeListAsync() : Promise<IPokemonType[]>
{

	const task = new Promise<IPokemonType[]>( async ( resolve, reject ) => {

		try {
			
			var data = await fetchAPIAsync<IPokemonTypeList>( pokeapiUrl + "type" )
		} catch ( error )
		{
			
			reject( error )
			return
		}

		var types:IPokemonType[] = new Array( data.results.length )
	
		for( let i = 0; i < data.results.length; i++ )
		{

			types[i] = data.results[i]
		}

		resolve( types )
	} )
	
	return task
}

/*export function getList( maxItems:number, setter: ( ( pokemon:IPokemon, index:number ) => void ) )
{

	getResponse<IPokemonList>( pokeapiUrl + "pokemon?limit=" + maxItems )
	.then( ( data ) => {

		for( let i = 0; i < data.results.length; i++ )
		{
	
			getResponse<IPokemon>( data.results[i].url )
			.then( ( result ) => {

				setter( result, i )
			} )
		}
	} )
}*/


/*export function getImage( endpoint:string )
{

	fetch( endpoint )
  	.then( (response) => {

		if( !response.ok )
			throw new Error('Network response was not OK');
    return response.blob();
	} )
	.then( ( myBlob ) => {

    	myImage.src = URL.createObjectURL( myBlob );
	} )
	.catch((error) => {
    	console.error('There has been a problem with your fetch operation:', error);
	});
}*/