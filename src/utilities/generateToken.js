import { generate } from "otp-generator";


export default function generateToken() {
  return generate(10, {
    upperCase: true,
    specialChars: false,
    alphabets: true,
  });
}