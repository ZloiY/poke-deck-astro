const getAccessToken = () => 
  localStorage.getItem('poke_deck_astro_token');

export const getAuthToken = () => {
    console.log(localStorage.getItem('poke_deck_astro_token'));
  const access_token = getAccessToken();   
  return access_token ? `Bearer ${access_token}` : '';
};

export const removeAuthToken = () => {
  const access_token = getAccessToken();
  if (access_token) {
    localStorage.removeItem('poke_deck_astro_token'); 
  }
};
