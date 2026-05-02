export const getColorClass = (color: string) => {
    switch (color) {
        case "GREEN":
            return "bg-green-500";
        case "RED":
            return "bg-red-500";
        case "ORANGE":
            return "bg-orange-500";
        default:
            return "bg-gray-100";
    }
};