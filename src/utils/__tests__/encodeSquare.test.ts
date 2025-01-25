import { encodeSquare, decodeSquare } from "../encodeSquare";

test("encodeSquare", () => {
  expect(encodeSquare([0, 0])).toBe("a8");
  expect(encodeSquare([0, 7])).toBe("h8");
  expect(encodeSquare([7, 0])).toBe("a1");
  expect(encodeSquare([7, 7])).toBe("h1");
});

test("decodeSquare", () => {
  expect(decodeSquare("a8")).toStrictEqual([0, 0]);
  expect(decodeSquare("h8")).toStrictEqual([0, 7]);
  expect(decodeSquare("a1")).toStrictEqual([7, 0]);
  expect(decodeSquare("h1")).toStrictEqual([7, 7]);
});
