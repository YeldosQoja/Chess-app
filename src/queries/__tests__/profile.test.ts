import { renderHook, waitFor } from "@/test/test-utils";
import { getProfile, useProfile } from "../profile";

describe("test profile api endpoints and queries", () => {
  test("should fetch a user profile data", async () => {
    expect.assertions(1);
    return getProfile().then((data) => expect(data.first_name).toBe("John"));
  });

  test("render the useProfile hook", async () => {
    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: 1,
        firstName: "John",
        lastName: "Doe",
      });
    });
  });
});
