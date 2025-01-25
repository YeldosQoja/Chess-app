import { generatePieceListFromFEN } from "../generatePieceListFromFEN";

test("generatePieceListFromFEN", () => {
  const fen1 = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  expect(generatePieceListFromFEN(fen1)).toStrictEqual([
    // white pieces
    { id: 1, type: "r", color: "black", square: [0, 0] },
    { id: 2, type: "n", color: "black", square: [0, 1] },
    { id: 3, type: "b", color: "black", square: [0, 2] },
    { id: 4, type: "q", color: "black", square: [0, 3] },
    { id: 5, type: "k", color: "black", square: [0, 4] },
    { id: 6, type: "b", color: "black", square: [0, 5] },
    { id: 7, type: "n", color: "black", square: [0, 6] },
    { id: 8, type: "r", color: "black", square: [0, 7] },
    { id: 9, type: "p", color: "black", square: [1, 0] },
    { id: 10, type: "p", color: "black", square: [1, 1] },
    { id: 11, type: "p", color: "black", square: [1, 2] },
    { id: 12, type: "p", color: "black", square: [1, 3] },
    { id: 13, type: "p", color: "black", square: [1, 4] },
    { id: 14, type: "p", color: "black", square: [1, 5] },
    { id: 15, type: "p", color: "black", square: [1, 6] },
    { id: 16, type: "p", color: "black", square: [1, 7] },
    // black pieces
    { id: 17, type: "p", color: "white", square: [6, 0] },
    { id: 18, type: "p", color: "white", square: [6, 1] },
    { id: 19, type: "p", color: "white", square: [6, 2] },
    { id: 20, type: "p", color: "white", square: [6, 3] },
    { id: 21, type: "p", color: "white", square: [6, 4] },
    { id: 22, type: "p", color: "white", square: [6, 5] },
    { id: 23, type: "p", color: "white", square: [6, 6] },
    { id: 24, type: "p", color: "white", square: [6, 7] },
    { id: 25, type: "r", color: "white", square: [7, 0] },
    { id: 26, type: "n", color: "white", square: [7, 1] },
    { id: 27, type: "b", color: "white", square: [7, 2] },
    { id: 28, type: "q", color: "white", square: [7, 3] },
    { id: 29, type: "k", color: "white", square: [7, 4] },
    { id: 30, type: "b", color: "white", square: [7, 5] },
    { id: 31, type: "n", color: "white", square: [7, 6] },
    { id: 32, type: "r", color: "white", square: [7, 7] },
  ]);
});
