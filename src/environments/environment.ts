export const environment = {
  classic: {
    responsePlayerLimit: 100, // The number of players to use on requests for classic
    dura: {
      baseURL: 'https://classic.dura-online.com',
    },
    supabase: {
      url: 'https://pzkhnhkxiyyrizmglbpf.supabase.co',
      anonKey: 'sb_publishable_Ktny-Atzm0Ktm2_XrRsziw_5PONHOFd',
    },
  },
  seasonal: {
    enabled: true, // Redeploy to enable/disable seasonal environment toggle and data retrieval
    responsePlayerLimit: 5000, // The number of players to use on requests for seasonal
    dura: {
      baseURL: 'https://aetas.playdura.com',
    },
    supabase: {
      url: 'https://lbtkqriedhzoblyncgwr.supabase.co',
      anonKey: 'sb_publishable_wC_HpPnqg8BjPvfBhwiwgQ_jsQ8wbIw',
    },
  },
};
