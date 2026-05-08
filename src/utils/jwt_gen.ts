import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

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
      { expiresIn: sign_params.expires_in } as SignOptions
    );
  }
}

export default JwtUtil;
