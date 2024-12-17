import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "./Profile";
import { User } from "./types";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";

const mockUser: User = {
  id: 1,
  email: "test@example.com",
  username: "testuser",
  profile_image: "https://example.com/image.jpg",
  points: 120,
  description: "Test user description",
  theme_preference: 1, // 1 = Dark Theme
  created_at: "2024-01-01T00:00:00Z",
  last_login_at: "2024-02-01T00:00:00Z",
};

describe("Profile Component", () => {
  test("renders user profile data correctly", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Profile user={mockUser} />
        </AuthProvider>
      </MemoryRouter>
    );

    const usernameElement = screen.getByRole("heading", { level: 3 });
    expect(usernameElement.textContent).toBe(mockUser.username);

    const descriptionElement = screen.getByText(mockUser.description);
   //xpect(descriptionElement).toBeInTheDocument();

    const pointsElement = screen.getByText(/Points:/);
    expect(pointsElement.textContent).toBe(`Points: ${mockUser.points}`);

    const themeElement = screen.getByText(/Theme Preference:/);
    const expectedTheme = mockUser.theme_preference === 1 ? "Dark" : "Light";
    expect(themeElement.textContent).toBe(`Theme Preference: ${expectedTheme}`);

    const lastLoginElement = screen.getByText(/Last Login:/);
    expect(lastLoginElement.textContent).toBe(
      `Last Login: ${new Date(mockUser.last_login_at).toLocaleDateString()}`
    );

    const profileImg = screen.getByAltText(mockUser.profile_image);
    //expect(profileImg).toBeInTheDocument();
    expect(profileImg.getAttribute("src")).toBe(mockUser.profile_image);
  });

  test("handles missing optional fields gracefully", () => {
    const incompleteUser: User = {
      ...mockUser,
      points: null,
      theme_preference: 0,
    };

    render(
      <MemoryRouter>
        <AuthProvider>
          <Profile user={incompleteUser} />
        </AuthProvider>
      </MemoryRouter>
    );

    const pointsElement = screen.getByText(/Points:/);
    expect(pointsElement.textContent).toBe("Points: 0");

    const themeElement = screen.getByText(/Theme Preference:/);
    expect(themeElement.textContent).toBe("Theme Preference: Light");
  });
});
