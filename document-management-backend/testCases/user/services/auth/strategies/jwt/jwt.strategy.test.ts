import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { createMock } from "@golevelup/ts-jest";
import { JwtStrategy } from "src/user/services/auth/strategies/jwt/jwt.strategy";

describe("JWT Strategy", () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: { get: () => "secret" } },
      ],
    })
      .useMocker(createMock)
      .compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should return payload on validate", async () => {
    const payload = {
      email: "email",
      firstName: "fName",
      lastName: "Lname",
      id: "1",
    };

    expect(await strategy.validate(payload)).toBe(payload);
  });

  it("should throw ForbiddenException on invalid user", async () => {
    const payload = {
      email: "email",
      firstName: "fName",
      lastName: "Lname",
      id: "1",
    };

    jest.spyOn(strategy["user"], "isUserExists").mockResolvedValueOnce(null);

    await expect(strategy.validate(payload)).rejects.toThrowError(
      "Invalid User Details.",
    );
  });
});
