/**
 * Get the correct URL based on the environment
 * This is useful for redirects in authentication flows
 */
export const getURL = () => {
  let url =
    process?.env?.BASE_URL ?? // Set this to your site URL in production env.
    'https://www.jamal.ly';
  
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`;
  
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;
  
  return url;
}; 