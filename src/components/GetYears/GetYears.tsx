export const fetchYears = async (selectedMake: string, isMounted: boolean, setYears: (value: any) => void) => {
    try {
        const res = await fetch(
            `/api/carYear?model=${selectedMake}`
        );
        const data = await res.json(); 
        if (isMounted) setYears(data?.Years || []);
    } catch (err) {
        console.error("fetchModels failed:", err);
    }
};