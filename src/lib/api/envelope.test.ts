import { describe, expect, it } from "vitest";
import { ApiError, unwrapEnvelope, unwrapPage } from "./envelope";

describe("unwrapEnvelope", () => {
  it("returns data from a success envelope", () => {
    expect(
      unwrapEnvelope<{ id: string }>(
        { success: true, data: { id: "user-1" } },
        200,
      ),
    ).toEqual({ id: "user-1" });
  });

  it("surfaces the message for 403, 409, and 422", () => {
    for (const status of [403, 409, 422]) {
      expect(() =>
        unwrapEnvelope({ success: false, message: "Not allowed" }, status),
      ).toThrow(ApiError);
      try {
        unwrapEnvelope({ success: false, message: "Not allowed" }, status);
      } catch (error) {
        expect(error).toMatchObject({ status, message: "Not allowed" });
      }
    }
  });

  it("flattens nested Nest getResponse() message objects", () => {
    try {
      unwrapEnvelope(
        {
          success: false,
          message: { message: "Unauthorized", statusCode: 401 },
        },
        401,
      );
      throw new Error("expected throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe("Unauthorized");
    }
  });

  it("joins validation message arrays", () => {
    try {
      unwrapEnvelope(
        { success: false, message: ["title should not be empty", "category must be a valid enum"] },
        400,
      );
      throw new Error("expected throw");
    } catch (error) {
      expect((error as ApiError).message).toContain("title should not be empty");
      expect((error as ApiError).message).toContain("category must be a valid enum");
    }
  });

  it("reads a paginated list", () => {
    expect(
      unwrapPage<string>(
        {
          success: true,
          data: { items: ["a"], total: 1, page: 1, perPage: 10, lastPage: 1 },
        },
        200,
      ),
    ).toEqual({ items: ["a"], total: 1, page: 1, perPage: 10, lastPage: 1 });
  });
});
