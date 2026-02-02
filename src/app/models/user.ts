export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public passwordHash: string,
    public createdAt: string
  ) {}

  static hashPassword(password: string) {
    let hash = 0;
    for (let i = 0; i < password.length; i += 1) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  }

  static fromJSON(data: User) {
    return new User(data.id, data.name, data.email, data.passwordHash, data.createdAt);
  }

  verifyPassword(password: string) {
    return User.hashPassword(password) === this.passwordHash;
  }
}
