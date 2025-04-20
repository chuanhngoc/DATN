export const isAuthentication = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return JSON.parse(token ? token : "");
    }
  };
  
  export const token_auth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return JSON.parse(token ? token : "")?.access_token;
    }
  };
  