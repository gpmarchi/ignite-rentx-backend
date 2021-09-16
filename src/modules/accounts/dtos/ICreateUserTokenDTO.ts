interface ICreateUserTokenDTO {
  user_id: string;
  refresh_token: string;
  expires_at: Date;
}

export { ICreateUserTokenDTO };
