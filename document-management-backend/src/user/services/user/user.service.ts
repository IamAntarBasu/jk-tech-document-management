import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserValidation } from "../../validations/createUser.validation";
import { UserEntity } from "../../models/user.entity";
import { TokenManagementService } from "../tokenManagement/jwt.service";
import { PasswordService } from "../password/password.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: TokenManagementService,
  ) {}

  /**
   * Get all users in the database
   * @returns all users in the database
   */
  public getAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({
      select: ["id", "email", "lastName", "firstName"],
    });
  }

  /**
   * Check if the user exists by email
   * @param email existing user's email address
   * @returns the user entity if exists, otherwise null
   */
  async isUserExists(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  /**
   * check if the user's password matches the existing password
   * @param user existing user entity
   * @param requestPassword user's input password
   * @returns boolean whether the password matches or not
   */
  async checkUserPassword(
    user: UserEntity,
    requestPassword: string,
  ): Promise<boolean> {
    return this.passwordService.comparePassword(requestPassword, user.passwordHash);
  }

  /**
   * registering a new user
   * @param createUserType the payload to create a new user
   * @returns the created user entity
   */
  async createUser(createUserType: CreateUserValidation): Promise<UserEntity> {
    const userPayload = {
      email: createUserType.email.toLowerCase(),
      firstName: createUserType.firstName,
      lastName: createUserType.lastName,
      passwordHash: await this.passwordService.generatePassword(createUserType.password),
      roleId: createUserType.roleId,
    };

    const newUser = this.usersRepository.create(userPayload);
    this.usersRepository.save(newUser);

    return newUser;
  }

  /**
   * Get the jwt token for the provided user
   * @param user existing user entity
   * @returns the jwt token
   */
  public getUserToken(user: UserEntity): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email.toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }
}
