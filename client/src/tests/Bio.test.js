import BioEditior from "../Bio-Editor";
import { render } from "@testing-library/react";
// import axios from "../axios";

jest.mock("../axios");

// * 1. When no bio of the user is passed, "Add" button is rendered:
test("Rendering when no bio is inserted", () => {
    const { container } = render(<BioEditior />);
    expect(container.querySelector("button").innerHTML).toBe("Add Bio");
});

// * 2. When Bio is written, "Edit" button is rendered:
test("Rendering when bio is inserted", () => {
    const { container } = render(<BioEditior />);
    expect(container.querySelector("button").innerHTML).toBe("Edit Bio");
});
