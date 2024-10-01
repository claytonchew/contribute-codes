import { describe, it, expect } from "vitest";
import { createResponse } from "./api";

describe("createResponse", () => {
  describe("success", () => {
    it("should return a response with data and metadata", () => {
      const data = { key: "value" };
      const metadata = { pagination: { page: 1, perPage: 10, total: 100 } };
      const result = createResponse.success(data, metadata);

      expect(result).toEqual({ data, ...metadata });
    });

    it("should return a response with data and no metadata", () => {
      const data = { key: "value" };
      const result = createResponse.success(data);

      expect(result).toEqual({ data });
    });

    it("should return a response with null data and no metadata", () => {
      const result = createResponse.success(null);

      expect(result).toEqual({ data: null });
    });
  });

  describe("raw", () => {
    it("should return the raw response as is", () => {
      const rawResponse = { data: { key: "value" }, extra: "info" };
      const result = createResponse.raw(rawResponse);

      expect(result).toBe(rawResponse);
    });
  });
});
