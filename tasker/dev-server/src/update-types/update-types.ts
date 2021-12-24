import fs from "fs";
import path from "path";

export function updateTypes(globals: string[], locals: string[]): void {
  const typesPath: string = path.resolve(
    __dirname,
    "../../../types/custom-types/custom-types.d.ts",
  );

  const imports: string = 'import { GlobalsDeclaration } from "declarations"; \n';

  const customGlobals: string =
    "export type CustomGlobals = \n" +
    globals.map((global) => `  | "${global}"`).join("\n") +
    "\n  | GlobalsDeclaration; \n";

  const customLocals: string =
    "export interface ITaskerLocals {\n" +
    locals
      .map((local) => {
        if (local.includes("()")) {
          return `  ${local.replace("()", "")}: string[];`;
        } else {
          return `  ${local}: string;`;
        }
      })
      .join("\n") +
    "\n}";

  const updatedTypes: string = [imports, customGlobals, customLocals].join("\n");
  fs.writeFileSync(typesPath, updatedTypes);
}
