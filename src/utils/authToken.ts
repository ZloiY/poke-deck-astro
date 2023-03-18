import { createEvent, createStore } from "effector";

const getAccessToken = () => 
localStorage.getItem('poke_deck_astro_token');

export const setAuthToken = createEvent<string>(); 
setAuthToken.watch((token) => {
  localStorage.setItem('poke_deck_astro_token', token);
});
const resetToken = createEvent();
export const $authToken = createStore<string | null>(getAccessToken() ?? null);
$authToken.on(setAuthToken, (_, token) => token);
$authToken.reset(resetToken);

export const getAuthToken = () => {
    console.log(localStorage.getItem('poke_deck_astro_token'));
  const access_token = getAccessToken();   
  return access_token ? `Bearer ${access_token}` : '';
};

export const removeAuthToken = () => {
  const access_token = getAccessToken();
  if (access_token) {
    localStorage.removeItem('poke_deck_astro_token');
    resetToken();
  }
};
