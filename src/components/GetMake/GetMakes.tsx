export const fetchMakes = async (isMounted: boolean, setMakes: (value: any) => void) => {
    try {
        const res = await fetch("/api/cardata");
        const data = await res.json();
        if (isMounted) setMakes(data.Makes || []);
    } catch (err) {
        console.error("fetchMakes failed:", err);
    }
};
