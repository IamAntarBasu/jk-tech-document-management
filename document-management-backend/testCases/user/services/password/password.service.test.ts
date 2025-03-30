import { Test, TestingModule } from "@nestjs/testing";
import { hash, compare } from "bcryptjs";
import { PasswordService } from "src/user/services/password/password.service";

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("PasswordService", () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should generate passwords", async () => {
    const hashMock = jest.mocked(hash);
    hashMock.mockResolvedValue("mock-password" as never);
    expect(await service.generatePassword("password")).toBe("mock-password");
  });

  it("should compare password hash", async () => {
    const compareMock = jest.mocked(compare);
    compareMock.mockResolvedValue(true as never);
    expect(await service.comparePassword("password", "hash")).toBe(true);
  });
});
