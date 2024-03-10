import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import * as api from './api';
import { Recipe } from './types';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import { AiOutlineSearch } from 'react-icons/ai';

type Tabs = 'search' | 'favourites';

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState<Tabs>('search');

  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);
  const [hasSearchResults, setHasSearchResults] = useState<boolean>(false);

  const pageNumber = useRef(1);

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavouriteRecipes();
  }, []);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
      setHasSearchResults(recipes.results.length > 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes([...recipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (error) {
      console.log(error);
    }
  };

  const addFevouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFevouriteRecipe(recipe);
      setFavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavouriteRecipe(recipe);
      const updatedRecipes = favouriteRecipes.filter(
        (favRecipe) => recipe.id !== favRecipe.id
      );
      setFavouriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="/hero-image.jpg" alt="header image" />
        <div className="title">My Recipes</div>
      </div>
      <div className="tabs">
        <h1
          className={selectedTab === 'search' ? 'tab-active' : ''}
          onClick={() => setSelectedTab('search')}
        >
          Recipe Search
        </h1>
        <h1
          className={selectedTab === 'favourites' ? 'tab-active' : ''}
          onClick={() => setSelectedTab('favourites')}
        >
          Favourites
        </h1>
      </div>
      {selectedTab === 'search' && (
        <>
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input
              type="text"
              required
              placeholder="Enter a search ..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button>
              <AiOutlineSearch size={40} />
            </button>
          </form>

          <div className="recipe-grid">
            {recipes.map((recipe) => {
              const isFavourite = favouriteRecipes.some(
                (favRecipe) => recipe.id === favRecipe.id
              );

              return (
                <RecipeCard
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavouriteButtonClick={
                    !isFavourite ? addFevouriteRecipe : removeFavouriteRecipe
                  }
                  isFavourite={isFavourite}
                  key={recipe.id}
                />
              );
            })}
          </div>

          {hasSearchResults && (
            <button className="view-more-button" onClick={handleViewMoreClick}>
              View More
            </button>
          )}
        </>
      )}

      {selectedTab === 'favourites' && (
        <div className="recipe-grid">
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={removeFavouriteRecipe}
              isFavourite={true}
              key={recipe.id}
            />
          ))}
        </div>
      )}
      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
};

export default App;
