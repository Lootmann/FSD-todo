type AuthUserType = {
  username: string;
  password: string;
};

type AuthTokenType = {
  access_token: string | null;
  token_type: string | null;
};

type CurrentUserType = {
  username: string;
};
