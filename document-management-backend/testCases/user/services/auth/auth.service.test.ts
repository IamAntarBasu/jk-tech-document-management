import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthService } from "src/user/services/auth/auth.service";
import { UserEntity } from "src/user/models/user.entity";
import { mockUserEntity } from "src/user/models/__examples__/user-entity.fixture";
import { PasswordService } from "src/user/services/password/password.service";
import { TokenManagementService } from "src/user/services/tokenManagement/jwt.service";
import { UserService } from "src/user/services/user/user.service";

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        PasswordService,
        ConfigService,
        TokenManagementService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("register", () => {
    it("should check for user existence", async () => {
      expect.assertions(3);

      const existSpy = jest
        .spyOn(userService, "isUserExists")
        .mockResolvedValue(mockUserEntity);
      const createSpy = jest.spyOn(userService, "createUser");

      try {
        await authService.register({
          roleId: 1,
          email: "email",
          password: "password",
          lastName: "lName",
          firstName: "fName",
        });
      } catch (e) {
        expect(e.message).toBe("A user with this email is already registered.");
      }
      expect(existSpy).toHaveBeenCalledWith("email");
      expect(createSpy).toHaveBeenCalledTimes(0);
    });

    it("should create user", async () => {
      const dto = {
        roleId: 1,
        email: "email",
        password: "password",
        lastName: "lName",
        firstName: "fName",
      };

      const existSpy = jest
        .spyOn(userService, "isUserExists")
        .mockResolvedValue(null);
      const createSpy = jest
        .spyOn(userService, "createUser")
        .mockResolvedValue({ ...mockUserEntity, ...dto });
      const userTokenSpy = jest
        .spyOn(userService, "getUserToken")
        .mockReturnValue("mock-token");

      const newUser = await authService.register(dto);

      expect(newUser).toHaveProperty(["id"]);
      expect(existSpy).toHaveBeenCalledWith("email");
      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(userTokenSpy).toHaveBeenCalledWith(expect.objectContaining(dto));
    });
  });

  describe("login", () => {
    it("should check for user existence", async () => {
      expect.assertions(2);

      const existSpy = jest
        .spyOn(userService, "isUserExists")
        .mockResolvedValue(null);

      try {
        await authService.login({
          email: "email",
          password: "password",
        });
      } catch (e) {
        expect(e.message).toBe("No account found with this email.");
      }
      expect(existSpy).toHaveBeenCalledWith("email");
    });

    it("should check for password correct", async () => {
      expect.assertions(3);

      const existSpy = jest
        .spyOn(userService, "isUserExists")
        .mockResolvedValue(mockUserEntity);
      const checkPassSpy = jest
        .spyOn(userService, "checkUserPassword")
        .mockResolvedValue(false);

      try {
        await authService.login({
          email: "email",
          password: "password",
        });
      } catch (e) {
        expect(e.message).toBe("The password you entered is incorrect.");
      }
      expect(existSpy).toHaveBeenCalledWith("email");
      expect(checkPassSpy).toHaveBeenCalledWith(mockUserEntity, "password");
    });

    it("should return session token", async () => {
      const existSpy = jest
        .spyOn(userService, "isUserExists")
        .mockResolvedValue(mockUserEntity);
      const checkPassSpy = jest
        .spyOn(userService, "checkUserPassword")
        .mockResolvedValue(true);
      const userTokenSpy = jest
        .spyOn(userService, "getUserToken")
        .mockReturnValue("mock-token");

      const token = await authService.login({
        email: "email",
        password: "password",
      });

      expect(token).toBe("mock-token");
      expect(existSpy).toHaveBeenCalledWith("email");
      expect(checkPassSpy).toHaveBeenCalledWith(mockUserEntity, "password");
      expect(userTokenSpy).toHaveBeenCalledWith(mockUserEntity);
    });
  });
});
