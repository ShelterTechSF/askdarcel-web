import React from "react";
import { render, screen } from "@testing-library/react";
import LabelTagRows from "components/listing/LabelTagRows";

describe("<LabelTagRows />", () => {
  it("should show top level category labels if they exist", () => {
    const fake_category = {
      id: 4558736345530368,
      name: "Rene Lebsack",
      top_level: true,
      featured: true,
    };

    render(
      <table>
        <tbody>
          <LabelTagRows categories={[fake_category]} eligibilities={[]} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId("top-level-categories")).toHaveTextContent(
      fake_category.name
    );
  });

  it("should not show top level category labels if they are empty", () => {
    const fake_category = {
      id: 4558736345530368,
      name: "Rene Lebsack",
      top_level: false,
      featured: true,
    };

    render(
      <table>
        <tbody>
          <LabelTagRows categories={[fake_category]} eligibilities={[]} />
        </tbody>
      </table>
    );

    expect(
      screen.queryByTestId("top-level-categories")
    ).not.toBeInTheDocument();
  });

  it("should show subcategory labels if they exist", () => {
    const fake_category = {
      id: 4558736345530368,
      name: "Rene Lebsack",
      top_level: false,
      featured: true,
    };

    render(
      <table>
        <tbody>
          <LabelTagRows categories={[fake_category]} eligibilities={[]} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId("subcategories")).toHaveTextContent(
      fake_category.name
    );
    expect(
      screen.queryByTestId("top-level-categories")
    ).not.toBeInTheDocument();
  });

  it("should not show subcategory labels if they are empty", () => {
    const fake_category = {
      id: 4558736345530368,
      name: "Rene Lebsack",
      top_level: true,
      featured: true,
    };

    render(
      <table>
        <tbody>
          <LabelTagRows categories={[fake_category]} eligibilities={[]} />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId("subcategories")).not.toBeInTheDocument();
  });

  it("should show eligibility labels if they exist", () => {
    const fake_eligibility = {
      id: 3185842451382272,
      name: "Mr. Frank Larson DVM",
      feature_rank: null,
    };

    render(
      <table>
        <tbody>
          <LabelTagRows categories={[]} eligibilities={[fake_eligibility]} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId("eligibilities")).toHaveTextContent(
      fake_eligibility.name
    );
  });

  it("should not show eligibility labels if they are empty", () => {
    render(
      <table>
        <tbody>
          <LabelTagRows categories={[]} eligibilities={[]} />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId("eligibilities")).not.toBeInTheDocument();
  });

  it("should not show eligibility or category labels if they are not passed", () => {
    render(
      <table>
        <tbody>
          <LabelTagRows />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId("eligibilities")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("top-level-categories")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("subcategories")).not.toBeInTheDocument();
  });
});
