import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitestのglobalsを使っていないのでTesting Libraryの自動cleanupが効かない。
// 前のテストで描画した画面が残らないよう、テストごとに明示的に片付ける
afterEach(() => {
  cleanup();
});
