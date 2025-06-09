import { faker } from "@faker-js/faker";
import { vi } from "vitest";

faker.seed(123);
vi.mock("expo-crypto", () => ({
  randomUUID: faker.string.uuid,
}));
