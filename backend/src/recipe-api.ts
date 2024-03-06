const apiKey = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page: number) => {
  if (!apiKey) {
    throw new Error('API key not found'); // if not key nothing will work
  }

  const url = new URL('https://api.spoonacular.com/recipes/complexSearch');

  const queryParams = {
    apiKey, // same name so we gonna use shorthand
    query: searchTerm, //getting query from searchterm
    number: '10', //The number of expected results
    offset: (page * 10).toString(), //The number of results to skip
  };
  url.search = new URLSearchParams(queryParams).toString();

  try {
    const searchResponse = await fetch(url);
    const resultsJson = await searchResponse.json();
  } catch (error) {
    console.log(error);
  }
};