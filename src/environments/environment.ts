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
    // Set to `false` and redeploy to disable the seasonal server toggle.
    enabled: false,
    dura: {
      baseURL: 'https://aetas.playdura.com',
    },
    supabase: {
      url: 'https://lbtkqriedhzoblyncgwr.supabase.co',
      anonKey: 'sb_publishable_wC_HpPnqg8BjPvfBhwiwgQ_jsQ8wbIw',
    },
  },
};
