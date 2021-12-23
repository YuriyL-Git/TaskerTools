import { LocalsDeclaration } from "declarations";
import { ITaskerLocals } from "./custom-types/custom-types";

//@ts-ignore
const taskerLocals: ITaskerLocals = {};

//@ts-ignore
const declaredLocals: LocalsDeclaration = {};

export const locals: ITaskerLocals & LocalsDeclaration = {
  ...taskerLocals,
  ...declaredLocals,
};
