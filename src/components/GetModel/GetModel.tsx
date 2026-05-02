export const fetchModels = async (selectedMake: string, isMounted: boolean, setModels: (value: any) => void) => {
    try {
        const res = await fetch(
            `/api/carModel?make=${selectedMake}`
        );
        const data = await res.json(); 
        if (isMounted) setModels(data?.Models || []);
    } catch (err) {
        console.error("fetchModels failed:", err);
    }
};
