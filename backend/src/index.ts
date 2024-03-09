import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import * as RecipeAPI from './recipe-api';
import { constants } from 'buffer';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/api/recipes/search', async (req, res) => {
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string);
  const results = await RecipeAPI.searchRecipes(searchTerm, page); // assigned to results

  return res.json(results); //returned all info in json
});

app.get('/api/recipes/:recipeId/summary', async (req, res) => {
  const recipeId = req.params.recipeId;
  const results = await RecipeAPI.getRecipeSummary(recipeId);
  return res.json(results);
});

app.listen(5000, () => {
  console.log('Server running on localhost 5000');
});
