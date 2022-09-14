import MainPanel from "..";

export default function (this: MainPanel, e: InputEvent) {
    console.log("input", e);

    if (e.inputType === "insertText") {
        
    }
    else if (e.inputType === "deleteContentBackward") {
    }
}