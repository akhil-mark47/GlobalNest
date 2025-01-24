export const filterHousingListings = (
  listings: any[],
  searchTerm: string,
  filters: Record<string, any>
) => {
  return listings.filter(listing => {
    // Search term filter
    const searchMatch = !searchTerm || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof listing.location === 'string' && 
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()));

    // Price range filter
    let priceMatch = true;
    if (filters.priceRange) {
      const price = parseFloat(listing.price);
      const [min, max] = filters.priceRange.split('-').map(Number);
      priceMatch = max === undefined 
        ? price >= min
        : price >= min && price <= max;
    }

    // Available date filter
    let dateMatch = true;
    if (filters.availableFrom) {
      const availableDate = new Date(listing.available_from);
      const filterDate = new Date(filters.availableFrom);
      dateMatch = availableDate >= filterDate;
    }

    return searchMatch && priceMatch && dateMatch;
  });
};

export const filterJobListings = (
  listings: any[],
  searchTerm: string,
  filters: Record<string, any>
) => {
  return listings.filter(listing => {
    // Search term filter
    const searchMatch = !searchTerm || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof listing.location === 'string' && 
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()));

    // Job type filter
    const typeMatch = !filters.jobType || listing.type === filters.jobType;

    // Salary range filter
    let salaryMatch = true;
    if (filters.salaryRange) {
      const salary = extractSalaryValue(listing.salary);
      if (salary) {
        const [min, max] = filters.salaryRange.split('-').map(Number);
        salaryMatch = max === undefined 
          ? salary >= min
          : salary >= min && salary <= max;
      }
    }

    return searchMatch && typeMatch && salaryMatch;
  });
};

const extractSalaryValue = (salaryString: string): number | null => {
  if (!salaryString) return null;
  const numbers = salaryString.match(/\d+/g);
  if (!numbers) return null;
  return Math.min(...numbers.map(Number));
};