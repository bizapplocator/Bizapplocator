import * as bcrypt from "bcrypt";

class PasswordController {
  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  }
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
  }
}
export { PasswordController };
