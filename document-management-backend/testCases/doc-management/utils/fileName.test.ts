import { fileName } from "src/doc-management/utils/fileName";

describe("convertByte", () => {
  it("should convert bytes to KB, MB, GB", () => {
    expect(fileName(1024)).toBe("1.0 KB");
    expect(fileName(1024 * 1024)).toBe("1.0 MB");
    expect(fileName(1024 * 1024 * 1024)).toBe("1.0 GB");
  });

  it('should return "n/a" if bytes is 0', () => {
    expect(fileName(0)).toBe("n/a");
  });

  it('should return "Bytes" if bytes is less than 1024', () => {
    expect(fileName(1023)).toBe("1023 Bytes");
  });
});
