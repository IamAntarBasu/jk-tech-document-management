import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserValidation } from "../../validations/createUser.validation";
import { UserLoginValidation } from "../../validations/login.validation";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * Register a new user
   * @param userType payload to create a new user
   * @returns user object with token
   */
  async register(userType: CreateUserValidation) {
    // check if user exists and send custom error message
    if (await this.userService.isUserExists(userType.email)) {
      this.failLogin("A user with this email is already registered.");
    }

    const newUser = await this.userService.createUser(userType);
    const token = this.userService.getUserToken(newUser);

    return { ...newUser, token };
  }

  /**
   * Login a user
   * @param loginRequest payload with credentials
   * @returns token if login is successful
   */
  async login(loginRequest: UserLoginValidation): Promise<string | void> {
    const { email, password } = loginRequest;
    const user = await this.userService.isUserExists(email);

    if (!user) {
      return this.failLogin("No account found with this email.");
    }

    if (await this.userService.checkUserPassword(user, password)) {
      return this.userService.getUserToken(user);
    }
    this.failLogin("The password you entered is incorrect.");
  }

  /**
   * A helper function to throw a custom error message
   * @param message custom error message
   */
  private failLogin(message = "Authentication failed. Please check your credentials.") {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }
}
