import relativeTime from './relativeTime';

describe('relativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for same time", () => {
    expect(relativeTime('2024-06-15T11:59:30Z')).toBe('Last edited just now');
  });

  it("returns minutes ago when less than 1 hour", () => {
    expect(relativeTime('2024-06-15T11:55:00Z')).toBe('Last edited 5 minutes ago');
    expect(relativeTime('2024-06-15T11:59:00Z')).toBe('Last edited 1 minute ago');
  });

  it("returns hours ago when less than 1 day", () => {
    expect(relativeTime('2024-06-15T09:00:00Z')).toBe('Last edited 3 hours ago');
    expect(relativeTime('2024-06-15T11:00:00Z')).toBe('Last edited 1 hour ago');
  });

  it("returns days ago when less than 1 month", () => {
    expect(relativeTime('2024-06-13T12:00:00Z')).toBe('Last edited 2 days ago');
    expect(relativeTime('2024-06-14T12:00:00Z')).toBe('Last edited 1 day ago');
  });

  it("returns months ago when more than 30 days", () => {
    expect(relativeTime('2024-05-01T12:00:00Z')).toBe('Last edited 1 month ago');
    expect(relativeTime('2024-02-15T12:00:00Z')).toBe('Last edited 4 months ago');
  });
});
