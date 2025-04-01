export interface UserProfile {
    firstName: string,
    lastName: string,
    userEmail: string,
    phone: string | null,
    address: {
        street: string | null,
        city: string | null,
        state: string | null,
        zipCode: string | null,
        country: string | null,
    },
}