/**
 * Template for a simple component test
 *
 * Usage: Duplicate this file and rename it using your component name. Happy
 * coding from there!
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Normally imported from components directory
const MyFakeComponent = ({ text }: { text: string }) => <>{text}</>;

// Put any module mocks outside test blocks
// jest.mock("<my-module>", () => (<'mock implementation'>));

describe("<MyFakeComponent />", () => {
  const parameters = {
    text: "expected content",
  };

  it("renders", () => {
    render(<MyFakeComponent {...parameters} />, { wrapper: BrowserRouter });
    expect(screen.getByTestId("my-component-test-id")).toHaveTextContent(
      parameters.text
    );
  });

  it("renders with async effects", async () => {
    render(<MyFakeComponent {...parameters} />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(screen.getByTestId("my-component-test-id")).toHaveTextContent(
        parameters.text
      );
    });
  });
});
