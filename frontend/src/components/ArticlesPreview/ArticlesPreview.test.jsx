import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ArticlesPreview from "./ArticlesPreview";

// Mock the useAuth hook used by FavButton
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    isAuth: false,
    headers: {},
  }),
}));

// Mock the toggleFav service
vi.mock("../../services/toggleFav", () => ({
  default: vi.fn(),
}));

describe("ArticlesPreview", () => {
  const mockArticles = [
    {
      slug: "test-article-1",
      title: "Test Article One",
      description: "This is the first test article",
      author: {
        username: "testuser",
        image: "https://example.com/avatar.jpg",
        bio: "Test bio",
        followersCount: 0,
        following: false,
      },
      createdAt: "2024-01-01T00:00:00.000Z",
      tagList: ["react", "testing"],
      favorited: false,
      favoritesCount: 5,
    },
    {
      slug: "test-article-2",
      title: "Test Article Two",
      description: "This is the second test article",
      author: {
        username: "anotheruser",
        image: "https://example.com/avatar2.jpg",
        bio: "Another bio",
        followersCount: 10,
        following: true,
      },
      createdAt: "2024-01-02T00:00:00.000Z",
      tagList: ["javascript"],
      favorited: true,
      favoritesCount: 12,
    },
  ];

  const defaultProps = {
    articles: mockArticles,
    loading: false,
    updateArticles: vi.fn(),
  };

  function renderComponent(props = {}) {
    return render(
      <MemoryRouter>
        <ArticlesPreview {...defaultProps} {...props} />
      </MemoryRouter>,
    );
  }

  it("should render article titles", () => {
    renderComponent();
    expect(screen.getByText("Test Article One")).toBeInTheDocument();
    expect(screen.getByText("Test Article Two")).toBeInTheDocument();
  });

  it("should render article descriptions", () => {
    renderComponent();
    expect(
      screen.getByText("This is the first test article"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This is the second test article"),
    ).toBeInTheDocument();
  });

  it("should render read count for each article", () => {
    renderComponent();
    // Each article should have a read-count div
    const readCounts = document.querySelectorAll(".read-count");
    expect(readCounts.length).toBe(2);
  });

  it("should render the eye icon for each article", () => {
    renderComponent();
    const icons = document.querySelectorAll(".read-count-icon");
    expect(icons.length).toBe(2);
  });

  it("should render read count with locale-formatted number", () => {
    renderComponent();
    const readCounts = document.querySelectorAll(".read-count span");
    expect(readCounts.length).toBe(2);
    // Each span should contain a number (locale formatted)
    readCounts.forEach((span) => {
      expect(span.textContent).toMatch(/^[\d,]+$/);
    });
  });

  it('should show "Loading article..." when loading', () => {
    render(
      <MemoryRouter>
        <ArticlesPreview
          articles={[]}
          loading={true}
          updateArticles={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Loading article...")).toBeInTheDocument();
  });

  it('should show "No articles available." when empty', () => {
    render(
      <MemoryRouter>
        <ArticlesPreview
          articles={[]}
          loading={false}
          updateArticles={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("No articles available.")).toBeInTheDocument();
  });

  it("should not render read count when no articles", () => {
    render(
      <MemoryRouter>
        <ArticlesPreview
          articles={[]}
          loading={false}
          updateArticles={vi.fn()}
        />
      </MemoryRouter>,
    );
    const readCounts = document.querySelectorAll(".read-count");
    expect(readCounts.length).toBe(0);
  });

  it("should render tags for each article", () => {
    renderComponent();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("testing")).toBeInTheDocument();
    expect(screen.getByText("javascript")).toBeInTheDocument();
  });

  it("should link to article detail pages", () => {
    renderComponent();
    const links = screen.getAllByRole("link", { name: /Test Article/ });
    expect(links[0]).toHaveAttribute("href", "/article/test-article-1");
    expect(links[1]).toHaveAttribute("href", "/article/test-article-2");
  });
});
