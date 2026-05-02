interface Problem {
    problem: string;
    color: string;
}
interface TireStatus {
    name: string;
    color: string;
}
interface TireDepth {
    name: string;
    color: string;
}
export const removeItemFromArray = (
    index: number,
    setState: React.Dispatch<React.SetStateAction<string[]>>
): void => {
    setState((prevState) => {
        const updatedProblems = [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1),
        ];
        return updatedProblems;
    });
};
export const removeItemFromArrayProblem = (
    index: number,
    setState: React.Dispatch<React.SetStateAction<Problem[]>>
): void => {
    setState((prevState) => {
        const updatedProblems = [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1),
        ];
        return updatedProblems;
    });
};
export const removeItemFromArrayStatus = (
    index: number,
    setState: React.Dispatch<React.SetStateAction<TireStatus[]>>
): void => {
    setState((prevState) => {
        const updatedStatus = [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1),
        ];
        return updatedStatus;
    });
};
export const removeItemFromArrayDepth = (
    index: number,
    setState: React.Dispatch<React.SetStateAction<TireDepth[]>>
): void => {
    setState((prevState) => {
        const updatedDepths = [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1),
        ];
        return updatedDepths;
    });
};
