export const environment = {
  classic: {
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
    dura: {
      baseURL: 'https://aetas.playdura.com',
    },
    supabase: {
      url: 'https://lbtkqriedhzoblyncgwr.supabase.co',
      anonKey: 'sb_publishable_wC_HpPnqg8BjPvfBhwiwgQ_jsQ8wbIw',
    },
  },
};
