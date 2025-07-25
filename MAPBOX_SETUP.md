# Mapbox Setup Instructions

To display the campus buildings map, you need to get a Mapbox access token:

## Steps to get your Mapbox token:

1. Go to [https://account.mapbox.com/access-tokens/](https://account.mapbox.com/access-tokens/)
2. Sign up for a free account if you don't have one
3. Create a new access token or use the default public token
4. Copy the token (it starts with `pk.`)

## How to add the token to your project:

1. Open `src/MAP.jsx`
2. Find this line:
   ```javascript
   const MAPBOX_TOKEN = 'pk.your_mapbox_token_here';
   ```
3. Replace `'pk.your_mapbox_token_here'` with your actual token

## Free tier limits:
- 50,000 map loads per month
- Perfect for development and small projects

## Alternative: Environment variable (recommended for production)
You can also store the token in an environment variable:
1. Create a `.env` file in your project root
2. Add: `VITE_MAPBOX_TOKEN=your_actual_token_here`
3. In MAP.jsx, use: `const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;`
