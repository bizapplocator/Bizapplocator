import jwt from "jsonwebtoken";
import type { SignOptions, Algorithm } from "jsonwebtoken";
import "dotenv/config";

interface SignatureParams {
  id: string;
  role: string;
  expires_in: string | number;
  secret: string;
}

class JwtUtil {
  async sign(sign_params: SignatureParams) {
    return jwt.sign(
      { id: sign_params.id, role: sign_params.role },
      sign_params.secret!,
      { expiresIn: sign_params.expires_in } as SignOptions,
    );
  }
  decode(token: string) {
    try {
      let secret_key = process.env.JWT_SECRET!;
      const algorithms: Algorithm[] = ["HS256"];
      let verified_token = jwt.verify(token, secret_key, { algorithms });

      return verified_token;
    } catch (err) {
      throw err;
    }
  }
}

export default JwtUtil;
