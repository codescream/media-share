export const userInfo = localStorage.getItem('user') ? 
JSON.parse(localStorage.getItem('user')) :
localStorage.clear();

//suffles the post so display is different each time
export const shuffleArray = (array) =>  {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}