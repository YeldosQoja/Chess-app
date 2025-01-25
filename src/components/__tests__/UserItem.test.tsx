import React from "react";
import { render, screen, waitFor } from "@/test/test-utils";
import { UserItem } from "../UserItem";

describe("<UserItem/> ", () => {
  test("render UserItem with friend user props", async () => {
    render(
      <UserItem
        user={{
          firstName: "Yeldos",
          lastName: "Kozha",
          id: 2,
          username: "yeldos.kozha",
          avatar: null,
          isFriend: true,
          isRequested: false,
        }}
      />,
    );

    await waitFor(() => {
      const text = screen.getByTestId("fullName");
      const challegeButton = screen.getByText("Challenge");
      const linkButton = screen.getByRole("link");
      expect(text).toHaveTextContent("Yeldos Kozha");
      expect(challegeButton).toBeOnTheScreen();
      expect(linkButton).toBeOnTheScreen();
    });
  });

  test("render UserItem with an authenticated user as user props", async () => {
    render(
      <UserItem
        user={{
          firstName: "John",
          lastName: "Doe",
          id: 1,
          username: "johndoe",
          avatar: null,
          isFriend: false,
          isRequested: false,
        }}
      />,
    );

    await waitFor(() => {
      const text = screen.getByTestId("fullName");
      expect(text).toHaveTextContent("John Doe");
    });
  });
});
