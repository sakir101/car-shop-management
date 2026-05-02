
export const formatTooltipContent = (item: any) => {
  return `
    <div>
      <p><strong>Name:</strong> ${item.name || "N/A"}</p>
      <p><strong>Role:</strong> ${item.role || "N/A"}</p>
      <p><strong>Email:</strong> ${item.email || "N/A"}</p>
      <p><strong>Contact Number:</strong> ${item.contactNum || "N/A"}</p>
      <p><strong>Address:</strong> ${item.address || "N/A"}</p>
      ${item.vehicles?.length ? `<p><strong>Vehicles:</strong> ${item.vehicles.map((v: { numberPlate: any; }) => v.numberPlate).join(", ")}</p>` : ""}
    </div>
  `;
};