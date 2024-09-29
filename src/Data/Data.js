import axios from 'axios';

let budgetData = null;

export const getBudgetData = async () => {
  if (budgetData) {
    return budgetData;
  }

  try {
    const response = await axios.get('http://localhost:3000/budget');
    budgetData = response.data;
    return budgetData;
  } catch (error) {
    console.error('Error fetching budget data:', error);
    throw error;
  }
};
