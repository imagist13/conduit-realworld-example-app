import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ArticleMeta from "./ArticleMeta";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

const mockAuthor = {
  username: "testuser",
  image: "https://example.com/avatar.jpg",
  bio: "Test bio",
  followersCount: 5,
  following: false,
};

function renderComponent(props = {}) {
  const defaultProps = {
    author: mockAuthor,
    createdAt: "2024-06-15T11:00:00Z",
  };
  return render(
    <MemoryRouter>
      <ArticleMeta {...defaultProps} {...props} />
    </MemoryRouter>,
  );
}

describe("ArticleMeta", () => {
  it("should render author username", () => {
    renderComponent();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("should render creation date", () => {
    renderComponent();
    expect(screen.getByText("June 15, 2024")).toBeInTheDocument();
  });

  it("should show edited date when updatedAt differs from createdAt", () => {
    renderComponent({ updatedAt: "2024-06-15T11:30:00Z" });
    expect(screen.getByText("Last edited 30 minutes ago")).toBeInTheDocument();
  });

  it("should not show edited date when updatedAt equals createdAt", () => {
    renderComponent({ updatedAt: "2024-06-15T11:00:00Z" });
    expect(screen.queryByText(/Last edited/)).not.toBeInTheDocument();
  });

  it("should not show edited date when updatedAt is not provided", () => {
    renderComponent();
    expect(screen.queryByText(/Last edited/)).not.toBeInTheDocument();
  });

  it("should render children", () => {
    renderComponent({ children: <button>Click me</button> });
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should render avatar image", () => {
    renderComponent();
    const avatar = screen.getByAltText("testuser");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });
});