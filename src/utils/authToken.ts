import { createEvent, createStore } from "effector";

const getAccessToken = () => typeof window !== 'undefined' 
  ? localStorage.getItem('poke_deck_astro_token')
  : undefined;

export const setAuthToken = createEvent<string>(); 
setAuthToken.watch((token) => {
  localStorage.setItem('poke_deck_astro_token', token);
});
const resetToken = createEvent();
export const $authToken = createStore<string | null>(getAccessToken() ?? null);
$authToken.on(setAuthToken, (_, token) => token);
$authToken.on(resetToken, () => null);

export const getAuthToken = () => {
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
